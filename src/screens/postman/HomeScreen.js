import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { useTheme } from "../../assets/theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  var { theme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      let user = await AsyncStorage.getItem("user");
      console.log("User from async", user);
      if (user !== null) {
        setUser(JSON.parse(user));
      }
    }
    getUser();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text>HomeScreen of the Postman</Text>

      <Text>{JSON.stringify(user)}</Text>
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
