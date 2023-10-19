import React, { useContext } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import userUtils from "../utils/userUtils";
import { AuthContext } from "../contextStore/AuthProvider";

const ProfileCard = () => {
    const { user, setUser } = useContext(AuthContext);
  
  return (
    <View style={styles.container}>
      <Avatar.Image source={{ uri: user?.profile_picture }} size={100} />
      <View style= {styles.userData}>
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Role: {user?.role}</Text>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: "row",
    alignItems: "center",
  },
  userData: {
    marginLeft: 10,
  },

  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProfileCard;
