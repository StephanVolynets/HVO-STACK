import { deleteFileFromStorage, uploadFileToStorage } from "@/apis/storage";
import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { set } from "lodash";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  label: string;
  type: "audio" | "video";
  signedUrl: string | undefined | null; // Signed URL for upload
  formErrorMessage?: string;
  onUploadChange: (
    status: "uploading" | "uploaded",
    fileName: string | null
  ) => void; // Callback when upload completes
};
export default function UploadSingleFileGCS({
  label,
  type,
  signedUrl,
  formErrorMessage,
  onUploadChange,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  console.log("SIGNEDURL_GCS", signedUrl);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [signedUrl]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      [type === "video" ? "video/*" : "audio/*"]: [],
    },
    maxFiles: 1,
  });

  const handleClickUpload = () => {
    document.querySelector<HTMLInputElement>("#file-input")?.click();
  };

  const handleFileUpload = async (file: File) => {
    console.log("first", signedUrl);
    if (!signedUrl) {
      setError("Upload URL is not available.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    onUploadChange("uploading", null); // Notify parent component

    try {
      const response = await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percentCompleted);
          } else {
            // Fallback if `event.total` is undefined
            setProgress(100); // Assume the upload is complete
            // Here right?
            setFile(file);
            onUploadChange("uploaded", file.name); // Notify parent component
          }
        },
      });

      if (response.status === 200) {
        setFile(file);
        onUploadChange("uploaded", file.name); // Notify parent component
      }
    } catch (err: any) {
      console.error("File upload failed:", err);
      setError(err.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Stack alignItems="flex-start" spacing={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          backgroundColor: "common.white",
          // borderRadius: "4px",
          // borderTopRightRadius: "4px",
          // borderBottomRightRadius: "4px",
          // border: "1px solid #E6E6E6",
          width: "100%",
          height: "100%",
        }}
      >
        <Button
          fullWidth
          sx={{
            display: "flex",
            justifyContent: "start",
            borderRadius: "2px 0px 0px 2px",
            borderTopLeftRadius: 0,

            px: 2.5,

            // py: 1.5,
          }}
          // onClick={handleClickUpload}
          disabled={!signedUrl}
        >
          <Stack
            {...getRootProps()}
            direction="row"
            spacing={1}
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              {...getInputProps()}
              id="file-input"
              style={{ display: "none" }}
            />

            {!file && !isUploading ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                {/* <SvgColor
                  src={`/assets/icons/staff/files/${
                    type === "video" ? "video" : "audio"
                  }.svg`}
                  sx={{ width: 24, height: 24 }}
                /> */}
                <SvgColor src="/assets/icons/upload.svg" />
                <Typography variant="bodyLarge" color="primary.main">
                  {type === "video" ? ".MP4" : ".AAF or .WAV"}
                </Typography>
              </Stack>
            ) : isUploading ? (
              <Box
                sx={{ width: 24, height: 24 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress
                  size={20}
                  thickness={5}
                  variant="determinate"
                  value={progress}
                  color="success"
                />
              </Box>
            ) : (
              <Box
                sx={{ width: 24, height: 24 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Iconify
                  icon="bi:check-circle-fill"
                  color="#00B280"
                  width={20}
                  height={20}
                />
              </Box>
            )}
          </Stack>
        </Button>
      </Stack>
      {formErrorMessage && (
        <Typography variant="caption" color="error" textAlign="center" ml={1}>
          {formErrorMessage}
        </Typography>
      )}
    </Stack>
  );
}

// TODO: We have to add cancel button. Request design for this.
