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
import AuthProvider, {AuthContext} from "../contextStore/AuthProvider";


function RootNavigator() {

  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setLoading(true);

      if (authenticatedUser) {
        console.log("User is authenticated");
        const uid = authenticatedUser.uid;
        let userData = await userService.getUserData(uid, authenticatedUser.email);
        // console.log("User Data", userData);
        setUser(userData);
      } else {
        
        console.log("User is not authenticated");
        setUser(null);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   //get user from async
  //   setLoading(true);
  //   const getUser = async () => {
  //     let user = await userService.getUserData();
  //     // console.log("User from async", user);
  //     if (user !== null) {
  //       setUser(user);
  //     }
  //   };
  //   getUser();
  //   setLoading(false);
  // }, []);


  if (loading) {
    return <LoadingScreen />;
  }
  let userRole = user?.role;
  return (
    <NavigationContainer>
      {userRole === "postman" ? (
        <PostmanStack />
      ) : userRole === "dispatcher" ? (
        <DispatcherStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const AppNavigator = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default AppNavigator;

