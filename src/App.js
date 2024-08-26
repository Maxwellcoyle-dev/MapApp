// App.js
import { useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";

import { Layout } from "antd";

// React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home/Home";
import MyAccount from "./pages/MyAccount";
import MyListsPage from "./pages/MyListsPage/MyListsPage";
import ListPage from "./pages/ListPage/ListPage";
import PlacePage from "./pages/PlacePage/PlacePage";
import SignIn from "./pages/AuthPages/SignIn";
import CreateAccount from "./pages/AuthPages/CreateAccount";
import AddTagPage from "./pages/AddTagPage/AddTagPage";
import ManageCategoriesPage from "./pages/ManageCategoriesPage/ManageCategoriesPage";
import SearchResultsListPage from "./pages/SearchResultsListPage/SearchResultsListPage";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

// Hooks
import useGetUserLocation from "./hooks/useGetUserLocation";

// Context

import { SearchProvider } from "./state/SearchContext";
import { useAppContext } from "./state/AppContext";

const { Content, Footer } = Layout;

function App() {
  const { setUserLocation } = useAppContext();

  useGetUserLocation();

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
      <Router>
        <Layout style={{ height: "100vh", position: "relative" }}>
          <Content>
            <Routes>
              <Route path="login" element={<SignIn />} />
              <Route path="create-account" element={<CreateAccount />} />
              <Route path="/" element={<Home />}>
                <Route
                  path="results-list"
                  element={<SearchResultsListPage />}
                />
                <Route path="list/:listId" element={<ListPage />} />
              </Route>
              <Route path="place/:placeId" element={<PlacePage />} />
              <Route
                path="my-lists"
                element={
                  <ProtectedRoute>
                    <MyListsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="add-tag/:placeId" element={<AddTagPage />} />
              <Route
                path="manage-categories"
                element={<ManageCategoriesPage />}
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
          {/* <Footer
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 6,
              padding: 0,
            }}
          >
            <NavBar />
          </Footer> */}
        </Layout>
      </Router>
    </SearchProvider>
  );
}

export default App;
