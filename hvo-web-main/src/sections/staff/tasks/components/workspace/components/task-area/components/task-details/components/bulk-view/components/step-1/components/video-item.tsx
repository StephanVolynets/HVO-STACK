import SvgColor from "@/components/svg-color";
import LanguagesChip from "@/sections/staff/tasks/components/side-panel/components/navigator/components/navigator-list/components/languages-chip";
import { Divider, IconButton, Stack, Typography } from "@mui/material";
import { StaffVideoDTO } from "hvo-shared";

interface Props {
  video: StaffVideoDTO;
  onDelete: () => void;
}

export default function VideoItem({ video, onDelete }: Props) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        borderRadius: "100px",
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        flex={1}
      >
        <Typography variant="bodyLargeStrong">{video.title}</Typography>
        <LanguagesChip video={video} />
      </Stack>
      <Stack direction="row" alignItems="center">
        <Divider orientation="vertical" />
        <IconButton
          onClick={(e) => {
            onDelete();
          }}
          sx={{
            borderRadius: 0,
            borderTopRightRadius: "100px",
            borderBottomRightRadius: "100px",
            height: "100%",
            px: 1.5,
          }}
        >
          <SvgColor
            src="/assets/icons/close.svg"
            color="primary.surface"
            sx={{ width: 24, height: 24 }}
          />
        </IconButton>
      </Stack>
    </Stack>
  );
}
