import { auth, db } from "../config/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

const getDetailsofAddress = async (addressId) => {
    const docRef = doc(db, "Address", addressId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return docSnap.data();
    }
    // console.log("No address document!");
    return null;
    }


const addAddress = async (address) => {
    const addressCollectionRef = collection(db, "Address");
    const docRef = await addDoc(addressCollectionRef, address);
    

    return docRef.id;
};

export default {
    getDetailsofAddress,
    addAddress,
};

