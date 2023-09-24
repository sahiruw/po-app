import mailItemData from "../data/mailItemData";
import { AppConstants } from "../assets/constants";
import imageUtils from "../utils/imageUtils";

const getDetailsofMailItemByID = async (mailItemId) => {
  let mailData = await mailItemData.getDetailsofMailItemByID(mailItemId);
  return mailData;
};

const getDetailsofMailItemByBarcodeID = async (barcodeID) => {
  let mailData = await mailItemData.getDetailsofMailItemByID(mailItemId);
  return mailData;
};

const updateMailItemdeliveryStatus = async (mailItemDetails, attemptData) => {
  let res = false;

  if (attemptData.status === AppConstants.MailDeliveryAttemptStatus.Delivered) {
    // console.log(mailItemDetails.id, attemptData)

    res = await mailItemData.markMailItemAsDelivered(
      mailItemDetails,
      attemptData
    );
  } else {
    console.log(attemptData)
    res = await mailItemData.markMailItemAsNotDelivered(
      mailItemDetails,
      attemptData
    );
  }
  // console.log("updateMailItemdeliveryStatus", res);
  return res;
};

export default {
  getDetailsofMailItemByID,
  getDetailsofMailItemByBarcodeID,
  updateMailItemdeliveryStatus,
};
