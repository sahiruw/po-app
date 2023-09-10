import React, { createRef, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Switch,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import Constants from "expo-constants";
import routeService from "../../services/routeService";
import addressUtils from "../../utils/addressUtils";

import { SketchCanvas, SketchCanvasRef } from "rn-perfect-sketch-canvas";
import AppbarC from "../../components/AppBarC";

const MAP_API_KEY = Constants.expoConfig.gmaps.apiKey;

const MapScreen = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [mailItems, setMailItems] = useState([]);

  const [isMailDelivered, setIsMailDelivered] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [note, setNote] = useState("");

  const canvasRef = useRef();

  useEffect(() => {
    // Fetch the coordinates from the API
    const fetchCoordinates = async () => {
      let route = await routeService.getRouteForToday();
      setMailItems(route.mailItemData);
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
    console.log("Coordinates fet ched from API");
  }, []);

  const handleMarkerPress = (index, coord) => {
    setSelectedMarker({ index, ...mailItems[index - 1] });
    setIsMailDelivered(false);
    canvasRef.current?.reset();
    setNote("");
  };

  const handleButton1Click = (marker) => {
    // Handle the first button click action here
    console.log("Button 1 clicked for marker:", marker);
    setShowSubmit(true);
    // setCoordinates(
    //   coordinates.filter((coord, index) => index !== marker.index)
    // );
  };

  const handleSubmit = () => {
    // Handle the first button click action here

    setShowSubmit(false);
  };

  const handleOpenInMaps = () => {
    if (coordinates.length > 1 && selectedMarker !== null) {
      const { latitude, longitude } = selectedMarker;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      console.log("Opening in Google Maps:", url);
      Linking.openURL(url);
    }
  };

  const handleOverlayPress = () => {
    // Close the popup when the overlay is pressed
    setSelectedMarker(null);
  };

  if (!showSubmit) {
    return (
      <>
        <AppbarC title="Map" />
        <View style={styles.container}>
          {/* <Text>{JSON.stringify(selectedMarker)}</Text> */}
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
                    mailItems[index - 1]?.type === "Normal"
                      ? "green"
                      : mailItems[index - 1]?.type === "Registered"
                      ? "blue"
                      : mailItems[index - 1]?.type === "Parcel"
                      ? "orange"
                      : mailItems[index - 1]?.type === "Return"
                      ? "red"
                      : "black" // Default color if none of the types match
                  }
                  In
                  th
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
                    Mark as {isMailDelivered ? "Delivered" : "Not Delivered"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOpenInMaps()}
                  style={styles.openInMapsButton}
                >
                  <Text>Open in Google Maps</Text>
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
  } else {
    return (
      <>
        <AppbarC title="Update Status" showBackButton={true} />
        <View style={styles.container}>
          <View style={styles.container2}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowSubmit(false)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
          {isMailDelivered && (
            <>
              <SketchCanvas
                ref={canvasRef}
                strokeColor={"black"}
                strokeWidth={5}
                containerStyle={{
                  flex: 1,
                  orderWidth: 1, // Add border width
                  borderColor: "black",
                  marginRight: 10,
                  marginTop: 10,
                  marginLeft: 10,
                }}
              />
              <View style={styles.container2}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    canvasRef.current?.reset();
                  }}
                >
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    canvasRef.current?.undo();
                  }}
                >
                  <Text style={styles.buttonText}>Undo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    canvasRef.current?.redo();
                  }}
                >
                  <Text style={styles.buttonText}>Redo</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {!isMailDelivered && (
            <TextInput
              placeholder="Enter note here..."
              multiline
              value={note}
              onChangeText={(text) => setNote(text)}
              style={styles.inputField}
            />
          )}
        </View>
      </>
    );
  }
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
