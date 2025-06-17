import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { InboxTaskDTO, TaskStatus, TaskType, toDisplayName } from "hvo-shared";
import { getStatusColor, getStepNumber } from "../../../utils";
import StaffSelect from "./components/staff-select";
import ExpectedByPicker from "./components/expected-by-picker";
import { useState } from "react";

type Props = {
  phase: InboxTaskDTO;
  onUpdateChange: (taskId: number, key: "staffIds" | "expectedDeliveryDate", value: any) => void;
};

export default function ExpandedPhase({ phase, onUpdateChange }: Props) {
  const [isDateReset, setIsDateReset] = useState(false);
  const [localDate, setLocalDate] = useState<Date | null | undefined>(phase.expected_delivery_date);

  const handleExpectedDateChange = (date: Date) => {
    setLocalDate(date);
    onUpdateChange(phase.id, "expectedDeliveryDate", date);
    setIsDateReset(false);
  };

  const handleStaffChange = (staffIds: number[]) => {
    onUpdateChange(phase.id, "staffIds", staffIds);
    // onUpdateChange(phase.id, "expectedDeliveryDate", null);
    setIsDateReset(true);
    // setLocalDate(null);
  };

  console.log("Inbox_dto: ", phase);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      {/* Phase number & name */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{ opacity: phase.status === TaskStatus.IN_PROGRESS ? "100%" : "50%" }}
        spacing={1}
      >
        {/* Number */}
        <Box
          sx={{
            borderRadius: "50%",
            width: 32,
            height: 32,
            backgroundColor: getStatusColor(phase.status),
            color: phase.status === TaskStatus.PENDING ? "#262626" : "white",
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="labelLarge"
            fontWeight={700}
            sx={{ color: phase.status === TaskStatus.PENDING ? "#262626" : "common.white" }}
          >
            {getStepNumber(phase.type)}
          </Typography>
        </Box>

        {/* Name */}
        <Typography variant="bodyRegularStrong">{toDisplayName(phase.type)}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.5}>
        <ExpectedByPicker
          value={localDate ?? null}
          onChange={handleExpectedDateChange}
          disabled={phase.status === TaskStatus.COMPLETED}
          isDateReset={isDateReset}
        />
        <StaffSelect
          taskId={phase?.id}
          onChange={handleStaffChange}
          mode={phase?.type === TaskType.VOICE_OVER ? "multiple" : "single"}
          expanded
          disabled={phase.status === TaskStatus.COMPLETED}
        />
      </Stack>
    </Stack>
  );
}
