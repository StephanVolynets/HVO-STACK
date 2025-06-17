import {
  Box,
  Divider,
  MenuItem,
  Select,
  Stack,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
  Typography,
} from "@mui/material";
import { SelectOption } from "hvo-shared";
import Image from "../image";
import { ReactNode } from "react";
import { PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER } from "next/dist/lib/constants";
import { CustomChip } from "../custom-chip";

type SelectProps<T> = TextFieldProps & {
  value: T[];
  onChange: (value: T[]) => void;
  label?: string;
  placeholder?: string;
  noOptionSelectedValue?: string;
  native?: boolean;
  maxHeight?: number;
  options: SelectOption[];
  children?: React.ReactNode;
  PaperPropsSx?: SxProps<Theme>;
  useIconAdornment?: boolean;
  sortAlphabetically?: boolean;
};

export function CustomMultipleSelect<T extends string | number>({
  value,
  noOptionSelectedValue = "All",
  onChange,
  label,
  placeholder,
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
  const renderValues = (selectedIds: any[]) => {
    const selectedItems = options.filter((item) => selectedIds?.includes(item.id));

    if (!selectedItems?.length && placeholder) {
      return <Box sx={{ color: "text.disabled" }}>{placeholder}</Box>;
    }
    // return selectedItems.map((item) => item.label).join(", ");

    if (selectedItems.length === 1) {
      return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {renderIcon(selectedItems[0].icon)}
          <Typography variant="bodySmall">{selectedItems[0].label}</Typography>
        </Stack>
      );
    } else {
      return (
        <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {selectedItems.map((item, index) => renderIcon(item.icon))}
          </Stack>

          <CustomChip textVariant="bodySmallStrong" textColor="#4D0000" backgroundColor="#FCF3F2">
            {selectedItems.length}
          </CustomChip>
        </Stack>
      );
    }
  };

  const renderIcon = (icon: any) => {
    return (
      <>
        {typeof icon === "string" ? (
          <Box
            sx={{
              minWidth: 24,
              minHeight: 24,
              borderRadius: "50%",
              backgroundColor: icon ? "transparent" : "#ffcc80",
            }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            key={icon}
          >
            <Image
              src={icon}
              alt={""}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
              }}
            />
          </Box>
        ) : (
          (icon as ReactNode)
        )}
      </>
    );
  };

  const handleChange = (event: any) => {
    const { value } = event.target;
    onChange(value);
  };

  return (
    <Select
      multiple
      size="small"
      displayEmpty={!!placeholder}
      id={`multiple-${name}`}
      label={label}
      renderValue={renderValues}
      value={value}
      onChange={handleChange}
      MenuProps={{
        disablePortal: true,
        PaperProps: {
          sx: {
            maxHeight: maxHeight,
          },
        },
      }}
    >
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
    </Select>
  );
}
