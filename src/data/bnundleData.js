import { auth, db } from "../config/firebase";
import { doc, getDoc , query, collection, where, getDocs} from "firebase/firestore";
import userData from "./userData";
import dateUtils from "../utils/dateUtils";

const getBundleData = async () => {
  let date = dateUtils.getToday();

  const q = query(
    collection(db, "Bundle"),
    where("date", "==", date)
  );

  // Fetch the documents that match the query
  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("Document data:", doc.data());
        return doc.data();
      });
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
      return null;
    });
};

export default {
  getBundleData,
};
