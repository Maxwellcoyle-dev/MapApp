import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const REGION = "us-east-2";
const LIST_TABLE = process.env.LIST_TABLE;
const USER_TABLE = process.env.USER_TABLE;
const GSI_NAME = "userId-index";
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

  try {
    const userId = body.userId;
    const listName = body.listName;
    const listDescription = body.listDescription;
    const publicList = body?.public || false;
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
      TableName: LIST_TABLE,
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

    console.log("Creating list...");
    await dbclient.send(new PutItemCommand(params));
    console.log("List created");

    const userParams = {
      TableName: USER_TABLE,
      Key: {
        userId: { S: userId },
      },
      UpdateExpression:
        "SET #lists = list_append(if_not_exists(#lists, :empty_list), :newListId)",
      ExpressionAttributeNames: {
        "#lists": "lists",
      },
      ExpressionAttributeValues: {
        ":newListId": { L: [{ M: { listId: { S: newListId } } }] },
        ":empty_list": { L: [] },
      },
    };

    const userData = await dbclient.send(new UpdateItemCommand(userParams));
    console.log("User data: ", userData);

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
