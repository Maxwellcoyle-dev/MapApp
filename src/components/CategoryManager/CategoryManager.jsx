import React, { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";

import useUser from "../../hooks/useUser";

const CategoryManager = () => {
  const [categories, setCategories] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
        console.log(user);
      })
      .catch((error) => console.error(error));
  }, []);

  // useEffect(() => {
  //   console.log(authUser?.data.categories);
  //   if (authUser?.data.categories) {
  //     setCategories(authUser?.data.categories);
  //   }
  // }, [user]);

  return <div>CategoryManager</div>;
};

export default CategoryManager;
