// AppNavigator.js
import React, { useState, createContext, useContext, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

import LoadingScreen from "../screens/LoadingScreen";

import PostmanStack from "./PostmanNavigator";
import DispatcherStack from "./Dispatchernavigation";
import AuthStack from "./LoginNavigator";

import userService from "../services/userService";
import AuthProvider, { AuthContext } from "../contextStore/AuthProvider";
import { AlertNotificationRoot } from "react-native-alert-notification";


import { AppConstants } from "../assets/constants";




function RootNavigator() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setLoading(true);

      if (authenticatedUser) {
        console.log("User is authenticated");
        const uid = authenticatedUser.uid;
        let userData = await userService.getUserData(
          uid,
          authenticatedUser.email
        );

        // console.log("User Data", userData);
        setUser(userData);
      } else {
        console.log("User is not authenticated");
        setUser(null);
        setLoading(false);

        return <AuthStack />;
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  





  if (loading) {
    return <LoadingScreen />;
  }
  let userRole = user?.role;
  userID = user?.uid;
  // console.log(user)
  return (
    <NavigationContainer>
      {userRole === AppConstants.EmployeeRoles.Postman ? (
        <PostmanStack />
      ) : userRole === AppConstants.EmployeeRoles.Dispatcher ? (
        <DispatcherStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const AppNavigator = () => {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </AlertNotificationRoot>
  );
};

export default AppNavigator;
