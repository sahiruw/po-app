
import { useContext } from "react";
import userData from "../data/userData";
import {AuthContext} from "../contextStore/AuthProvider";

const getUserData = async (uid, email) => {
    let user = await userData.getUserData(uid, email);
    return user;
}

const getActiveUserData = async () => {
    let user = await userData.getActiveUserData();
    return user;
}

const removeUserData = async () => {

    await userData.removeUserData();
}

const saveUserProfilePicture = async (uri) => {
    let url = await userData.saveUserProfilePicture(uri);
    return url;
}


const updateUserData = async (user, isProfilePictureChanged) => {
    if (isProfilePictureChanged) {
        let url = await userData.saveUserProfilePicture(user.profile_picture);
        user.profile_picture = url;
    }
    
    await userData.saveUserdata(user, true);
}

export default {
    getUserData,
    removeUserData,
    getActiveUserData,
    saveUserProfilePicture,
    updateUserData,
};