import { Controller, useFormContext } from "react-hook-form";
import { Stack, Box, TextField, FormHelperText } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SvgColor from "@/components/svg-color";
import dayjs from "dayjs";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";

interface RHFDateTimePickerProps {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  required?: boolean;
  format?: string;
  disabled?: boolean;
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

export default function RHFDateTimePicker({
  name,
  label,
  helperText,
  required,
  format = "MM/DD/YYYY • hh:mm A",
  disabled,
}: RHFDateTimePickerProps) {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              disabled={disabled}
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                field.onChange(newValue ? newValue.toDate() : null);
              }}
              ampm={true}
              timeSteps={{ minutes: 15 }}
              // format={format}
              format="MM/DD/YYYY hh:mm A"
              views={["year", "month", "day", "hours", "minutes"]}
              open={open}
              onClose={() => setOpen(false)}
              slots={{
                openPickerIcon: () => null,
              }}
              slotProps={{
                textField: {
                  size: "small",
                  variant: "outlined",
                  // inputFormat: "MM/DD/YYYY hh:mm A",
                  placeholder: "MM/DD/YYYY • hh:mm A",
                  required,
                  error: !!error,
                  inputProps: {
                    placeholder: "MM/DD/YYYY • hh:mm A",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  },
                  InputProps: {
                    startAdornment: (
                      <Box
                        onClick={() => setOpen(true)}
                        sx={{
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: -1,
                          mr: 1,
                          cursor: "pointer",
                        }}
                      >
                        <SvgColor
                          src="/assets/icons/calendar.svg"
                          color="primary.main"
                          sx={{
                            opacity: 0.5,
                            ".MuiInputBase-root:hover &": {
                              opacity: 1,
                            },
                            ".MuiInputBase-root.Mui-focused &": {
                              opacity: 1,
                            },
                          }}
                        />
                      </Box>
                    ),
                    sx: {
                      p: 2,
                      boxSizing: "border-box",
                      backgroundColor: "#F2F2F2",
                      // border: "1px solid #F7F7F8",
                      border: (theme) =>
                        `1px solid ${theme.palette.common.mainBorder}`,
                      borderRadius: "100px",
                      "&:hover": {
                        backgroundColor: "common.white",
                        border: (theme) =>
                          `1px solid ${theme.palette.common.mainBorder}`,
                        boxShadow: "0 0 16px rgba(38, 38, 38, 0.05)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "common.white",
                        border: (theme) => `1px solid #262626`,
                      },
                    },
                  },
                  sx: {
                    "& .MuiInputBase-input": {
                      fontSize: "18px",
                      fontWeight: 400,
                      color: "primary.main",
                      p: 0,
                      "&::placeholder": {
                        color: "common.surfaceVariant",
                        opacity: 0.5,
                      },
                    },
                    "&:hover .MuiInputBase-input": {
                      opacity: 1,
                    },
                    "&.Mui-focused .MuiInputBase-input": {
                      opacity: 1,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  },
                },
                popper: {
                  sx: {
                    "& .MuiPaper-root": {
                      borderRadius: "8px",
                    },
                    zIndex: 9999,
                  },
                },
              }}
            />
          </LocalizationProvider>
          {helperText && !error && (
            <FormHelperText>{helperText}</FormHelperText>
          )}
        </Stack>
      )}
    />
  );
}
