import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const LIST_TABLE = process.env.LIST_TABLE;
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);

  const listId = event.pathParameters.listId;
  const { name, description, isPublic, userId } = JSON.parse(event.body);

  console.log("listId: ", listId);
  console.log("listName: ", name);
  console.log("description: ", description);
  console.log("isPublic: ", isPublic);
  console.log("userId: ", userId);

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

  if (
    name === undefined &&
    userId === undefined &&
    description === undefined &&
    isPublic === undefined
  ) {
    console.error("No updates are present");
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message:
          "At least one update field (listName, description, isPublic) is required",
      }),
    };
  }

  try {
    const updateResult = await updateList(listId, {
      name,
      userId,
      description,
      isPublic,
    });
    console.log("List updated: ", updateResult);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "List updated successfully",
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

const updateList = async (listId, { name, description, isPublic }) => {
  // primary key listId, sort key userId
  const params = {
    TableName: LIST_TABLE,
    Key: {
      listId: { S: listId },
    },
    UpdateExpression: "SET ",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    ReturnValues: "ALL_NEW",
  };

  const updates = [];
  if (name !== undefined) {
    updates.push("#listName = :ln");
    params.ExpressionAttributeNames["#listName"] = "listName";
    params.ExpressionAttributeValues[":ln"] = { S: name };
  }

  if (description !== undefined) {
    updates.push("#listDescription = :d");
    params.ExpressionAttributeNames["#listDescription"] = "listDescription";
    params.ExpressionAttributeValues[":d"] = { S: description };
  }
  if (isPublic !== undefined) {
    updates.push("#public = :p");
    params.ExpressionAttributeNames["#public"] = "public";
    params.ExpressionAttributeValues[":p"] = { BOOL: isPublic };
  }

  params.UpdateExpression += updates.join(", ");

  try {
    const data = await dbclient.send(new UpdateItemCommand(params));
    console.log("Update Result: ", data);
    return data.Attributes;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error(`Unable to update list: ${err.message}`);
  }
};
