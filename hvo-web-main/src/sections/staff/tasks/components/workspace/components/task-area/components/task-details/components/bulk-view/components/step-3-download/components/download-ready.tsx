import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import Iconify from "@/components/iconify";

interface Props {
  downloadUrl: string;
  onBack: () => void;
}

export default function DownloadReady({ downloadUrl, onBack }: Props) {
  const handleDownload = () => {
    window.open(downloadUrl, "_blank");
  };

  return (
    <Stack
      flex={1}
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100%",
        position: "relative",
      }}
    >
      {/* <IconButton
        onClick={onBack}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "text.secondary",
        }}
      >
        <Iconify icon="mdi:arrow-left" width={24} height={24} />
      </IconButton> */}

      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "common.green",
          color: "common.white",
        }}
      >
        <Iconify icon="mdi:check" width={48} height={48} />
      </Box> */}
      <Box
        component="img"
        src="/assets/images/check-circle-green.png"
        sx={{
          width: 192,
          height: 192,
        }}
      />

      <Stack spacing={3} alignItems="center">
        <Stack spacing={0} alignItems="center">
          <Typography
            variant="h1"
            color="common.surfaceVariant"
            // sx={{ letterSpacing: "-0.01em" }}
          >
            Your download is ready
          </Typography>

          <Typography
            variant="bodyLarge"
            color="common.surfaceVariant"
            // color="text.secondary"
            textAlign="center"
            //   sx={{ lineHeight: 1.5 }}
          >
            Click the button below to download your files.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<Iconify icon="mdi:arrow-left" />}
          >
            Other Language
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:download" />}
            onClick={handleDownload}
            sx={{
              px: 3,
              py: 1.5,
            }}
          >
            Download Files
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
