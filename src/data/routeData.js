import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

import mailItemData from "./mailItemData";
import addressData from "./addressData";

const getRoute = async (dateKey, uid) => {
  let routeRaw = await AsyncStorage.getItem("route");
  let routeStored = JSON.parse(routeRaw);

  if (routeStored?.dateKey === dateKey) {
    console.log("route from  async");
    return routeStored;
  } else {
    console.log("reading route from firebase");
    let mailsForToday = [];

    const docRef = doc(db, "Route", dateKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      routeIDS = docSnap.data();
      if (routeIDS) {
        for (let mail of routeIDS.mails) {
          let maildata = await mailItemData.getDetailsofMailItem(mail);
          let recipientAddress = await addressData.getDetailsofAddress(
            maildata.receiver_address_id
          );
          maildata.receiver_address = recipientAddress;
          if (maildata) {
            mailsForToday.push(maildata);
          }
        }

      }

      let route = { dateKey, uid, mailItemData: mailsForToday };
      // console.log("route from firebase", route);
      saveRoute(route);
      return route;
    }
    console.log("No route document!");
    return { dateKey, uid, mailItemData: mailsForToday };
  }
};

const saveRoute = async (route) => {
  await AsyncStorage.setItem("route", JSON.stringify(route));
};

export default {
  getRoute,
};
