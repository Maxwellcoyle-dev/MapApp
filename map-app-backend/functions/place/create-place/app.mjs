import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const PLACES_TABLE = "MapAppPlacesTable";
const LISTS_TABLE = "MapAppListsTable";
const dbclient = new DynamoDBClient({ region: REGION });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  "Access-Control-Allow-Headers": "Content-Type",
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

  if (place.photos && place.photos.length > 0) {
    await addPlaceToListItem(
      userId,
      listId,
      place.place_id,
      place.photos[0].url
    );
  } else {
    await addPlaceToListItem(userId, listId, place.place_id, null);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Place saved successfully!" }),
  };
};

const savePlace = async (userId, listId, placeData) => {
  console.log("savePlace -- ", userId, listId, placeData);

  if (
    !placeData ||
    !placeData.place_id ||
    !placeData.geometry ||
    !placeData.geometry.location ||
    !placeData.photos ||
    !placeData.current_opening_hours ||
    !placeData.current_opening_hours.weekday_text
  ) {
    console.error("Missing required place data");
    return;
  }

  const params = {
    TableName: PLACES_TABLE,
    Item: {
      placeId: { S: placeData.place_id },
      userId: { S: userId },
      listId: { S: listId },
      name: { S: placeData.name },
      location: {
        M: {
          lat: { N: placeData.geometry.location.lat.toString() },
          long: { N: placeData.geometry.location.lng.toString() },
        },
      },
      photos: {
        SS: placeData.photos.map((photo) => photo.url),
      },
      hours: {
        L: placeData.current_opening_hours.weekday_text.map((day) => ({
          S: day,
        })),
      },
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

const addPlaceToListItem = async (userId, listId, placeId, photoUrl) => {
  console.log("addPlaceToUserList -- ", userId, listId, placeId, photoUrl);

  const placeMap = {
    placeId: { S: placeId },
  };

  if (photoUrl) {
    placeMap.photo = { S: photoUrl };
  }

  const params = {
    TableName: LISTS_TABLE,
    Key: {
      listId: { S: listId },
      userId: { S: userId },
    },
    UpdateExpression:
      "SET places = list_append(if_not_exists(places, :emptyList), :place)",
    ExpressionAttributeValues: {
      ":place": { L: [{ M: placeMap }] },
      ":emptyList": { L: [] },
    },
  };

  console.log("params", params);
  const command = new UpdateItemCommand(params);
  try {
    await dbclient.send(command);
    console.log("Place added to user list successfully");
  } catch (err) {
    console.error("Error adding place to user list", err);
  }
};
