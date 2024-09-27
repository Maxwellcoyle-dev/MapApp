import React, { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MdOutlineLocationOn } from "react-icons/md";
import { Switch, Tag } from "antd";

// hooks
import useGetCoordsLocality from "../../../hooks/google-api-hooks/useGetCoordsLocality";

// State
import { useSearchContext } from "../../../state/SearchContext";
import { useAppContext } from "../../../state/AppContext";

const LocationToggle = () => {
  const [localityDisplay, setLocalityDisplay] = useState("");

  // Search Context and App Context
  const { searchLocation, setSearchLocation, nearby, setNearby } =
    useSearchContext();
  const { userLocation } = useAppContext();

  // Google API Hook to get the locality of location coordinates
  const { getCoordsLocality } = useGetCoordsLocality();

  // access the map instance using the useMap hook - use this to set the center of the map
  const map = useMap();

  useEffect(() => {
    const updateLocationAndLocality = async () => {
      if (nearby) {
        const locality = await getCoordsLocality(userLocation);
        const truncatedLocality = locality?.slice(0, 15) || "Loading...";
        setLocalityDisplay(truncatedLocality);
        setSearchLocation({
          coords: userLocation,
          locality: locality,
        });
        map?.setCenter(userLocation);
      } else {
        const truncatedLocality = "Set location";
        setSearchLocation({
          coords: null,
          locality: null,
        });
        setLocalityDisplay(truncatedLocality);
      }
    };

    updateLocationAndLocality();
  }, [nearby, userLocation, map]);

  return (
    <div
      style={{
        width: "calc(100% - 2rem)",
        display: "flex",
        justifyContent: "space-between",
        padding: ".5rem",
        borderRadius: ".5rem",
        gap: ".25rem",
      }}
    >
      <Tag
        icon={<MdOutlineLocationOn style={{ verticalAlign: "middle" }} />}
        color={searchLocation?.locality ? "success" : "warning"}
        style={{
          maxWidth: "200px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "flex",
          alignItems: "center",
        }}
      >
        {searchLocation?.locality || localityDisplay}
      </Tag>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        <h4>Nearby</h4>
        <Switch
          checked={nearby}
          onChange={(checked) => {
            setNearby(checked);
          }}
        />
      </div>
    </div>
  );
};

export default LocationToggle;
