import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../assets/theme/theme";

const HomeScreen = ({ navigation }) => {
  var { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // After signing out, you might want to navigate the user to the login screen
      await AsyncStorage.setItem("keepLoggedIn", "false");
      await AsyncStorage.removeItem("user");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text>HomeScreen of the disptch karana ekaa</Text>
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

export default HomeScreen;