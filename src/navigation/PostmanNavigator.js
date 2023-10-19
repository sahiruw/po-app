// navigation/RootStack.js
import React, { useContext, useEffect } from "react";
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

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as TaskManager from "expo-task-manager";

import { rtdatabase } from "../config/firebase";
import { ref, set } from "firebase/database";
import { AuthContext } from "../contextStore/AuthProvider";
import { AppConstants } from "../assets/constants";
import userService from "../services/userService";

const Stack = createNativeStackNavigator();
const StackBottom = createBottomTabNavigator();

const LOCATION_TASK_NAME = "background-location-task";

const saveLocationToFirebase = async (lat, long) => {
  let user = await userService.getActiveUserData();
  const userId = user?.uid;

  try {
    const locationRef = ref(rtdatabase, `userLocation/${userId}`);
    await set(locationRef, {
      lat,
      long,
    });
    console.log("Location saved to Firebase for user ID:", userId, lat, long);
  } catch (error) {
    console.error("Error saving location to Firebase:", error);
  }
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  // if (data && user?.role == AppConstants.EmployeeRoles.Postman) {
  //   const { locations } = data;
  //   const lat = locations[0].coords.latitude;
  //   const long = locations[0].coords.longitude;
  //   saveLocationToFirebase(lat, long);
  // }
  const { locations } = data;
  const lat = locations[0].coords.latitude;
  const long = locations[0].coords.longitude;
  saveLocationToFirebase(lat, long);
});

const RootStack = () => {
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status: statusB } = await Location.requestBackgroundPermissionsAsync();
      const { status: statusF } = await Location.requestForegroundPermissionsAsync();

      if (statusB === "granted" && statusF === "granted") {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          enableHighAccuracy: true,
          distanceInterval: 1,
          timeInterval: 5000,
        });
      } else {
        console.error("Location services needed");
      }
    };

    if (user?.role == AppConstants.EmployeeRoles.Postman) {
      getLocationPermission();
    }
  }, []);

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
