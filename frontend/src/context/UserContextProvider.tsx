import React, { createContext, useState, ReactNode } from "react";

interface UserContextProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; 
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>; 
}

export const UserContext = createContext<UserContextProps | null>(null);

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
