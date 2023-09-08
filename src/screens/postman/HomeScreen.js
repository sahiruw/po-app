import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { useTheme } from "../../assets/theme/theme";
import userService from "../../services/userService"
import routeService from "../../services/routeService"

const HomeScreen = ({ navigation }) => {
  var { theme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      let user = await userService.getUserData();
      setUser(user);
    }
    getUser();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text>HomeScreen of the Postman</Text>
      <Text>{JSON.stringify(routeService.getRouteForToday())}</Text>
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
