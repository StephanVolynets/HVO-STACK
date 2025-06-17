import { paths } from "@/routes/paths";
import { useGetStaffTask, useGetStaffVideos } from "@/use-queries/staff";
import { StaffVideoDTO } from "hvo-shared";
import { StaffTaskDTO } from "hvo-shared";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

export interface ChosenLanguage {
  id: number;
  name: string;
  code: string;
}

interface StaffContextType {
  videos: StaffVideoDTO[];
  isVideosLoading: boolean;
  selectedVideo: StaffVideoDTO | undefined;
  selectedTaskSummary: any; // this is the one from the StaffVideoDTO
  isTaskLoading: boolean;
  selectedTask: StaffTaskDTO | undefined;
  videoId: number | undefined;
  taskId: number | undefined;
  handleVideoSelection: (videoId: number, taskId: number) => void;
  // isLoading: boolean;
  // hasSelection: boolean;
  // Control states
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isMultiSelectActive: boolean;
  toggleMultiSelect: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  creatorId: number | undefined;
  setCreatorId: (creatorId: number) => void;
  bulkMethod: "none" | "upload" | "download";
  setBulkMethod: (bulkMethod: "none" | "upload" | "download") => void;
  checkedVideos: number[];
  setCheckedVideos: (checkedVideos: number[]) => void;
  bulkState: "none" | "download-sent" | "upload-sent";
  setBulkState: (bulkState: "none" | "download-sent" | "upload-sent") => void;
  bulkActionsStep: number;
  setBulkActionsStep: (bulkActionsStep: number) => void;
  chosenLanguage: ChosenLanguage | null;
  setChosenLanguage: (chosenLanguage: ChosenLanguage | null) => void;
  refetchVideos: () => void;
}

const StaffContext = createContext<StaffContextType>({} as StaffContextType);

export function StaffContextProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const videoId = searchParams.get("videoId");
  const taskId = searchParams.get("taskId");

  const [selectedVideo, setSelectedVideo] = useState<StaffVideoDTO | undefined>(
    undefined
  );
  const [selectedTaskSummary, setSelectedTaskSummary] = useState<
    any | undefined
  >(undefined);

  // Control states
  const [searchTerm, setSearchTerm] = useState("");
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all_videos");
  const [creatorId, setCreatorId] = useState<number>();

  const [checkedVideos, setCheckedVideos] = useState<number[]>([]);
  const [bulkMethod, setBulkMethod] = useState<"none" | "upload" | "download">(
    "none"
  );
  const [bulkState, setBulkState] = useState<
    "none" | "download-sent" | "upload-sent"
  >("none");
  const [bulkActionsStep, setBulkActionsStep] = useState(0);
  const [chosenLanguage, setChosenLanguage] = useState<ChosenLanguage | null>(
    null
  );
  console.log("inputValue", creatorId);

  const initialTaskIdRef = useRef(taskId);

  const {
    videos: _videos,
    isLoading: isVideosLoading,
    refetch: refetchVideos,
  } = useGetStaffVideos({
    limit: 10,
    taskId: initialTaskIdRef.current ? +initialTaskIdRef.current : undefined,
    filter: isMultiSelectActive ? "completed" : activeFilter, //ready_for_work
    searchTerm: searchTerm,
    creatorId: isMultiSelectActive ? creatorId : undefined,
  });
  const { task, isLoading: isTaskLoading } = useGetStaffTask(
    taskId ? +taskId : undefined
  );

  const videos = useMemo(() => {
    return _videos?.pages.map((page) => page).flat() || [];
  }, [_videos]);

  // Handle automatic selection of first video when none is selected
  useEffect(() => {
    if (!isVideosLoading && videos.length > 0) {
      if (!videoId || !taskId) {
        const firstVideo = videos[0];
        const firstTask = firstVideo.tasks[0];
        if (firstVideo && firstTask) {
          setSelectedVideo(firstVideo);
          setSelectedTaskSummary(firstTask);
          console.log("->>>> ]2]" + firstVideo, firstTask);
          router.push(
            paths.dashboard.staff.tasksNew(firstVideo.id, firstTask.taskId)
          );
        }
      } else {
        const _selectedVideo = videos.find((video) => video.id === +videoId);
        setSelectedVideo(_selectedVideo);
        const _selectedTask = taskId
          ? videos.find((video) => video.id === +taskId)
          : _selectedVideo?.tasks[0];
        setSelectedTaskSummary(_selectedTask);
      }
    }
  }, [isVideosLoading, videos, videoId, taskId, router]);

  // Handle video selection
  const handleVideoSelection = (newVideoId, newTaskId) => {
    const selectedVideo = videos.find((video) => video.id === newVideoId);
    const selectedTaskSummary = selectedVideo?.tasks.find(
      (task) => task.taskId === newTaskId
    );

    setSelectedVideo(selectedVideo);
    setSelectedTaskSummary(selectedTaskSummary);

    router.push(paths.dashboard.staff.tasksNew(newVideoId, newTaskId));
  };

  // Toggle method for multi-select
  const toggleMultiSelect = () => {
    if (isMultiSelectActive) {
      setBulkActionsStep(0);
      setBulkMethod("none");
      setBulkState("none");
      setCheckedVideos([]);
    }
    setIsMultiSelectActive((prev) => !prev);
  };

  const value: StaffContextType = {
    videos,
    isVideosLoading,
    selectedVideo,
    isTaskLoading,
    selectedTaskSummary,
    selectedTask: task,
    videoId: videoId ? +videoId : undefined,
    taskId: taskId ? +taskId : undefined,
    handleVideoSelection,
    // isLoading: isVideosLoading || isTaskLoading,
    // hasSelection: !!videoId && !!taskId
    // Control states
    searchTerm,
    setSearchTerm,
    isMultiSelectActive,
    toggleMultiSelect,
    activeFilter,
    setActiveFilter,
    creatorId,
    setCreatorId,
    bulkMethod,
    setBulkMethod,
    checkedVideos,
    setCheckedVideos,
    bulkState,
    setBulkState,
    bulkActionsStep,
    setBulkActionsStep,
    chosenLanguage,
    setChosenLanguage,
    refetchVideos,
  };

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
}

export const useStaffContext = () => useContext(StaffContext);
