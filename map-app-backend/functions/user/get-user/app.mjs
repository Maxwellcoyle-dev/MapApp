import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

import { defaultCategories } from "./userDefaults.mjs";

const REGION = "us-east-2";
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
  console.log("defaultCategories: ", defaultCategories);

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
    TableName: "MapAppUserTable",
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
        createdAt: parseInt(data.Item.createdAt.N),
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
        TableName: "MapAppUserTable",
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
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "User created",
          data: putParams.Item,
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
