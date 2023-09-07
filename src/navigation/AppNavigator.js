// AppNavigator.js
import React, { useState, createContext, useContext, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoadingScreen from "../screens/LoadingScreen";

import PostmanStack from "./PostmanNavigator";
import DispatcherStack from "./Dispatchernavigation";
import AuthStack from "./LoginNavigator";

import {getUserData} from "../utils/authUtils";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function RootNavigator() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setLoading(true);

      if (authenticatedUser) {
        console.log("User is authenticated");
        const uid = authenticatedUser.uid;
        let userData = await getUserData(uid);
        console.log("User Data", userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        
        console.log("User is not authenticated");
        setUser(null);
        setIsLoggedIn(false);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    //get user from async
    setLoading(true);
    const getUser = async () => {
      let user = await AsyncStorage.getItem("user");
      console.log("User from async", user);
      if (user !== null) {
        setUser(JSON.parse(user));
      }
    };
    getUser();
    setLoading(false);
  }, []);


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
