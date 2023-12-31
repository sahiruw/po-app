import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import {
  getStorage,

} from "firebase/storage";
// import Constants from "expo-constants";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

let firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId,
  measurementId: Constants.expoConfig.extra.measurementId,
};

console.log(JSON.stringify(firebaseConfig));

// Initialize Firebase
if (!getApps().length) {
  
  console.log("Initializing Firebase");
  const app = initializeApp(firebaseConfig);
  console.log("Initializing Auth");
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  console.log("Initializing Firestore");
  initializeFirestore(app, {
    persistence: persistentLocalCache,
  });
  console.log("Firebase Initialized");
}

const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const store = getStorage(app);
const rtdatabase = getDatabase(app);

export { auth, db, store, rtdatabase };
