import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

import MapView from "./components/MapView/MapView";

function App({ signOut }) {
  return <MapView />;
}

export default withAuthenticator(App);
