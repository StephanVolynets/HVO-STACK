import ExpectedByPicker from "@/components/audio-dub/components/phases-expanded/components/expanded-phase/components/expected-by-picker";
import StaffSelect from "@/components/audio-dub/components/phases-expanded/components/expanded-phase/components/staff-select";
import { getStatusColor } from "@/components/audio-dub/components/utils";
import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { Box, Typography, Stack } from "@mui/material";
import { TaskStatus, TaskType } from "hvo-shared";
import { useEffect, useState } from "react";

type Props = {
  onUpdateChange: (
    taskId: number,
    key: "staffIds" | "expectedDeliveryDate",
    value: any
  ) => void;
};

export default function TranscriptionTask({ onUpdateChange }: Props) {
  // const { selectedVideo } = useSelectedInboxVideo();
  const { selectedVideo } = useInboxContext();

  const [isDateReset, setIsDateReset] = useState(false);
  const [localDate, setLocalDate] = useState<Date | null | undefined>(
    selectedVideo?.transcriptionTask?.expected_delivery_date
  );

  console.log(
    "selectedVideo?.transcriptionTask?.expected_delivery_date",
    selectedVideo?.transcriptionTask?.expected_delivery_date
  );

  useEffect(() => {
    setLocalDate(selectedVideo?.transcriptionTask?.expected_delivery_date);
  }, [selectedVideo?.transcriptionTask?.expected_delivery_date]);

  const handleExpectedDateChange = (date: Date) => {
    onUpdateChange(
      selectedVideo!.transcriptionTask.id,
      "expectedDeliveryDate",
      date
    );
    setIsDateReset(false);
    setLocalDate(date);
  };

  const handleStaffChange = (staffIds: number[]) => {
    onUpdateChange(selectedVideo!.transcriptionTask.id, "staffIds", staffIds);
    // onUpdateChange(phase.id, "expectedDeliveryDate", null);
    setIsDateReset(true);
    // setLocalDate(null);
  };

  const transcriptionTask =
    selectedVideo?.transcriptionTask || selectedVideo?.audioDubs[0]?.tasks[0];

  console.log("transcriptionTask", transcriptionTask, selectedVideo?.audioDubs);

  if (!transcriptionTask) return null;

  return (
    <Box
      sx={{
        border: "1px solid #E6E6E6",
        backgroundColor: "common.white",
        borderRadius: "16px",
        px: 2,
        py: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Number and Title */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              borderRadius: "50%",
              width: 32,
              height: 32,
              backgroundColor: getStatusColor(transcriptionTask.status),
              color:
                transcriptionTask.status === TaskStatus.PENDING
                  ? "#262626"
                  : "white",
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="labelLarge"
              fontWeight={700}
              sx={{
                color:
                  transcriptionTask.status === TaskStatus.PENDING
                    ? "#262626"
                    : "common.white",
              }}
            >
              1
            </Typography>
          </Box>
          <Typography variant="bodyRegularStrong">Transcription</Typography>
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={1} alignItems="center">
          <ExpectedByPicker
            value={localDate ?? null}
            onChange={handleExpectedDateChange}
            disabled={transcriptionTask.status === TaskStatus.COMPLETED}
            isDateReset={isDateReset}
          />
          <StaffSelect
            taskId={transcriptionTask.id}
            onChange={handleStaffChange}
            mode="single"
            expanded
            disabled={transcriptionTask.status === TaskStatus.COMPLETED}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
