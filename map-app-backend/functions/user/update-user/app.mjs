import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const USER_TABLE = "MapAppUserTable";
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);

  const userId = event.pathParameters.userId;
  const categories = JSON.parse(event.body).categories;

  console.log("userId: ", userId);
  console.log("categories: ", categories);

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

  if (!categories) {
    console.error("No categories are present");
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "categories are required",
      }),
    };
  }

  try {
    const updateResult = await updateCategories(userId, categories);
    console.log("Categories updated: ", updateResult);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Categories updated",
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

const updateCategories = async (userId, categories) => {
  const categoryItems = categories.map((category) => ({
    M: {
      categoryId: { S: category.categoryId },
      name: { S: category.name },
      tags: {
        L: category.tags.map((tag) => ({
          M: { tagId: { S: tag.tagId }, tagName: { S: tag.tagName } },
        })),
      },
      creationType: { S: category.creationType },
      createdAt: { N: category.createdAt.toString() },
      lastUpdatedAt: { N: category.lastUpdatedAt.toString() },
    },
  }));

  const params = {
    TableName: USER_TABLE,
    Key: {
      userId: { S: userId },
    },
    UpdateExpression: "SET categories = :categories",
    ExpressionAttributeValues: {
      ":categories": { L: categoryItems },
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await dbclient.send(new UpdateItemCommand(params));
    console.log("Update Result: ", data);
    return data.Attributes;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error(`Unable to update categories: ${err.message}`);
  }
};
