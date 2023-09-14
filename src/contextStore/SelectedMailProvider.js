import React, { useState, createContext } from "react";

const SlectedMailContext = createContext({});

const SlectedMailProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <SlectedMailContext.Provider value={{ user, setUser }}>
      {children}
    </SlectedMailContext.Provider>
  );
};

export default SlectedMailProvider;
export { SlectedMailContext};
