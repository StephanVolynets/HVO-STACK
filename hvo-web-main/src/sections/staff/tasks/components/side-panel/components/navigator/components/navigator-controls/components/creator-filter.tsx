import {
  Select,
  MenuItem,
  Box,
  Stack,
  Avatar,
  Typography,
  FormControl,
  Skeleton,
} from "@mui/material";
import { SelectOption, TASKS_FILTER_OPTIONS } from "hvo-shared";
import { forwardRef, useEffect, useMemo, useState } from "react";
import SvgColor from "@/components/svg-color";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { useGetStaffCreators } from "@/use-queries/staff";
import { SelectChangeEvent } from "@mui/material";

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

export default function CreatorFilter() {
  const { creators, isLoading } = useGetStaffCreators();
  const { creatorId, setCreatorId } = useStaffContext();

  const creatorOptions = useMemo(
    () =>
      creators?.map(
        (creator) =>
          ({
            id: creator.id,
            label: creator.full_name,
            icon: creator.photo_url || "",
          } as SelectOption)
      ) || [],
    [creators]
  );

  useEffect(() => {
    if (creators && creators?.length > 0) {
      setCreatorId(Number(creators?.[0].id));
    }
  }, [creators]);

  const handleFilterChange = (event: SelectChangeEvent) => {
    setCreatorId(Number(event.target.value));
  };

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
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
    <FormControl fullWidth>
      <Select
        size="medium"
        value={creatorId?.toString() || ""}
        onChange={handleFilterChange}
        IconComponent={CustomSelectArrowIcon}
        sx={{
          height: 56,
          "& .MuiSelect-select": {
            fontSize: "16px",
            // fontWeight: filter !== "all_videos" ? 600 : "inherit",
            fontWeight: 600,
            pl: 3,
            // pr: "24px", // Adjust right padding to accommodate the icon
          },
          borderRadius: 100,
        }}
      >
        {creatorOptions.map((option) => (
          <MenuItem key={option.id} value={option.id.toString()}>
            <Stack
              display="flex"
              direction="row"
              alignItems="center"
              spacing={0.5}
            >
              <Avatar
                src={option.icon as string}
                sx={{ width: 20, height: 20 }}
              />
              <Typography fontSize={16} fontWeight={600}>
                {option.label}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
