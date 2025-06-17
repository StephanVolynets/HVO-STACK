import {
  Select,
  MenuItem,
  Box,
  Stack,
  Avatar,
  Typography,
  FormControl,
  Skeleton,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { forwardRef } from "react";
import SvgColor from "@/components/svg-color";
import { useStaffContext } from "../../../contexts/staff-context";
import { STAFF_TYPES, StaffType } from "hvo-shared";

export const CustomSelectArrowIcon = forwardRef(function CustomIcon(
  props,
  ref
) {
  return (
    <Box
      ref={ref}
      {...props}
      mr={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      aria-hidden="true" // Hide from screen readers
    >
      <SvgColor src="/assets/icons/select-arrow.svg" />
    </Box>
  );
});

const PHASES = [
  { id: StaffType.TRANSCRIPTOR, label: "Transcription" },
  { id: StaffType.TRANSLATOR, label: "Translation" },
  { id: StaffType.VOICE_ACTOR, label: "Recording" },
  { id: StaffType.AUDIO_ENGINEER, label: "Mixing" },
];

export default function PhaseFilter() {
  const { phase, setPhase } = useStaffContext();

  const handleFilterChange = (event: SelectChangeEvent) => {
    setPhase(event.target.value);
  };

  return (
    <FormControl sx={{ width: "141px" }}>
      <Select
        value={phase?.toString() || "-1"}
        onChange={handleFilterChange}
        IconComponent={CustomSelectArrowIcon}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 500 },
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
        sx={{
          "& .MuiSelect-select": {
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "24px",
            px: 2,
            py: 1.5,
          },
          borderRadius: 100,
        }}
      >
        <MenuItem value="-1">
          <Stack
            display="flex"
            direction="row"
            alignItems="center"
            spacing={0.5}
          >
            <Typography fontSize={16} fontWeight={600}>
              All Phases
            </Typography>
          </Stack>
        </MenuItem>
        <Divider />
        {PHASES.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            <Stack
              display="flex"
              direction="row"
              alignItems="center"
              spacing={0.5}
              minWidth={0}
            >
              <Typography
                fontSize={16}
                fontWeight={600}
                maxWidth="100%"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                display="block"
              >
                {option.label}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
