import {
  DynamoDBClient,
  QueryCommand,
  BatchGetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const REGION = "us-east-2";
const PLACE_TABLE = process.env.PLACE_TABLE;
const LIST_TABLE = process.env.LIST_TABLE;
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("Event: ", event);

  // get the users lists using the GSI -  idnexName - userId-indexm AtributeName - userId
  const userId = event.pathParameters.userId;
  console.log("userId: ", userId);
  const params = {
    TableName: LIST_TABLE,
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };
  const getListsCommand = new QueryCommand(params);
  const getListsResponse = await dbclient.send(getListsCommand);
  console.log("getListsResponse: ", getListsResponse);

  if (getListsResponse.Items.length === 0) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([]),
    };
  }
  const unmarshalledListsResponse = getListsResponse.Items.map((list) => {
    return unmarshall(list);
  });

  console.log("unmarshalledListsResponse: ", unmarshalledListsResponse);

  let userLists = unmarshalledListsResponse.map((list) => {
    return {
      listId: list.listId,
      listName: list.listName,
      listDescription: list.listDescription,
      createdAt: list.createdAt,
      lastUpdatedAt: list.lastUpdatedAt,
      ...(list?.places && {
        places: list.places.map((place) => {
          return {
            placeId: place.placeId,
          };
        }),
      }),
    };
  });

  console.log("userLists: ", userLists);

  //   iterate through each list,make a batchitem request to places table to get all list places:

  for (let list of userLists) {
    console.log("list: ", list);

    if (!list.places) {
      continue;
    }

    const placeIds = list.places.map((place) => place.placeId);
    console.log("placeIds: ", placeIds);

    const keys = placeIds.map((placeId) => {
      return {
        placeId: { S: placeId },
        userId: { S: userId },
      };
    });
    console.log("keys: ", keys);
    const getPlacesParams = {
      RequestItems: {
        [PLACE_TABLE]: {
          Keys: keys,
        },
      },
    };
    console.log("getPlacesParams: ", getPlacesParams);

    const getPlacesCommand = new BatchGetItemCommand(getPlacesParams);
    const placesResponse = await dbclient.send(getPlacesCommand);
    console.log("placesResponse: ", placesResponse);

    const places = placesResponse.Responses[PLACE_TABLE].map((place) => {
      return unmarshall(place);
    });

    console.log("places: ", places);
    list.places = places;
  }

  console.log("userLists: ", userLists);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(userLists),
  };
};
