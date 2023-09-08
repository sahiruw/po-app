import userService from "./userService";
import routeData from "../data/routeData";
import mailItemService from "./mailItemService";

const getRouteDataForToday = async () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2-digit month
  const year = currentDate.getFullYear().toString(); // Full year

  const dateKey = `${day}${month}${year}`;

  const user = await userService.getUserData();

  let routes = await routeData.getRoute(dateKey, user.uid);

  return routes;
};

export default {
  getRouteForToday: getRouteDataForToday,
};
