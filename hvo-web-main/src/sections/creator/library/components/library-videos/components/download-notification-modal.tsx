import { Modal } from "@/components/mui";
import { Stack, Typography, Link } from "@mui/material";
import Iconify from "@/components/iconify";

type Props = {
  open: boolean;
  onClose: () => void;
  email: string;
};

export default function DownloadNotificationModal({ open, onClose, email }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        sx={{
          width: { xs: "90vw", sm: "70vw" },
          display: "flex",
          backgroundColor: "white",
          borderRadius: 4,
        }}
        p={4}
        spacing={3}
        alignItems="center"
      >
        <Iconify icon="mdi:email-outline" width={64} height={64} sx={{ color: "text.secondary" }} />

        <Stack spacing={1} alignItems="center">
          <Typography variant="h3" textAlign="center">
            You will receive a .ZIP on
          </Typography>

          <Typography
            variant="h4"
            sx={{
              backgroundColor: "#F5F5F5",
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            {email}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          It might take up to 5 minutes in order for us to send you the files, if you don&apos;t get them, please try again or{" "}
          <Link
            href="#"
            underline="always"
            onClick={(e) => {
              e.preventDefault(); /* Add contact support handler */
            }}
          >
            contact support
          </Link>
        </Typography>
      </Stack>
    </Modal>
  );
}
