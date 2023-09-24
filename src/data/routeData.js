import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

import mailItemData from "./mailItemData";
import addressData from "./addressData";
import { AppConstants } from "../assets/constants";

const getRoute = async (dateKey, uid) => {
  let routeRaw = await AsyncStorage.getItem("route");
  let routeStored = JSON.parse(routeRaw);

  if (routeStored?.dateKey === dateKey) {
    console.log("route from  async");
    // console.log(routeStored);

    return routeStored;
  } else {
    console.log("reading route from firebase");
    let mailsForToday = [];

    const docRef = doc(db, "Route", dateKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let docSnapData = docSnap.data();
      let assignedMails = docSnapData[uid];

      if (assignedMails) {
        await mailItemData.updateStatusOfMailItems(
          assignedMails,
          AppConstants.MailItemStatus.OutforDelivery,
          AppConstants.MailItemStatus.TobeDelivered
        );

        for (let mail of assignedMails) {
          // console.log("mail", mail);
          let maildata = await mailItemData.getDetailsofMailItemByID(mail);
          let recipientAddress = await addressData.getDetailsofAddress(
            maildata.receiver_address_id
          );
          // console.log("recipientAddress", maildata.receiver_address, recipientAddress);
          maildata.receiver_address = recipientAddress;
          maildata["id"] = mail;
          // console.log("maildata", maildata);
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
    console.log("Route imported");
  }
};

const saveRoute = async (route) => {
  await AsyncStorage.setItem("route", JSON.stringify(route));
};

const removeRoute = async () => {
  await AsyncStorage.removeItem("route");
};

const updateMailListofroute = async (mailList) => {
  let routeRaw = await AsyncStorage.getItem("route");
  let routeStored = JSON.parse(routeRaw);

  if (routeStored) {
    routeStored.mailItemData = mailList;
    await AsyncStorage.setItem("route", JSON.stringify(routeStored));
  }
};

export default {
  getRoute,
  saveRoute,
  removeRoute,
  updateMailListofroute,
};
