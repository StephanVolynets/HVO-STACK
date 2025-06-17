import CustomChip from "@/components/custom-chip/custom-chip";
import SvgColor from "@/components/svg-color";
import { Avatar, IconButton, Typography } from "@mui/material";

import { Stack } from "@mui/material";
import { CreatorSummaryDTO } from "hvo-shared";

interface Props {
  creatorSummary: CreatorSummaryDTO;
}

export default function CompactRow({ creatorSummary }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        p: 1,
        borderRadius: "100px",
      }}
    >
      <Stack direction="row" spacing={0.5} flex={1} alignItems="center">
        <Avatar
          src={creatorSummary.photo_url || ""}
          sx={{ width: 32, height: 32 }}
        />
        <Typography variant="bodyRegular">
          @{creatorSummary.username}
        </Typography>
      </Stack>
      <Stack alignItems="center" flex={1}>
        <Typography variant="bodyRegular" fontWeight={700}>
          {creatorSummary.videos_in_queue}
        </Typography>
      </Stack>
      <Stack alignItems="center" flex={1}>
        <Typography variant="bodyRegular" fontWeight={700}>
          {creatorSummary.videos_in_progress}
        </Typography>
      </Stack>
      <Stack alignItems="center" flex={1}>
        <Typography variant="bodyRegular" fontWeight={700} color="green.main">
          {creatorSummary.videos_completed}
        </Typography>
      </Stack>
      <Stack
        alignItems="center"
        justifyContent="flex-end"
        flex={1}
        direction="row"
        spacing={0.5}
      >
        <IconButton
          sx={{
            p: 0.5,
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
          }}
        >
          <SvgColor
            src="/assets/icons/edit-2.svg"
            sx={{ width: 16, height: 16 }}
          />
        </IconButton>
        <IconButton
          sx={{
            p: 0.5,
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
          }}
        >
          <SvgColor
            src="/assets/icons/more-horizontal.svg"
            sx={{ width: 16, height: 16 }}
          />
        </IconButton>
        <IconButton
          sx={{
            p: 0.5,
            border: "1px solid #FFCCCC",
            "&:hover": {
              backgroundColor: "rgba(178, 0, 0, 0.05)",
            },
            "&:active": {
              backgroundColor: "rgba(178, 0, 0, 0.1)",
            },
          }}
        >
          <SvgColor
            src="/assets/icons/bin-outlined.svg"
            color="#4D0000"
            sx={{ width: 16, height: 16 }}
          />
        </IconButton>
      </Stack>
    </Stack>
  );
}
