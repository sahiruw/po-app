import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useTheme } from "../../assets/theme/theme";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

import addressUtils from "../../utils/addressUtils";
import AppbarC from "../../components/AppBarC";
import userService from "../../services/userService";
import postOfficeService from "../../services/postOfficeService";
import addressService from "../../services/addressService";
import LoadingScreen from "../LoadingScreen";

const AddAddressScreen = () => {
  const [address, setAddress] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(userLocation);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  var { theme } = useTheme();

  useEffect(() => {
    // Get the user's current location
    (async () => {
      let userloc = await addressUtils.getUserLocation();
      setSelectedLocation(userloc);
      setUserLocation(userloc);
    })();
  }, []);

  useEffect(() => {
    // Get users city from the selected location
    const getCity = async () => {
      setIsLoading(true);
      let postmanActive = await userService.getActiveUserData();
      let po = await postOfficeService.getDetailsofPostofficeByID(
        postmanActive.postoffice
      );
      setAddress({ ...address, City: po.Name, RegionID: postmanActive.region, District: po.District });
      setIsLoading(false);
    };
    getCity();
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
    setIsLoading(true);
    // Check if a location is selected
    if (!selectedLocation) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Location",
        textBody: "Please select a location on the map.",
        button: "Okay",
      });
      return;
    }

    if (
      !address.HouseNo  ||
      !address.Address_line_1  ||
      !address.Address_line_2 
    ) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Address",
        textBody: `Please fill all the fields.`,
        button: "Okay",
      });
      return;
    }
    console.log(address);
    // Save the address  and location to the database
    let addressID = await addressService.addAddress({...address, Location:[selectedLocation.latitude, selectedLocation.longitude]});
    console.log(addressID);
    // Clear input fields and selected location
    setAddress({ City: address.City, District: address.District, RegionID: address.RegionID });
    setSelectedLocation(userLocation);

    setIsLoading(false);
    // Show success message
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Address Added",
      textBody: `The address 
      ${address.HouseNo}, ${address.Address_line_1}, ${address.Address_line_2},s ${address.city} 
      has been added successfully.\nID: ${addressID}`,
      button: "Okay",
    });
  };

  return (
    <>
      <AppbarC title="Add Address" />
      {isLoading && <LoadingScreen />}
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <TextInput
            style={[
              styles.input,
              styles.halfInput,
              {
                borderColor: theme.accentColor,
                fontStyle: "italic",
                color: theme.lightBackgroundColor3,
              },
            ]}
            value={address?.City}
            onChangeText={(text) => setAddress({ ...address, City: text })}
            placeholder="City"
            editable={false}
          />

          <TextInput
            style={[styles.input, styles.halfInput]}
            onChangeText={(text) => setAddress({ ...address, HouseNo: text })}
            placeholder="House No"
          />
        </View>
        <TextInput
          style={styles.input}
          onChangeText={(text) =>
            setAddress({ ...address, Address_line_1: text })
          }
          placeholder="Enter Address Line 1"
        />

        <TextInput
          style={styles.input}
          onChangeText={(text) =>
            setAddress({ ...address, Address_line_2: text })
          }
          placeholder="Enter Address Line 2"
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
          onMarkerDragEnd={handleMarkerDragEnd}
          showsUserLocation={true}
          userLocationAnnotationTitle={"You are here"}
          followsUserLocation={true}
          showsMyLocationButton={true}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} draggable />
          )}
        </MapView>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.lightBackgroundColor2 },
          ]}
          onPress={handleSubmit}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "49%",
  },
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
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddAddressScreen;
