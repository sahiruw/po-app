import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { collection, addDoc } from "firebase/firestore";
// import { db } from "./config/firebase";

const AddAddressScreen = () => {
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get the user's current location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({
        latitude,
        longitude,
      });
      setSelectedLocation({
        latitude,
        longitude,
      });
    })();
  }, []);

  const handleMapPress = (event) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  const handleSubmit = async () => {
    // Check if a location is selected
    if (!selectedLocation) {
      console.log("Please select a location on the map.");
      return;
    }

    // Save the address and location to the database
    // await addDoc(collection(db, "addresses"), {
    //   addressLine1,
    //   addressLine2,
    //   city,
    //   location: selectedLocation,
    // });
    console.log(JSON.stringify( {
      addressLine1,
      addressLine2,
      city,
      location: selectedLocation,
    }))
    // Clear input fields and selected location
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    // setSelectedLocation(null);

    console.log("Address added successfully!");
  };

  return (
    <View style={styles.container}>
      <Text>Add Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Address Line 1"
        value={addressLine1}
        onChangeText={setAddressLine1}
      />
      <TextInput
        style={styles.input}
        placeholder="Address Line 2"
        value={addressLine2}
        onChangeText={setAddressLine2}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <Text>Map:{JSON.stringify( userLocation)}</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 6.79,
          longitude: userLocation ? userLocation.longitude : 79.86,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} draggable />}
      </MapView>
      <Text>Selected Location:</Text>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  map: {
    flex: 1,
    height: 300,
    marginBottom: 10,
  },
});

export default AddAddressScreen;
