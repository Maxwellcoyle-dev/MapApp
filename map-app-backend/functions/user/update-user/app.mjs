import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

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
};
