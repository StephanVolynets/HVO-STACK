import { updateTaskStaff } from "@/apis/task";
import { AudioDubNew } from "@/components/audio-dub";
import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { Box, Button, Stack, Typography } from "@mui/material";
import { UpdateTaskStaffDTO, updateTaskStaffDTOSchema } from "hvo-shared";
import { useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { set } from "lodash";
import ConfirmChanges from "./confirm-changes";
import TranscriptionTask from "./components/transcription-task";

export default function LanguagesContent() {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedVideo } = useSelectedInboxVideo();
  const [changes, setChanges] = useState<UpdateTaskStaffDTO>({ updates: [] });
  const [resetKey, setResetKey] = useState(0);

  const [isSaveInProgress, setIsSaveInProgress] = useState<boolean>(false);

  const totalChanges = useMemo(() => {
    return changes.updates.reduce((count, update) => {
      let taskChanges = 0;
      if (update.staffIds && update.staffIds.length > 0) {
        taskChanges += 1; // Count staff changes
      }
      // Count date changes, including resetting to null
      // if (update.expectedDeliveryDate !== undefined) {
      //   taskChanges += 1;
      // }
      return count + taskChanges;
    }, 0);
  }, [changes.updates]);

  const hasMissingDueDate = useMemo(() => {
    return changes.updates.some((update) => {
      // Check if there are staff changes and no due date
      return (
        (update.staffIds?.length > 0 || update.staffIds === null) &&
        !update.expectedDeliveryDate
      );
    });
  }, [changes.updates]);

  const handleUpdateChange = (
    taskId: number,
    key: "staffIds" | "expectedDeliveryDate",
    value: number[] | Date
  ) => {
    setChanges((prev) => {
      const existingTaskIndex = prev.updates.findIndex(
        (update) => update.taskId === taskId
      );

      // Update existing task
      if (existingTaskIndex !== -1) {
        const updatedTask = {
          ...prev.updates[existingTaskIndex],
          [key]: value,
        };
        return {
          updates: [
            ...prev.updates.slice(0, existingTaskIndex),
            updatedTask,
            ...prev.updates.slice(existingTaskIndex + 1),
          ],
        };
      }

      // Add new task
      const newTask = {
        taskId,
        staffIds: [],
        expectedDeliveryDate: null,
        [key]: value,
      };
      return {
        updates: [...prev.updates, newTask],
      };
    });
  };
  const handleSaveChanges = async () => {
    // Validate the DTO using Zod
    const parsedDTO = updateTaskStaffDTOSchema.safeParse(changes);

    if (!parsedDTO.success) {
      console.error("Validation failed:", parsedDTO.error.errors);
      alert("Validation errors occurred. Please review your changes.");
      return;
    }

    // Submit the DTO to the backend
    try {
      setIsSaveInProgress(true);
      await updateTaskStaff(parsedDTO.data); // Submit to API
      enqueueSnackbar("Staff Assigned!", { variant: "success" });
      setChanges({ updates: [] }); // Clear local changes
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaveInProgress(false);
    }
  };

  const handleDiscardChanges = () => {
    setChanges({ updates: [] }); // Clear local changes
    // refetch();
    setResetKey((prevKey) => prevKey + 1);
  };

  return (
    <Stack
      flex={1}
      sx={{
        backgroundColor: "transparent",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        flex={1}
        p={2}
        spacing={1}
        sx={{
          overflow: "auto",
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
        }}
      >
        <TranscriptionTask onUpdateChange={handleUpdateChange} />

        {selectedVideo?.audioDubs.map((audioDub) => (
          <AudioDubNew
            audioDub={audioDub}
            key={`${audioDub.id}-${resetKey}`}
            onUpdateChange={handleUpdateChange}
            hideTranscript
          />
        ))}
      </Stack>

      {/* Save or Discard changes */}
      {changes.updates.length > 0 && (
        <ConfirmChanges
          count={changes.updates.length}
          handleDiscardChanges={handleDiscardChanges}
          handleSaveChanges={handleSaveChanges}
          saveLoading={isSaveInProgress}
          hasMissingDueDate={hasMissingDueDate}
        />
      )}
    </Stack>
  );
}
