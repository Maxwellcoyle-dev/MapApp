import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const PLACE_TABLE = process.env.PLACE_TABLE;
const LIST_TABLE = process.env.LIST_TABLE;
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
  console.log("place.photos -- ", place.photos);

  await savePlace(userId, listId, place);

  if (place.photos && place.photos.length > 0) {
    await addPlaceToListItem(
      userId,
      listId,
      place.place_id,
      place.name,
      place.photos[0].url
    );
  } else {
    await addPlaceToListItem(userId, listId, place.place_id, place.name, null);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Place saved successfully!" }),
  };
};

const savePlace = async (userId, listId, placeData) => {
  if (
    !placeData ||
    !placeData.place_id ||
    !placeData.geometry ||
    !placeData.geometry.location ||
    !placeData.photos
  ) {
    console.error("Missing required place data");
    return;
  }

  const photoData = placeData.photos.map((photo) => {
    return {
      M: {
        height: { N: photo.height.toString() },
        width: { N: photo.width.toString() },
        html_attributions: {
          SS: photo.html_attributions.map((html) =>
            html.replace(/<[^>]*>/g, "")
          ),
        }, // Removes HTML tags and stores plain text
      },
    };
  });

  const params = {
    TableName: PLACE_TABLE,
    Item: {
      placeId: { S: placeData.place_id },
      userId: { S: userId },
      listId: { S: listId },
      name: { S: placeData.name },
      formattedAddress: { S: placeData.formatted_address || "" },
      formattedPhoneNumber: { S: placeData.formatted_phone_number || "" },
      businessStatus: { S: placeData.business_status || "" },
      icon: { S: placeData.icon || "" },
      internationalPhoneNumber: {
        S: placeData.international_phone_number || "",
      },
      url: { S: placeData.url || "" },
      website: { S: placeData.website || "" },
      vicinity: { S: placeData.vicinity || "" },
      rating: { N: placeData.rating ? placeData.rating.toString() : "0" },
      types: { SS: placeData.types || [] },
      photoDetails: { L: photoData },
      geometry: {
        M: {
          location: {
            M: {
              lat: { N: placeData.geometry.location.lat.toString() },
              lng: { N: placeData.geometry.location.lng.toString() },
            },
          },
          viewport: placeData.geometry.viewport
            ? {
                M: {
                  south: { N: placeData.geometry.viewport.south.toString() },
                  west: { N: placeData.geometry.viewport.west.toString() },
                  north: { N: placeData.geometry.viewport.north.toString() },
                  east: { N: placeData.geometry.viewport.east.toString() },
                },
              }
            : { NULL: true },
        },
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

const addPlaceToListItem = async (
  userId,
  listId,
  placeId,
  placeName,
  photoUrl
) => {
  console.log(
    "addPlaceToUserList -- ",
    userId,
    listId,
    placeId,
    placeName,
    photoUrl
  );

  const placeMap = {
    placeId: { S: placeId },
    name: { S: placeName },
  };

  if (photoUrl) {
    placeMap.photo = { S: photoUrl };
  }

  const params = {
    TableName: LIST_TABLE,
    Key: {
      listId: { S: listId },
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
