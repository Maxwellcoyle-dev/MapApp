// App.js
import { useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";

import { Layout } from "antd";

// React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Main from "./pages/Main/Main";
import MyAccount from "./pages/MyAccount";
import MyPlaces from "./pages/MyPlacesPage/MyPlacesPage";
import ListPage from "./pages/ListPage/ListPage";
import PlacePage from "./pages/PlacePage/PlacePage";
import SignIn from "./pages/AuthPages/SignIn";
import CreateAccount from "./pages/AuthPages/CreateAccount";
import AddTagPage from "./pages/AddTagPage/AddTagPage";
import SavePlace from "./pages/SavePlace/SavePlace";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

// Components
import NavBar from "./components/NavBar/NavBar";

// Context
import { MapProvider } from "./state/MapContext";
import { SearchProvider } from "./state/SearchContext";
import { useAppContext } from "./state/AppContext";

const { Content, Footer } = Layout;

function App() {
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

  return (
    <SearchProvider>
      <MapProvider>
        <Router>
          <Layout style={{ height: "100vh", position: "relative" }}>
            <Content>
              <Routes>
                <Route path="login" element={<SignIn />} />
                <Route path="create-account" element={<CreateAccount />} />
                <Route path="/" element={<Main />}>
                  <Route path="list/:listId" element={<ListPage />} />
                  <Route path="place/:placeId" element={<PlacePage />} />
                </Route>
                <Route
                  path="my-places"
                  element={
                    <ProtectedRoute>
                      <MyPlaces />
                    </ProtectedRoute>
                  }
                />
                <Route path="add-tag/:placeId" element={<AddTagPage />} />
                <Route
                  path="save-place/:placeId"
                  element={
                    <ProtectedRoute>
                      <SavePlace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-account"
                  element={
                    <ProtectedRoute>
                      <MyAccount />
                    </ProtectedRoute>
                  }
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

export default App;
