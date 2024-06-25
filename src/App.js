import { useState } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { APIProvider } from "@vis.gl/react-google-maps";

import Main from "./pages/Main";

function App({ signOut }) {
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <Main />
    </APIProvider>
  );
}

export default withAuthenticator(App);
