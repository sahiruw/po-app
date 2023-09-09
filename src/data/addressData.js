import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const getDetailsofAddress = async (addressId) => {
    const docRef = doc(db, "Address", addressId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return docSnap.data();
    }
    console.log("No address document!");
    return null;
    }

export default {
    getDetailsofAddress,
};

