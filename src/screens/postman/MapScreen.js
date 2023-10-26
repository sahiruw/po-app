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

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Constants from "expo-constants";
import routeService from "../../services/routeService";
import addressUtils from "../../utils/addressUtils";

import AppbarC from "../../components/AppBarC";
import LoadingScreen from "../LoadingScreen";
import { useNavigation } from "@react-navigation/core";
import { useTheme } from "../../assets/theme/theme";
import { MailListContext } from "../../contextStore/MailListProvider";
import { useContext } from "react";
import { AppConstants } from "../../assets/constants";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

import { PROVIDER_GOOGLE } from "react-native-maps";

const MAP_API_KEY = Constants.expoConfig.extra.apiKey;
console.log("map api",MAP_API_KEY);

const MapScreen = () => {
  const { theme } = useTheme();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [coordinatesforRoute, setCoordinatesforRoute] = useState([]);
  const { mailList, setMailList } = useContext(MailListContext);

  const [isMailDelivered, setIsMailDelivered] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const fetchMailList = async () => {
    setIsLoading(true);
    let route = await routeService.getRouteForToday();
    setMailList(route.mailItemData);
    console.log("Mail List fetched from API");
    setIsLoading(false);
  };

  const fetchCoordinates = async () => {
    // setIsLoading(true);

    if (mailList) {
      // update new mail list in async storage
      await routeService.updateMailListofroute(mailList);
      let userloc = await addressUtils.getUserLocation();

      let coordinatesTemp = [userloc];
      let coordinatesTempForRoute = [userloc];

      for (let mail of mailList) {
        let location = mail.receiver_address.Location;
        coordinatesTemp.push({
          latitude: location[0],
          longitude: location[1],
        });

        if (mail.status === AppConstants.MailItemStatus.OutforDelivery) {
          // console.log(mail.status);
          // console.log(mail.receiver_name);

          coordinatesTempForRoute.push({
            latitude: location[0],
            longitude: location[1],
          });
        }
      }
      // console.log(coordinatesTemp)

      setCoordinates(coordinatesTemp);
      setCoordinatesforRoute(coordinatesTempForRoute);
      console.log("Coordinates fetched from API");
    }
    // setIsLoading(false);
  };

  useEffect(() => {
    fetchCoordinates();
  }, [mailList]);

  useEffect(() => {
    fetchCoordinates();
    fetchMailList();
  }, []);

  const reload = async () => {
    fetchCoordinates();
    fetchMailList();
  };

  const handleMarkerPress = (index, coord) => {
    setSelectedMarker({ index, ...mailList[index - 1] });
    setIsMailDelivered(false);
  };

  const handleMarkAttempt = (marker) => {
    // if (marker.type != "Normal" || !isMailDelivered) {
    navigation.navigate("DeliverySubmission", { isMailDelivered, marker });
    // }
    // console.log("handleMarkAttempt", marker)
    setSelectedMarker(null);
  };

  const handleOpenInMaps = () => {
    
    if (coordinatesforRoute.length > 1) {
      console.log("Opening in Google Maps");
      const { latitude, longitude } =
        coordinatesforRoute[coordinatesforRoute.length - 1];

      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode = driving&waypoints=${coordinatesforRoute
        .slice(0, -2)
        .map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`)
        .join("|")}`;
      console.log("Opening in Google Maps:", url);
      Linking.openURL(url);
    }
    else {
      console.log("No route to open in Google Maps");
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Unsuccessful",
        textBody: "No route to open in Google Maps",
        button: "Okay",
      });
    }
  };

  const handleOverlayPress = () => {
    // Close the popup when the overlay is pressed
    setSelectedMarker(null);
  };

  return (
    <>
      <AppbarC title="Map" />
      {isLoading && <LoadingScreen />}
      <View style={styles.container}>
        <View style={styles.container2}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.midGreenBackgroundColor, width: "85%" },
            ]}
            onPress={handleOpenInMaps}
          >
            <Text style={styles.buttonText}>Open in Google Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.midRedBackgroundColor, width: "10%" , padding: 5},
            ]}
            onPress={reload}
          >
            <Text style={[styles.buttonText, {fontSize: 20}]}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* <Text>{JSON.stringify(mailList[0])}</Text> */}


        <MapView
          
          style={styles.map}
          initialRegion={{
            latitude: coordinates[0] ? coordinates[0].latitude : 6.79,
            longitude: coordinates[0] ? coordinates[0].longitude : 79.9,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomControlEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          provider = {PROVIDER_GOOGLE}
        >
          {coordinates.length > 0 &&
            coordinates.map((coord, index) => (
              <Marker
                key={index + 1}
                coordinate={coord}
                title={index == 0 ? "Your Location" : `Item ${index}`}
                onPress={() => handleMarkerPress(index, coord)}
                //colour of the marker
                pinColor={
                  mailList[index - 1]?.type === AppConstants.MailItems.Normal
                    ? AppConstants.MailItemMarkerColors.Normal
                    : mailList[index - 1]?.type ===
                      AppConstants.MailItems.Registered
                    ? AppConstants.MailItemMarkerColors.Registered
                    : mailList[index - 1]?.type === AppConstants.MailItems.Logi
                    ? AppConstants.MailItemMarkerColors.Logi
                    : mailList[index - 1]?.type ===
                      AppConstants.MailItems.Return
                    ? AppConstants.MailItemMarkerColors.Return
                    : "black" // Default color if none of the types match
                }
              />
            ))}

          {coordinates.length > 1 && (
            <MapViewDirections
              origin={coordinatesforRoute[0]}
              waypoints={coordinatesforRoute} // Exclude the first and last points
              destination={coordinatesforRoute[coordinatesforRoute.length - 1]}
              apikey={MAP_API_KEY}
              strokeWidth={4}
              strokeColor="grey"
            />
          )}
        </MapView>

        {selectedMarker?.receiver_address && (
          <>
            <View
              style={[
                styles.markerInfo,
                {
                  backgroundColor:
                    selectedMarker.status == AppConstants.MailItemStatus.Failed
                      ? theme.lightRedBackgroundColor
                      : selectedMarker.status ==
                        AppConstants.MailItemStatus.Delivered
                      ? theme.lightGreenBackgroundColor
                      : theme.backgroundColor,
                },
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>
                {String(selectedMarker.type).toUpperCase()} -{" "}
                {selectedMarker.status}
              </Text>

              <Text style={{ fontWeight: "bold" }}>
                {selectedMarker.receiver_name}
              </Text>
              <Text>
                {`No: ${addressUtils.formatAddress(
                  selectedMarker.receiver_address
                )}`}
              </Text>
              {selectedMarker.status !=
              AppConstants.MailItemStatus.OutforDelivery ? (
                <>
                  <Icon
                    name={
                      AppConstants.MailItemIcons[
                        AppConstants.MappingToDB[selectedMarker.type]
                      ]
                    }
                    size={100}
                    style={{ marginTop: 10, marginBottom: 10 }}
                  />
                </>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 16,
                    }}
                  >
                    <Text style={{ marginRight: 8 }}>
                      Is the mail delivered?
                    </Text>
                    <Switch
                      value={isMailDelivered}
                      onValueChange={(value) => setIsMailDelivered(value)}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => handleMarkAttempt(selectedMarker)}
                    style={[
                      styles.button,
                      { backgroundColor: theme.lightBackgroundColor2 },
                    ]}
                  >
                    <Text style={styles.buttonText}>
                      {isMailDelivered
                        ? selectedMarker.type != AppConstants.MailItems.Normal
                          ? "Get Signature"
                          : "Mark as Delivered"
                        : "Add Delivery Failure Notice"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
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
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  map: {
    flex: 1,

    top: 15,
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
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
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
    // paddingHorizontal: 20, // Add horizontal padding for spacing
    // paddingVertical: 20,
  },
});

export default MapScreen;
