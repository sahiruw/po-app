import React from "react";

import PostmanHomeScreen from "../screens/postman/HomeScreen";
import PostmanBottomBar from "../screens/postman/BottomBar";
import AddAddressScreen from "../screens/postman/AddAddressScreen";
import MailListTabs from "../screens/postman/MailListTabs";
import SettingsView from "../screens/postman/SettingsView";
import MapScreen from "../screens/postman/MapScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../assets/theme/theme";


const Stack = createBottomTabNavigator();

function PostmanStack() {
    var {theme} = useTheme();
  
    return (
      <Stack.Navigator
        defaultScreenOptions={PostmanHomeScreen}
        screenOptions={{
          // headerShown: false,
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: theme.primaryColor,
            elevation: 0,
            shadowOpacity: 0,
          }
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <PostmanBottomBar
            navData={{ navigation, state, descriptors, insets }}
          />
        )}
      >
        <Stack.Screen
          name="Postman Home"
          component={PostmanHomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => {
              return <Icon name="home" size={size} color={color} />;
            },
          }}
        />
  
        <Stack.Screen
          name="Add Address"
          component={AddAddressScreen}
          options={{
            tabBarLabel: "Add Address",
            tabBarIcon: ({ color, size }) => {
              return <Icon name="plus" size={size} color={color} />;
            },
          }}
        />
  
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarLabel: "Map",
            tabBarIcon: ({ color, size }) => {
              return <Icon name="map" size={size} color={color} />;
            },
          }}
        />
  
        <Stack.Screen
          name="Mail List"
          component={MailListTabs}
          options={{
            tabBarLabel: "Mail List",
            tabBarIcon: ({ color, size }) => {
              return <Icon name="email" size={size} color={color} />;
            },
          }}
        />
  
        <Stack.Screen
          name="Settings"
          component={SettingsView}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => {
              return <Icon name="cog" size={size} color={color} />;
            },
          }}
        />
  
  
      </Stack.Navigator>
      
    );
  }

  export default PostmanStack;