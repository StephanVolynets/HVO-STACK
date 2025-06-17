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
import { SelectOption } from "hvo-shared";
import { forwardRef, useEffect } from "react";
import SvgColor from "@/components/svg-color";
import { useGetYoutubeChannels } from "@/use-queries/video";
import { Controller, useFormContext } from "react-hook-form";

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
      aria-hidden="true"
    >
      <SvgColor src="/assets/icons/select-arrow.svg" />
    </Box>
  );
});

export default function ChannelSelector() {
  const { control, setValue, watch } = useFormContext();
  const { channels, isLoading } = useGetYoutubeChannels();
  const currentValue = watch("youtubeChannelId");

  const creatorOptions =
    channels?.map(
      (channel) =>
        ({
          id: channel.id,
          label: channel.title,
          icon: channel.id || "",
        } as SelectOption)
    ) || [];

  useEffect(() => {
    if (channels && channels.length > 0 && !currentValue) {
      setValue("youtubeChannelId", channels[0].id);
    }
  }, [channels, setValue, currentValue]);

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
    <Controller
      name="youtubeChannelId"
      control={control}
      render={({ field }) => (
        // <FormControl sx={{ width: "179px" }}>
        <FormControl sx={{ width: "250px" }}>
          <Select
            {...field}
            size="medium"
            IconComponent={CustomSelectArrowIcon}
            sx={{
              "& .MuiSelect-select": {
                fontSize: "16px",
                fontWeight: 600,
                p: 1,
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
                  <Typography fontSize={16} fontWeight={600} pl={0.5}>
                    {option.label}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
}
