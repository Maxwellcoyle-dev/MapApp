import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const LIST_TABLE = process.env.LIST_TABLE;
const PLACE_TABLE = process.env.PLACE_TABLE;
const USER_TABLE = process.env.USER_TABLE;
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const lambdaHandler = async (event) => {
  try {
    const userId = event.pathParameters.userId;
    console.log("userId", userId);

    //   get the user item from the user table
    const userItem = await getUserItem(userId);
    console.log("userItem ---", userItem);

    //   get the users lists from the list table
    const userLists = await getUserLists(userId);
    console.log("userLists ---", userLists);

    // get all of the users places using the gsi - userId
    const userPlaces = await getUserPlaces(userId);
    console.log("userPlaces ---", userPlaces);

    // delete all of the users places
    for (const place of userPlaces) {
      await deleteUserPlace(place.placeId.S, userId);
    }

    // delete all of the users lists
    for (const list of userLists) {
      await deleteUserList(list.listId.S);
    }

    // delete the user item from the user table
    await deleteUserItem(userId);

    //   return a basic response for testing
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "User deleted",
      }),
    };
  } catch (error) {
    console.error("Error deleting user", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error deleting user",
      }),
    };
  }
};

const getUserItem = async (userId) => {
  const getUserItemParams = {
    TableName: USER_TABLE,
    Key: {
      userId: { S: userId },
    },
  };

  const getUserItemCommand = new GetItemCommand(getUserItemParams);
  const getUserItemResponse = await dbclient.send(getUserItemCommand);
  console.log("getUserItemResponse ---", getUserItemResponse);

  return getUserItemResponse.Item;
};

const getUserLists = async (userId) => {
  // get all lists for the user using the gsi - userId

  const getUserListsParams = {
    TableName: LIST_TABLE,
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  const getUserListsCommand = new QueryCommand(getUserListsParams);
  const getUserListsResponse = await dbclient.send(getUserListsCommand);
  console.log("getUserListsResponse ---", getUserListsResponse);

  return getUserListsResponse.Items;
};

const getUserPlaces = async (userId) => {
  const getUserPlacesParams = {
    TableName: PLACE_TABLE,
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  const getUserPlacesCommand = new QueryCommand(getUserPlacesParams);
  const getUserPlacesResponse = await dbclient.send(getUserPlacesCommand);
  console.log("getUserPlacesResponse ---", getUserPlacesResponse);

  return getUserPlacesResponse.Items;
};

const deleteUserItem = async (userId) => {
  const deleteUserItemParams = {
    TableName: USER_TABLE,
    Key: {
      userId: { S: userId },
    },
  };

  const deleteUserItemCommand = new DeleteItemCommand(deleteUserItemParams);
  const deleteUserItemResponse = await dbclient.send(deleteUserItemCommand);
  console.log("deleteUserItemResponse ---", deleteUserItemResponse);

  return deleteUserItemResponse;
};

const deleteUserList = async (listId) => {
  // delete the user's lists using the listId
  const deleteUserListsParams = {
    TableName: LIST_TABLE,
    Key: {
      listId: { S: listId },
    },
  };

  const deleteUserListsCommand = new DeleteItemCommand(deleteUserListsParams);
  const deleteUserListsResponse = await dbclient.send(deleteUserListsCommand);
  console.log("deleteUserListsResponse ---", deleteUserListsResponse);

  return deleteUserListsResponse;
};

const deleteUserPlace = async (placeId, userId) => {
  // delete the user's places using the placeId abd userId
  const deleteUserPlacesParams = {
    TableName: PLACE_TABLE,
    Key: {
      placeId: { S: placeId },
      userId: { S: userId },
    },
  };

  const deletePlaceResult = await dbclient.send(
    new DeleteItemCommand(deleteUserPlacesParams)
  );
  console.log("deletePlaceResult ---", deletePlaceResult);

  return deletePlaceResult;
};
