import { CustomChip } from "@/components/custom-chip";
import { FlagEmoji } from "@/components/flag-emoji";
import { Avatar, Box, Skeleton, Stack, Typography } from "@mui/material";
import { InboxVideoDTO, StaffSummaryDTO, StaffType } from "hvo-shared";

interface Props {
  item: StaffSummaryDTO;
  isSelected: boolean;
  onClick: () => void;
}

export default function StaffItem({ item, isSelected, onClick }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py={1}
      pl={2}
      pr={1}
      spacing={1}
      sx={{
        borderRadius: 100,
        border: (theme) =>
          `2px solid ${
            isSelected ? theme.palette.common.mainBorder : "transparent"
          }`,
        backgroundColor: isSelected ? "#F4F4F4" : "transparent",
        // Hover effect
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: isSelected ? "#F4F4F4" : "#F9F9F9", // Subtle hover effect
        },
        boxSizing: "border-box",
      }}
      onClick={onClick}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Avatar src={item.photo_url || ""} sx={{ width: 24, height: 24 }} />
        <Typography
          variant="bodyLargeStrong"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
          pr={1}
        >
          {item?.full_name}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
            backgroundColor: "common.white",
            borderRadius: 100,
            px: 1.5,
            py: 0.75,
          }}
        >
          {item.language && (
            <FlagEmoji countryCode={item.language.code} maxHeight={20} />
          )}

          {/* {video.audioDubs && video.audioDubs.length > 2 && (
            <CustomChip fontSize={8} fontWeight={700}>
              {video.audioDubs.length - 2}
            </CustomChip>
          )} */}
        </Stack>
      </Stack>
    </Stack>
  );
}

export const StaffItemSkeleton = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py={1}
      pl={2}
      pr={1}
      sx={{
        borderRadius: 100,
      }}
    >
      <Skeleton variant="text" width="100%" height={28} />
    </Stack>
  );
};
