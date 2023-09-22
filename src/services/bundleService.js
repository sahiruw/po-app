import bnundleData from "../data/bnundleData";

const getBundleData = async () => {
  const data = await bnundleData.getBundleData();
  return data;
};

const getBundleDataByID = async (bundleID) => {
  const data = await bnundleData.getBundleDataByID(bundleID);
  return data;
};

const updateBundleStatus = async (selectedBundleId, bundleData) => {
  await bnundleData.updateBundleStatus(selectedBundleId, bundleData);
};

const acceptBundle = async ( bundleData) => {
    // await bnundleData.acceptBundle(bundleID, bundleData);
    console.log( bundleData);
    await bnundleData.acceptBundle(bundleData);
};

export default {
  getBundleData,
  updateBundleStatus,
  getBundleDataByID,
  acceptBundle,
};
