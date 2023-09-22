import { store } from "../config/firebase";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const uploadImage = (path, buffer) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(store, path);
    const metadata = {
      contentType: 'image/jpeg'
    };

    const uploadTask = uploadBytesResumable(storageRef, buffer, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        reject(error); // Reject the promise with the error
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL); // Resolve the promise with the download URL
          })
          .catch((error) => {
            console.log(error);
            reject(error); // Reject the promise with any errors from getDownloadURL
          });
      }
    );
  });
};

export default {
  uploadImage,
};
