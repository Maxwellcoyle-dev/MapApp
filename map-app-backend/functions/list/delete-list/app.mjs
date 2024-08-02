import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
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
  console.log("event", event);
  const listId = event.pathParameters.listId;
  const userId = event.pathParameters.userId;
  console.log("listId", listId);
  console.log("userId", userId);

  //   use listId to get the list Item
  const listItem = await getListItem(listId);
  console.log("listItem ---", listItem);
  const listPlaces = listItem.places.L;
  console.log("listPlaces ---", listPlaces);

  // we need to check if each place in the list exists in any other list. if it does not, we will delete it
  console.log("starting Loop");
  console.log("listPlaces?.length ---", listPlaces?.length);
  for (let i = 0; i < listPlaces?.length; i++) {
    const placeId = listPlaces[i].M.placeId.S;
    console.log("placeId ---", placeId);

    const placeInOtherLists = await checkPlaceInOtherLists(userId, placeId);
    console.log("placeInOtherLists ---", placeInOtherLists);

    if (!placeInOtherLists) {
      await deletePlace(userId, placeId);
    }
  }

  // delete the list
  await deleteList(listId);

  // return success response
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: `Successfully recieved request.`,
    }),
  };
};

const getListItem = async (listId) => {
  console.log("Preparing to get list item");
  const getListItemParams = {
    TableName: LIST_TABLE,
    Key: {
      listId: { S: listId },
    },
  };
  console.log("get List Item Params --- ", getListItemParams);

  const getListItemCommand = new GetItemCommand(getListItemParams);
  const getListItemResponse = await dbclient.send(getListItemCommand);
  console.log("get List Item Response --- ", getListItemResponse);

  return getListItemResponse.Item;
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

const deleteList = async (listId) => {
  console.log("preparing to delete list");
  const params = {
    TableName: LIST_TABLE,
    Key: {
      listId: { S: listId },
    },
  };
  console.log("delete params", params);
  const deleteListResult = await dbclient.send(new DeleteItemCommand(params));
  console.log("delete result", deleteListResult);
};
