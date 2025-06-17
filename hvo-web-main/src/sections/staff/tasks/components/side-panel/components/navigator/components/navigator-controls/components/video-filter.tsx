import { Select, MenuItem, Box, Typography } from "@mui/material";
import { TASKS_FILTER_OPTIONS } from "hvo-shared";
import { forwardRef, useState } from "react";
import SvgColor from "@/components/svg-color";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";

const CustomIcon = forwardRef(function CustomIcon(props, ref) {
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

export default function VideoFilter() {
  const { activeFilter, setActiveFilter } = useStaffContext();

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setActiveFilter(selectedFilter);
  };

  return (
    <Select
      size="medium"
      value={activeFilter}
      onChange={handleFilterChange}
      IconComponent={CustomIcon}
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
      {TASKS_FILTER_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Typography fontSize={16} fontWeight={600}>
            {option.label}
          </Typography>
        </MenuItem>
      ))}
    </Select>
  );
}
