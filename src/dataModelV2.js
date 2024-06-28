const user = {
  userId: 1,
  userName: "email@gmail.com",
  lastLocation: {
    lat: 0,
    long: 0,
  },
  lists: [
    {
      listId: 1,
    },
  ],
};

const list = {
  listId: 1,
  userId: user.userId,
  listName: "My List",
  places: [
    {
      placeId: 1,
      name: "Place Name",
      location: {
        lat: 0,
        long: 0,
      },
      myRating: 5,
      myNotes: "My Notes",
      myTags: ["tag1", "tag2"],
    },
  ],
};

const place = {
  placeId: 1,
  googlePlaceData: {},
};

const categories = {
  categoryId: 1,
  name: "Category Name",
  tags: ["tag1", "tag2"],
  creationType: "user || default",
};
