import { useGetVideoPreview } from "@/use-queries/video";
import {
  Button,
  CircularProgress,
  InputLabel,
  Modal,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import EmailChipInput from "./components/email-chip-input";
import SvgColor from "@/components/svg-color";
import { enqueueSnackbar } from "notistack";
import { getShareToken } from "@/apis/video";
import { ShareVideoDTO } from "hvo-shared";
import { paths } from "@/routes/paths";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ShareModal({ open, onClose }: Props) {
  const { video } = useGetVideoPreview();
  const [emails, setEmails] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyLink = async () => {
    const shareVideoData: ShareVideoDTO = {
      videoId: video?.id ?? 0,
    };
    const token = await getShareToken(shareVideoData);
    console.log("Token:", token);

    navigator.clipboard.writeText(paths.preview(video?.id!, token.token));
    enqueueSnackbar("Link copied to clipboard");
  };

  const handleShare = async () => {
    setIsSubmitting(true);
    try {
      const shareVideoData: ShareVideoDTO = {
        videoId: video?.id ?? 0,
        emails: emails,
      };
      const token = await getShareToken(shareVideoData);
      console.log("Sharing video with:", emails);
    } catch (error) {
      console.error("Error sharing video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDoneClick = async () => {
    if (emails.length > 0) {
      await handleShare();
      setEmails([]);
      enqueueSnackbar(`Link sent to ${emails.length} emails`);
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        spacing={3}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "flex-start",
          width: 720,
          p: 3,
          borderRadius: "32px",
          border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
          bgcolor: "common.white",
          boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.12)",
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4" color="common.surfaceVariant">
            Share Preview
          </Typography>
          <Typography variant="bodyLarge" color="common.surfaceVariant">
            {video?.title}
          </Typography>
        </Stack>

        <Stack spacing={0.5} sx={{ width: "100%" }}>
          <InputLabel
            htmlFor="email"
            sx={{
              fontSize: 16,
              fontWeight: 400,
              color: "primary.surface",
              "&:after": {
                content: '" *"',
                color: "primary.surface",
              },
            }}
          >
            Email
          </InputLabel>
          <EmailChipInput id="email" emails={emails} onChange={setEmails} />
          <Typography variant="bodyRegular" color="primary.surface">
            {" "}
            An email with the preview link will be automatically sent
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button
            variant="outlined"
            size="large"
            startIcon={<SvgColor src="/assets/icons/link.svg" />}
            onClick={handleCopyLink}
          >
            Copy link
          </Button>
          <Button size="large" variant="contained" onClick={handleDoneClick}>
            {isSubmitting ? (
              <>
                Done <CircularProgress size={16} sx={{ ml: 1 }} />
              </>
            ) : (
              "Done"
            )}
          </Button>
        </Stack>

        {/* <Button
            variant="contained"
            disabled={emails.length === 0 || isSubmitting}
            onClick={handleShare}
            fullWidth
            sx={{
              borderRadius: "100px",
              py: 1.5,
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </Button> */}
      </Stack>
    </Modal>
  );
}
