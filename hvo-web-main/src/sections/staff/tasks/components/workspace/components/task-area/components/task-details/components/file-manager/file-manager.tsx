import { Box, Button, Stack, CircularProgress } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import { ResourceItemDTO, TaskStatus } from "hvo-shared";
import { useQuery } from "@tanstack/react-query";
import {
  deleteFileFromStorage,
  // uploadFileWithPreSignedUrl,
  getFileId,
  getBoxUploadUrl,
  uploadFileToBoxChunked,
  uploadFileToStorage,
} from "@/apis/storage";
import FileList from "./components/file-list";
import { getTaskUploadedFiles } from "@/apis/task";
import Iconify from "@/components/iconify";
import SubmittedMessage from "./components/submitted-message";
import UpcomingTaskMessage from "./components/upcoming-message";
import TaskCompleted from "./components/task-completed";
import TaskAvailableSoon from "./components/task-available-soon";
import SmartUploadInfo from "./components/smart-upload-info";
import AvailableSoonState from "./components/available-soon-state";
const BORDER_ANIMATION_DURATION = 3000;
// Constants for file upload configuration
const MAX_FILE_SIZE = 10000 * 1024 * 1024; // 100MB
const ACCEPTED_FILE_TYPES = {
  "audio/*": [],
  "video/*": [],
};

interface FileManagerProps {
  taskId: number;
  folderId: string;
  isTaskInProgress: boolean;
  onTaskComplete?: () => Promise<void>;
  onError?: (error: Error) => void;
  taskStatus: TaskStatus;
}

