import { createContext, useContext } from 'react';
import { ReactNode } from 'react';

export interface LayoutContextType {
  headerTitle: ReactNode;
  setHeaderTitle: (title: ReactNode) => void;
  headerActions: ReactNode | null;
  setHeaderActions: (actions: ReactNode | null) => void;
  primaryAction: ReactNode | null;
  setPrimaryAction: (action: ReactNode | null) => void;
  sideContent: ReactNode | null;
  setSideContent: (content: ReactNode | null) => void;
  // Settings
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  // Plain mode
  plainMode: boolean;
  setPlainMode: (plainMode: boolean) => void;
  // Settings
//   hideSidePanel: boolean;
//   setHideSidePanel: (hideSidePanel: boolean) => void;
}

// Create context with undefined default value
export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Custom hook to use the layout context
export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}