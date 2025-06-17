import { Controller, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import { Theme, SxProps } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { ListItemIcon, Stack, Typography } from "@mui/material";
import { SelectOption } from "hvo-shared";
import Image from "@/components/image";
import { ReactNode } from "react";
import Iconify from "../iconify";
import { FlagEmoji } from "../flag-emoji";

// ----------------------------------------------------------------------

type RHFSelectProps = TextFieldProps & {
  name: string;
  native?: boolean;
  maxHeight?: boolean | number;
  options: SelectOption[];
  children?: React.ReactNode;
  PaperPropsSx?: SxProps<Theme>;
  useIconAdornment?: boolean;
  sortAlphabetically?: boolean;
};

export function RHFSelect({
  name,
  native,
  maxHeight = 220,
  helperText,
  children,
  options,
  useIconAdornment,
  PaperPropsSx,
  sortAlphabetically,
  ...other
}: RHFSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: {
              disablePortal: true,
              PaperProps: {
                sx: {
                  ...(!native && {
                    maxHeight:
                      typeof maxHeight === "number" ? maxHeight : "unset",
                  }),
                  ...PaperPropsSx,
                },
              },
            },
            sx: { textTransform: "capitalize" },
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {options
            ?.sort((a, b) =>
              sortAlphabetically ? a?.label?.localeCompare(b?.label) : 0
            )
            .map((option) => (
              <MenuItem
                key={option.id}
                value={option.id}
                disabled={option.disabled}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {useIconAdornment && typeof option.icon === "string" ? (
                    <Box
                      sx={{
                        minWidth: 24,
                        minHeight: 24,
                        borderRadius: "50%",
                        backgroundColor: option.icon
                          ? "transparent"
                          : "#ffcc80",
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
      )}
    />
  );
}

// ----------------------------------------------------------------------

type RHFMultiSelectProps = FormControlProps & {
  name: string;
  label?: string;
  chip?: boolean;
  checkbox?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  // options: {
  //   label: string;
  //   value: string;
  // }[];
  options: SelectOption[];
  useIconAdornment?: boolean;
  sortAlphabetically?: boolean;
  maxHeight?: number;
};

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  helperText,
  useIconAdornment,
  sortAlphabetically,
  maxHeight = 300,

  ...other
}: RHFMultiSelectProps) {
  const { control } = useFormContext();

  const renderValues = (selectedIds: any[]) => {
    const selectedItems = options.filter((item) =>
      selectedIds?.includes(item.id)
    );

    if (!selectedItems?.length && placeholder) {
      return <Box sx={{ color: "text.disabled" }}>{placeholder}</Box>;
    }

    // if (chip) {
    //   return (
    //     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
    //       {selectedItems.map((item) => (
    //         <Chip key={item.value} size="small" label={item.label} />
    //       ))}
    //     </Box>
    //   );
    // }

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
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {selectedItems.map((item, index) => renderIcon(item.icon))}
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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...other}>
          {label && <InputLabel id={name}> {label} </InputLabel>}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            id={`multiple-${name}`}
            labelId={name}
            label={label}
            renderValue={renderValues}
            MenuProps={{
              disablePortal: true,
              PaperProps: {
                sx: {
                  maxHeight,
                },
              },
            }}
          >
            {options.map((option) => {
              const selected = field.value?.includes(option.id);

              return (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  disabled={option.disabled}
                >
                  <Stack
                    flex={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {useIconAdornment && renderIcon(option.icon)}
                      <Typography variant="bodySmall">
                        {option.label}
                      </Typography>
                    </Stack>
                    {selected && <Iconify icon="mdi:close" sx={{ ml: 0.5 }} />}
                  </Stack>
                </MenuItem>
              );
            })}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