export default function FileManager({
  taskId,
  folderId,
  isTaskInProgress: initialIsTaskInProgress,
  onTaskComplete,
  onError,
  taskStatus,
}: FileManagerProps) {
  // Track files that are currently being uploaded
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [animateBorder, setAnimateBorder] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(
    taskStatus === TaskStatus.COMPLETED
  );
  const [isTaskInProgress, setIsTaskInProgress] = useState(
    initialIsTaskInProgress
  );
  const queryClient = useQueryClient();

  // Fetch the list of already uploaded files
  const { data: uploadedFiles = [] } = useQuery<ResourceItemDTO[]>({
    queryKey: ["tasks/uploaded-files", taskId],
    queryFn: async () => {
      if (!folderId || !taskId) return [];
      try {
        return await getTaskUploadedFiles({ folderId, taskId });
      } catch (error) {
        onError?.(error as Error);
        return [];
      }
    },
    // Don't refetch on window focus for better UX
    refetchOnWindowFocus: false,
  });

  // Handle the file upload process
  const handleFilesSelected = async (files: File[]) => {
    // Add files to uploading state
    const newFileNames = files.map((f) => f.name);
    setUploadingFiles(
      (prev) => new Set([...Array.from(prev), ...newFileNames])
    );

    // Prepare file metadata for optimistic update
    const fileMetadata: ResourceItemDTO[] = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      fileId: "", // Will be filled after upload
      downloadUrl: "",
    }));

    // Optimistically update UI
    queryClient.setQueryData<ResourceItemDTO[]>(
      ["tasks/uploaded-files", taskId],
      (oldFiles = []) => [...oldFiles, ...fileMetadata]
    );

    // Process each file
    try {
      await Promise.all(
        files.map(async (file) => {
          try {
            // const response = await uploadFileToStorage(file, folderId);
            // const uploadUrl = await getBoxUploadUrl(folderId, file.name);

            // // Upload the file directly to Box using the pre-signed URL
            // await uploadFileWithPreSignedUrl(file, uploadUrl);

            // const fileId = await getFileId(file.name, folderId);

            let fileId = "";
            if (file.size > 25 * 1024 * 1024) {
              const fileInfo = await uploadFileToBoxChunked(file, folderId);
              fileId = fileInfo.fileId;
            } else {
              const fileInfo = await uploadFileToStorage(file, folderId);
              fileId = fileInfo.fileId;
            }

            // Update the file's ID in the cache once upload is complete
            queryClient.setQueryData<ResourceItemDTO[]>(
              ["tasks/uploaded-files", taskId],
              (oldFiles = []) =>
                oldFiles.map((f) =>
                  f.name === file.name ? { ...f, fileId: fileId } : f
                )
            );
          } catch (error) {
            // If individual file upload fails, remove it from the cache
            queryClient.setQueryData<ResourceItemDTO[]>(
              ["tasks/uploaded-files", taskId],
              (oldFiles = []) => oldFiles.filter((f) => f.name !== file.name)
            );
            throw error;
          }
        })
      );
    } catch (error) {
      onError?.(error as Error);
    } finally {
      // Remove files from uploading state
      setUploadingFiles((prev) => {
        const next = new Set(prev);
        newFileNames.forEach((name) => next.delete(name));
        return next;
      });
    }
  };

  // Handle file deletion
  const handleDeleteFile = useCallback(
    async (fileId: string) => {
      // Get current files before deletion
      const previousFiles =
        queryClient.getQueryData<ResourceItemDTO[]>([
          "tasks/uploaded-files",
          taskId,
        ]) || [];

      try {
        // Optimistically remove from cache
        queryClient.setQueryData<ResourceItemDTO[]>(
          ["tasks/uploaded-files", taskId],
          (old = []) => old.filter((f) => f.fileId !== fileId)
        );

        // Attempt deletion
        await deleteFileFromStorage(fileId);
      } catch (error) {
        // If deletion fails, revert the cache
        queryClient.setQueryData(
          ["tasks/uploaded-files", taskId],
          previousFiles
        );
        onError?.(error as Error);
      }
    },
    [taskId, queryClient, onError]
  );

  // Configure dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFilesSelected(acceptedFiles);
    },
    [handleFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    disabled: !isTaskInProgress,
    // accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (fileRejections) => {
      const errors = fileRejections.map(
        (rejection) => `${rejection.file.name}: ${rejection.errors[0].message}`
      );
      onError?.(new Error(errors.join("\n")));
    },
  });

  const handleCompleteClick = async () => {
    try {
      setIsCompleting(true);
      await onTaskComplete?.();
      setAnimateBorder(true);
      setIsTaskInProgress(false);
      setTimeout(() => setAnimateBorder(false), BORDER_ANIMATION_DURATION);
    } catch (error) {
      setAnimateBorder(false);
      onError?.(error as Error);
    } finally {
      setIsCompleting(false);
      setIsTaskCompleted(true);
    }
  };

  return (
    // <Box display="flex" flex={1}>

    <Stack
      p={1.5}
      sx={{
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        backgroundColor: "common.white",
        boxShadow: "0px 4px 16px 0px rgba(38, 38, 38, 0.05)",
        flex: 1,
        display: "flex",
      }}
      spacing={1.5}
    >
      <SmartUploadInfo />

      {/* Dropzone area */}
      <Box
        {...getRootProps()}
        sx={{
          flex: 1,
          // border: isDragActive ? "2px dashed #0066CC" : "1px solid #E0E0E0",
          // borderRadius: "8px",
          // p: 2,
          // backgroundColor: "white",
          cursor: isTaskInProgress ? "pointer" : "default",
          transition: "all 0.2s ease-in-out",
          borderRadius: "24px",
          "&:hover": isTaskInProgress
            ? {
                // borderColor: "#0066CC",
                // backgroundColor: "#F8F9FA",
                boxShadow: "inset 0px 4px 16px 0px rgba(0, 0, 0, 0.08)",
                backgroundColor: "common.white",
                "& .upload-file-icon": {
                  color: "#F2F2F2",
                },
              }
            : {},
          // Prevent text selection during drag
          userSelect: "none",
        }}
      >
        <input {...getInputProps()} />
        <FileList
          uploadedFiles={uploadedFiles}
          uploadingFiles={uploadingFiles}
          isTaskInProgress={isTaskInProgress}
          isTaskPending={taskStatus === TaskStatus.PENDING}
          onDeleteFile={handleDeleteFile}
        />
      </Box>

      {/* Action buttons */}
      {isTaskInProgress && (
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={open}
            disabled={uploadingFiles.size > 0}
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Upload Files
          </Button>
          <Button
            variant="contained"
            disabled={
              uploadingFiles.size > 0 ||
              uploadedFiles.length === 0 ||
              isCompleting
            }
            onClick={handleCompleteClick}
          >
            {isCompleting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Complete Task"
            )}
          </Button>
        </Stack>
      )}

      {isTaskCompleted && <TaskCompleted />}

      {/* {taskStatus === TaskStatus.PENDING && <TaskAvailableSoon />} */}
    </Stack>
  );
}
