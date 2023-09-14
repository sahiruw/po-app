import { store } from "../config/firebase";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const uploadImage = async (path, buffer) => {

  var storageRef = ref(store,path);
  const metadata = {
    contentType: 'image/jpeg'
  };

  const uploadTask = uploadBytesResumable(storageRef, buffer, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => { 
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
       },
    (error) => {
      console.log(error);
      return null
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        return downloadURL;
      });
    }
  );
};

export default {
  uploadImage,
};
