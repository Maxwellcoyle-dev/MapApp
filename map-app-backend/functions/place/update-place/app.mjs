import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import AWS from "aws-sdk";

const REGION = "us-east-2";
const PLACE_TABLE = process.env.PLACE_TABLE;
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
  const expressionAttributeValues = {};
  const updateExpressions = [];

  Object.keys(placeData).forEach((key) => {
    const attributeKey = `:${key}`;

    if (key === "tags") {
      updateExpressions.push(`${key} = ${attributeKey}`);
      expressionAttributeValues[attributeKey] = {
        L: placeData[key].map((tag) => ({
          M: {
            tagId: { S: tag.tagId },
            categoryId: { S: tag.categoryId },
          },
        })),
      };
    } else {
      updateExpressions.push(`${key} = ${attributeKey}`);

      if (typeof placeData[key] === "string") {
        expressionAttributeValues[attributeKey] = { S: placeData[key] };
      } else if (typeof placeData[key] === "number") {
        expressionAttributeValues[attributeKey] = {
          N: placeData[key].toString(),
        };
      } else if (Array.isArray(placeData[key])) {
        expressionAttributeValues[attributeKey] = {
          L: placeData[key].map((item) => ({ S: item.toString() })),
        };
      } else if (typeof placeData[key] === "object") {
        expressionAttributeValues[attributeKey] = {
          M: AWS.DynamoDB.Converter.marshall(placeData[key]),
        };
      }
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
    return data.Attributes;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error(`Unable to update place: ${err.message}`);
  }
};
