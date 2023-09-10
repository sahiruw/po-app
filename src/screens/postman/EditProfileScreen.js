import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import AppBarC from "../../components/AppBarC";

const EditProfileScreen = () => {
  return (
    <>
    <AppBarC title="Edit Profile" showBackButton={true}/>
    <View>
      

      <Text>Edit Profile Screen</Text>
      {/* Add form elements for editing user profile */}
    </View>
    </>
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
  
  
export default EditProfileScreen;
