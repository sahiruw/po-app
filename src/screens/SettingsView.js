// screens/SettingsScreen.js
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import AppBarC from "../components/AppBarC";

import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

import { useTheme } from "../assets/theme/theme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import userService from "../services/userService";
import userUtils from "../utils/userUtils";

import { AuthContext } from "../contextStore/AuthProvider";
import routeService from "../services/routeService";
import ProfileCard from "../components/ProfileCard";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as TaskManager from "expo-task-manager";

LOCATION_TRACKING = "background-location-task";

const SettingsView = () => {
  var { theme } = useTheme();
  const { user, setUser } = useContext(AuthContext);

  clearAsyncStorage = async () => {
    await AsyncStorage.removeItem("route");
    await AsyncStorage.removeItem("bundleData");
  };

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
        if (tracking) {
          Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        }
      });

      await signOut(auth);
      // await AsyncStorage.removeItem("user");
      await routeService.removeRoute();
      setUser(null);
      await userService.removeUserData();

      await clearAsyncStorage();
      navigation.navigate("Login");
      console.log("User signed out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <AppBarC title="Settings" />

      <View style={{ alignSelf: "center", margin: 20 }}>
        <ProfileCard />
      </View>
      {/* <Text>{JSON.stringify(user)}</Text> */}
      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => {
          navigation.navigate("EditProfile");
        }}
      >
        <Text>Edit Profile Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionItem]} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfo: {
    alignItems: "center",
    padding: 16,
  },
  notificationIcon: {
    marginRight: 10,
  },
  actionItem: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 16,
  },
});

export default SettingsView;
