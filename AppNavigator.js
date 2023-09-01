// AppNavigator.js
import React, { useState, createContext, useContext, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screens/LoginScreen";
import LoadingScreen from "./screens/LoadingScreen";

import PostmanHomeScreen from "./screens/postman/HomeScreen";
import DispatcherHomeScreen from "./screens/dispatcher/HomeScreen";
import PostmanBottomBar from "./screens/postman/BottomBar";
import AddAddressScreen from "./screens/postman/AddAddressScreen";
import MailListViewScreen from "./screens/postman/MailListViewScreen";
import SettingsView from "./screens/postman/SettingsView";
import MapScreen from "./screens/postman/MapScreen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "./assets/theme/theme";

const Stack = createBottomTabNavigator();

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
        component={MailListViewScreen}
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
    </Stack.Navigator>
  );
}

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
    return (
      // <View>
      //   <ActivityIndicator size="large" />
      //   <Text>{JSON.stringify(user)}</Text>
      // </View>
      <LoadingScreen />
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
