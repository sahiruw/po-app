
import userData from "../data/userData";

const getUserData = async (uid, email) => {
    let user = await userData.getUserData(uid, email);
    return user;
}

const removeUserData = async () => {
    await userData.removeUserData();
}

export default {
    getUserData,
    removeUserData,
};