// components/FileItem.tsx
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// import { ExtendedResourceItemDTO } from "../../file-manager/components/file-item";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import SvgColor from "@/components/svg-color";
import { getIconName } from "../utils";
import { ResourceItemDTO } from "hvo-shared";

export interface ExtendedResourceItemDTO extends ResourceItemDTO {
  file?: File; // Optional since not all items will have a file object
}

interface FileItemProps {
  file: ExtendedResourceItemDTO;
  isUploading: boolean;
  showActions: boolean;
  onDelete: () => void;
}

function getFileTypeIcon(fileType: string) {
  if (fileType.startsWith("image/")) return <ImageIcon />;
  if (fileType.startsWith("audio/")) return <AudioFileIcon />;
  if (fileType.startsWith("video/")) return <VideoFileIcon />;
  return <InsertDriveFileIcon />;
}

export default function FileItem({
  file,
  isUploading,
  showActions,
  onDelete,
}: FileItemProps) {
  console.log("file", file.type);
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#F4F4F4",
        },
        backgroundColor: "common.white",
        borderRadius: "100px",
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        cursor: "default",
        overflow: "hidden",
      }}
    >
      <Stack alignItems="center" direction="row" px={4} py={2} spacing={1}>
        <SvgColor
          src={`/assets/icons/staff/files/${getIconName(file.name)}.svg`}
        />
        <Typography
          // variant="bodyLarge"
          fontSize={18}
          fontWeight={400}
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
          }}
        >
          {file.name}
        </Typography>
      </Stack>
      {/* File details */}
      {/* <Stack flex={1} spacing={0.5}>
        <Typography variant="body1" noWrap>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {file.file?.size && formatFileSize(file.file.size)}
        </Typography>
      </Stack> */}

      {showActions && (
        <Stack direction="row" alignItems="center">
          <Divider orientation="vertical" />
          {isUploading ? (
            // Show loading spinner during upload
            <Box display="flex" alignItems="center" px={1.5}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            // Show trash icon for deletion
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              sx={{
                borderRadius: 0,
                borderTopRightRadius: "2px",
                borderBottomRightRadius: "2px",
                height: "100%",
                px: 1.5,
              }}
            >
              <SvgColor
                src="/assets/icons/trash-new.svg"
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
          )}
        </Stack>
      )}
      {/* Upload status or actions */}
      {/* {showActions && (
        <Box sx={{ ml: 2 }}>
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )} */}
    </Stack>
  );
}

// Utility function for formatting file sizes
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
