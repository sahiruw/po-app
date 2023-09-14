
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
    const {user, setUser} = useContext(AuthContext);
    setUser(null);
    await userData.removeUserData();
}

const saveUserProfilePicture = async (uri) => {
    let url = await userData.saveUserProfilePicture(uri);
    return url;
}


const updateUserData = async (user) => {
    await userData.saveUserdata(user, true);
}

export default {
    getUserData,
    removeUserData,
    getActiveUserData,
    saveUserProfilePicture,
    updateUserData,
};