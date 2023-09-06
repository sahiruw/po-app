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

  const setUserData = async (authenticatedUser) => {
    setLoading(true);
    if (!isLoggedIn && authenticatedUser) {
      const docRef = doc(db, "employees", authenticatedUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        //set user with data merge with previous data
        setUser({ ...authenticatedUser, ...docSnap.data() });
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No sch document!");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        await setUserData(authenticatedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const _retrieveData = () => {
      try {
        AsyncStorage.getItem("keepLoggedIn").then((value) => {
          if (value == "true") {
            setIsLoggedIn(true);
          }
        });

        AsyncStorage.getItem("user").then((value) => {
          setUserData(JSON.parse(value));
        });
      } catch (error) {
        console.log(error);
      }
    };
    _retrieveData();
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
