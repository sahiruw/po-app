import userService from "./userService";
import routeData from "../data/routeData";
import mailItemService from "./mailItemService";
import dateUtils from "../utils/dateUtils";

const getRouteDataForToday = async () => {

  let dateKey = dateUtils.getToday();

  const user = await userService.getUserData();

  let routes = await routeData.getRoute(dateKey, user.uid);
  // console.log(routes)
  // setMailList(routes.mailItemData);

  return routes;
};

const removeRoute = async () => {
  await routeData.removeRoute();
};

export default {
  getRouteForToday: getRouteDataForToday,
  removeRoute,
};
