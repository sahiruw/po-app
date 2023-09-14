const getToday = () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2-digit month
  const year = currentDate.getFullYear().toString(); // Full year

  const dateKey = `${day}${month}${year}`;
  return dateKey;
};

export default {
  getToday,
};
