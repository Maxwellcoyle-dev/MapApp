import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppProvider } from "./state/AppContext";
import { AuthProvider } from "./state/AuthContext";

import { APIProvider } from "@vis.gl/react-google-maps";

import { Amplify } from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider>
      <AuthProvider>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </APIProvider>
      </AuthProvider>
    </AppProvider>
  </React.StrictMode>
);
