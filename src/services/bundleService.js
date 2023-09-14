
import bnundleData from "../data/bnundleData";

const getBundleData = async () => {
    const data = await bnundleData.getBundleData();
    return data;
}

export default {
   getBundleData,
};