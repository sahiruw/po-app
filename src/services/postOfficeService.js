import postOfficeData from "../data/postOfficeData";

const getDetailsofPostofficeByID = async (poID) => {
    const data = await postOfficeData.getDetailsofPostofficeByID(poID);
    return data
    }

export default {
    getDetailsofPostofficeByID,
};