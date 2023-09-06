import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const MAP_API_KEY = "AIzaSyAuYYZazxHt-Kl5vWNfLnfffVrYGDBdgeo"; // Replace with your Google Maps API key

const MapScreen = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerColor, setMarkerColor] = useState("blue");

  const coordinates = [
    { latitude: 6.0367, longitude: 80.217 }, // Galle
    { latitude: 6.0344, longitude: 80.2176 }, // Galle Fort
    { latitude: 6.0364, longitude: 80.2178 }, // Galle Clock Tower
    { latitude: 6.0413, longitude: 80.2175 }, // Galle International Cricket Stadium
    { latitude: 6.0421, longitude: 80.215 }, // Unawatuna Beach
    { latitude: 6.0233, longitude: 80.2175 }, // Jungle Beach
    { latitude: 6.0369, longitude: 80.2251 }, // National Maritime Museum
    { latitude: 6.0331, longitude: 80.2166 }, // Dutch Hospital Shopping Precinct
    { latitude: 6.0246, longitude: 80.2186 }, // Japanese Peace Pagoda
    { latitude: 6.0319, longitude: 80.2167 }, // All Saints' Church
  ];

  const handleMarkerPress = (index, coord) => {
    setSelectedMarker({ index, ...coord });
  };

  const handleButton1Click = (marker) => {
    // Handle the first button click action here
    console.log("Button 1 clicked for marker:", marker);
    setMarkerColor("green");
  };

  const handleButton2Click = (marker) => {
    // Handle the second button click action here
    console.log("Button 2 clicked for marker:", marker);
    setMarkerColor("grey");
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            coordinate={coord}
            title={`Point ${index + 1}`}
            onPress={() => handleMarkerPress(index, coord)}
            pinColor={index === selectedMarker?.index ? markerColor : "blue"}
          />
        ))}

        {coordinates.length > 1 && (
          <MapViewDirections
            origin={coordinates[0]}
            waypoints={coordinates.slice(1, -1)} // Exclude the first and last points
            destination={coordinates[coordinates.length - 1]}
            apikey={MAP_API_KEY}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
      </MapView>

      {selectedMarker !== null && (
        <>
          <View style={styles.markerInfo}>
            <Text>Latitude: {selectedMarker.latitude}</Text>
            <Text>Longitude: {selectedMarker.longitude}</Text>
            <TouchableOpacity
              onPress={() => handleButton1Click(selectedMarker)}
              style={styles.button}
            >
              <Text>Button 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleButton2Click(selectedMarker)}
              style={styles.button}
            >
              <Text>Button 2</Text>
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
