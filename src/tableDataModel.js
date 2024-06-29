const user = {
  userId: 1, // primary key - cognito userId
  userName: "email@gmail.com",
  lastLocation: {
    // last known location of the user - use to center map while searching for location or on location error
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
      tags: [
        {
          tagId: 1, // uuid to identify tag / make tags searchable
          tagName: "",
        },
      ],
      creationType: "user || default",
      createdAt: "2021-01-01T00:00:00Z",
      lastUpdaedAt: "2021-01-01T00:00:00Z",
    },
  ],
  createdAt: "2021-01-01T00:00:00Z",
};

const list = {
  listId: 1, // primary key - uuid - reference in user table
  userId: user.userId, // userId of the user who created / owns the list
  listName: "My List",
  places: [
    {
      placeId: 1, // google place_id - reference the placeId - primary key of place table
    },
  ],
  public: false, // if true, list is shareable
  createdAt: "2021-01-01T00:00:00Z",
  lastUpdaedAt: "2021-01-01T00:00:00Z",
};

// contains enough information to display a place on the map + show basic details in a list view
// use google places api to get more details
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
  myTags: [{ categoryId: categoryId, tagId: tagId }], // tag = categoryId + tagId
  createdAt: "2021-01-01T00:00:00Z",
  lastUpdaedAt: "2021-01-01T00:00:00Z",
};
