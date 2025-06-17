import { deleteFileFromStorage, uploadFileToStorage } from "@/apis/storage";
import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import { Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import { set } from "lodash";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  label: string;
  type: "audio" | "video";
  // uploadUrl: string | undefined | null;
  folderId: string | undefined | null;
  onUploadChange: (fileId: string) => void;
  formErrorMessage?: string;
};

export default function UploadSingleFile({ label, type, folderId, onUploadChange, formErrorMessage }: Props) {
  const [file, setFile] = useState<File | null>();
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("We got upload? ", acceptedFiles[0].name);
      if (acceptedFiles.length > 0) {
        // console.log("Upload 1", folderId, uploadedFileId);
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [folderId, uploadedFileId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [],
      "video/*": [],
    },
    maxFiles: 1,
  });

  const handleClickUpload = () => {
    document.querySelector<HTMLInputElement>("#file-input")?.click();
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    try {
      if (uploadedFileId) {
        await deleteFileFromStorage(uploadedFileId);
        setUploadedFileId(null);
      }
      const data = await uploadFile(file);
      setFile(file);
      onUploadChange?.(data!.fileId);
    } catch (error) {
      setError(error.message);
      onUploadChange?.("");
    }
  };

  const uploadFile = async (file) => {
    if (!folderId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);

    try {
      const data = await uploadFileToStorage(file, folderId);
      setUploadedFileId(data.fileId);
      // console.log("File uploaded successfully:", data);
      return data;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
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
          borderRadius: "4px",
          border: "1px solid #E6E6E6",
          width: "100%",
        }}
      >
        <Button
          fullWidth
          sx={{
            display: "flex",
            justifyContent: "start",
            borderRadius: "2px 0px 0px 2px",
            px: 2.5,
            py: 1.5,
          }}
          onClick={handleClickUpload}
          disabled={!folderId}
        >
          <Stack {...getRootProps()} direction="row" spacing={1} alignItems="center">
            <input {...getInputProps()} id="file-input" style={{ display: "none" }} />
            <SvgColor
              src={`/assets/icons/staff/files/${type === "video" ? "video" : "audio"}.svg`}
              sx={{ width: 24, height: 24 }}
            />
            <Typography
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                textOverflow: "ellipsis",
              }}
              fontSize={18}
              fontWeight={500}
              lineHeight="24px"
            >
              {file ? (file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name) : label}
            </Typography>
          </Stack>
        </Button>

        <Stack direction="row" alignItems="center" spacing={1.5} pr={1.5}>
          <Divider sx={{ height: "100%" }} orientation="vertical" />
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            // <SvgColor
            //   src={`/assets/icons/${!!file ? "tick" : "info-empty"}.svg`}
            //   color="common.green"
            //   sx={{ width: 24, height: 24 }}
            // />
            <Iconify icon="bi:check-circle-fill" color="#00B280" />
          )}
        </Stack>
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
