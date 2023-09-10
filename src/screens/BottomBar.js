import React from "react";

import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/core";
import { useTheme } from "../assets/theme/theme";

function BottomBar(props) {
  var { navigation, state, descriptors, insets } = props.navData;
  var { theme } = useTheme();

  return (
    <BottomNavigation.Bar
      labeled={false}
      navigationState={state}
      safeAreaInsets={insets}
      
      style={{
        backgroundColor: theme.lightBackgroundColor3,
        borderTopLeftRadius: 20, // Rounded upper left corner
      }}
      // activeColor="blue"          // Color when selected
      inactiveColor="white"        // Color when not selected
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];
        if (options.tabBarIcon) {
          return options.tabBarIcon({ focused, color, size: 24 });
        }

        return null;
      }}
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.title;

        return label;
      }}
    />
  );
}

export default BottomBar;
