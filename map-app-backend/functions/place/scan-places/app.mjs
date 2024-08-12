import {
  DynamoDBClient,
  GetItemCommand,
  BatchGetItemCommand,
} from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const PLACES_TABLE = process.env.PLACES_TABLE;
const LIST_TABLE = process.env.LIST_TABLE;
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

  try {
    // get the list using the listId
    const getParams = {
      TableName: LIST_TABLE,
      Key: {
        listId: { S: listId },
      },
    };
    const getCommand = new GetItemCommand(getParams);
    const listitemResponse = await dbclient.send(getCommand);
    console.log("listitemResponse: ", listitemResponse);

    if (!listitemResponse.Item.places) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([]),
      };
    }
    // get list of palceIds from the listitemResponse
    const placeIds = listitemResponse.Item.places?.L.map(
      (place) => place.M.placeId.S
    );
    console.log("placeIds: ", placeIds);

    const userId = listitemResponse.Item.userId.S;

    // get the places using the placeIds and GetBatchItemCommand
    const keys = placeIds.map((placeId) => {
      return {
        placeId: { S: placeId },
        userId: { S: userId },
      };
    });
    console.log("keys: ", keys);
    const batchGetParams = {
      RequestItems: {
        [PLACES_TABLE]: {
          Keys: keys,
        },
      },
    };
    console.log("batchGetParams: ", batchGetParams);
    const batchGetCommand = new BatchGetItemCommand(batchGetParams);
    const batchGetResponse = await dbclient.send(batchGetCommand);
    console.log("batchGetResponse: ", batchGetResponse);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(batchGetResponse.Responses[PLACES_TABLE]),
    };
  } catch (err) {
    console.log("Error: ", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(err),
    };
  }
};
