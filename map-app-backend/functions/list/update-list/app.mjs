import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const LISTS_TABLE = "MapAppListsTable";
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

  const listId = body?.listId;
  const listName = body?.listName || null;
  const description = body?.description || null;
  const isPublic = body?.public || null;

  if (!listId) {
    console.error("No listId is present");
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "listId is required",
      }),
    };
  }

  const primaryKey = { listId: { S: listId } };

  const params = {
    TableName: LISTS_TABLE,
    Key: primaryKey,
    UpdateExpression: "",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  // Build the update expression dynamically
  const updates = [];
  if (description !== null) {
    updates.push("#description = :d");
    params.ExpressionAttributeNames["#description"] = "description";
    params.ExpressionAttributeValues[":d"] = { S: description };
  }
  if (listName !== null) {
    updates.push("#listName = :ln");
    params.ExpressionAttributeNames["#listName"] = "listName";
    params.ExpressionAttributeValues[":ln"] = { S: listName };
  }
  if (isPublic !== null) {
    updates.push("#public = :p");
    params.ExpressionAttributeNames["#public"] = "public";
    params.ExpressionAttributeValues[":p"] = { BOOL: isPublic };
  }

  // Combine the update expressions
  if (updates.length > 0) {
    params.UpdateExpression = "set " + updates.join(", ");
  }

  // Only send the update command if there are updates
  if (updates.length > 0) {
    async () => {
      try {
        await dbclient.send(new UpdateItemCommand(params));
        console.log("Success", data);
      } catch (err) {
        console.error("Error", err);
      }
    };
  }
};
