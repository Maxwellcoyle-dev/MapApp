// App.js
import { useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";

// React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Amplify
import { withAuthenticator } from "@aws-amplify/ui-react";

// Pages
import Main from "./pages/Main/Main";
import MyAccount from "./pages/MyAccount";
import MyLists from "./pages/MyLists/MyLists";
import ListManager from "./pages/ListManager";
import List from "./pages/List";
import PlaceDetails from "./pages/PlaceDetails/PlaceDetails";

// Components
import NavBar from "./components/NavBar/NavBar";
import { MapProvider } from "./state/MapContext"; // Import MapProvider

import { useAppContext } from "./state/AppContext";

import useUser from "./hooks/useUser";

function App({ signOut, user }) {
  const { userLocation, setUserLocation } = useAppContext();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error(error)
    );
  }, []);

  const { user: loggedInUser, isUserLoading, userError } = useUser(user);

  return (
    <MapProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route
              path="/my-account"
              element={<MyAccount signOut={signOut} />}
            />
            <Route path="my-lists" element={<MyLists />} />
            <Route path="list-manager" element={<ListManager />} />
            <Route path="list/:listId" element={<List />} />
            <Route path="place/:placeId" element={<PlaceDetails />} />
          </Route>
        </Routes>

        <NavBar />
      </Router>
    </MapProvider>
  );
}

export default withAuthenticator(App);
