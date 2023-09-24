import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import imaeUtils from "../utils/imageUtils";
import storeFirebaseData from "../data/storeFirebaseData";

async function getUserData(uid, email) {
  let user = await AsyncStorage.getItem("user");


  if (user) {
    return JSON.parse(user);
  } else {
    
    if (uid != null) {
      
      const docRef = doc(db, "employees", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        user = { uid, email, ...docSnap.data() };
        saveUserdata(user);
        return user;
      }
    }
    
    // docSnap.data() will be undefined in this case
    console.log("No sch document!");
    return null;
  }
}

async function saveUserdata(user, saveToDatabse = false) {

  await AsyncStorage.setItem("user", JSON.stringify(user));
  if (saveToDatabse) {
    const docRef = doc(db, "employees", user.uid);
    await setDoc(docRef, user);
  }
}

async function removeUserData() {
  await AsyncStorage.removeItem("user");
}

async function getActiveUserData() {
  let user = await AsyncStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  } else {
    return null;
  }
}

async function saveUserProfilePicture(uri) {
  let buffer = await imaeUtils.uriToBuffer(uri);
  let user = await getActiveUserData();
  let path = "/employeeProfilePictures/" + user.uid + ".jpg";
  
  let downloadUrl = await storeFirebaseData.uploadImage(path, buffer);
  return downloadUrl;
}

export default {
  getUserData,
  removeUserData,
  getActiveUserData,
  saveUserProfilePicture,
  saveUserdata,
};
