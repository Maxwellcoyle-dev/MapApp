import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const PLACES_TABLE = process.env.PLACES_TABLE;
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);
  const listId = event.queryStringParameters.listId;
  console.log("listId: ", listId);

//   get places with 
};
