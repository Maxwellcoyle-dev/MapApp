import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const PLACES_TABLE = "MapAppPlacesTable";
const LISTS_TABLE = "MapAppListsTable";
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

export const lambdaHandler = async (event) => {
  console.log("event", event);
  const body = JSON.parse(event.body);

  const userId = body.userId;
  console.log("userId -- ", userId);
  const listId = body.listId;
  console.log("listId -- ", listId);
  const place = body.place;
  console.log("place -- ", place);

  await savePlace(userId, listId, place);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Hello from create-place!" }),
  };
};

const savePlace = async (userId, listId, placeData) => {
  console.log("savePlace -- ", userId, listId, placeData);

  console.log("photos", placeData.photos[0]);

  const params = {
    TableName: PLACES_TABLE,
    Item: {
      placeId: { S: placeData.place_id },
      userId: { S: userId },
      listId: { S: listId },
      name: { S: placeData.name },
      location: {
        M: {
          lat: { N: placeData.geometry.location.lat },
          long: { N: placeData.geometry.location.long },
        },
      },
      photos: { SS: placeData.photos.map((photo) => photo.url) },
      hours: { L: placeData.hours.map((hour) => ({ S: hour })) },
    },
  };
  console.log("params", params);
  const command = new PutItemCommand(params);
  try {
    await dbclient.send(command);
    console.log("Place saved successfully");
  } catch (err) {
    console.error("Error saving place", err);
  }
};
