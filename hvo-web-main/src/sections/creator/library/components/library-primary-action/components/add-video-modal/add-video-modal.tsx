import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  IconButton,
  Stack,
  Typography,
  Modal as MuiModal,
  Modal,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Iconify from "@/components/iconify";
import VideoUploadForm from "./components/single-file-upload/video-upload-form";
import { addVideo } from "@/apis/video";
import { AddVideoDTO } from "hvo-shared";
import { useAuthContext } from "@/auth/hooks";
import SvgColor from "@/components/svg-color";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormData = {
  id: string;
  data?: AddVideoDTO;
  isValid?: boolean;
};

export default function MultipleVideoUploadModal({ open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [forms, setForms] = useState<FormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const previousFormsLength = useRef(forms.length);
  const { user } = useAuthContext();

  const handleAddForm = () => {
    setForms((prev) => [...prev, { id: uuidv4() }]);
  };

  const handleRemoveForm = (id: string) => {
    setForms((prev) => prev.filter((form) => form.id !== id));
  };

  const handleFormSubmitReady = useCallback(
    async (formId: string, isValid: boolean, data: AddVideoDTO) => {
      console.log("We have a ready one: ", formId, isValid, data);
      setForms((prev) =>
        prev.map((form) =>
          form.id === formId ? { ...form, isValid, data } : form
        )
      );
    },
    []
  );

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      const validForms = forms.filter((form) => form.isValid && form.data);

      if (validForms.length === 0) {
        enqueueSnackbar("No valid forms to submit", { variant: "warning" });
        return;
      }

      const results = Promise.all(
        validForms.map(async (form) => {
          try {
            if (form.data) {
              await addVideo(form.data, user?.email);
              return true;
            }
            return false;
          } catch (error) {
            console.error(`Error submitting form ${form.id}:`, error);
            return false;
          }
        })
      );

      let message = "Submission received. Will appear shortly.";
      // if (validForms.length > 1) {
      //   message = `Successfully uploaded ${validForms.length} videos. You will be notified by email once they are ready.`;
      // } else {
      //   message = `Successfully uploaded 1 video. You will be notified by email once it is ready.`;
      // }

      enqueueSnackbar(message, { variant: "success" });
      onClose();

      // const successCount = results.filter(Boolean).length;

      // if (successCount === validForms.length) {
      //   enqueueSnackbar(`Successfully uploaded ${successCount} videos!`, { variant: "success" });
      //   onClose();
      // } else {
      //   enqueueSnackbar(`${successCount} of ${validForms.length} videos uploaded successfully`, { variant: "warning" });
      // }
    } catch (error) {
      console.error("Error submitting forms:", error);
      enqueueSnackbar("Error uploading videos", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(scrollLeft + 30 < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check
      return () => scrollContainer.removeEventListener("scroll", checkScroll);
    }
  }, [checkScroll]);

  // Scroll effect
  useEffect(() => {
    if (
      forms.length > previousFormsLength.current &&
      scrollContainerRef.current
    ) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
    previousFormsLength.current = forms.length;
  }, [forms.length]);

  // Modal open/close effect
  useEffect(() => {
    if (!open) {
      setForms([]);
    } else {
      setForms([{ id: uuidv4() }]);
    }
  }, [open]);

  const areAllFormsReady =
    forms.length > 0 && forms.every((form) => form.isValid);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(7px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2.5,
        // py: 0.5,
      }}
    >
      <Stack
        sx={{
          px: "70px",
          display: "flex",
          flex: 1,
          alignItems: "center",
          position: "relative",
          pointerEvents: "none",
          "& > *": {
            pointerEvents: "auto",
          },
          overflow: "hidden",
        }}
        spacing={1.75 - 0.5}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "100%",
            overflowX: "auto",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            "& > *": {
              pointerEvents: "auto",
            },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            position: "relative",
            // pl: "350px",
            // pr: "350px",
            borderRadius: "24px",
            p: 0.5,
            maxHeight: "80%",
          }}
          ref={scrollContainerRef}
        >
          {forms.map((form, index) => (
            <VideoUploadForm
              key={form.id}
              formId={form.id}
              videoIndex={index}
              handleAddForm={handleAddForm}
              handleRemoveForm={() => handleRemoveForm(form.id)}
              // showRemoveButton={forms[0].id !== form.id}
              onSubmitReady={handleFormSubmitReady}
              canRemove={forms.length > 1}
            />
          ))}
        </Stack>

        {/* {showLeftGradient && (
          <Box
            sx={{
              position: "absolute",
              left: 70,
              top: 0,
              bottom: 70,
              width: "70px",
              background:
                "linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {showRightGradient && (
          <Box
            sx={{
              position: "absolute",
              right: 70,
              top: 0,
              bottom: 70,
              width: "70px",
              background:
                "linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )} */}

        <Button
          variant="contained"
          size="extraLarge"
          sx={{
            // width: "432px",
            px: "32px",
          }}
          onClick={handleSubmitAll}
          disabled={isSubmitting || forms.length === 0 || !areAllFormsReady}
        >
          {isSubmitting
            ? "Uploading..."
            : // : `Submit ${forms.length} Video${forms.length !== 1 ? "s" : ""}`}
              `Submit ${forms.length} Video${forms.length !== 1 ? "s" : ""}`}
        </Button>

        <IconButton
          sx={{
            position: "absolute",
            top: 0 + 4, // +4 is 4 px for the py of 0.5
            right: 0,
            // border: "1px solid #E6E6E6",
            width: "56px",
            height: "56px",
            backgroundColor: "common.white",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
          size="large"
          onClick={handleAddForm}
          title="Add video"
          disabled={isSubmitting}
        >
          <SvgColor src="/assets/icons/add.svg" />
        </IconButton>
      </Stack>
    </Modal>
  );
}
