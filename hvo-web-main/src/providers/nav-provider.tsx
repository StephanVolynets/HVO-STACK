import { NavContext } from "@/contexts/nav-context";
import { useState } from "react";

interface NavProviderProps {
  children: React.ReactNode;
}

export const NavProvider: React.FC<NavProviderProps> = ({ children }) => {
  const [isNavVisible, setIsNavVisible] = useState(true);

  return (
    <NavContext.Provider value={{ isNavVisible, setIsNavVisible }}>
      {children}
    </NavContext.Provider>
  );
};
