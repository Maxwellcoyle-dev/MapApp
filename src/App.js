import "./App.css";
import "@aws-amplify/ui-react/styles.css";

// React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Amplify
import { withAuthenticator } from "@aws-amplify/ui-react";
import { APIProvider } from "@vis.gl/react-google-maps";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Main from "./pages/Main/Main";
import MyAccount from "./pages/MyAccount";
import MyLists from "./pages/MyLists";
import ListManager from "./pages/ListManager";
import List from "./pages/List";
import PlaceDetails from "./pages/PlaceDetails/PlaceDetails";

// Components
import NavBar from "./components/NavBar/NavBar";

const queryClient = new QueryClient();

function App({ signOut }) {
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div style={{ position: "relative", height: "100vh" }}>
            {/* set the height to 100vh 1 4rem */}
            <div style={{ height: "calc(100vh - 4rem)", overflow: "hidden" }}>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route
                  path="/my-account"
                  element={<MyAccount signOut={signOut} />}
                />
                <Route path="/my-lists" element={<MyLists />} />
                <Route path="/list-manager" element={<ListManager />} />
                <Route path="/list/:listId" element={<List />} />
                <Route path="/place/:placeId" element={<PlaceDetails />} />
              </Routes>
            </div>

            <NavBar />
          </div>
        </Router>
      </QueryClientProvider>
    </APIProvider>
  );
}

export default withAuthenticator(App);
