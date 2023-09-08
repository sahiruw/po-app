import mailItemData from "../data/mailItemData";

const getDetailsofMailItem = async (mailItemId) => {
  let mailData = await mailItemData.getDetailsofMailItem(mailItemId);
  return mailData;
};

export default {
  getDetailsofMailItem,
};
