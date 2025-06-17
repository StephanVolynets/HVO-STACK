import { useState } from "react";
import {
  Button,
  Stack,
  Typography,
  Modal as MuiModal,
  Box,
  Paper,
  IconButton,
  Link,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Iconify from "@/components/iconify";
import { useAuthContext } from "@/auth/hooks";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { getBulkUploadTemplate, uploadBulkVideos } from "@/apis/video";
import SvgColor from "@/components/svg-color";
import { LoadingButton } from "@mui/lab";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BulkUploadModal({ open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuthContext();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      console.log("user", user);
      const response = await getBulkUploadTemplate(user?.email);

      // Create a URL for the blob
      const url = window.URL.createObjectURL(response.data);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video_upload_template.xlsx");

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);

      // enqueueSnackbar("Template downloaded successfully", {
      //   variant: "success",
      // });
    } catch (error) {
      console.error("Error downloading template:", error);
      enqueueSnackbar("Error downloading template", { variant: "error" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      enqueueSnackbar("Please upload an XLSX file", { variant: "warning" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await uploadBulkVideos(user?.email, file);
      console.log("response", response);
      enqueueSnackbar(
        "XLSX file uploaded successfully. You will be notified by email once processing is complete.",
        { variant: "success" }
      );
      onClose();
    } catch (error) {
      console.error("Error uploading XLSX:", error);
      enqueueSnackbar("Error uploading XLSX file", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="bulk-upload-modal-title"
      aria-describedby="bulk-upload-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 720 },
          bgcolor: "common.white",
          borderRadius: "32px",
          boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.12)",
          p: 3,
          border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        }}
      >
        <Stack spacing={1.5}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h4" color="common.surfaceVariant">
                Bulk Upload
              </Typography>
              <Button
                variant="outlined"
                onClick={handleDownloadTemplate}
                startIcon={<SvgColor src="/assets/icons/download.svg" />}
                sx={{ height: 40 }}
              >
                Download .XLSX Template
              </Button>
            </Stack>

            <Typography variant="bodyLarge" color="common.surfaceVariant">
              Fill the <u>XLSX template</u> with the relevant links and drop in
              the box
            </Typography>
          </Stack>

          <Stack
            {...getRootProps()}
            alignItems="center"
            justifyContent="center"
            sx={{
              height: 320,
              p: 1.5,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              cursor: !file ? "pointer" : "default",
              backgroundColor: "#F2F2F2",
              transition: "all 0.2s ease-in-out",
              border: (theme) =>
                `2px solid ${
                  isDragActive ? theme.palette.primary.main : "transparent"
                }`,
              "&:hover": {
                boxShadow: "inset 0px 4px 16px 0px rgba(0, 0, 0, 0.08)",
                backgroundColor: "common.white",
                "& .upload-file-icon": {
                  color: "#F2F2F2",
                },
              },
            }}
            spacing={2}
          >
            <input {...getInputProps()} />
            {file ? (
              <Stack alignItems="center" spacing={2}>
                <SvgColor
                  src="/assets/icons/check-circle.svg"
                  sx={{ width: 96, height: 96 }}
                  color="#99FF99"
                />

                <Stack spacing={0.5} alignItems="center">
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: 20,
                      backgroundColor: "rgba(38, 38, 38, 0.05)",
                      border: (theme) =>
                        `1px solid ${theme.palette.common.mainBorder}`,
                    }}
                  >
                    <Typography
                      variant="bodyLargeStrong"
                      color="common.surfaceVariant"
                    >
                      {file.name}
                    </Typography>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      size="small"
                    >
                      <Iconify icon="mdi:close" />
                    </IconButton>
                  </Stack>
                  <Typography
                    variant="bodyRegular"
                    color="common.surfaceVariant"
                  >
                    File ready for upload. Click Submit to process your videos.
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <>
                <SvgColor
                  className="upload-file-icon"
                  src={
                    isDragActive
                      ? "/assets/icons/drag-file.svg"
                      : "/assets/icons/summarize.svg"
                  }
                  sx={{
                    width: 96,
                    height: 96,
                    filter: "drop-shadow(0px 1px 2.5px rgba(0,0,0,0.2))",
                    transition: "all 0.2s ease-in-out",
                    color: "#FFF",
                  }}
                />

                <Stack spacing={0.5} alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Typography
                      variant="bodyLargeStrong"
                      color="common.surfaceVariant"
                    >
                      Add Filled
                    </Typography>
                    <Box
                      sx={{
                        px: 2.5,
                        py: 1,
                        borderRadius: 20,
                        backgroundColor: "rgba(38, 38, 38, 0.05)",
                        border: (theme) =>
                          `1px solid ${theme.palette.common.mainBorder}`,
                      }}
                    >
                      <Typography
                        variant="bodyLargeStrong"
                        color="common.surfaceVariant"
                        sx={{
                          opacity: 0.7,
                        }}
                      >
                        .xlsx
                      </Typography>
                    </Box>
                    <Typography
                      variant="bodyLargeStrong"
                      color="common.surfaceVariant"
                    >
                      Template Here
                    </Typography>
                  </Stack>

                  <Typography
                    variant="bodyRegular"
                    color="common.surfaceVariant"
                  >
                    Drag and drop, or click to select from your computer&apos;s
                    files.
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>

          <LoadingButton
            fullWidth
            variant="outlined"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Box>
    </MuiModal>
  );
}
