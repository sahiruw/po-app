import React from "react";


import DispatcherHomeScreen from "../screens/dispatcher/HomeScreen";


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


const Stack = createBottomTabNavigator();

function DispatcherStack() {
    return (
      <Stack.Navigator
        defaultScreenOptions={DispatcherHomeScreen}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Dispatcher Home" component={DispatcherHomeScreen} />
      </Stack.Navigator>
    );
  }

  export default DispatcherStack;