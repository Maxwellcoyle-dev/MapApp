import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

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

    const unmarshalledData = data.Items.map((item) => unmarshall(item));
    console.log("unmarshalledData: ", unmarshalledData);

    // Process data.Items: Convert timestamps and sort the array
    const processedItems = unmarshalledData
      .map((item) => {
        return {
          ...item,
          createdAt: new Date(Number(item.createdAt)).toISOString(),
          lastUpdatedAt: new Date(Number(item.lastUpdatedAt)).toISOString(),
        };
      })
      .sort((a, b) => {
        return new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt);
      });
    console.log("processedItems: ", processedItems);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Lists scanned",
        data: processedItems,
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
