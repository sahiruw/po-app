import React from "react";
import { View, Button, StyleSheet , Text} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

function PostmanHomeScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // After signing out, you might want to navigate the user to the login screen
      navigation.replace("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View>
      {/* Your home screen content */}
      <Text>Postman Home Screen</Text>
      {/* <text>{user}</text> */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

export default PostmanHomeScreen;


const styles = StyleSheet.create({})

