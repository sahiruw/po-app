// AppNavigator.js
import React, { useState, createContext, useContext, useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

import LoginScreen from "./screens/LoginScreen";

import PostmanHomeScreen from "./screens/postman/HomeScreen";
import DispatcherHomeScreen from "./screens/dispatcher/HomeScreen";

const Stack = createNativeStackNavigator();
const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function PostmanStack() {
  return (
    <Stack.Navigator defaultScreenOptions={PostmanHomeScreen}>
      <Stack.Screen name="Postman Home" component={PostmanHomeScreen} />
    </Stack.Navigator>
  );
}

function DispatcherStack() {
  return (
    <Stack.Navigator defaultScreenOptions={DispatcherHomeScreen}>
      <Stack.Screen name="Dispatcher Home" component={DispatcherHomeScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator defaultScreenOptions={LoginScreen}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isLoggerIn, setIsLoggerIn] = useState(false);

  const _retrieveData = () => {
    try {
      AsyncStorage.getItem("keepLoggedIn").then((value) => {
        if (value == "true") {
          setIsLoggerIn(true);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      // authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      if (authenticatedUser) {
        setUser(authenticatedUser);

        const docRef = doc(db, "employees", authenticatedUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          //set user with data merge with previous data
          setUser({ ...authenticatedUser, ...docSnap.data() });
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>{JSON.stringify(user)}</Text>
      </View>
    );
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
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen
    //       options={{ headerShown: false }}
    //       name="Login"
    //       component={LoginScreen}
    //     />
    //     <Stack.Screen name="Home" component={PostmanHomeScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default AppNavigator;
