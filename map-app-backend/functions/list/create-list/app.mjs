import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const REGION = "us-east-2";
const LISTS_TABLE = "MapAppListsTable";
const GSI_NAME = "userIdIndex";
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);
  const body = JSON.parse(event.body);
  console.log("Body: ", body);

  const userId = body.userId;
  const listName = body.listName;
  const listDescription = body.listDescription;
  const publicList = body.public;
  const createdAt = Date.now();
  const lastUpdatedAt = Date.now();

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

  const newListId = uuidv4();

  const params = {
    TableName: LISTS_TABLE,
    Item: {
      listId: { S: newListId },
      userId: { S: userId },
      listName: { S: listName },
      listDescription: { S: listDescription },
      public: { BOOL: publicList },
      createdAt: { N: `${createdAt}` },
      lastUpdatedAt: { N: `${lastUpdatedAt}` },
    },
  };

  try {
    console.log("Creating list...");
    await dbclient.send(new PutItemCommand(params));
    console.log("List created");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "List created",
      }),
    };
  } catch (error) {
    console.error("Error creating list: ", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error creating list",
      }),
    };
  }
};
