import React, { useState, createContext } from "react";

const MailListContext = createContext({});

const MailListProvider = ({ children }) => {
  const [mailList, setMailList] = useState(null);
  return (
    <MailListContext.Provider value={{ mailList, setMailList }}>
      {children}
    </MailListContext.Provider>
  );
};

export default MailListProvider;
export { MailListContext };
