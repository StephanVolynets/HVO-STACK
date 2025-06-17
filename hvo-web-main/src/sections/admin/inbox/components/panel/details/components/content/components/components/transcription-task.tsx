import ExpectedByPicker from "@/components/audio-dub/components/phases-expanded/components/expanded-phase/components/expected-by-picker";
import StaffSelect from "@/components/audio-dub/components/phases-expanded/components/expanded-phase/components/staff-select";
import { getStatusColor } from "@/components/audio-dub/components/utils";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { Box, Typography, Stack } from "@mui/material";
import { TaskStatus, TaskType } from "hvo-shared";
import { useEffect, useState } from "react";

type Props = {
  onUpdateChange: (taskId: number, key: "staffIds" | "expectedDeliveryDate", value: any) => void;
};

export default function TranscriptionTask({ onUpdateChange }: Props) {
  const { selectedVideo } = useSelectedInboxVideo();

  const [isDateReset, setIsDateReset] = useState(false);
  const [localDate, setLocalDate] = useState<Date | null | undefined>(
    selectedVideo?.transcriptionTask?.expected_delivery_date
  );

  useEffect(() => {
    console.log(
      "selectedVideo?.transcriptionTask?.expected_delivery_date",
      selectedVideo?.transcriptionTask?.expected_delivery_date
    );
    setLocalDate(selectedVideo?.transcriptionTask?.expected_delivery_date);
  }, [selectedVideo?.transcriptionTask?.expected_delivery_date]);

  const handleExpectedDateChange = (date: Date) => {
    onUpdateChange(selectedVideo!.transcriptionTask.id, "expectedDeliveryDate", date);
    setIsDateReset(false);
    setLocalDate(date);
  };

  const handleStaffChange = (staffIds: number[]) => {
    onUpdateChange(selectedVideo!.transcriptionTask.id, "staffIds", staffIds);
    // onUpdateChange(phase.id, "expectedDeliveryDate", null);
    setIsDateReset(true);
    // setLocalDate(null);
  };

  if (!selectedVideo?.transcriptionTask) return null;

  return (
    <Box
      sx={{
        border: "1px solid #E6E6E6",
        borderRadius: "16px",
        px: 2,
        py: 1,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        {/* Number and Title */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              borderRadius: "50%",
              width: 32,
              height: 32,
              backgroundColor: getStatusColor(selectedVideo.transcriptionTask.status),
              color: selectedVideo.transcriptionTask.status === TaskStatus.PENDING ? "#262626" : "white",
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="labelLarge"
              fontWeight={700}
              sx={{ color: selectedVideo.transcriptionTask.status === TaskStatus.PENDING ? "#262626" : "common.white" }}
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
            disabled={selectedVideo?.transcriptionTask.status === TaskStatus.COMPLETED}
            isDateReset={isDateReset}
          />
          <StaffSelect
            taskId={selectedVideo?.transcriptionTask?.id}
            onChange={handleStaffChange}
            mode="single"
            expanded
            disabled={selectedVideo?.transcriptionTask.status === TaskStatus.COMPLETED}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
