// AppNavigator.js
import React, { useState, createContext, useContext, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

import LoadingScreen from "../screens/LoadingScreen";

import PostmanStack from "./PostmanNavigator";
import DispatcherStack from "./Dispatchernavigation";
import AuthStack from "./LoginNavigator";

import userService from "../services/userService";
import AuthProvider, { AuthContext } from "../contextStore/AuthProvider";
import { AlertNotificationRoot } from "react-native-alert-notification";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as TaskManager from "expo-task-manager";

import { rtdatabase } from "../config/firebase";
import { ref, set } from "firebase/database";
import { AppConstants } from "../assets/constants";

const LOCATION_TASK_NAME = "background-location-task";

function RootNavigator() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data && user?.role == AppConstants.EmployeeRoles.Postman) {
      const { locations } = data;
      const lat = locations[0].coords.latitude;
      const long = locations[0].coords.longitude;
      saveLocationToFirebase(lat, long);
    }
  });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setLoading(true);

      if (authenticatedUser) {
        console.log("User is authenticated");
        const uid = authenticatedUser.uid;
        let userData = await userService.getUserData(
          uid,
          authenticatedUser.email
        );

        // console.log("User Data", userData);
        setUser(userData);
      } else {
        console.log("User is not authenticated");
        setUser(null);
        setLoading(false);

        return <AuthStack />;
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveLocationToFirebase = async (lat, long) => {

    const userId = user?.uid;

    try {
      const locationRef = ref(rtdatabase, `userLocation/${userId}`);
      await set(locationRef, {
        lat,
        long,
      });
      console.log("Location saved to Firebase for user ID:", userId);
    } catch (error) {
      console.error("Error saving location to Firebase:", error);
    }
  };



  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestBackgroundPermissionsAsync();

      if (status === "granted") {
        // Start the location updates

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          enableHighAccuracy: true,
          distanceInterval: 1,
          timeInterval: 5000,
        });
      } else {
        console.error("Location services needed");
      }
    };

    if (user?.role == AppConstants.EmployeeRoles.Postman) {
      getLocationPermission();
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
  let userRole = user?.role;
  userID = user?.uid;
  // console.log(user)
  return (
    <NavigationContainer>
      {userRole === AppConstants.EmployeeRoles.Postman ? (
        <PostmanStack />
      ) : userRole === AppConstants.EmployeeRoles.Dispatcher ? (
        <DispatcherStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const AppNavigator = () => {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </AlertNotificationRoot>
  );
};

export default AppNavigator;
