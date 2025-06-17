import { createContext, useContext, useState, ReactNode } from "react";
import { VideoStatus } from "hvo-shared";

interface LibraryContextType {
  isDownloadResourcesEnabled: boolean;
  setIsDownloadResourcesEnabled: (enabled: boolean) => void;
  selectedVideos: number[];
  handleVideoSelect: (videoId: number, status: VideoStatus) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [isDownloadResourcesEnabled, setIsDownloadResourcesEnabled] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

  const handleVideoSelect = (videoId: number, status: VideoStatus) => {
    if (status !== VideoStatus.COMPLETED) {
      return;
    }

    setSelectedVideos((prev) => {
      if (prev.includes(videoId)) {
        return prev.filter((id) => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };

  const handleSetDownloadResourcesEnabled = (enabled: boolean) => {
    setIsDownloadResourcesEnabled(enabled);
    if (!enabled) {
      setSelectedVideos([]);
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        isDownloadResourcesEnabled,
        setIsDownloadResourcesEnabled: handleSetDownloadResourcesEnabled,
        selectedVideos,
        handleVideoSelect,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibraryContext() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibraryContext must be used within a LibraryProvider");
  }
  return context;
}
