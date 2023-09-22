import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const getDetailsofMailItemByID = async (mailItemId) => {
  const docRef = doc(db, "MailServiceItem", mailItemId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  console.log("No mail item document!");
  return null;
};


export default {
  getDetailsofMailItemByID,
};
