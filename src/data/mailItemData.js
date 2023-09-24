import { AppConstants } from "../assets/constants";
import { auth, db } from "../config/firebase";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import storeFirebaseData from "./storeFirebaseData";
import imageUtils from "../utils/imageUtils";

const getDetailsofMailItemByID = async (mailItemId) => {
  const docRef = doc(db, "MailServiceItem", mailItemId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  console.log("No mail item document!");
  return null;
};

const markMailItemAsDelivered = async (mailItemData, data) => {
  const batch = writeBatch(db);

  const deliveryAttemptRef = doc(collection(db, "DeliveryAttempt"));
  batch.set(deliveryAttemptRef, data);

  let prevAttempts = mailItemData.delivery_attempts;
  prevAttempts.push(deliveryAttemptRef.id);
  batch.update(doc(db, "MailServiceItem", mailItemData.id), {
    status: AppConstants.MailItemStatus.Delivered,
    delivery_attempts: prevAttempts,
  });

  batch.commit()
  console.log("markMailItemAsDelivered", mailItemData.id);
  return true
}

const markMailItemAsNotDelivered = async (mailItemData, data) => {
  console.log("markMailItemAsNotDelivered", mailItemData.id, data);
  const batch = writeBatch(db);

  // check no of attempts
  let prevAttempts = mailItemData.delivery_attempts;

  if (prevAttempts.length >= 3) {
    return false;
  }
  
  // add record to delivery Attempt
  const deliveryAttemptRef = doc(collection(db, "DeliveryAttempt"));
  batch.set(deliveryAttemptRef, data);

  // update mail item status
  prevAttempts.push(deliveryAttemptRef.id);
  let sts = AppConstants.MailItemStatus.TobeDelivered;
  
  if (prevAttempts.length >= 3) {
    if (mailItemData.type == AppConstants.MailItemStatus.Normal) {
      sts = AppConstants.MailItemStatus.DeliveryCancelled;
    } else {
      sts = AppConstants.MailItemStatus.TobeReturned;
    }

  }

  batch.update(doc(db, "MailServiceItem", mailItemData.id), {
    status: sts,
    delivery_attempts: prevAttempts,
  });

  await batch.commit()
  return true

}


export default {
  getDetailsofMailItemByID,
  markMailItemAsNotDelivered,
  markMailItemAsDelivered,
};
