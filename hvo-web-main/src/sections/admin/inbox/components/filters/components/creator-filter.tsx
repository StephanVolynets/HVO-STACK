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
} from "@mui/material";
import { SelectOption, TASKS_FILTER_OPTIONS } from "hvo-shared";
import { forwardRef, useEffect, useMemo, useState } from "react";
import SvgColor from "@/components/svg-color";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { useGetStaffCreators } from "@/use-queries/staff";
import { SelectChangeEvent } from "@mui/material";
import { useInboxContext } from "../../../contexts/inbox-context";
import { useGetAllCreatorsBasic } from "@/use-queries/creator";

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
  const { creatorId, setCreatorId } = useInboxContext();
  const { creatorsBasic: creators, isLoading } = useGetAllCreatorsBasic();

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

  // useEffect(() => {
  //   if (creators && creators?.length > 0) {
  //     setCreatorId(Number(creators?.[0].id));
  //   }
  // }, [creators]);

  const handleFilterChange = (event: SelectChangeEvent) => {
    setCreatorId(Number(event.target.value));
  };

  if (isLoading) {
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
    <FormControl sx={{ width: "152px" }}>
      <Select
        value={(creatorId || -1).toString()}
        onChange={handleFilterChange}
        IconComponent={CustomSelectArrowIcon}
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
              All Creators
            </Typography>
          </Stack>
        </MenuItem>
        <Divider />
        {creatorOptions.map((option) => (
          <MenuItem key={option.id} value={option.id.toString()}>
            <Stack
              display="flex"
              direction="row"
              alignItems="center"
              spacing={0.5}
              minWidth={0}
            >
              <Avatar
                src={option.icon as string}
                sx={{ width: 20, height: 20 }}
              />
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
