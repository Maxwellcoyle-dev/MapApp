import "./App.css";
import "@aws-amplify/ui-react/styles.css";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Main from "./pages/Main";

const queryClient = new QueryClient();

function App({ signOut }) {
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </APIProvider>
  );
}

export default withAuthenticator(App);
