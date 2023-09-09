import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Switch,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import Constants from "expo-constants";
import routeService from "../../services/routeService";
import addressUtils from "../../utils/addressUtils";

import SignatureScreen from "../../components/SignatureScreen";
import NoteScreen from "../../components/NoteScreen";

const MAP_API_KEY = Constants.expoConfig.gmaps.apiKey;

const MapScreen = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [mailItems, setMailItems] = useState([]);

  const [isMailDelivered, setIsMailDelivered] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [note, setNote] = useState("");

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

  const handleSaveSignature = (signature) => {
    // Handle saving the signature image
    setSignatureImage(signature);
    setSignatureVisible(false);
  };

  const handleSaveNote = (userNote) => {
    // Handle saving the user's note
    setNote(userNote);
    setNoteVisible(false);
  };

  const handleMarkerPress = (index, coord) => {
    setSelectedMarker({ index, ...mailItems[index] });
    setIsMailDelivered(false);
  };

  const handleButton1Click = (marker) => {
    // Handle the first button click action here
    console.log("Button 1 clicked for marker:", marker);

    setCoordinates(
      coordinates.filter((coord, index) => index !== marker.index)
    );
  };

  const handleButton2Click = (marker) => {
    // Handle the second button click action here
    console.log("Button 2 clicked for marker:", marker);
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

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(selectedMarker)}</Text>
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

      {selectedMarker !== null && (
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
            {/* <SignatureScreen
              isVisible={isMailDelivered}
              onSave={handleSaveSignature}
              // onCancel={() => setSignatureVisible(false)}

            /> */}

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default MapScreen;
