import React from "react";
import { View, Button, StyleSheet , Text} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // After signing out, you might want to navigate the user to the login screen
      AsyncStorage.setItem("keepLoggedIn", "false")
      navigation.replace("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View>
      <Text>HomeScreen of the disptch karana ekaa</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})