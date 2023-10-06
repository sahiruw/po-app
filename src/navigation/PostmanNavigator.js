// navigation/RootStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditProfileScreen from "../screens/EditProfileScreen";
import LoginScreen from "../screens/LoginScreen";

import PostmanHomeScreen from "../screens/postman/HomeScreen";
import PostmanBottomBar from "../screens/BottomBar";
import AddAddressScreen from "../screens/postman/AddAddressScreen";
import MailListTabs from "../screens/postman/MailListTabs";
import SettingsView from "../screens/SettingsView";
import MapScreen from "../screens/postman/MapScreen";
import DeliverySubmission from "../screens/postman/DeliverySubmission";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../assets/theme/theme";
import MailListProvider from "../contextStore/MailListProvider";

const Stack = createNativeStackNavigator();
const StackBottom = createBottomTabNavigator();

const RootStack = () => {
  return (
    <MailListProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainStack} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen
          name="DeliverySubmission"
          component={DeliverySubmission}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </MailListProvider>
  );
};

function MainStack() {
  var { theme } = useTheme();

  return (
    <StackBottom.Navigator
      defaultScreenOptions={PostmanHomeScreen}
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
        <PostmanBottomBar
          navData={{ navigation, state, descriptors, insets }}
        />
      )}
    >
      <StackBottom.Screen
        name="Postman Home"
        component={PostmanHomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />

      <StackBottom.Screen
        name="Add Address"
        component={AddAddressScreen}
        options={{
          tabBarLabel: "Add Address",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="plus" size={size} color={color} />;
          },
        }}
      />

      <StackBottom.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="map" size={size} color={color} />;
          },
        }}
      />

      <StackBottom.Screen
        name="Mail List"
        component={MailListTabs}
        options={{
          tabBarLabel: "Mail List",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="email" size={size} color={color} />;
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
