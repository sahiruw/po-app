import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

import { useTheme } from "../../assets/theme/theme";

// import userService from "../../services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsView = ({ navigation }) => {
  var { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      
      // await userService.removeUserData();
      //wait for 1 second
      setTimeout(() => {
        console.log("Waited 1 second");
      }, 1000);
      navigation.navigate("Postman Home");
      console.log("User signed out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text>HomeScreen of the Postman</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default SettingsView;
