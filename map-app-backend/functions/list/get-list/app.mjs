import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const REGION = "us-east-2";
const LIST_TABLE = process.env.LIST_TABLE;
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);
  const listId = event.pathParameters.listId;
  console.log("listId: ", listId);

  if (!listId) {
    console.error("No listId is present");
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "listId is required",
      }),
    };
  }

  const params = {
    TableName: LIST_TABLE,
    Key: {
      listId: { S: listId },
    },
  };

  try {
    console.log("Getting list...");
    const data = await dbclient.send(new GetItemCommand(params));
    console.log("Data: ", data);
    console.log("data.Item: ", data.Item);
    const unmarshalledData = unmarshall(data.Item);
    console.log("unmarshalledData: ", unmarshalledData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "List retrieved",
        data: unmarshalledData,
      }),
    };
  } catch (error) {
    console.error("Error getting list: ", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error getting list",
      }),
    };
  }
};
