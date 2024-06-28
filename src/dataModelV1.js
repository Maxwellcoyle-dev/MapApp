const user = {
  userId: 1,
  userName: "email@gmail.com",
  lastLocation: {
    lat: 0,
    long: 0,
  },
  lists: [
    {
      listId: 1, // reference the listId - primary key of list table
    },
  ],
  // user can edit + create their own categories
  // come with some built in default categories (e.g. meal, style, ethnicity, vibe, etc.)
  // user can add their own categories + tags. they can edit tags in default categories
  categories: [
    {
      categoryId: 1,
      name: "Category Name",
      tags: [{ tagId: 1, tagName: "" }],
      creationType: "user || default",
      createdAt: "2021-01-01T00:00:00Z",
      lastUpdaedAt: "2021-01-01T00:00:00Z",
    },
  ],
  createdAt: "2021-01-01T00:00:00Z",
};

const list = {
  listId: 1,
  userId: user.userId,
  listName: "My List",
  places: [
    // place contains everything necessary to display in list view + query can be made to google places api for more detailed information
    // could consider storing all google place data in dynamodb / if so consider how to reuse place data across lists and users.
    {
      placeId: 1, // google place_id
    },
  ],
  public: false, // if true, list is shareable
  createdAt: "2021-01-01T00:00:00Z",
  lastUpdaedAt: "2021-01-01T00:00:00Z",
};

const place = {
  placeId: 1, // google place_id - primary key
  userId: user.userId, // user specific - sortkey
  name: "Place Name",
  location: {
    lat: 0,
    long: 0,
  },
  images: ["url1", "url2"],
  hours: [
    {
      day: "Monday",
      open: "8:00 AM",
      close: "5:00 PM",
    },
  ],
  priceLevel: 1,
  myRating: 5,
  myNotes: "My Notes",
  myTags: [{ category: categoryId, tagId: 1 }], // tag = categoryId + tagId
  createdAt: "2021-01-01T00:00:00Z",
  lastUpdaedAt: "2021-01-01T00:00:00Z",
};
