import userService from "./userService";
import routeData from "../data/routeData";
import mailItemService from "./mailItemService";
import dateUtils from "../utils/dateUtils";

const getRouteDataForToday = async () => {

  let dateKey = dateUtils.getToday();

  const user = await userService.getUserData();
  // console.log(user)
  let routes = await routeData.getRoute(dateKey, user.uid);

  return routes;
};

const removeRoute = async () => {
  await routeData.removeRoute();
};

const updateMailListofroute = async (mailList) => {
  await routeData.updateMailListofroute(mailList);
}

export default {
  getRouteForToday: getRouteDataForToday,
  removeRoute,
  updateMailListofroute
};
