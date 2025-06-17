"use client";
import React from "react";

interface NavContextState {
  isNavVisible: boolean;
  setIsNavVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavContext = React.createContext<NavContextState>(null!);

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNavVisible, setIsNavVisible] = React.useState(false);

  return (
    <NavContext.Provider value={{ isNavVisible, setIsNavVisible }}>
      {children}
    </NavContext.Provider>
  );
};
