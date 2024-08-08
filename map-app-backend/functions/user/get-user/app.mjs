import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { createNewUser } from "./createNewUser.mjs";

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
    console.error("No userId is present");
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "userId is required",
      }),
    };
  }

  try {
    console.log("Checking if user exists...");
    const userData = await getUser(userId);

    if (userData) {
      console.log("User found: ", userData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "User found",
          data: userData,
        }),
      };
    } else {
      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            message: "Email is required to create a new user",
          }),
        };
      }

      console.log("User not found, creating user...");
      const newUser = await createNewUser(userId, email);
      console.log("New user created: ", newUser);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: "User created",
          data: newUser,
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

const getUser = async (userId) => {
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
        lists: data.Item.lists.L.map((list) => ({
          listId: list.M.listId.S,
        })),
        categories: data.Item.categories.L.map((category) => ({
          categoryId: category.M.categoryId.S,
          categoryName: category.M.categoryName.S,
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
      return userObj;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error: ", err);
    return null;
  }
};
