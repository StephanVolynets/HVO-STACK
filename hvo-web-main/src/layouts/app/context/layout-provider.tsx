import React, { useState, ReactNode, useEffect } from "react";
import { LayoutContext } from "./layout-context";
// import { usePathname } from "next/navigation";
import { shouldHideSidePanel } from "../config/route-layouts";

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  // const pathname = usePathname();
  const [headerTitle, setHeaderTitle] = useState<ReactNode>("");
  const [headerActions, setHeaderActions] = useState<ReactNode | null>(null);
  const [primaryAction, setPrimaryAction] = useState<ReactNode | null>(null);
  const [sideContent, setSideContent] = useState<ReactNode | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(320);
  const [plainMode, setPlainMode] = useState<boolean>(false);
  // const [hideSidePanel, setHideSidePanel] = useState<boolean>(
  //   shouldHideSidePanel(pathname)
  // );

  useEffect(() => {
    console.log("LayoutProvider rendered");
  });

  const value = {
    headerTitle,
    setHeaderTitle,
    headerActions,
    setHeaderActions,
    primaryAction,
    setPrimaryAction,
    sideContent,
    setSideContent,
    sidebarWidth,
    setSidebarWidth,
    plainMode,
    setPlainMode,
    // hideSidePanel,
    // setHideSidePanel,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}
