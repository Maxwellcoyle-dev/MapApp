import {
  DynamoDBClient,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import AWS from "aws-sdk";

const REGION = "us-east-2";
const PLACE_TABLE = process.env.PLACE_TABLE;
const LIST_TABLE = process.env.LIST_TABLE;
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);

  const placeId = event.pathParameters.placeId;
  const { userId, placeData } = JSON.parse(event.body);

  console.log("placeId: ", placeId);
  console.log("userId: ", userId);
  console.log("placeData: ", placeData);

  if (!placeId || !userId || !placeData) {
    console.error("Missing required parameters");
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "placeId, userId, and placeData are required",
      }),
    };
  }

  try {
    const updateResult = await updatePlace(placeId, userId, placeData);
    console.log("Place updated: ", updateResult);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Place updated",
        data: updateResult,
      }),
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: `Error processing request: ${err.message}`,
      }),
    };
  }
};

const updatePlace = async (placeId, userId, placeData) => {
  console.log("Updating place...");
  console.log("Place Data: ", placeData);
  console.log("Place ID: ", placeId);
  const expressionAttributeValues = {};
  const updateExpressions = [];

  const filteredPlaceData = Object.keys(placeData).reduce((acc, key) => {
    if (key !== "placeId" && key !== "userId" && key !== "photos") {
      acc[key] = placeData[key];
    }
    return acc;
  }, {});

  Object.keys(filteredPlaceData).forEach((key) => {
    const attributeKey = `:${key}`;

    if (key === "reviews") {
      updateExpressions.push(`${key} = ${attributeKey}`);
      expressionAttributeValues[attributeKey] = {
        L: filteredPlaceData[key].map((review) => ({
          M: {
            author_name: { S: review.author_name },
            author_url: { S: review.author_url },
            language: { S: review.language },
            profile_photo_url: { S: review.profile_photo_url },
            rating: { N: review.rating.toString() },
            relative_time_description: { S: review.relative_time_description },
            text: { S: review.text },
            time: { N: review.time.toString() },
          },
        })),
      };
    } else if (typeof filteredPlaceData[key] === "string") {
      updateExpressions.push(`${key} = ${attributeKey}`);
      expressionAttributeValues[attributeKey] = { S: filteredPlaceData[key] };
    } else if (typeof filteredPlaceData[key] === "number") {
      updateExpressions.push(`${key} = ${attributeKey}`);
      expressionAttributeValues[attributeKey] = {
        N: filteredPlaceData[key].toString(),
      };
    } else if (typeof filteredPlaceData[key] === "boolean") {
      updateExpressions.push(`${key} = ${attributeKey}`);
      expressionAttributeValues[attributeKey] = {
        BOOL: filteredPlaceData[key],
      };
    } else if (Array.isArray(filteredPlaceData[key])) {
      if (key === "tags") {
        updateExpressions.push(`${key} = ${attributeKey}`);
        expressionAttributeValues[attributeKey] = {
          L: filteredPlaceData[key].map((tag) => ({
            M: {
              tagId: { S: tag.tagId },
              tagName: { S: tag.tagName },
              categoryId: { S: tag.categoryId },
              categoryName: { S: tag.categoryName },
            },
          })),
        };
      } else {
        updateExpressions.push(`${key} = ${attributeKey}`);
        expressionAttributeValues[attributeKey] = {
          L: filteredPlaceData[key].map((item) => ({ S: item.toString() })),
        };
      }
    } else if (typeof filteredPlaceData[key] === "object") {
      updateExpressions.push(`${key} = ${attributeKey}`);
      expressionAttributeValues[attributeKey] = {
        M: AWS.DynamoDB.Converter.marshall(filteredPlaceData[key]),
      };
    }
  });

  const params = {
    TableName: PLACE_TABLE,
    Key: {
      placeId: { S: placeId },
      userId: { S: userId },
    },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await dbclient.send(new UpdateItemCommand(params));
    console.log("Update Result: ", data);

    await addPlaceToSavedList(userId, placeId, placeData.placeName);

    return data.Attributes;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error(`Unable to update place: ${err.message}`);
  }
};

const getSavedUserList = async (userId) => {
  // get users lists using the GSI

  const params = {
    TableName: LIST_TABLE,
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  try {
    const data = await dbclient.send(new QueryCommand(params));
    console.log("Lists: ", data.Items);
    // find the list data.item matching the listName.S: "Saved"
    const savedList = data.Items.find((item) => item.listName.S === "Saved");
    console.log("Saved List: ", savedList);
    return savedList;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error(`Unable to get user lists: ${err.message}`);
  }
};

const addPlaceToSavedList = async (userId, placeId, placeName) => {
  const savedList = await getSavedUserList(userId);

  if (!savedList) {
    console.error("Saved list not found");
    throw new Error("Saved list not found");
  }

  const listId = savedList.listId.S;

  const existingPlaces = savedList.places ? savedList.places.L : [];
  const placeExists = existingPlaces.some(
    (place) => place.M.placeId.S === placeId
  );

  if (placeExists) {
    console.log("Place already exists in the list. No update needed.");
    return savedList; // Or return an appropriate response
  }

  const placeMap = {
    placeId: { S: placeId },
    placeName: { S: placeName },
  };

  const params = {
    TableName: LIST_TABLE,
    Key: {
      listId: { S: listId },
    },
    UpdateExpression:
      "SET places = list_append(if_not_exists(places, :emptyList), :place)",
    ExpressionAttributeValues: {
      ":place": { L: [{ M: placeMap }] },
      ":emptyList": { L: [] },
    },
  };

  try {
    const data = await dbclient.send(new UpdateItemCommand(params));
    console.log("Update Result: ", data);
    return data.Attributes;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error(`Unable to add place to saved list: ${err.message}`);
  }
};
