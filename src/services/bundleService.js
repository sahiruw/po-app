
import bnundleData from "../data/bnundleData";

const getBundleData = async () => {
    const data = await bnundleData.getBundleData();
    // console.log(data);
    return data;
}

export default {
   getBundleData,
};