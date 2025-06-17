import {
  Box,
  Button,
  Stack,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { useMemo, useState } from "react";
import FileItem, { findBestMatch } from "./file-item";
import Iconify from "@/components/iconify";
import SmartUploadInfo from "../../../../file-manager/components/smart-upload-info";
import NoFilesState from "../../../../file-manager/components/no-files-state";
import { StaffVideoDTO } from "hvo-shared";
import { uploadFileToStorage, uploadFileToBoxChunked } from "@/apis/storage";
import { completeTask } from "@/apis/task";

// Define the structure for storing file match details
interface FileMatchDetails {
  video: StaffVideoDTO | null;
  matchType: "exact" | "partial" | "none";
  isUserChoice: boolean;
}

// Define the structure for storing file upload status
interface FileUploadStatus {
  status: "pending" | "uploading" | "completed" | "error";
  progressPercent?: number;
  error?: string;
  fileId?: string;
}

// Define a more specific return type for the promises within uploadPromises
type UploadPromiseResult =
  | { fileName: string; status: "completed"; fileId: string; taskId: number }
  | { fileName: string; status: "skipped"; reason: string }
  | { fileName: string; status: "error"; error: string };

// Define OverallProcessPhase type
type OverallProcessPhase =
  | "idle"
  | "uploading"
  | "completingTasks"
  | "allDone"
  | "errorInUpload"
  | "errorInCompletion";

interface Props {
  handleNextStep: () => void;
}

export default function BulkUploadFileManager({ handleNextStep }: Props) {
  const { checkedVideos, videos, chosenLanguage } = useStaffContext();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileToVideoMap, setFileToVideoMap] = useState<{
    [fileName: string]: FileMatchDetails;
  }>({});
  const [fileUploadProgress, setFileUploadProgress] = useState<{
    [fileName: string]: FileUploadStatus;
  }>({});
  const [isProcessingSubmit, setIsProcessingSubmit] = useState(false);
  const [overallProcessPhase, setOverallProcessPhase] =
    useState<OverallProcessPhase>("idle");

  const selectedVideos = useMemo(() => {
    return videos.filter(
      (video) =>
        checkedVideos.includes(video.id) &&
        video.tasks.some((task) => task.languageId === chosenLanguage?.id)
    );
  }, [checkedVideos, videos, chosenLanguage?.id]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prev) => {
        const newFiles = acceptedFiles.filter(
          (f) => !prev.some((pf) => pf.name === f.name)
        );
        return [...prev, ...newFiles];
      });

      const newFileEntries = {};
      const newProgressEntries = {};
      acceptedFiles.forEach((file) => {
        if (!fileToVideoMap[file.name]) {
          // Only process if not already processed
          const { video, matchType } = findBestMatch(file.name, selectedVideos);
          newFileEntries[file.name] = {
            video,
            matchType,
            isUserChoice: matchType === "exact",
          };
          newProgressEntries[file.name] = { status: "pending" };
        }
      });

      setFileToVideoMap((prev) => ({ ...prev, ...newFileEntries }));
      setFileUploadProgress((prev) => ({ ...prev, ...newProgressEntries }));
    },
  });

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setFileToVideoMap((prev) => {
      const newMap = { ...prev };
      delete newMap[fileName];
      return newMap;
    });
    setFileUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const handleVideoSelect = (fileName: string, video: StaffVideoDTO | null) => {
    setFileToVideoMap((prev) => {
      const existingDetails = prev[fileName];
      return {
        ...prev,
        [fileName]: {
          ...(existingDetails as FileMatchDetails),
          video,
          isUserChoice: true,
        },
      };
    });
  };

  const handleSubmit = async () => {
    if (!chosenLanguage) {
      console.error("No chosen language selected.");
      return;
    }
    setIsProcessingSubmit(true);
    setOverallProcessPhase("uploading");

    // Initialize all files to pending if not already set
    const initialProgressUpdates = {};
    uploadedFiles.forEach((file) => {
      if (!fileUploadProgress[file.name]) {
        initialProgressUpdates[file.name] = { status: "pending" };
      }
    });
    setFileUploadProgress((prev) => ({ ...prev, ...initialProgressUpdates }));

    console.log("Starting file uploads...");

    const uploadPromises = uploadedFiles.map(
      async (file): Promise<UploadPromiseResult> => {
        const fileDetails = fileToVideoMap[file.name];
        if (!fileDetails || !fileDetails.video) {
          setFileUploadProgress((prev) => ({
            ...prev,
            [file.name]: { status: "error", error: "No video mapped" },
          }));
          return {
            fileName: file.name,
            status: "skipped",
            reason: "No video mapped",
          };
        }

        const targetTask = fileDetails.video.tasks.find(
          (task) => task.languageId === chosenLanguage!.id
        );

        if (
          !targetTask ||
          !targetTask.uploadedFilesFolderId ||
          typeof targetTask.taskId !== "number"
        ) {
          setFileUploadProgress((prev) => ({
            ...prev,
            [file.name]: {
              status: "error",
              error: "No target folder or valid taskId",
            },
          }));
          return {
            fileName: file.name,
            status: "skipped",
            reason: "No target folder or valid taskId",
          };
        }

        setFileUploadProgress((prev) => ({
          ...prev,
          [file.name]: { status: "uploading", progressPercent: 0 },
        }));
        console.log(
          `# Uploading: ${file.name} to Folder ID: ${targetTask.uploadedFilesFolderId}`
        );

        try {
          let uploadResponse;
          if (file.size > 25 * 1024 * 1024) {
            uploadResponse = await uploadFileToBoxChunked(
              file,
              targetTask.uploadedFilesFolderId
            );
          } else {
            uploadResponse = await uploadFileToStorage(
              file,
              targetTask.uploadedFilesFolderId
            );
          }
          setFileUploadProgress((prev) => ({
            ...prev,
            [file.name]: {
              status: "completed",
              fileId: uploadResponse.fileId,
              progressPercent: 100,
            },
          }));
          console.log(
            `SUCCESS: ${file.name} uploaded. File ID: ${uploadResponse.fileId}`
          );
          return {
            fileName: file.name,
            status: "completed",
            fileId: uploadResponse.fileId,
            taskId: targetTask.taskId,
          };
        } catch (error: any) {
          console.error(`FAILED to upload ${file.name}:`, error);
          setFileUploadProgress((prev) => ({
            ...prev,
            [file.name]: {
              status: "error",
              error: error.message || "Upload failed",
            },
          }));
          return {
            fileName: file.name,
            status: "error",
            error: error.message || "Upload failed",
          };
        }
      }
    );

    const uploadResults = await Promise.allSettled(uploadPromises);
    console.log("--- All uploads settled --- ");

    const successfulUploadsWithTaskIds: Array<{
      fileName: string;
      status: "completed";
      fileId: string;
      taskId: number;
    }> = [];
    let hasUploadErrors = false;

    uploadResults.forEach((result) => {
      if (result.status === "fulfilled") {
        if (
          result.value.status === "completed" &&
          typeof result.value.taskId === "number"
        ) {
          successfulUploadsWithTaskIds.push(
            result.value as {
              fileName: string;
              status: "completed";
              fileId: string;
              taskId: number;
            }
          );
        } else if (result.value.status === "error") {
          hasUploadErrors = true;
        }
      } else {
        hasUploadErrors = true;
        console.error(
          "Unexpected rejected promise in uploadPromises:",
          result.reason
        );
      }
    });

    if (successfulUploadsWithTaskIds.length > 0) {
      setOverallProcessPhase("completingTasks");
      console.log("Completing tasks for successful uploads...");

      const taskCompletionPromises = successfulUploadsWithTaskIds.map(
        (upload) => completeTask(upload.taskId)
      );
      const taskCompletionResults = await Promise.allSettled(
        taskCompletionPromises
      );

      let hasCompletionErrors = false;
      taskCompletionResults.forEach((result, index) => {
        if (result.status === "rejected") {
          hasCompletionErrors = true;
          console.error(
            `Failed to complete task ${successfulUploadsWithTaskIds[index].taskId}:`,
            result.reason
          );
        } else {
          console.log(
            `Task ${successfulUploadsWithTaskIds[index].taskId} completed successfully.`
          );
        }
      });

      if (hasCompletionErrors) {
        setOverallProcessPhase("errorInCompletion");
      } else {
        setOverallProcessPhase("allDone");
        handleNextStep();
      }
    } else if (hasUploadErrors) {
      setOverallProcessPhase("errorInUpload");
    } else {
      setOverallProcessPhase("allDone");
      if (
        uploadedFiles.length === 0 ||
        (successfulUploadsWithTaskIds.length === 0 && !hasUploadErrors)
      ) {
        handleNextStep();
      }
    }

    setIsProcessingSubmit(false);
  };

  const isSubmitDisabled = useMemo(() => {
    if (uploadedFiles.length === 0) return true;
    return uploadedFiles.some((file) => !fileToVideoMap[file.name]?.video);
  }, [uploadedFiles, fileToVideoMap]);

  const getStatusMessageAndIcon = () => {
    switch (overallProcessPhase) {
      case "uploading":
        return {
          message: "Uploading files...",
          icon: <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />,
        };
      case "completingTasks":
        return {
          message: "Completing tasks...",
          icon: <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />,
        };
      case "errorInUpload":
        return {
          message: "Error during uploads. Please check files.",
          icon: (
            <Iconify
              icon="eva:alert-triangle-fill"
              width={20}
              sx={{ mr: 1, color: "warning.main" }}
            />
          ),
        };
      case "errorInCompletion":
        return {
          message: "Error completing tasks. Some uploads may have succeeded.",
          icon: (
            <Iconify
              icon="eva:alert-triangle-fill"
              width={20}
              sx={{ mr: 1, color: "warning.main" }}
            />
          ),
        };
      case "allDone":
        return {
          message: "All operations finished.",
          icon: (
            <Iconify
              icon="eva:checkmark-circle-2-fill"
              width={20}
              sx={{ mr: 1, color: "success.main" }}
            />
          ),
        };
      default:
        return { message: "", icon: null };
    }
  };

  const { message: statusMessage, icon: statusIcon } =
    getStatusMessageAndIcon();

  const showStatusBox =
    overallProcessPhase === "uploading" ||
    overallProcessPhase === "completingTasks" ||
    overallProcessPhase === "errorInUpload" ||
    overallProcessPhase === "errorInCompletion" ||
    (overallProcessPhase === "allDone" && isProcessingSubmit);

  return (
    <Stack
      {...getRootProps()}
      sx={{
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        backgroundColor: "common.white",
        border: isDragActive ? "2px solid #CCCCCC" : "none",
        boxShadow: isDragActive
          ? "0px 4px 16px 0px rgba(38, 38, 38, 0.1)"
          : "0px 4px 16px 0px rgba(38, 38, 38, 0.05)",
        "&:hover": {
          boxShadow: !isDragActive
            ? "0px 4px 16px 0px rgba(38, 38, 38, 0.1)"
            : "inherit",
        },
        cursor: "pointer",
        transition: "all 0.2s ease",
        flex: 1,
        display: "flex",
        p: 1.5,
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <input {...getInputProps()} />
      <SmartUploadInfo />

      {showStatusBox && (
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            backgroundColor: "common.white",
            color: "common.white",
            padding: "8px 16px",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
            // minWidth: "250px",
            justifyContent: "center",
          }}
        >
          {/* {statusIcon} */}
          <CircularProgress size={16} thickness={5} sx={{ mr: 1 }} />
          <Typography variant="subtitle2" component="span">
            {statusMessage}
          </Typography>
        </Box>
      )}
      <Stack
        spacing={1}
        width="100%"
        sx={{
          position: "relative",
          flex: "1 1 0",
          minHeight: 0,
          overflowY: "auto",
          mb: 1.5,
          "&::-webkit-scrollbar": {
            width: 8,
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
            margin: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 10,
            border: "2px solid transparent",
            backgroundClip: "content-box",
            transition: "background-color 0.2s ease",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          scrollbarWidth: "thin",
          msOverflowStyle: "none",
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 90%, transparent 100%)",
        }}
      >
        {uploadedFiles.length === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NoFilesState />
          </Box>
        )}

        {uploadedFiles.map((file) => {
          const fileDetails = fileToVideoMap[file.name];
          const uploadStatus = fileUploadProgress[file.name];
          return (
            <FileItem
              key={file.name}
              file={file}
              videos={selectedVideos}
              onRemove={handleRemoveFile}
              onVideoSelect={handleVideoSelect}
              selectedVideo={fileDetails?.video || null}
              matchType={fileDetails?.matchType || "none"}
              isUserChoice={fileDetails?.isUserChoice || false}
              uploadStatus={uploadStatus}
              isProcessingSubmit={isProcessingSubmit}
            />
          );
        })}
      </Stack>

      <Stack spacing={2} sx={{ flexShrink: 0 }}>
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          size="extraLarge"
          startIcon={<Iconify icon="mdi:plus" />}
          disabled={isProcessingSubmit}
        >
          Upload
        </Button>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit();
          }}
          sx={{
            "&:disabled": {
              backgroundColor: (theme) => theme.palette.grey[300],
            },
          }}
          size="extraLarge"
          disabled={isSubmitDisabled || isProcessingSubmit}
        >
          {isProcessingSubmit ? (
            <CircularProgress size={28} color="inherit" sx={{ mr: 1 }} />
          ) : null}
          {isProcessingSubmit ? "Processing..." : "Submit"}
        </Button>
      </Stack>
    </Stack>
  );
}
