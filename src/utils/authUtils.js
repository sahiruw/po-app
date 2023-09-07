import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
//async function

export async function getUserData  (uid) {
let user = await AsyncStorage.getItem("user");

  if (user) {
    return JSON.parse(user);
  } else {
    const docRef = doc(db, "employees", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return { uid, ...docSnap.data() };
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No sch document!");
      return null;
    }
  }
};

