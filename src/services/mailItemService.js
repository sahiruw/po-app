import mailItemData from "../data/mailItemData";

const getDetailsofMailItemByID = async (mailItemId) => {
  let mailData = await mailItemData.getDetailsofMailItemByID(mailItemId);
  return mailData;
};

const getDetailsofMailItemByBarcodeID = async (barcodeID) => {
  let mailData = await mailItemData.getDetailsofMailItemByID(mailItemId);
  return mailData;
};

export default {
   getDetailsofMailItemByID,
    getDetailsofMailItemByBarcodeID
};
