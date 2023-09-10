import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useTheme } from "../../assets/theme/theme";

import addressUtils from "../../utils/addressUtils";
import AppbarC from "../../components/AppBarC";

const AddAddressScreen = () => {
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(userLocation);
  const [userLocation, setUserLocation] = useState(null);
  var { theme } = useTheme();

  useEffect(() => {
    // Get the user's current location
    (async () => {
      let userloc = await addressUtils.getUserLocation();
      setSelectedLocation(userloc);
      setUserLocation(userloc);
    })();
  }, []);

  const handleMarkerDragEnd = (event) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };


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

    // Save the address  and location to the database
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

    console.log("Address added  successfully!");
  };

  return (
    <>
    <AppbarC title="Add Address" />
    <View style={styles.container}>
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 6.79,
          longitude: userLocation ? userLocation.longitude : 79.86,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        onMarkerDragEnd= {handleMarkerDragEnd}
        showsUserLocation={true}
        userLocationAnnotationTitle={"You are here"}
        followsUserLocation={true}
        showsMyLocationButton={true}    
      >
        {selectedLocation && <Marker coordinate={selectedLocation} draggable />}
      </MapView>
      <TouchableOpacity style={[styles.button ,{ backgroundColor: theme.primaryColor}]} onPress={handleSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>

    </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    height: 40,
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
  button :{
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddAddressScreen;
