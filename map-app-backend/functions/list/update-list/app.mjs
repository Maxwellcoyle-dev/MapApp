import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const LISTS_TABLE = "MapAppListsTable";
const GSI_NAME = "userIdIndex";
const dbclient = new DynamoDBClient({ region: REGION });

/*
listName
description
public
*/

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,PUT", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);

  const body = JSON.parse(event.body);

  const userId = body.userId;
  console.log("userId -- ", userId);
  const listId = body.listId;
  console.log("listId -- ", listId);
  const place = body.place;
  console.log("place -- ", place);

  console.log("userId: ", userId);

  if (!userId) {
    console.error("No userId is present");
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "userId is required",
      }),
    };
  }

  const params = {
    TableName: LISTS_TABLE,
    Key: {
      listId: { S: listId },
      userId: { S: userId },
    },
    UpdateExpression: "set #desc = :d, #listName = :ln, #public = :p",
    ExpressionAttributeNames: {
      "#desc": "description",
      "#listName": "listName",
      "#public": "public",
    },
    ExpressionAttributeValues: {
      ":d": { S: "New description value" }, // New value for description
      ":ln": { S: "New list name value" }, // New value for listName
      ":p": { BOOL: true }, // New value for public
    },
  };

  const params = {
    TableName: LISTS_TABLE,
    Key: {
      listId: { S: listId },
      userId: { S: userId },
    },
    UpdateExpression:
      "SET places = list_append(if_not_exists(places, :emptyList), :place)",
    ExpressionAttributeValues: {
      ":place": { L: [{ M: placeMap }] },
      ":emptyList": { L: [] },
    },
  };
  console.log("params", params);
  const command = new UpdateItemCommand(params);
  try {
    await dbclient.send(command);
    console.log("Place added to user list successfully");
  } catch (err) {
    console.error("Error adding place to user list", err);
  }
};
