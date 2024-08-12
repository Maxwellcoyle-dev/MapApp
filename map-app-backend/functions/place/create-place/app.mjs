import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
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
  const listId = body.listId;
  console.log("listId -- ", listId);
  const userId = body.userId;
  console.log("userId -- ", userId);
  const place = body.place;
  console.log("place -- ", place);

  // check if the place is already saved
  const getParams = {
    TableName: PLACE_TABLE,
    Key: {
      placeId: { S: place.place_id },
      userId: { S: userId },
    },
  };
  const getCommand = new GetItemCommand(getParams);

  const getPlaceResponse = await dbclient.send(getCommand);
  console.log("getPlaceResponse -- ", getPlaceResponse);

  if (getPlaceResponse.Item) {
    console.log(
      "Place already saved to Place Table. Adding reference to List Item"
    );
    const isDuplicate = await checkListForDuplicateItem(listId, place.place_id);
    if (isDuplicate) {
      console.log("Place already saved to this list!");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Place already saved to this list!" }),
      };
    }
    await addPlaceToListItem(userId, listId, place.place_id, place.name);
  } else {
    console.log("Place not saved yet. Saving place to Place Table");
    await savePlace(userId, listId, place);
    console.log("Place saved to Place Table. Adding reference to List Item");
    await addPlaceToListItem(userId, listId, place.place_id, place.name);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Place saved successfully!" }),
  };
};

const savePlace = async (userId, listId, placeData) => {
  if (!placeData || !listId || !userId) {
    console.error("Missing required place data");
    return;
  }

  const params = {
    TableName: PLACE_TABLE,
    Item: {
      placeId: { S: placeData.place_id },
      userId: { S: userId },
      placeName: { S: placeData.name },
      formattedAddress: { S: placeData.formatted_address || "" },
      formattedPhoneNumber: { S: placeData.formatted_phone_number || "" },
      businessStatus: { S: placeData.business_status || "" },
      icon: { S: placeData.icon || "" },
      internationalPhoneNumber: {
        S: placeData.international_phone_number || "",
      },
      placeUrl: { S: placeData.url || "" },
      website: { S: placeData.website || "" },
      vicinity: { S: placeData.vicinity || "" },
      rating: { N: placeData.rating ? placeData.rating.toString() : "0" },
      types: { SS: placeData.types || [] },
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
    const savePlaceResult = await dbclient.send(command);
    console.log("savePlaceResult -- ", savePlaceResult);
  } catch (err) {
    console.error("Error saving place", err);
  }
};

const addPlaceToListItem = async (userId, listId, placeId, placeName) => {
  console.log("addPlaceToUserList -- ", userId, listId, placeId, placeName);

  const placeMap = {
    placeId: { S: placeId },
    name: { S: placeName },
  };

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
    const updateListItemResponse = await dbclient.send(command);
    console.log("updateListItemResponse -- ", updateListItemResponse);
    console.log("Place added to user list successfully");
  } catch (err) {
    console.error("Error adding place to user list", err);
  }
};

const checkListForDuplicateItem = async (listId, placeId) => {
  const params = {
    TableName: LIST_TABLE,
    Key: {
      listId: { S: listId },
    },
  };

  const command = new GetItemCommand(params);
  try {
    const listData = await dbclient.send(command);
    console.log("listData -- ", listData);
    if (listData.Item) {
      const list = listData.Item;
      const places = list.places.L;
      const isDuplicate = places.some((place) => place.M.placeId.S === placeId);
      return isDuplicate;
    }
  } catch (err) {
    console.error("Error checking for duplicate item", err);
  }
};
