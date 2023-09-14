import React, { createRef, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Switch,
  TextInput,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import Constants from "expo-constants";
import routeService from "../../services/routeService";
import addressUtils from "../../utils/addressUtils";

import AppbarC from "../../components/AppBarC";
import LoadingScreen from "../LoadingScreen";
import { useNavigation } from "@react-navigation/core";

import { MailListContext } from "../../contextStore/MailListProvider";
import { useContext } from "react";

const MAP_API_KEY = Constants.expoConfig.gmaps.apiKey;

const MapScreen = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const {mailList, setMailList} = useContext(MailListContext)

  const [isMailDelivered, setIsMailDelivered] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);


  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();



  useEffect(() => {
    setIsLoading(true);
    // Fetch the coordinates from the API
    const fetchCoordinates = async () => {
      let route = await routeService.getRouteForToday();
      setMailList(route.mailItemData);
      let userloc = await addressUtils.getUserLocation();
      let coordinatesTemp = [userloc];
      for (let mail of route.mailItemData) {
        let location = mail.receiver_address.Location;
        coordinatesTemp.push({
          latitude: location[0],
          longitude: location[1],
        });
      }
      setCoordinates(coordinatesTemp);
    };
    fetchCoordinates();
    console.log("Coordinates fetched from API");
    setIsLoading(false);
  }, [coordinates.length]);

  const handleMarkerPress = (index, coord) => {
    setSelectedMarker({ index, ...mailList[index - 1] });
    setIsMailDelivered(false);
  };

  const handleButton1Click = (marker) => {
    // Handle the first button click action here

    // console.log("Button 1 clicked for marker:", marker);

    if (marker.type != "Normal" || !isMailDelivered) {
      navigation.navigate("DeliverySubmission", { isMailDelivered, marker});
    } 
  };



  const handleOpenInMaps = () => {
    console.log("Opening in Google Maps");
    console.log(coordinates);
    if (coordinates.length > 1) {
      //from last coordinate
      const { latitude, longitude } = coordinates[coordinates.length - 1];

      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode = driving&waypoints=${coordinates
        .slice(1, -2)
        .map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`)
        .join("|")}`;
      console.log("Opening in Google Maps:", url);
      Linking.openURL(url);
    }
  };

  const handleOverlayPress = () => {
    // Close the popup when the overlay is pressed
    setSelectedMarker(null);
  };

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }
    return (
      <>
        <AppbarC title="Map" />
        {isLoading && <LoadingScreen />}

        <View style={styles.container}>
          {/* <Text>{JSON.stringify(coordinates)}</Text> */}
          <TouchableOpacity
            onPress={handleOpenInMaps}
            style={styles.openInMapsButton}
          >
            <Text>Open in Google Maps</Text>
          </TouchableOpacity>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinates[0] ? coordinates[0].latitude : 6.0367,
              longitude: coordinates[0] ? coordinates[0].longitude : 80.217,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {coordinates.length > 0 &&
              coordinates.map((coord, index) => (
                <Marker
                  key={index}
                  coordinate={coord}
                  title={`Point ${index + 1}`}
                  onPress={() => handleMarkerPress(index, coord)}
                  //colour of the marker
                  pinColor={
                    mailList[index - 1]?.type === "Normal"
                      ? "green"
                      : mailList[index - 1]?.type === "Registered"
                      ? "blue"
                      : mailList[index - 1]?.type === "Parcel"
                      ? "orange"
                      : mailList[index - 1]?.type === "Return"
                      ? "red"
                      : "black" // Default color if none of the types match
                  }
                />
              ))}

            {coordinates.length > 1 && (
              <MapViewDirections
                origin={coordinates[0]}
                waypoints={coordinates.slice(1, -1)} // Exclude the first and last points
                destination={coordinates[coordinates.length - 1]}
                apikey={MAP_API_KEY}
                strokeWidth={3}
                strokeColor="grey"
              />
            )}
          </MapView>

          {selectedMarker?.receiver_address_id && (
            <>
              <View style={styles.markerInfo}>
                <Text style={{ fontWeight: "bold" }}>
                  {`${selectedMarker.receiver_name.first_name} ${selectedMarker.receiver_name.mid_name} ${selectedMarker.receiver_name.last_name}`}
                </Text>
                <Text>
                  {`No: ${addressUtils.formatAddress(
                    selectedMarker.receiver_address
                  )}`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  <Text style={{ marginRight: 8 }}>Is the mail delivered?</Text>
                  <Switch
                    value={isMailDelivered}
                    onValueChange={(value) => setIsMailDelivered(value)}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => handleButton1Click(selectedMarker)}
                  style={styles.button}
                >
                  <Text>
                    {isMailDelivered ? selectedMarker.type != "Normal" ? "Get Signature" : "Mark as Delivered" : "Add Delivery Failure Notice"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => handleOverlayPress()}
              />
            </>
          )}
        </View>
      </>
    );
  
};

const styles = StyleSheet.create({
  inputField: {
    backgroundColor: "white",
    padding: 10,
    height: 250,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 10,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  markerInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1, // Ensure the popup is above the overlay
  },

  sign: {
    zIndex: 2, // Ensure the popup is above the overlay
  },
  button: {
    marginTop: 10,
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
  openInMapsButton: {
    marginTop: 10,
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 0, // Place the overlay behind the popup
  },

  container2: {
    flexDirection: "row", // Arrange buttons horizontally
    justifyContent: "space-between", // Space between buttons
    paddingHorizontal: 20, // Add horizontal padding for spacing
    paddingVertical: 20,
  },
});

export default MapScreen;
