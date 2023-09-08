import React, { useState } from "react";
import { useTheme } from "../assets/theme/theme";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";



const LoginScreen = ({ navigation }) => {
  const { width, height } = Dimensions.get("window");
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userID = userCredential.user.uid;
      console.log("User ID", userID);
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
      console.log("Login Failed", errorMessage);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{
          width: width * 0.8,
          height: height * 0.5,
          resizeMode: "contain",
        }}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: "blue",
  },
  loginButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LoginScreen;
