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
    const transformedData = transformDynamoDBData(data.Item); // Transform data here
    console.log("Data: ", transformedData);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(transformedData),
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

const transformDynamoDBData = (dynamoData) => {
  if (!dynamoData) return null;

  const convertAttribute = (attribute) => {
    if ("S" in attribute) return attribute.S;
    if ("N" in attribute) return Number(attribute.N);
    if ("SS" in attribute) return attribute.SS;
    if ("M" in attribute) return transformDynamoDBData(attribute.M);
    if ("L" in attribute) return attribute.L.map(convertAttribute);
    return attribute;
  };

  const transformedData = {};
  for (const key in dynamoData) {
    transformedData[key] = convertAttribute(dynamoData[key]);
  }

  return transformedData;
};
