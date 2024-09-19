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

// Hooks
import useGetUserLocation from "./hooks/useGetUserLocation";

// Context
import { SearchProvider } from "./state/SearchContext";

const { Content } = Layout;

function AuthenticatedLayout({ children }) {
  const [authStatus, setAuthStatus] = useState("loading");

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
  useGetUserLocation();

  return (
    <SearchProvider>
      <Router>
        <Layout style={{ height: "100vh", position: "relative" }}>
          <Content>
            <Routes>
              <Route path="login" element={<SignIn />} />
              <Route path="create-account" element={<CreateAccount />} />
              <Route
                path="/*"
                element={
                  <AuthenticatedLayout>
                    <Routes>
                      <Route path="/" element={<Home />}>
                        <Route
                          path="results-list"
                          element={<SearchResultsListPage />}
                        />
                        <Route path="list/:listId" element={<ListPage />} />
                        <Route path="place/:placeId" element={<PlacePage />} />
                      </Route>
                      <Route path="my-lists" element={<MyListsPage />} />
                      <Route path="add-tag/:placeId" element={<AddTagPage />} />
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
