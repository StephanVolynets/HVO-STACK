import Image from "@/components/image";
import { Box, Stack, Typography } from "@mui/material";
import {
  AudioDubPhase,
  AudioDubStatus,
  LibraryAudioDubDTO,
  TaskAudioDubDTO,
} from "hvo-shared";
import { getStatusIndicatorColor, mapProgressToNumber } from "./utils";
import SvgColor from "@/components/svg-color";
import { FlagEmoji } from "@/components/flag-emoji";

type Props = {
  // audioDubStatus: AudioDubStatus;
  // audioDubProgress: AudioDubProgress;
  audioDub: LibraryAudioDubDTO | TaskAudioDubDTO;
  showLanguageText?: boolean;
  isVideoPending?: boolean;
};

export default function AudioDubItem({ audioDub, showLanguageText }: Props) {
  return (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        backgroundColor:
          audioDub.status === AudioDubStatus.COMPLETED ||
          (audioDub.status === AudioDubStatus.REVIEW && !!audioDub.approved)
            ? "#00B280"
            : "#F2F2F2",
        borderRadius: "100px",
        opacity: audioDub.status === AudioDubStatus.PENDING ? 0.5 : 1,
      }}
      alignItems="center"
      p={0.5}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Box
          display="flex"
          sx={{
            // width: 48,
            height: 32,
            px: 0.75,
            borderRadius: 130,
            backgroundColor: "common.white",
          }}
          alignItems="center"
          justifyContent="center"
          gap={0.5}
        >
          <FlagEmoji countryCode={audioDub.language.code} />
          {showLanguageText && (
            <Typography variant="subtitle2" fontSize={13}>
              {audioDub.language.name}
            </Typography>
          )}
        </Box>
      </Stack>

      <Box
        display="flex"
        sx={{
          borderRadius: "50%",
          backgroundColor: getStatusIndicatorColor(
            audioDub.status,
            !!audioDub.approved
          ),
          width: "32px",
          height: "32px",
        }}
        alignItems="center"
        justifyContent="center"
      >
        {audioDub.phase === AudioDubPhase.TRANSCRIPTION &&
          !audioDub.approved && (
            <SvgColor
              src={`/assets/icons/slow_motion_video.svg`}
              color="#333333"
              sx={{ width: 20, height: 20 }}
            />
          )}
        {audioDub.phase !== AudioDubPhase.TRANSCRIPTION &&
          !audioDub.approved && (
            <Typography variant="labelLarge" color="white" fontWeight={700}>
              {mapProgressToNumber(audioDub.phase)}
            </Typography>
          )}
        {(audioDub.status === AudioDubStatus.COMPLETED ||
          audioDub.status === AudioDubStatus.REVIEW) &&
          audioDub.approved && (
            <SvgColor
              src={`/assets/icons/check_circle.svg`}
              color="white"
              sx={{ width: 20, height: 20 }}
            />
          )}
      </Box>
    </Stack>
  );
}
