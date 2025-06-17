import {
  Select,
  MenuItem,
  Box,
  Stack,
  Typography,
  FormControl,
  Skeleton,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { forwardRef, useMemo } from "react";
import SvgColor from "@/components/svg-color";
import { useGetAllLanguages } from "@/use-queries/common";
import { FlagEmoji } from "@/components/flag-emoji";
import { useStaffContext } from "../../../contexts/staff-context";

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

export default function LanguageFilter() {
  const { languageId, setLanguageId } = useStaffContext();

  const { languages: _langaugesOptions, isLoading: isLoadingLanguages } =
    useGetAllLanguages();
  const languageOptions = useMemo(
    () =>
      _langaugesOptions?.map((language) => ({
        id: language.id,
        label: language.name,
        icon: <FlagEmoji countryCode={language.code} size={15} />,
      })) || [],
    [_langaugesOptions]
  );

  const handleFilterChange = (event: SelectChangeEvent) => {
    setLanguageId(Number(event.target.value));
  };

  if (isLoadingLanguages) {
    return (
      <Box sx={{ width: "152px" }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={57}
          sx={{ borderRadius: 100 }}
          animation="wave"
        />
      </Box>
    );
  }

  return (
    <FormControl sx={{ width: "170px" }}>
      <Select
        value={languageId?.toString() || "-1"}
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
        <MenuItem value={-1}>
          <Stack
            display="flex"
            direction="row"
            alignItems="center"
            spacing={0.5}
          >
            {/* <Avatar sx={{ width: 20, height: 20 }} /> */}
            <Typography fontSize={16} fontWeight={600}>
              All Languages
            </Typography>
          </Stack>
        </MenuItem>
        <Divider />
        {languageOptions.map((option) => (
          <MenuItem key={option.id} value={option.id.toString()}>
            <Stack
              display="flex"
              direction="row"
              alignItems="center"
              spacing={0.5}
              minWidth={0}
            >
              {option.icon}
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
