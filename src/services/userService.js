
import userData from "../data/userData";

const getUserData = async (uid) => {
    let user = await userData.getUserData(uid);
    return user;
}

const removeUserData = async () => {
    await userData.removeUserData();
}

export default {
    getUserData,
    removeUserData,
};