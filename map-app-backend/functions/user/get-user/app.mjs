import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

import { defaultCategories } from "./userDefaults.mjs";

const REGION = "us-east-2";
const USER_TABLE = "MapAppUserTable";
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);

  const userId = event.pathParameters.userId;
  const email = event.queryStringParameters.email;
  console.log("userId: ", userId);
  console.log("email: ", email);

  if (!userId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "userId is required",
      }),
    };
  }

  const params = {
    TableName: USER_TABLE,
    Key: {
      userId: { S: userId },
    },
  };

  try {
    const data = await dbclient.send(new GetItemCommand(params));
    console.log("Data: ", data.Item);

    if (data.Item) {
      const userObj = {
        userId: data.Item.userId.S,
        email: data.Item.email.S,
        categories: data.Item.categories.L.map((category) => ({
          categoryId: category.M.categoryId.S,
          name: category.M.name.S,
          tags: category.M.tags.L.map((tag) => ({
            tagId: tag.M.tagId.S,
            tagName: tag.M.tagName.S,
          })),
          creationType: category.M.creationType.S,
          createdAt: category.M.createdAt.N,
          lastUpdatedAt: category.M.lastUpdatedAt.N,
        })),
        createdAt: data.Item.createdAt.N,
      };
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "User found",
          data: userObj,
        }),
      };
    } else {
      console.log("User not found, creating user...");

      console.log("defaultCategories: ", defaultCategories);
      const formattedCategories = defaultCategories.map((category) => ({
        M: {
          categoryId: category.categoryId,
          name: category.name,
          tags: {
            L: category.tags.L.map((tag) => ({
              M: {
                tagId: tag.M.tagId,
                tagName: tag.M.tagName,
              },
            })),
          },
          creationType: category.creationType,
          createdAt: category.createdAt,
          lastUpdatedAt: category.lastUpdatedAt,
        },
      }));

      const putParams = {
        TableName: USER_TABLE,
        Item: {
          userId: { S: userId },
          email: { S: email },
          categories: {
            L: formattedCategories,
          },
          createdAt: { N: `${Date.now()}` },
        },
      };

      const putData = await dbclient.send(new PutItemCommand(putParams));

      console.log("User created: ", putData);

      const getUserParams = {
        TableName: USER_TABLE,
        Key: {
          userId: { S: userId },
        },
      };
      const getUserData = await dbclient.send(
        new GetItemCommand(getUserParams)
      );

      console.log("getUserData: ", getUserData.Item);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "User created",
          data: getUserData.Item,
        }),
      };
    }
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
