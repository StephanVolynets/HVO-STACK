import { CustomChip } from "@/components/custom-chip";
import { FlagEmoji } from "@/components/flag-emoji";
import { Box, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { InboxVideoDTO, StaffType } from "hvo-shared";

interface Props {
  video: InboxVideoDTO;
  isSelected: boolean;
  onClick: () => void;
}

export default function VideoItem({ video, isSelected, onClick }: Props) {
  return (
    <Tooltip title={video.title} arrow>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        py={0.5}
        pl={2}
        pr={0.5}
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
          {video.title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
              backgroundColor: "common.white",
              borderRadius: 100,
              // px: 1.5,
              // py: 0.75,
              py: 0.5,
              px: 1,
            }}
          >
            {video.audioDubs &&
              video.audioDubs
                .slice(0, 2)
                .map((audioDub, index) => (
                  <FlagEmoji
                    key={index}
                    countryCode={audioDub.language.code}
                    maxHeight={20}
                    size={24}
                  />
                ))}

            {video.audioDubs && video.audioDubs.length > 2 && (
              <CustomChip fontSize={8} fontWeight={700}>
                {video.audioDubs.length - 2}
              </CustomChip>
            )}
          </Stack>

          {/* {video.hasFeedback && (
                      <Box 
                          sx={{
                              width: 12,
                              height: 12,
                              borderRadius: 100,
                              backgroundColor: "#4285F4",
                              mr: 1,
                          }} 
                      />
                  )} */}
        </Stack>
      </Stack>
    </Tooltip>
  );
}

export const VideoItemSkeleton = () => {
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
