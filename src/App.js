import React, { useContext } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Main from "./pages/Main";

const queryClient = new QueryClient();

function App({ signOut }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ height: "100vh" }}>
        <Main />
      </div>
    </QueryClientProvider>
  );
}

export default withAuthenticator(App);
