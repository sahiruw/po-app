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
import { Avatar } from "react-native-paper";

import { AuthContext } from "../contextStore/AuthProvider";
import LoadingScreen from "./LoadingScreen";

const EditProfileScreen = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
  var { theme } = useTheme();
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImage(user?.profile_picture);
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
    let url = image;

    setUser({ ...user, profile_picture: url });

    await userService.updateUserData(user);
    navigation.navigate("Settings");
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          {/* <Text>{JSON.stringify(user)}</Text> */}
          <Image source={{ uri: image }} style={styles.profileImage} />
          <Text style={styles.uploadText}>Upload Profile Picture</Text>
        </TouchableOpacity>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          // placeholder={user?.name.first_name}
          onChangeText={(text) =>
            setUser({
              ...user,
              name: { first_name: text, last_name: user.name.last_name },
            })
          }
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          // placeholder={user?.name.last_name}
          onChangeText={(text) =>
            setUser({
              ...user,
              name: { last_name: text, first_name: user.name.first_name },
            })
          }
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
