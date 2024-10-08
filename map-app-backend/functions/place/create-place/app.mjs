import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

import { marshall } from "@aws-sdk/util-dynamodb";

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
      placeId: { S: place.placeId },
      userId: { S: userId },
    },
  };
  console.log("getParams -- ", getParams);
  const getCommand = new GetItemCommand(getParams);

  const getPlaceResponse = await dbclient.send(getCommand);
  console.log("getPlaceResponse -- ", getPlaceResponse);

  if (getPlaceResponse.Item) {
    console.log(
      "Place already saved to Place Table. Adding reference to List Item"
    );
    const isDuplicate = await checkListForDuplicateItem(listId, place.placeId);
    if (isDuplicate) {
      console.log("Place already saved to this list!");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Place already saved to this list!" }),
      };
    }
    console.log(userId, listId, place.placeId, place.placeName);
    await addPlaceToListItem(userId, listId, place.placeId, place.placeName);
  } else {
    console.log("Place not saved yet. Saving place to Place Table");
    await savePlace(userId, listId, place);
    console.log("Place saved to Place Table. Adding reference to List Item");
    await addPlaceToListItem(userId, listId, place.placeId, place.placeName);
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

  console.log("savePlace -- ", userId, listId, placeData);

  console.log("opening_hours -- ", placeData.opening_hours);

  const params = {
    TableName: PLACE_TABLE,
    Item: {
      placeId: { S: placeData.placeId },
      userId: { S: userId },
      placeName: { S: placeData.placeName },
      placeIsSaved: { BOOL: true },
      formatted_address: { S: placeData.formatted_address || "" },
      formatted_phone_number: { S: placeData.formatted_phone_number || "" },
      business_status: { S: placeData.business_status || "" },
      ...(placeData.international_phone_number && {
        international_phone_number: {
          S: placeData.international_phone_number,
        },
      }),
      placeUrl: { S: placeData.placeUrl || "" },
      website: { S: placeData.website || "" },
      vicinity: { S: placeData.vicinity || "" },
      rating: { N: placeData.rating ? placeData.rating.toString() : "0" },
      total_user_ratings: {
        N: placeData.user_ratings_total
          ? placeData.user_ratings_total.toString()
          : "0",
      },
      types: { SS: placeData.types || [] },
      reviews: {
        L: placeData.reviews?.map((review) => ({
          M: {
            authorName: { S: review.author_name },
            authorUrl: { S: review.author_url },
            language: { S: review.language },
            profilePhotoUrl: { S: review.profile_photo_url },
            rating: { N: review.rating.toString() },
            relativeTimeDescription: { S: review.relative_time_description },
            text: { S: review.text },
            time: { N: review.time.toString() },
          },
        })),
      },
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
      opening_hours: {
        M: {
          weekday_text: {
            L: placeData.opening_hours?.weekday_text?.map((text) => ({
              S: text,
            })),
          },
          periods: {
            L: placeData.opening_hours?.periods?.map((period) => ({
              M: {
                close: {
                  M: {
                    day: { N: period.close.day.toString() },
                    time: { S: period.close.time },
                  },
                },
                open: {
                  M: {
                    day: { N: period.open.day.toString() },
                    time: { S: period.open.time },
                  },
                },
              },
            })),
          },
        },
      },
    },
  };

  console.log("opening_hours -- ", placeData.opening_hours);
  console.log("params", params);
  console.log(params.Item.opening_hours);
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
    placeName: { S: placeName },
  };

  console.log("placeMap -- ", placeMap);

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
