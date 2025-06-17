import {
  TextField,
  Stack,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { UploadSingleFileGCS } from "@/components/upload/single-file-GCS";
import { useState } from "react";
import { debounce } from "lodash";
import SvgColor from "@/components/svg-color";
import { url } from "inspector";
type MixedInputProps = {
  name: string;
  label: string;
  type: "video" | "audio";
  signedUrl?: string | null;
  onUploadChange: (fileId: string) => void;
  formErrorMessage?: string;
};

export default function MixedInput({
  name,
  type,
  label,
  signedUrl,
  onUploadChange,
  formErrorMessage,
}: MixedInputProps) {
  const { control, setValue, setError, clearErrors, watch } = useFormContext();
  const [urlState, setUrlState] = useState<"empty" | "valid" | "invalid">(
    "empty"
  );
  const [GCSFileUploadStatus, setGCSUploadStatus] = useState<
    "empty" | "uploading" | "uploaded"
  >("empty");

  const finalValue = watch(name);
  // Green: #FAFFFA; Red: #FFFAFA

  console.log("first", GCSFileUploadStatus);

  const [urlValue, setUrlValue] = useState<string>("");

  const validateUrl = debounce((url: string) => {
    const isValidYouTubeUrl = (url: string) =>
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
    const isValidGoogleDriveUrl = (url: string) =>
      /^(https?:\/\/)?(drive\.google\.com)\/file\/d\/.+$/.test(url);

    // Perform validation based on type
    if (type === "video") {
      if (isValidYouTubeUrl(url) || isValidGoogleDriveUrl(url)) {
        setValue(name, url); // Set the value in the form
        clearErrors(name); // Clear any existing errors
        setUrlState("valid");
      } else {
        setValue(name, "");
        setError(name, { message: "Invalid YouTube or Google Drive URL" }); // Set an error
        setUrlState("invalid");
      }
    } else if (type === "audio") {
      if (isValidGoogleDriveUrl(url)) {
        setValue(name, url); // Set the value in the form
        clearErrors(name); // Clear any existing errors
        setUrlState("valid");
      } else {
        setValue(name, "");
        setError(name, { message: "Invalid Google Drive URL" }); // Set an error
        setUrlState("invalid");
      }
    }
  }, 1000);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlValue(value); // Update local state
    validateUrl(value); // Trigger validation after debounce
  };

  const getIcon = () => {
    if (type === "video") {
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          {!urlValue && (
            <>
              <SvgColor src="/assets/icons/youtube.svg" colored />
              <SvgColor src="/assets/icons/google-drive.svg" colored />
            </>
          )}
          {urlValue &&
            (urlValue.includes("youtube") || urlValue.includes("youtu.be")) && (
              <SvgColor src="/assets/icons/youtube.svg" colored />
            )}
          {urlValue && urlValue.includes("drive.google.com") && (
            <SvgColor src="/assets/icons/google-drive.svg" colored />
          )}
        </Stack>
      );
    } else {
      return <SvgColor src="/assets/icons/google-drive.svg" colored />;
    }
  };

  const getBackgroundColor = () => {
    if (urlState === "valid") {
      return "#E6F6E6";
    } else if (urlState === "invalid") {
      return "#FDEAEA";
    } else {
      return "#F2F2F2";
    }
  };

  return (
    <Stack
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 0 16px rgba(38, 38, 38, 0.05)",
        },
      }}
    >
      <TextField
        fullWidth
        value={urlValue}
        onChange={handleUrlChange}
        // label={label}
        // label="Successfully uploaded"
        variant="outlined"
        // disabled
        // aria-readonly
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{getIcon()}</InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "19px",
            borderBottomRightRadius: "4px",
            borderBottomLeftRadius: "4px",
            backgroundColor: getBackgroundColor(),
            border: "none",
            "& .MuiInputBase-input": {
              typography: "bodyLarge",
              // padding: "16px",
              "&::placeholder": {
                color: "common.surfaceVariant",
                opacity: 0.5,
              },
            },
            "&:hover": {
              backgroundColor: "common.white",
              "& fieldset": {
                border: (theme) =>
                  `1px solid ${theme.palette.common.mainBorder}`,
              },
            },
            "&.Mui-focused": {
              backgroundColor: "common.white",
              "& fieldset": {
                border: "1px solid #262626",
              },
            },
            "& fieldset": {
              border: (theme) => `1px solid transparent`,
            },
          },
        }}
        placeholder={`https://www.youtube.com/watch?v=Dcp02c9LLEw`}
      />
      <UploadSingleFileGCS
        type={type}
        signedUrl={signedUrl}
        label={label}
        onUploadChange={(status: "uploading" | "uploaded", fileId) => {
          console.log("GoUPLO", status, fileId);
          if (status === "uploaded") {
            onUploadChange(fileId!); // Trigger the callback
            setValue(name, fileId); // Set the value in the form
          } else {
            setValue(name, ""); // Clear the value in the
          }
          clearErrors(name); // Clear any existing errors
          setGCSUploadStatus(status);
        }}
      />
      {/* {formErrorMessage && (
        <Typography variant="caption" color="error" ml={1}>
          {formErrorMessage}
        </Typography>
      )} */}
    </Stack>
  );
}
