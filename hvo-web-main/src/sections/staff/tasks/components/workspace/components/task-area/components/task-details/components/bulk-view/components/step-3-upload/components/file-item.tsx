import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { StaffVideoDTO } from "hvo-shared";
import SvgColor from "@/components/svg-color";
import Iconify from "@/components/iconify";
import { CustomSelectArrowIcon } from "@/sections/staff/tasks/components/side-panel/components/navigator/components/navigator-controls/components/creator-filter";
import { getIconName } from "../../../../file-manager/utils";
// import { getIconName } from "../../../../../../file-manager-new/utils";

// Re-define FileUploadStatus here if not easily importable, or import from parent
// For simplicity here, we'll assume it might be passed or can be re-defined if needed.
interface FileUploadStatus {
  status: "pending" | "uploading" | "completed" | "error";
  progressPercent?: number;
  error?: string;
  fileId?: string;
}

// Helper function to find the best video match based on filename
// This function is now primarily used by the parent BulkUploadFileManager.
// It's kept here if FileItem might need it independently in other contexts, or it could be moved to a utils file.
export const findBestMatch = (
  fileName: string,
  videos: StaffVideoDTO[]
): { video: StaffVideoDTO | null; matchType: "exact" | "partial" | "none" } => {
  const fileNameWithoutExt =
    fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
  const exactMatch = videos.find(
    (video) => video.title.toLowerCase() === fileNameWithoutExt.toLowerCase()
  );
  if (exactMatch) return { video: exactMatch, matchType: "exact" };

  const partialMatches = videos.filter(
    (video) =>
      fileNameWithoutExt.toLowerCase().includes(video.title.toLowerCase()) ||
      video.title.toLowerCase().includes(fileNameWithoutExt.toLowerCase())
  );
  if (partialMatches.length > 0)
    return { video: partialMatches[0], matchType: "partial" };

  return { video: null, matchType: "none" };
};

interface Props {
  file: File;
  videos: StaffVideoDTO[];
  onRemove: (fileName: string) => void;
  onVideoSelect: (fileName: string, video: StaffVideoDTO | null) => void;
  selectedVideo: StaffVideoDTO | null;
  matchType: "exact" | "partial" | "none";
  isUserChoice: boolean;
  uploadStatus?: FileUploadStatus;
  isProcessingSubmit?: boolean;
}

