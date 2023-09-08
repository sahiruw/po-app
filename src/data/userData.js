import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

async function getUserData(uid) {
  let user = await AsyncStorage.getItem("user");

  if (user) {
    return JSON.parse(user);
  } else {
    if (uid != null) {
      const docRef = doc(db, "employees", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        user = { uid, ...docSnap.data() }
        saveUserdata(user)
        return user;
      }
    }
    // docSnap.data() will be undefined in this case
    console.log("No sch document!");
    return null;
  }
}

async function saveUserdata(user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
}

async function removeUserData() {
  await AsyncStorage.removeItem("user");
}

export default {
  getUserData,
};
