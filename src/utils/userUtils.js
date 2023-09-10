const formatName = (user) => {
  let fullName = "";
  if (user) {
    fullName = user.first_name;

    // Check if mid_name is present and add it to the full name
    if (user.mid_name) {
      fullName += ` ${user.mid_name}`;
    }

    // Add last_name to the full name
    fullName += ` ${user.last_name}`;
  }

  return fullName;
};

export default {
  formatName,
};
