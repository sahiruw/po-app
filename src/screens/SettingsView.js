// screens/SettingsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import AppBarC from "../components/AppBarC";

import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

import { useTheme } from "../assets/theme/theme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import userService from "../services/userService";

const SettingsView = () => {
  var { theme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("user");
        if (jsonValue != null) {
          setUser(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.log(e);
      }
    };
    getUserData();
  }, []);

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // await AsyncStorage.removeItem("user");
      await userService.removeUserData();
      setTimeout(() => {
        console.log("Waited 1 second");
      }, 1000);
      navigation.navigate("Login");
      console.log("User signed out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <AppBarC title="Settings" />

      {/* User Info Section */}
      {/* Replace with actual user data */}
      <View style={styles.userInfo}>
        <Avatar.Image source={require("./profile.jpg")} size={100} />
        <Text>Name: John Doe</Text>
        <Text>Email: johndoe@example.com</Text>
        <Text>Role: User</Text>
      </View>

      {/* Action List */}
      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text>Edit Profile Data</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionItem}>
        <Text>Show Statistics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
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
    borderColor: "#ccc",
    padding: 16,
  },
});

export default SettingsView;
