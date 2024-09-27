// App.js
import { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { Layout } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

// Pages
import Home from "./routes/Home/Home";
import MyAccount from "./routes/MyAccount";
import ListPage from "./routes/ListPage/ListPage";
import PlacePage from "./routes/PlacePage/PlacePage";
import SignIn from "./routes/AuthRoutes/SignIn";
import CreateAccount from "./routes/AuthRoutes/CreateAccount";
import AddTag from "./routes/AddTag/AddTag";
import ManageCategoriesPage from "./routes/ManageCategoriesPage/ManageCategoriesPage";
import SearchResultsPage from "./routes/SearchResultsPage/SearchResultsPage";

// Context
import { SearchProvider } from "./state/SearchContext";

// Hooks
import useGetUserLocation from "./hooks/useGetUserLocation";

const { Content } = Layout;

function AuthenticatedLayout({ children }) {
  const [authStatus, setAuthStatus] = useState("loading");

  const getUserLocation = useGetUserLocation();

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchAuthSession();
        setAuthStatus("authenticated");
      } catch (error) {
        setAuthStatus("unauthenticated");
      }
    };
    checkAuth();
  }, []);

  if (authStatus === "loading") {
    return null; // or a loading spinner
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <SearchProvider>
      <Router>
        <Layout style={{ height: "100vh", position: "relative" }}>
          <Content>
            <Routes>
              {/* Auth Routes */}
              <Route path="login" element={<SignIn />} />
              <Route path="create-account" element={<CreateAccount />} />

              {/* Authenticated Routes */}
              <Route
                path="/*"
                element={
                  <AuthenticatedLayout>
                    <Routes>
                      <Route path="/" element={<Home />}>
                        <Route
                          path="results-list"
                          element={<SearchResultsPage />}
                        />
                        <Route path="list/:listId" element={<ListPage />} />
                        <Route path="place/:placeId" element={<PlacePage />} />
                      </Route>
                      <Route path="add-tag/:placeId" element={<AddTag />} />
                      <Route
                        path="manage-categories"
                        element={<ManageCategoriesPage />}
                      />
                      <Route path="my-account" element={<MyAccount />} />
                    </Routes>
                  </AuthenticatedLayout>
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </SearchProvider>
  );
}

export default App;
