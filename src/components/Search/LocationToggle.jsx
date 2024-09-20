import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { Switch, Tag } from "antd";

// State
import { useSearchContext } from "../../state/SearchContext";
import { useMapContext } from "../../state/MapContext";

const LocationToggle = () => {
  const { searchLocation, nearby, setNearby } = useSearchContext();
  const { userLocality } = useMapContext();

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
        {searchLocation?.locality
          ? searchLocation.locality.length > 15
            ? searchLocation.locality.slice(0, 15) + "..."
            : searchLocation.locality
          : "No location set"}
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
