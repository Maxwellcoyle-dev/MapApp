import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const PLACE_TABLE = process.env.PLACE_TABLE;
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);
  const placeId = event.pathParameters.placeId;
  const userId = event.pathParameters.userId;
  console.log("placeId: ", placeId);
  console.log("userId: ", userId);

  const params = {
    TableName: PLACE_TABLE,
    Key: {
      placeId: { S: placeId },
      userId: { S: userId },
    },
  };
  const command = new GetItemCommand(params);
  try {
    const data = await dbclient.send(command);
    console.log("Data: ", data);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(err),
    };
  }
};
