import React, { useEffect } from "react";
import { Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { MdOutlineLocationOff, MdOutlineLocationOn } from "react-icons/md";

const LocationTag = ({ setError, error, loading, location }) => {
  useEffect(() => {
    console.log("error: ", error);
    console.log("loading: ", loading);
    console.log("location: ", location);
    if (location || loading) {
      setError(null);
    }
  }, [error, loading, location, setError]);

  if (error) {
    return (
      <Tag color="error" icon={<MdOutlineLocationOff />}>
        No location
      </Tag>
    );
  }
  if (loading) {
    return (
      <Tag color="warning" icon={<LoadingOutlined />}>
        Loading...
      </Tag>
    );
  }
  if (location) {
    return (
      <Tag color="success" icon={<MdOutlineLocationOn />}>
        {location}
      </Tag>
    );
  }

  if (!location) {
    return (
      <Tag color="error" icon={<MdOutlineLocationOff />}>
        No location
      </Tag>
    );
  }
};

export default LocationTag;
