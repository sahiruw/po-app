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

    let bundles = []
  // Fetch the documents that match the query
  await getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        bundles.push({id: doc.id, ...doc.data()})
      });
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
    });
    return bundles;
};


export default {
  getBundleData,
};
