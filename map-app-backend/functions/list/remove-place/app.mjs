import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const LIST_TABLE = process.env.LIST_TABLE;
const PLACE_TABLE = process.env.PLACE_TABLE;
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const lambdaHandler = async (event) => {
  console.log("Received event:", event);
  try {
    const { listIds, placeId, userId } = JSON.parse(event.body); // Adjust to read from the request body
    console.log("listIds:", listIds);

    // Step 1: Remove the place from each list
    for (const listId of listIds) {
      await updateListToRemovePlace(listId, placeId);
    }

    // Step 2: Check if the place exists in any other lists
    const isPlaceInOtherLists = await checkPlaceInOtherLists(userId, placeId);

    // Step 3: If the place is not in any other lists, delete it
    if (!isPlaceInOtherLists) {
      await deletePlace(userId, placeId);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: `Successfully updated lists and handled place deletion as necessary.`,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Failed to process your request.",
        error: error.message,
      }),
    };
  }
};

const updateListToRemovePlace = async (listId, placeId) => {
  console.log("Preparing to update list to remove place");

  // Define parameters to fetch the list
  const getItemParams = {
    TableName: LIST_TABLE,
    Key: { listId: { S: listId } },
    ProjectionExpression: "places",
  };
  console.log("getItemParams:", JSON.stringify(getItemParams));

  // Fetch the list item from DynamoDB
  const listItem = await dbclient.send(new GetItemCommand(getItemParams));
  console.log("listItem:", JSON.stringify(listItem));

  // Check if the item and the places list exist
  if (!listItem.Item || !listItem.Item.places) {
    console.log("Item not found or places list is empty");
    return; // Exit if no item or no places
  }

  // Determine the index of the place in the list
  const placesList = listItem.Item.places.L;
  const placeIndex = placesList.findIndex(
    (place) => place.M.placeId.S === placeId
  );
  console.log("placeIndex:", placeIndex);

  if (placeIndex === -1) {
    console.log("Place not found in list");
    return; // Exit if place is not found in the list
  }

  // Define parameters to update the list by removing the place
  const updateParams = {
    TableName: LIST_TABLE,
    Key: { listId: { S: listId } },
    UpdateExpression: `REMOVE places[${placeIndex}]`,
    ReturnValues: "UPDATED_NEW",
  };
  console.log("updateParams:", JSON.stringify(updateParams));

  // Send the update command to DynamoDB
  const updateResult = await dbclient.send(new UpdateItemCommand(updateParams));
  console.log("Update result:", JSON.stringify(updateResult));
};

const checkPlaceInOtherLists = async (userId, placeId) => {
  console.log("preparing to scan for place in other lists");
  const scanParams = {
    TableName: LIST_TABLE,
    FilterExpression: "userId = :userId AND contains(places, :placeId)",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
      ":placeId": { S: placeId },
    },
  };
  console.log("scanParams", scanParams);
  const result = await dbclient.send(new ScanCommand(scanParams));
  console.log("scan result", result);
  return result.Items.length > 0;
};

const deletePlace = async (userId, placeId) => {
  console.log("preparing to delete place");
  const params = {
    TableName: PLACE_TABLE,
    Key: {
      userId: { S: userId },
      placeId: { S: placeId },
    },
  };
  console.log("delete params", params);
  const deletePlaceResult = await dbclient.send(new DeleteItemCommand(params));
  console.log("delete result", deletePlaceResult);
};
