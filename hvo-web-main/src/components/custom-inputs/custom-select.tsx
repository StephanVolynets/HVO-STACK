import { Box, Divider, MenuItem, Stack, SxProps, TextField, TextFieldProps, Theme, Typography } from "@mui/material";
import { SelectOption } from "hvo-shared";
import Image from "../image";
import { ReactNode } from "react";
import { PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER } from "next/dist/lib/constants";

type SelectProps<T> = TextFieldProps & {
  value: T | null;
  onChange: (value: T | null) => void;
  label?: string;
  noOptionSelectedValue?: string;
  disableNoOptionSelectedValue?: boolean;
  native?: boolean;
  maxHeight?: boolean | number;
  options: SelectOption[];
  children?: React.ReactNode;
  PaperPropsSx?: SxProps<Theme>;
  useIconAdornment?: boolean;
  sortAlphabetically?: boolean;
};

export function CustomSelect<T extends string | number>({
  value,
  noOptionSelectedValue = "All",
  disableNoOptionSelectedValue = false,
  onChange,
  label,
  native,
  maxHeight = 220,
  helperText,
  children,
  options,
  useIconAdornment,
  PaperPropsSx,
  sortAlphabetically,
  ...other
}: SelectProps<T>) {
  return (
    <TextField
      variant="outlined"
      select
      fullWidth
      value={value}
      SelectProps={{
        native,
        MenuProps: {
          disablePortal: true,
          PaperProps: {
            sx: {
              ...(!native && {
                maxHeight: typeof maxHeight === "number" ? maxHeight : "unset",
              }),
              ...PaperPropsSx,
            },
          },
        },
        sx: { textTransform: "capitalize" },
      }}
      label={value ? "" : label} // Remove label if a value is selected
      InputLabelProps={{
        shrink: false, // Prevent label from moving to the top
        sx: {
          visibility: value ? "hidden" : "visible", // Hide label when a value is selected
        },
      }}
      onChange={(e) => onChange(e.target.value as T)}
      // error={!!error}
      // helperText={error ? error?.message : helperText}
      {...other}
    >
      {!disableNoOptionSelectedValue && (
        <MenuItem key={-1} value={"-1" as T}>
          <Typography>{noOptionSelectedValue}</Typography>
        </MenuItem>
      )}
      <Divider />
      {options
        ?.sort((a, b) => (sortAlphabetically ? a?.label?.localeCompare(b?.label) : 0))
        .map((option) => (
          <MenuItem key={option.id} value={option.id} disabled={option.disabled}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {useIconAdornment && typeof option.icon === "string" ? (
                <Box
                  sx={{
                    minWidth: 24,
                    minHeight: 24,
                    borderRadius: "50%",
                    backgroundColor: option.icon ? "transparent" : "#ffcc80",
                  }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image
                    src={option.icon}
                    alt={""}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                    }}
                  />
                </Box>
              ) : (
                (option.icon as ReactNode)
              )}
              <Typography>{option.label}</Typography>
            </Stack>
          </MenuItem>
        ))}
    </TextField>
  );
}
