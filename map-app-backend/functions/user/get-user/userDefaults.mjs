import { v4 as uuidv4 } from "uuid";

export const defaultCategories = [
  {
    categoryId: { N: "1" },
    categoryName: { S: "Cuisine Type" },
    tags: {
      L: [
        { M: { tagId: { S: "1" }, tagName: { S: "Italian" } } },
        { M: { tagId: { S: "2" }, tagName: { S: "Chinese" } } },
        { M: { tagId: { S: "3" }, tagName: { S: "Mexican" } } },
        { M: { tagId: { S: "4" }, tagName: { S: "Japanese" } } },
        { M: { tagId: { S: "5" }, tagName: { S: "Indian" } } },
        { M: { tagId: { S: "6" }, tagName: { S: "French" } } },
        { M: { tagId: { S: "7" }, tagName: { S: "Mediterranean" } } },
        { M: { tagId: { S: "8" }, tagName: { S: "American" } } },
        { M: { tagId: { S: "9" }, tagName: { S: "Thai" } } },
        { M: { tagId: { S: "10" }, tagName: { S: "Korean" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
  {
    categoryId: { N: "2" },
    categoryName: { S: "Meal Type" },
    tags: {
      L: [
        { M: { tagId: { S: "1" }, tagName: { S: "Breakfast" } } },
        { M: { tagId: { S: "2" }, tagName: { S: "Brunch" } } },
        { M: { tagId: { S: "3" }, tagName: { S: "Lunch" } } },
        { M: { tagId: { S: "4" }, tagName: { S: "Dinner" } } },
        { M: { tagId: { S: "5" }, tagName: { S: "Dessert" } } },
        { M: { tagId: { S: "6" }, tagName: { S: "Late Night" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
  {
    categoryId: { N: "3" },
    categoryName: { S: "Dietary Preferences" },
    tags: {
      L: [
        { M: { tagId: { S: "1" }, tagName: { S: "Vegetarian" } } },
        { M: { tagId: { S: "2" }, tagName: { S: "Vegan" } } },
        { M: { tagId: { S: "3" }, tagName: { S: "Gluten-Free" } } },
        { M: { tagId: { S: "4" }, tagName: { S: "Paleo" } } },
        { M: { tagId: { S: "5" }, tagName: { S: "Keto" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
  {
    categoryId: { N: "4" },
    categoryName: { S: "Ambiance" },
    tags: {
      L: [
        { M: { tagId: { S: "1" }, tagName: { S: "Casual Dining" } } },
        { M: { tagId: { S: "2" }, tagName: { S: "Fine Dining" } } },
        { M: { tagId: { S: "3" }, tagName: { S: "Family-Friendly" } } },
        { M: { tagId: { S: "4" }, tagName: { S: "Romantic" } } },
        { M: { tagId: { S: "5" }, tagName: { S: "Trendy" } } },
        { M: { tagId: { S: "6" }, tagName: { S: "Quiet" } } },
        { M: { tagId: { S: "7" }, tagName: { S: "Lively" } } },
        { M: { tagId: { S: "8" }, tagName: { S: "Outdoor Seating" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
  {
    categoryId: { S: "5" },
    categoryName: { S: "Features" },
    tags: {
      L: [
        { M: { tagId: { S: "1" }, tagName: { S: "Takeout" } } },
        { M: { tagId: { S: "2" }, tagName: { S: "Delivery" } } },
        { M: { tagId: { S: "3" }, tagName: { S: "Reservations" } } },
        { M: { tagId: { S: "4" }, tagName: { S: "Live Music" } } },
        { M: { tagId: { S: "5" }, tagName: { S: "Pet-Friendly" } } },
        { M: { tagId: { S: "6" }, tagName: { S: "Free Wi-Fi" } } },
        { M: { tagId: { S: "7" }, tagName: { S: "Happy Hour" } } },
        { M: { tagId: { S: "8" }, tagName: { S: "Wheelchair Accessible" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
];

export const defaultList = {
  listId: { S: uuidv4() },
  listName: { S: "Saved" },
  public: { BOOL: false },
  userId: { S: "" },
  listDescription: { S: "Your saved places" },
  createdAt: { N: `${Date.now()}` },
  lastUpdatedAt: { N: `${Date.now()}` },
  creationType: { S: "default" },
};
