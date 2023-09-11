// navigation/RootStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditProfileScreen from "../screens/EditProfileScreen";
import LoginScreen from "../screens/LoginScreen";

import HomeScreen from "../screens/dispatcher/HomeScreen";
import BottomBar from "../screens/BottomBar";
import SettingsView from "../screens/SettingsView";
import AddtoBundleScreen from "../screens/dispatcher/AddtoBundleScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../assets/theme/theme";

const Stack = createNativeStackNavigator();
const StackBottom = createBottomTabNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainStack} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

function MainStack() {
  var { theme } = useTheme();

  return (
    <StackBottom.Navigator
      defaultScreenOptions={HomeScreen}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: theme.primaryColor,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomBar navData={{ navigation, state, descriptors, insets }} />
      )}
    >
      <StackBottom.Screen
        name="Dispatcher Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <StackBottom.Screen
        name="Add"
        component={AddtoBundleScreen}
        options={{
          tabBarLabel: "Add to Bundle",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="barcode-scan" size={size} color={color} />;
          },
        }}
      />

      <StackBottom.Screen
        name="View"
        component={AddtoBundleScreen}
        options={{
          tabBarLabel: "Add to Bundle",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="view-list" size={size} color={color} />;
          },
        }}
      />
      <StackBottom.Screen
        name="Settings"
        component={SettingsView}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="cog" size={size} color={color} />;
          },
        }}
      />
    </StackBottom.Navigator>
  );
}

export default RootStack;
