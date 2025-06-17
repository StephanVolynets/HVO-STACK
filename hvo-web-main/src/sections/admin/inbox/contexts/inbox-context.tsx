import { InboxVideoDTO } from "hvo-shared";
import { createContext, useContext, useState, useMemo } from "react";

interface InboxContextType {
  search: string;
  setSearch: (term: string) => void;
  creatorId: number | undefined;
  setCreatorId: (id: number | undefined) => void;
  staffNotAssigned: boolean;
  setStaffNotAssigned: (val: boolean) => void;
  hasFeedback: boolean;
  setHasFeedback: (val: boolean) => void;
  activeTab: "languages" | "feedback";
  setActiveTab: (tab: "languages" | "feedback") => void;
  //
  selectedVideo: InboxVideoDTO | undefined;
  setSelectedVideo: (video: InboxVideoDTO | undefined) => void;
}

const InboxContext = createContext<InboxContextType>({} as InboxContextType);

export function InboxContextProvider({ children }) {
  const [search, setSearch] = useState("");
  const [creatorId, setCreatorId] = useState<number | undefined>(undefined);
  const [staffNotAssigned, setStaffNotAssigned] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<"languages" | "feedback">(
    "languages"
  );
  const [selectedVideo, setSelectedVideo] = useState<InboxVideoDTO | undefined>(
    undefined
  );

  const value = useMemo(
    () => ({
      search,
      setSearch,
      creatorId,
      setCreatorId,
      staffNotAssigned,
      setStaffNotAssigned,
      hasFeedback,
      setHasFeedback,
      activeTab,
      setActiveTab,
      selectedVideo,
      setSelectedVideo,
    }),
    [search, creatorId, staffNotAssigned, hasFeedback, activeTab, selectedVideo]
  );

  return (
    <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
  );
}

export const useInboxContext = () => useContext(InboxContext);
