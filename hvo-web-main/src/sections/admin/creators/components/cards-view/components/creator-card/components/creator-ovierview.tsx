import { usePopover } from "@/components/custom-popover";
import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { CreatorSummaryDTO } from "hvo-shared";

type Props = {
  creatorSummary: CreatorSummaryDTO;
};

export default function CreatorOverview({ creatorSummary }: Props) {
  const popover = usePopover();

  const isCreatorActive = true;

  return (
    <Stack p={2} alignItems="center">
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          onClick={popover.onOpen}
          sx={{
            border: "1px solid #E6E6E6",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            padding: "4px",
          }}
        >
          <Iconify icon="eva:more-horizontal-fill" />
        </IconButton>

        <Box
          sx={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: isCreatorActive ? "#00B280" : "orange",
          }}
        />
      </Stack>

      <Avatar
        alt={"Username"}
        src={undefined}
        sx={{ width: 80, height: 80, mt: 5, mb: "11px" }}
      />

      <Stack alignItems="center" spacing={0.5}>
        <Typography variant="bodyLargeStrong" fontWeight={600}>
          {creatorSummary.username}
        </Typography>

        <Stack
          direction="row"
          sx={{
            border: "1px solid #E6E6E6",
            borderRadius: "100px",
            px: 1.5,
            py: 0.5,
          }}
          alignItems="center"
          spacing={0.5}
        >
          <Iconify icon="logos:youtube-icon" color="red" />
          <Typography variant="caption" fontWeight={700}>
            2M
          </Typography>
        </Stack>

        {/* Languages */}
        <Stack
          direction="row"
          sx={{
            border: "1px solid #E6E6E6",
            borderRadius: "100px",
            px: 1.5,
            py: 0.5,
          }}
          alignItems="center"
          spacing={0.5}
        >
          <Box
            display="flex"
            sx={{
              borderRadius: "75px",
              backgroundColor: "#F2F2F2",
              px: 0.75,
              py: 0.25,
            }}
            alignItems="center"
            justifyContent="center"
          >
            <Iconify icon="twemoji:flag-for-flag-united-states" width={16} />
          </Box>

          <SvgColor
            src={`/assets/icons/record_voice_over.svg`}
            color="black"
            sx={{ width: 21, height: 16 }}
          />

          <Stack
            direction="row"
            sx={{
              backgroundColor: "#F2F2F2",
              borderRadius: "75px",
              px: 1.5,
              py: 0.5,
            }}
            spacing={0.5}
          >
            <Iconify icon="twemoji:flag-for-flag-portugal" width={16} />
            <Iconify icon="fxemoji:spanishflag" width={16} />
            <Iconify icon="twemoji:flag-for-flag-serbia" width={16} />
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            textOverflow: "ellipsis",
          }}
        >
          Some basic description goes here
        </Typography>
      </Stack>
    </Stack>
  );
}
