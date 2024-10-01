import { useAppContext } from "../state/AppContext";

// Helper function to detect if the user is on iOS or Android and whether they are using Chrome or Safari
const useGetDeviceType = () => {
  const { setDeviceType } = useAppContext();
  const userAgent = navigator.userAgent || window.opera;
  console.log("userAgent", userAgent);

  if (/android/i.test(userAgent)) {
    setDeviceType("android");
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    // Check if the browser is Chrome or Safari on iOS
    if (/CriOS/i.test(userAgent)) {
      setDeviceType("ios-chrome"); // Chrome on iOS
    } else {
      setDeviceType("ios"); // Safari on iOS
    }
  } else {
    setDeviceType("other");
  }
};

export default useGetDeviceType;
