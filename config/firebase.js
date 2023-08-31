import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import Constants from "expo-constants";
import { Firestore } from "firebase/firestore";

// const firebaseConfig = {
//   apikey: Constants.expoConfig.extra.apikey,
//   authDomain: Constants.expoConfig.extra.authDomain,
//   projectId: Constants.expoConfig.extra.projectId,
//   storageBucket: Constants.expoConfig.extra.storageBucket,
//   messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
//   appId: Constants.expoConfig.extra.appId,
//   measurementId: Constants.expoConfig.extra.measurementId
// };

const firebaseConfig = {
  apiKey: "AIzaSyAuYYZazxHt-Kl5vWNfLnfffVrYGDBdgeo",
  authDomain: "pomis-g6.firebaseapp.com",
  projectId: "pomis-g6",
  storageBucket: "pomis-g6.appspot.com",
  messagingSenderId: "64553418375",
  appId: "1:64553418375:web:020ebb3213899307264222",
  measurementId: "G-TQDD31GN0F"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { auth, db}