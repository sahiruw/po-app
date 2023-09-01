import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { useTheme } from "../../assets/theme/theme";

const HomeScreen = ({ navigation }) => {
  var { theme } = useTheme();


  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text>HomeScreen of the Postman</Text>

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
