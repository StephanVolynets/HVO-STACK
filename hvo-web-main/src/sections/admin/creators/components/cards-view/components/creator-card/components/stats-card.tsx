import SvgColor from "@/components/svg-color";
import { Button, Stack, Typography } from "@mui/material";
import { getColor, getFollowUpText, getTitleText } from "../../../helpers";

export enum StatsMode {
  Queue = "Queue",
  InProgress = "In Progress",
  Completed = "Completed",
}

type Props = {
  mode: StatsMode;
  todaysCount: number;
  videosCount: number;
};

export default function StatsCard({ mode, todaysCount, videosCount }: Props) {
  return (
    <Stack flex={1} sx={{ borderTop: `4px solid ${getColor(mode)}` }} p={2}>
      {/* Top */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          whiteSpace: "nowrap",
          flexWrap: "nowrap",
          minWidth: 0,
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ minWidth: 0, flexShrink: 1 }}
        >
          <Typography
            variant="bodyRegular"
            fontWeight="bold"
            color={getColor(mode)}
            noWrap
            sx={{ minWidth: 0 }}
          >
            {todaysCount}
          </Typography>
          <Typography
            variant="bodyRegular"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
          >
            {getFollowUpText(mode)}
          </Typography>
        </Stack>

        <Button
          variant="text"
          sx={{
            border: "1px solid #E6E6E6",
            px: 1.5,
            py: 0.5,
            height: 24,
            whiteSpace: "nowrap",
            minWidth: "auto",
            flexShrink: 0,
          }}
          startIcon={
            <SvgColor
              src={`/assets/icons/open-link.svg`}
              color="black"
              sx={{ width: 12, height: 12 }}
            />
          }
        >
          <Typography variant="caption" noWrap>
            View All
          </Typography>
        </Button>
      </Stack>

      {/* Middle */}
      <Stack flex={1} alignItems="center" justifyContent="center">
        <Typography variant="bodyRegular">{getTitleText(mode)}</Typography>
        <Typography variant="display1" fontWeight={700} color={getColor(mode)}>
          {videosCount}
        </Typography>
      </Stack>
    </Stack>
  );
}
