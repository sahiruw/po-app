import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Appbar, Badge } from "react-native-paper";
import { useTheme } from "../assets/theme/theme";
import { useNavigation } from "@react-navigation/core";

const AppbarC = ({ title , showBackButton}) => {
  var { theme } = useTheme();
  const navigation = useNavigation();
  return (
    <Appbar.Header style={{ backgroundColor: theme.lightBackgroundColor3 }}>
      {showBackButton && <Appbar.BackAction onPress={() => navigation.goBack()} color="white"/>}
      <Appbar.Content title={title} titleStyle={{ color: "white" }} />
      {/* <Appbar.Action icon="bell" onPress={() => Handle notifications} /> */}
      <TouchableOpacity
        onPress={() => {
          /* Handle notifications */
        }}
      >
        <Badge>3</Badge>

        <Avatar.Icon icon="bell" size={24} style={styles.notificationIcon} />
      </TouchableOpacity>
    </Appbar.Header>
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

export default AppbarC;
