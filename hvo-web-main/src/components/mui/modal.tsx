import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal as MuiModal,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import { ReactElement, useState } from "react";
import { IconButton, Paper, paperClasses } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface Props {
  open: boolean;
  children?: ReactElement<any, any>;
  className?: string;
  onClose: () => void;
  closeButton?: boolean;
  backButton?: boolean;
  onBack?: () => void;
}

const Modal = ({ open, children, className, onClose, closeButton, onBack, backButton }: Props) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleCloseRequest = (event: any, reason: "backdropClick" | "escapeKeyDown") => {
    // if (reason === "backdropClick" || reason === "escapeKeyDown") {
    //   setConfirmDialogOpen(true); // Trigger confirmation dialog
    // } else {
    //   onClose();
    // }
    onClose();
  };

  return (
    <>
      <MuiModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleCloseRequest}
        closeAfterTransition
        // slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{
          display: "flex",
          zIndex: 1500,
          alignItems: "center",
          overflow: "scroll",

          justifyContent: "center",
          [`.${paperClasses.root}`]: {
            outlineStyle: "none",
          },
        }}
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            // backgroundColor: "transparent",
            borderRadius: "32px",
            backgroundColor: "white.main",
            boxShadow: "none",
          }}
        >
          <Box
            minHeight={0}
            className={className}
            overflow="auto"
            position="relative"
            maxHeight="100vh"
            sx={{ borderRadius: "32px" }}
          >
            {closeButton && (
              <IconButton
                id="closeButton"
                aria-label="Close"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  border: "1px solid #E6E6E6",
                  width: 48,
                  height: 48,
                }}
                onClick={onClose}
                size="large"
              >
                <CloseIcon sx={{ color: "#1A1A1A" }} />
              </IconButton>
            )}
            {backButton && (
              <IconButton
                id="closeButton"
                aria-label="Close"
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  zIndex: 1,
                  border: "1px solid #E6E6E6",
                  width: 48,
                  height: 48,
                }}
                onClick={() => {
                  if (onBack) {
                    onBack();
                  }
                }}
                size="large"
              >
                <ArrowBackIosNewIcon sx={{ color: "#1A1A1A" }} />
              </IconButton>
            )}

            {children}
          </Box>
          <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} sx={{ zIndex: 90000 }}>
            <DialogTitle>Confirm Close</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to close this modal? Unsaved changes will be lost.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
              <Button onClick={onClose} color="error">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </MuiModal>

      {/* Confirmation Dialog */}
    </>
  );
};

export default Modal;
