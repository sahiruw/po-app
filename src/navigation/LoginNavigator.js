import React from "react";
import LoginScreen from "../screens/LoginScreen";
import SettingsView from "../screens/SettingsView";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


const Stack = createBottomTabNavigator();

function AuthStack() {
    return (
      <Stack.Navigator
        defaultScreenOptions={LoginScreen}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* <Stack.Screen name="Settings" component={SettingsView} /> */}
      </Stack.Navigator>
    );
  }

  export default AuthStack;