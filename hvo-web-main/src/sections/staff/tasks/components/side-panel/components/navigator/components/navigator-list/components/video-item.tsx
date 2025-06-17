import { CustomChip } from "@/components/custom-chip";
import { FlagEmoji } from "@/components/flag-emoji";
import { paths } from "@/routes/paths";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { StaffType, StaffVideoDTO } from "hvo-shared";
import { useRouter } from "next/navigation";
import LanguagesChip from "./languages-chip";

interface Props {
  video: StaffVideoDTO;
  isSelected: boolean;
  onClick: () => void;
  staffType: StaffType;
}

export default function VideoItem({
  video,
  isSelected,
  onClick,
  staffType,
}: Props) {
  const router = useRouter();

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
        {staffType !== StaffType.TRANSCRIPTOR && (
          <LanguagesChip video={video} />
          // <Stack
          //   direction="row"
          //   spacing={0.5}
          //   alignItems="center"
          //   sx={{
          //     border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
          //     backgroundColor: "common.white",
          //     borderRadius: 100,
          //     p: 0.5,
          //     pl: 1,
          //     ...(video.tasks.length === 1 && {
          //       pr: 1,
          //     }),
          //   }}
          // >
          //   <Stack direction="row">
          //     {video.tasks.slice(0, 2).map((task, index) => (
          //       <FlagEmoji
          //         key={index}
          //         countryCode={task.languageCode}
          //         maxHeight={16}
          //         size={16}
          //       />
          //     ))}
          //   </Stack>
          //   {video.tasks.length > 2 && (
          //     <CustomChip>
          //       <Typography sx={{ fontSize: 8, fontWeight: 700 }}>
          //         {video.tasks.length - 2}
          //       </Typography>
          //     </CustomChip>
          //   )}
          // </Stack>
        )}

        {video.hasActiveFeedback && (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 100,
              backgroundColor: "#4285F4",
              mr: 1,
            }}
          />
        )}
      </Stack>
    </Stack>
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
