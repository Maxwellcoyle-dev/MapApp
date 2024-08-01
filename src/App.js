// App.js
import { useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";

import { Layout } from "antd";

// React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Amplify
import { withAuthenticator } from "@aws-amplify/ui-react";

// Pages
import Main from "./pages/Main/Main";
import MyAccount from "./pages/MyAccount";
import MyPlaces from "./pages/MyPlacesPage/MyPlacesPage";
import ListPage from "./pages/ListPage/ListPage";
import PlacePage from "./pages/PlacePage/PlacePage";
import AddTagPage from "./pages/AddTagPage/AddTagPage";

// Components
import NavBar from "./components/NavBar/NavBar";
import { MapProvider } from "./state/MapContext"; // Import MapProvider
import { SearchProvider } from "./state/SearchContext";

import { useAppContext } from "./state/AppContext";

import useUser from "./hooks/backend-hooks/useUser";

const { Content, Footer } = Layout;

function App({ signOut, user }) {
  const { setUserLocation } = useAppContext();

  useEffect(() => {
    // get the mapAppUserLocation from local storage
    const userLocation = localStorage.getItem("mapAppUserLocation");
    if (userLocation) {
      setUserLocation(JSON.parse(userLocation));
    }

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

  const { authUser } = useUser(user);

  return (
    <SearchProvider>
      <MapProvider>
        <Router>
          <Layout style={{ height: "100vh", position: "relative" }}>
            <Content>
              <Routes>
                <Route path="/" element={<Main />}>
                  <Route path="list/:listId" element={<ListPage />} />
                  <Route path="place/:placeId" element={<PlacePage />} />
                </Route>
                <Route path="my-places" element={<MyPlaces />} />
                <Route path="add-tag/:placeId" element={<AddTagPage />} />
                <Route
                  path="/my-account"
                  element={<MyAccount signOut={signOut} />}
                />
              </Routes>
            </Content>
            <Footer
              style={{
                position: "sticky",
                bottom: 0,
                zIndex: 6,
                padding: 0,
              }}
            >
              <NavBar />
            </Footer>
          </Layout>
        </Router>
      </MapProvider>
    </SearchProvider>
  );
}

export default withAuthenticator(App);
