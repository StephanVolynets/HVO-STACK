import { Button, Box } from "@mui/material";
import { useLibraryContext } from "../../contexts/library-context";
import { useBoolean } from "@/hooks/use-boolean";
import DownloadNotificationModal from "../library-videos/components/download-notification-modal";
import { useAuthContext } from "@/auth/hooks";
import { downloadDubs } from "@/apis/video";

export function FloatingDownloadButton() {
  const { selectedVideos } = useLibraryContext();
  const { user } = useAuthContext();
  const showModal = useBoolean();

  if (selectedVideos.length === 0) {
    return null;
  }

  const handleDownload = async () => {
    try {
      const downloadUrl = await downloadDubs(selectedVideos);
      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Error downloading videos:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleDownload}
          sx={{
            borderRadius: "24px",
            color: "common.white",
            px: 4,
            py: 1.5,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          Download {selectedVideos.length}{" "}
          {selectedVideos.length === 1 ? "Video" : "Videos"}
        </Button>
      </Box>
    </>
  );
}
