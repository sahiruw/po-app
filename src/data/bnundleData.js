import { auth, db } from "../config/firebase";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import userData from "./userData";
import dateUtils from "../utils/dateUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getBundleData = async () => {
  let date = dateUtils.getToday();

  let storedBundleData = await AsyncStorage.getItem("bundleData");
  let bundleData = JSON.parse(storedBundleData);

  if (bundleData?.date === date && false) {
    console.log("bundleData from  async", bundleData);
    return bundleData.bundles;
  } else {
    console.log("reading bundleData from firebase");
    
    const q = query(

      collection(db, "Bundle"),
      where("date", "==", date),
      where("status", "==", "Queued")
    );

    let bundles = [];
    // Fetch the documents that match the query
    await getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          bundles.push({ id: doc.id, ...doc.data() });
        });
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
    saveBundleData({ date, bundles });
    return bundles;
  }
};

const getBundleDataByID = async (bundleID) => {
  const docRef = doc(db, "Bundle", bundleID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};


const saveBundleData = async (bundleData) => {
  await AsyncStorage.setItem("bundleData", JSON.stringify(bundleData));
};

const updateBundleStatus = async (bundleID, bundleData) => {
  await AsyncStorage.removeItem("bundleData");
  
  // batch operation to update bundle status and mail service items
  const batch = writeBatch(db);

  // update bundle status
  const bundleRef = doc(db, "Bundle", bundleID);
  batch.update(bundleRef, { status: "Dispatched" });

  // update mail service items status
  for (let mailItem of bundleData) {
    batch.update(doc(db, "MailServiceItem", mailItem.id), {
      status: "Dispatched",
    });
  }

  // Commit the batch
  await batch.commit();
}

const acceptBundle = async (bundleData) => {
  const batch = writeBatch(db);

  // update bundle status
  const bundleRef = doc(db, "Bundle", bundleData.bundleID);
  batch.update(bundleRef, { status: "Arrived" });

  // update mail service items status
  for (let mailItemID of bundleData.mail_service_items) {
    batch.update(doc(db, "MailServiceItem", mailItemID), {
      status: "To be Delivered",
    });
  }

  // Commit the batch
  await batch.commit();
};


export default {
  updateBundleStatus,
  getBundleData,
  getBundleDataByID,
  acceptBundle,
};
