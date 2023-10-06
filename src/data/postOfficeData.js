import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const getDetailsofPostofficeByID = async (poID) => {
  const docRef = doc(db, "Postoffice", poID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  console.log("No mail item document!");
  return null;
};

export default {
  getDetailsofPostofficeByID,
};
