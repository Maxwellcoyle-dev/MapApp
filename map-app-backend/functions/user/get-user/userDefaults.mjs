export const defaultCategories = [
  {
    categoryId: { N: "1" },
    name: { S: "Cuisine Type" },
    tags: {
      L: [
        { M: { tagId: { N: "1" }, tagName: { S: "Italian" } } },
        { M: { tagId: { N: "2" }, tagName: { S: "Chinese" } } },
        { M: { tagId: { N: "3" }, tagName: { S: "Mexican" } } },
        { M: { tagId: { N: "4" }, tagName: { S: "Japanese" } } },
        { M: { tagId: { N: "5" }, tagName: { S: "Indian" } } },
        { M: { tagId: { N: "6" }, tagName: { S: "French" } } },
        { M: { tagId: { N: "7" }, tagName: { S: "Mediterranean" } } },
        { M: { tagId: { N: "8" }, tagName: { S: "American" } } },
        { M: { tagId: { N: "9" }, tagName: { S: "Thai" } } },
        { M: { tagId: { N: "10" }, tagName: { S: "Korean" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
  {
    categoryId: { N: "2" },
    name: { S: "Meal Type" },
    tags: {
      L: [
        { M: { tagId: { N: "1" }, tagName: { S: "Breakfast" } } },
        { M: { tagId: { N: "2" }, tagName: { S: "Brunch" } } },
        { M: { tagId: { N: "3" }, tagName: { S: "Lunch" } } },
        { M: { tagId: { N: "4" }, tagName: { S: "Dinner" } } },
        { M: { tagId: { N: "5" }, tagName: { S: "Dessert" } } },
        { M: { tagId: { N: "6" }, tagName: { S: "Late Night" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
  {
    categoryId: { N: "3" },
    name: { S: "Dietary Preferences" },
    tags: {
      L: [
        { M: { tagId: { N: "1" }, tagName: { S: "Vegetarian" } } },
        { M: { tagId: { N: "2" }, tagName: { S: "Vegan" } } },
        { M: { tagId: { N: "3" }, tagName: { S: "Gluten-Free" } } },
        { M: { tagId: { N: "4" }, tagName: { S: "Paleo" } } },
        { M: { tagId: { N: "5" }, tagName: { S: "Keto" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
  {
    categoryId: { N: "4" },
    name: { S: "Ambiance" },
    tags: {
      L: [
        { M: { tagId: { N: "1" }, tagName: { S: "Casual Dining" } } },
        { M: { tagId: { N: "2" }, tagName: { S: "Fine Dining" } } },
        { M: { tagId: { N: "3" }, tagName: { S: "Family-Friendly" } } },
        { M: { tagId: { N: "4" }, tagName: { S: "Romantic" } } },
        { M: { tagId: { N: "5" }, tagName: { S: "Trendy" } } },
        { M: { tagId: { N: "6" }, tagName: { S: "Quiet" } } },
        { M: { tagId: { N: "7" }, tagName: { S: "Lively" } } },
        { M: { tagId: { N: "8" }, tagName: { S: "Outdoor Seating" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
  {
    categoryId: { N: "5" },
    name: { S: "Features" },
    tags: {
      L: [
        { M: { tagId: { N: "1" }, tagName: { S: "Takeout" } } },
        { M: { tagId: { N: "2" }, tagName: { S: "Delivery" } } },
        { M: { tagId: { N: "3" }, tagName: { S: "Reservations" } } },
        { M: { tagId: { N: "4" }, tagName: { S: "Live Music" } } },
        { M: { tagId: { N: "5" }, tagName: { S: "Pet-Friendly" } } },
        { M: { tagId: { N: "6" }, tagName: { S: "Free Wi-Fi" } } },
        { M: { tagId: { N: "7" }, tagName: { S: "Happy Hour" } } },
        { M: { tagId: { N: "8" }, tagName: { S: "Wheelchair Accessible" } } },
      ],
    },
    creationType: { S: "default" },
    createdAt: { N: `${Date.now()}` },
    lastUpdatedAt: { N: `${Date.now()}` },
  },
];

export const defaultLists = [];
