// components/FileList.tsx
import { Stack, Typography } from "@mui/material";
import { ResourceItemDTO } from "hvo-shared";
import FileItem from "./file-item";
import NoFilesState from "./no-files-state";
import AvailableSoonState from "./available-soon-state";

interface FileListProps {
  // Files that are already uploaded and stored
  uploadedFiles: ResourceItemDTO[];
  // Files currently being uploaded
  uploadingFiles: Set<string>;
  // Whether the task is still in progress (affects UI interactions)
  isTaskInProgress: boolean;
  // Whether the task is still pending (affects UI interactions)
  isTaskPending: boolean;
  // Callback when a file is deleted
  onDeleteFile: (fileId: string) => void;
}

export default function FileList({
  uploadedFiles,
  uploadingFiles,
  isTaskInProgress,
  isTaskPending,
  onDeleteFile,
}: FileListProps) {
  // If there are no files at all, show empty state
  if (
    isTaskInProgress &&
    uploadedFiles.length === 0 &&
    uploadingFiles.size === 0
  ) {
    return <NoFilesState />;
  }

  if (isTaskPending) {
    return <AvailableSoonState />;
  }

  return (
    <Stack spacing={1.5} sx={{ width: "100%" }} p={1}>
      {uploadedFiles.map((file) => (
        <FileItem
          key={file.fileId || file.name}
          file={file}
          isUploading={uploadingFiles.has(file.name)}
          onDelete={() => onDeleteFile(file.fileId)}
          showActions={isTaskInProgress}
        />
      ))}
    </Stack>
  );
}
