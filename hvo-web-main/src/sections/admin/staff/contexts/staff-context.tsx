import { StaffSummaryDTO } from "hvo-shared";
import { createContext, useContext, useState, useMemo } from "react";

interface StaffContextType {
  search: string;
  setSearch: (term: string) => void;
  languageId: number | undefined;
  setLanguageId: (id: number | undefined) => void;
  phase: string | undefined;
  setPhase: (phase: string | undefined) => void;
  selectedStaff: StaffSummaryDTO | undefined;
  setSelectedStaff: (staff: StaffSummaryDTO | undefined) => void;
}

const StaffContext = createContext<StaffContextType>({} as StaffContextType);

export function StaffContextProvider({ children }) {
  const [search, setSearch] = useState("");
  const [languageId, setLanguageId] = useState<number | undefined>(undefined);
  const [phase, setPhase] = useState<string | undefined>(undefined);
  const [selectedStaff, setSelectedStaff] = useState<
    StaffSummaryDTO | undefined
  >(undefined);

  const value = useMemo(
    () => ({
      search,
      setSearch,
      languageId,
      setLanguageId,
      phase,
      setPhase,
      selectedStaff,
      setSelectedStaff,
    }),
    [search, languageId, phase, selectedStaff]
  );

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
}

export const useStaffContext = () => useContext(StaffContext);