export default function FileItem({
  file,
  videos,
  onRemove,
  onVideoSelect,
  selectedVideo,
  matchType,
  isUserChoice,
  uploadStatus,
  isProcessingSubmit,
}: Props) {
  // Select is disabled if it's an exact match, or if the file is actively uploading.
  const isSelectDisabled =
    matchType === "exact" ||
    uploadStatus?.status === "uploading" ||
    uploadStatus?.status === "completed";

  const hasNoSelection = !selectedVideo && matchType !== "exact"; // No selection and not an exact match forcing one

  // Show partial warning if: partial match, not user's choice, AND not uploading, not completed, not errored.
  const showPartialMatchWarning =
    matchType === "partial" &&
    !isUserChoice &&
    uploadStatus?.status !== "uploading" &&
    uploadStatus?.status !== "completed" &&
    uploadStatus?.status !== "error";

  const handleVideoChange = (event) => {
    const videoId = event.target.value;
    const video = videos.find((v) => v.id === videoId) || null;
    onVideoSelect(file.name, video);
  };

  // --- Base Style Determination ---
  let baseBorderColor = "common.mainBorder";
  let baseBackgroundColor = "common.white";
  let baseTextColor = "primary.surface";
  let baseIconColor = "primary.surface";
  let baseHoverBorderColor = "primary.dark";
  let baseFocusedBorderColor = "primary.main";
  let baseFontWeight = 400;

  const isPartialUnconfirmed = matchType === "partial" && !isUserChoice;
  const isNoSelectionState = !selectedVideo && matchType !== "exact";

  if (matchType === "exact") {
    baseBorderColor = "#D6E4DA";
    baseBackgroundColor = "rgba(76, 175, 80, 0.04)";
    baseTextColor = "#163B2E";
    baseIconColor = "#163B2E";
    baseHoverBorderColor = "#D6E4DA";
    baseFocusedBorderColor = "#D6E4DA";
    baseFontWeight = 500;
  } else if (isPartialUnconfirmed) {
    baseBorderColor = "#FFC680";
    baseBackgroundColor = "#FFF6E5";
    baseTextColor = "#A85900";
    baseIconColor = "#A85900";
    baseHoverBorderColor = "#8C4A00";
    baseFocusedBorderColor = "#8C4A00";
  } else if (isNoSelectionState) {
    baseBorderColor = "red.border";
    baseBackgroundColor = "red.surface1";
    baseTextColor = "red.onSurface";
    baseIconColor = "red.onSurface";
    baseHoverBorderColor = "error.light";
    baseFocusedBorderColor = "error.dark";
  }

  // --- Current Effective Style Determination ---
  let currentBorderColor = baseBorderColor;
  let currentBackgroundColor = baseBackgroundColor;
  let currentTextColor = baseTextColor;
  let currentIconColor = baseIconColor;
  let currentHoverBorderColor = baseHoverBorderColor;
  let currentFocusedBorderColor = baseFocusedBorderColor;
  let currentFontWeight = baseFontWeight;

  if (uploadStatus?.status === "error") {
    currentBorderColor = "error.main";
    currentBackgroundColor = "error.lighter";
    currentTextColor = "error.dark";
    currentIconColor = "error.dark";
    currentHoverBorderColor = "error.dark";
    currentFocusedBorderColor = "error.dark";
  }

  const showPartialMatchWarningTooltip =
    matchType === "partial" &&
    !isUserChoice &&
    uploadStatus?.status !== "uploading" &&
    uploadStatus?.status !== "completed" &&
    uploadStatus?.status !== "error";

  const hasNoSelectionForTooltip = !selectedVideo && matchType !== "exact";

  const showRemoveButton =
    uploadStatus?.status !== "uploading" &&
    uploadStatus?.status !== "completed" &&
    (!isProcessingSubmit || uploadStatus?.status === "error");

  let tooltipTitle = "Select a video";
  if (matchType === "exact" && uploadStatus?.status !== "error") {
    tooltipTitle = `Exact match: ${selectedVideo?.title || "Video"}`;
  } else if (showPartialMatchWarningTooltip) {
    tooltipTitle = `Potential match: ${
      selectedVideo?.title || "Video"
    } (Review recommended)`;
  } else if (hasNoSelectionForTooltip && uploadStatus?.status !== "error") {
    tooltipTitle = "Please select a video for this file.";
  } else if (uploadStatus?.status === "error") {
    tooltipTitle = `Error: ${uploadStatus.error || "Upload failed"}`;
  } else if (uploadStatus?.status === "completed") {
    tooltipTitle = `Uploaded: ${selectedVideo?.title || "File"}`;
  } else if (selectedVideo) {
    tooltipTitle = `Selected: ${selectedVideo.title}`;
  }

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pl: 4,
        cursor: "default",
        borderRadius: 100,
        backgroundColor: "#F8F8F8",
        mb: 1.5,
        width: "100%",
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        boxSizing: "border-box",
        opacity: uploadStatus?.status === "uploading" ? 0.6 : 1,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <SvgColor
          src={`/assets/icons/staff/files/${getIconName(file.name)}.svg`}
          sx={{ width: 24, height: 24, flexShrink: 0 }}
        />
        <Typography
          fontSize={18}
          fontWeight={400}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "primary.surface",
          }}
        >
          {file.name}
        </Typography>
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title={tooltipTitle}>
          <Select
            value={selectedVideo?.id || ""}
            onChange={handleVideoChange}
            displayEmpty
            disabled={isSelectDisabled}
            IconComponent={CustomSelectArrowIcon}
            startAdornment={
              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                <SvgColor
                  src={`/assets/icons/staff/files/video.svg`}
                  sx={{ width: 24, height: 24, flexShrink: 0 }}
                  color={currentIconColor}
                />
              </Box>
            }
            sx={{
              py: "1.5px",
              my: 1.5,
              minWidth: 300,
              width: 552,
              borderRadius: 100,
              fontSize: 18,
              fontWeight: currentFontWeight,
              backgroundColor: currentBackgroundColor,
              color: currentTextColor,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: 100,
                borderColor: currentBorderColor,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isSelectDisabled
                  ? currentBorderColor
                  : currentHoverBorderColor,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: isSelectDisabled
                  ? currentBorderColor
                  : currentFocusedBorderColor,
              },
              "&.Mui-disabled": {
                backgroundColor: currentBackgroundColor,
                color: currentTextColor,
                "& .MuiSelect-select": {
                  color: currentTextColor,
                  WebkitTextFillColor: currentTextColor,
                  fontWeight: currentFontWeight,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: currentBorderColor,
                },
                "& .MuiSvgIcon-root": {
                  color: currentIconColor,
                },
              },
              boxSizing: "border-box",
            }}
          >
            <MenuItem value="" disabled>
              {matchType === "exact" && selectedVideo
                ? selectedVideo.title
                : selectedVideo
                ? selectedVideo.title
                : "Select a video"}
            </MenuItem>
            {videos.map((video) => (
              <MenuItem key={video.id} value={video.id}>
                {video.title}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>

        <Box
          sx={{
            width: 72,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTopRightRadius: 100,
            borderBottomRightRadius: 100,
          }}
        >
          {uploadStatus?.status === "uploading" && (
            <CircularProgress size={28} />
          )}
          {uploadStatus?.status === "completed" && (
            <Iconify
              icon="eva:checkmark-circle-2-fill"
              sx={{ width: 28, height: 28, color: "success.main" }}
            />
          )}
          {uploadStatus?.status === "error" && (
            <Tooltip title={uploadStatus.error || "Upload failed"}>
              <Iconify
                icon="eva:alert-circle-fill"
                sx={{ width: 28, height: 28, color: "error.main" }}
              />
            </Tooltip>
          )}
          {showRemoveButton && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                if (!isProcessingSubmit || uploadStatus?.status === "error")
                  onRemove(file.name);
              }}
              disabled={isProcessingSubmit && uploadStatus?.status !== "error"}
              sx={{
                width: 72,
                height: 80,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              <SvgColor
                src={`/assets/icons/bin-2.svg`}
                color="#4D0000"
                sx={{ width: 24, height: 24, flexShrink: 0 }}
              />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
