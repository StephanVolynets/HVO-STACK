import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Props {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  required?: boolean;
}

export default function RHFDatePicker({ name, label, helperText, required }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              {...field}
              value={field.value || null}
              onChange={(newValue) => field.onChange(newValue)}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    label={label}
                    error={!!error}
                    helperText={error ? error.message : helperText}
                    required={required}
                    fullWidth
                  />
                ),
              }}
              slotProps={{
                popper: {
                  disablePortal: true,
                  placement: "bottom-end",
                  // modifiers: [
                  //   {
                  //     name: "zIndex",
                  //     options: {
                  //       zIndex: 2000,
                  //     },
                  //   },
                  // ],
                },
              }}
            />
          </LocalizationProvider>
          {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
        </Stack>
      )}
    />
  );
}
