import CustomChip from "@/components/custom-chip/custom-chip";
import { Typography } from "@mui/material";

import { Stack } from "@mui/material";

interface Props {
  creatorsCount: number;
}

export default function CompactHeader({ creatorsCount }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        p: 1,
        borderRadius: "100px",
        backgroundColor: "common.white",
        boxShadow:
          "0px 4px 16px 0px var(--Monochrome-Tint-Regular, rgba(38, 38, 38, 0.05))",
      }}
    >
      <Stack direction="row" spacing={0.5} flex={1} alignItems="center">
        <Typography variant="bodyRegular" fontWeight={700}>
          Creator
        </Typography>
        <CustomChip fontSize={14} fontWeight={700}>
          {creatorsCount}
        </CustomChip>
      </Stack>
      <Stack alignItems="center" flex={1}>
        <Typography variant="bodyRegular" fontWeight={700}>
          Queue
        </Typography>
      </Stack>
      <Stack alignItems="center" flex={1}>
        <Typography variant="bodyRegular" fontWeight={700}>
          In Progress
        </Typography>
      </Stack>
      <Stack alignItems="center" flex={1}>
        <Typography variant="bodyRegular" fontWeight={700} color="green.main">
          Done
        </Typography>
      </Stack>
      <Stack alignItems="center" flex={1}>
        {/* Empty */}
      </Stack>
    </Stack>
  );
}
