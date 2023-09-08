import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const getRoute = async (dateKey, uid) => {
  let route = await AsyncStorage.getItem("route");

  if (route?.dateKey === dateKey && route?.uid === uid) {
    console.log("route from  async", route);
    return JSON.parse(route);
  } else {
    //get route from firebase
    console.log(dateKey, uid);
    const docRef = doc(db, "Route", dateKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      routeIDS = docSnap.data();
      let mailItemData = [];

      if (routeIDS) {
        for (let mail of routes.mails) {
          let maildata = await mailItemService.getDetailsofMailItem(mail);
          if (maildata) {
            mailItemData.push(maildata);
          }
        }
      }
      console.log("routes", mailItemData);

      let route = { dateKey, uid, mailItemData };
      saveRoute(route);
      return route;
    }
    console.log("No route document!");
    return null;
  }
};

const saveRoute = async (route) => {
  await AsyncStorage.setItem("route", JSON.stringify(route));
};

export default {
  getRoute,
};
