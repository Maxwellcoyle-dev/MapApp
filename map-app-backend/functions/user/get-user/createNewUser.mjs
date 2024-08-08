import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { defaultCategories } from "./userDefaults.mjs";

const REGION = "us-east-2";
const USER_TABLE = "MapAppUserTable";
const LIST_TABLE = "MapAppListsTable";
const dbclient = new DynamoDBClient({ region: REGION });

export const createNewUser = async (userId, email) => {
  console.log("Creating new user function ...");
  const defaultListId = await createDefaultList(userId);
  console.log("Default list created: ", defaultListId);

  try {
    const formattedCategories = defaultCategories.map((category, index) => {
      if (!category.tags || !category.tags.L) {
        console.error(
          `Invalid category structure at index ${index}:`,
          category
        );
        throw new Error(`Invalid category structure at index ${index}`);
      }

      const formattedTags = category.tags.L.map((tag, tagIndex) => {
        if (!tag.M) {
          console.error(
            `Invalid tag structure at index ${tagIndex} in category ${index}:`,
            tag
          );
          throw new Error(
            `Invalid tag structure at index ${tagIndex} in category ${index}`
          );
        }

        return {
          M: {
            tagId: { S: uuidv4() },
            tagName: { S: tag.M.tagName.S },
          },
        };
      });

      return {
        M: {
          categoryId: { S: uuidv4() },
          categoryName: { S: category.categoryName.S },
          tags: { L: formattedTags },
          creationType: { S: category.creationType.S },
          createdAt: { N: `${category.createdAt.N}` },
          lastUpdatedAt: { N: `${category.lastUpdatedAt.N}` },
        },
      };
    });

    const putParams = {
      TableName: USER_TABLE,
      Item: {
        userId: { S: userId },
        email: { S: email },
        lists: {
          L: [
            {
              M: {
                listId: { S: defaultListId },
              },
            },
          ],
        },
        categories: { L: formattedCategories },
        createdAt: { N: `${Date.now()}` },
      },
    };

    console.log("Put params: ", JSON.stringify(putParams, null, 2));
    await dbclient.send(new PutItemCommand(putParams));

    const newUser = {
      userId,
      email,
      lists: [{ listId: defaultListId }],
      categories: defaultCategories,
      createdAt: Date.now(),
    };

    console.log("User created: ", newUser);
    return newUser;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error("Error creating new user");
  }
};

const createDefaultList = async (userId) => {
  console.log("Creating default list ...");
  const listId = uuidv4();
  console.log("List ID: ", listId);

  try {
    const formattedList = {
      listId: { S: listId },
      userId: { S: userId },
      listName: { S: "My List" },
      listDescription: { S: "This is your default list." },
      public: { BOOL: false },
      createdAt: { N: `${Date.now()}` },
      lastUpdatedAt: { N: `${Date.now()}` },
    };

    const putParams = {
      TableName: LIST_TABLE,
      Item: formattedList,
    };

    console.log("Put params for list: ", JSON.stringify(putParams, null, 2));
    await dbclient.send(new PutItemCommand(putParams));

    return listId;
  } catch (err) {
    console.error("Error: ", err);
    throw new Error("Error creating default list");
  }
};
