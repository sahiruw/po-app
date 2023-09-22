import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../assets/theme/theme";
import userService from "../services/userService";
import { AuthContext } from "../contextStore/AuthProvider";
import LoadingScreen from "./LoadingScreen";

const EditProfileScreen = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState(""); // Track first name separately
  const [lastName, setLastName] = useState(""); // Track last name separately
  const { theme } = useTheme();
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImage(user?.profile_picture);
    setFirstName(user?.name?.first_name || ""); // Set the initial first name
    setLastName(user?.name?.last_name || ""); // Set the initial last name
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Combine first name and last name into the user object
    const updatedUser = {
      ...user,
      name: {
        first_name: firstName,
        last_name: lastName,
      },
      profile_picture: image,
    };

    // Update the user data
    await userService.updateUserData(updatedUser);

    // Update the user context
    setUser(updatedUser);

    navigation.navigate("Settings");
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.profileImage} />
        </TouchableOpacity>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName} // Use the state variable to set the initial value
          onChangeText={(text) => setFirstName(text)} // Update the first name
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName} // Use the state variable to set the initial value
          onChangeText={(text) => setLastName(text)} // Update the last name
        />

        <View style={{ top: 20 }}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.lightBackgroundColor3 },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.lightBackgroundColor3 },
            ]}
            onPress={() => {
              navigation.navigate("Settings");
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    width: 250,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  uploadText: {
    color: "blue",
    marginTop: 10,
  },
  label: {
    // fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default EditProfileScreen;
