import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const LIST_TABLE = process.env.LIST_TABLE;
const GSI_NAME = "userId-index";
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);
  const userId = event.queryStringParameters.userId;
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
    TableName: LIST_TABLE,
    IndexName: GSI_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  try {
    console.log("Scanning lists...");
    const data = await dbclient.send(new QueryCommand(params));
    console.log("Data: ", data);
    console.log("data.Items: ", data.Items);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Lists scanned",
        data: data.Items,
      }),
    };
  } catch (error) {
    console.error("Error scanning lists: ", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error scanning lists",
      }),
    };
  }
};
