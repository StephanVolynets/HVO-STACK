import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { IconButton, InputAdornment, TextField, Box } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import SvgColor from "@/components/svg-color";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface ExpectedByPickerProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  disabled?: boolean;
  isDateReset?: boolean;
}

const CustomCalendarIcon = () => (
  <Box
    sx={{
      width: 16,
      height: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: -1,
    }}
  >
    <SvgColor src="/assets/icons/calendar.svg" />
  </Box>
);

export default function ExpectedByPicker({ value, onChange, disabled, isDateReset }: ExpectedByPickerProps) {
  console.log("isDateReset: ", isDateReset);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        disabled={disabled}
        slotProps={{
          textField: {
            size: "small",
            variant: "outlined",
            placeholder: "MM/DD/YY HH:mm",
            InputProps: {
              sx: {
                borderRadius: "24px",
                height: 32,
                width: 215,
                border: isDateReset ? "2px solid #FFA500" : "1px solid #E6E6E6",
                backgroundColor: isDateReset ? "#FEF6E5" : "common.white",
              },
            },
            sx: {
              "& .MuiInputBase-input": {
                fontSize: "14px",
              },
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                borderRadius: "8px",
              },
            },
          },
        }}
        slots={{
          openPickerIcon: CustomCalendarIcon,
        }}
        value={value ? dayjs.utc(value) : null}
        onChange={(newValue) => onChange(newValue ? newValue.toDate() : null)}
        ampm={true}
        timeSteps={{ minutes: 15 }}
        // sx={{
        //   "& .MuiOutlinedInput-root": {
        //     px: "4px",
        //     borderRadius: "8px",
        //     border: isDateReset ? "2px solid #FFA500" : "1px solid #E6E6E6",
        //     backgroundColor: isDateReset ? "#FEF6E5" : "common.white",
        //     pr: 2,
        //   },
        // }}
      />
    </LocalizationProvider>
  );
}
