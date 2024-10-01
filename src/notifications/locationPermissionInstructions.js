import { MdOutlineLocationOn } from "react-icons/md";
import { AiFillApple, AiFillChrome } from "react-icons/ai";

// Function to display permission instructions based on the device and browser type
const locationPermissionInstructions = (deviceType) => {
  console.log("deviceType: ", deviceType);
  let instructions = "";

  if (deviceType === "android") {
    instructions = (
      <div>
        <p>
          <MdOutlineLocationOn
            style={{ color: "#faad14", marginRight: "8px" }}
          />
          <strong>Enable location permissions in Chrome on Android:</strong>
        </p>
        <ul style={{ paddingLeft: "1rem" }}>
          <li>Tap the three dots in the top-right corner.</li>
          <li>
            Go to <strong>Settings &gt; Site settings &gt; Location</strong>.
          </li>
          <li>
            Ensure that location permissions are allowed for this website.
          </li>
        </ul>
      </div>
    );
  } else if (deviceType === "ios") {
    instructions = (
      <div>
        <p>
          <AiFillApple style={{ color: "#1677ff", marginRight: "8px" }} />
          <strong>Enable location permissions in Safari on iOS:</strong>
        </p>
        <ul style={{ paddingLeft: "1rem" }}>
          <li>
            Go to <strong>Settings &gt; Safari &gt; Location</strong> and select
            "Allow".
          </li>
          <li>
            Alternatively, go to{" "}
            <strong>Settings &gt; Privacy &gt; Location Services</strong> and
            ensure Safari is set to "While Using the App".
          </li>
        </ul>
      </div>
    );
  } else if (deviceType === "ios-chrome") {
    instructions = (
      <div>
        <p>
          <AiFillChrome style={{ color: "#1677ff", marginRight: "8px" }} />
          <strong>Enable location permissions in Chrome on iOS:</strong>
        </p>
        <ul style={{ paddingLeft: "1rem" }}>
          <li>
            Go to <strong>Settings &gt; Chrome &gt; Location</strong> and select
            "Allow".
          </li>
          <li>
            Alternatively, go to{" "}
            <strong>Settings &gt; Privacy &gt; Location Services</strong> and
            ensure Chrome is set to "While Using the App".
          </li>
        </ul>
      </div>
    );
  } else {
    instructions = (
      <div>
        <MdOutlineLocationOn style={{ color: "#faad14", marginRight: "8px" }} />
        <p>
          Please check your browser settings to enable location permissions.
        </p>
      </div>
    );
  }
  return instructions;
};

export default locationPermissionInstructions;
