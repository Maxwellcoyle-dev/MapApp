import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import MapView from "./components/MapView/MapView";
import PlacesComponent from "./components/PlacesComponent/PlacesComponent";

const queryClient = new QueryClient();

function App({ signOut }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <PlacesComponent />
        <MapView />;
      </div>
    </QueryClientProvider>
  );
}

export default withAuthenticator(App);
