import * as Location from "expo-location";
import Constants from "expo-constants";
import Geocoder from 'react-native-geocoding';

Geocoder.init(Constants.expoConfig.extra.apiKey);

const formatAddress = (address) => {
  return `${address.HouseNo}, ${address.Address_line_1}, ${address.Address_line_2}, ${address.Address_line_3}, ${address.City}`;
};

const geocodeToAddress = async (location) => {
    Geocoder.from(location)
          .then((json) => {
            const formattedAddress = json.results[0].formatted_address;
            return formattedAddress
          })
          .catch((error) => {
            console.warn(error)
            return null
        });
}

const getUserLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return;
  }
  let location = await Location.getLastKnownPositionAsync({})
  const { latitude, longitude } = location.coords;
  return {
    latitude,
    longitude,
  };
};

export default {
  formatAddress,
  getUserLocation,
    geocodeToAddress,
};
