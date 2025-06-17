import { Box, Stack, Typography } from "@mui/material";
import { AudioDubPhase, AudioDubStatus } from "hvo-shared";
import {
  getNumberBackgroundColor,
  isStepCompleted,
  mapAudioDubProgressToDisplayName,
} from "../utils";
import {
  getProgressNumberColor,
  mapProgressToNumber,
} from "../../../../audio-dubs-collapsed/components/utils";
import SvgColor from "@/components/svg-color";

type Props = {
  stepPhase: AudioDubPhase;
  currentProgress: AudioDubPhase;
  status: AudioDubStatus;
  isApproved: boolean;
};

export default function AudioDubStep({
  stepPhase,
  currentProgress,
  status,
  isApproved,
}: Props) {
  console.log("statusTT -> ", currentProgress);
  return (
    <Stack
      flexGrow={1}
      direction="row"
      pr={2}
      spacing={1}
      alignItems="center"
      sx={{
        backgroundColor: "common.white",
        borderRadius: "100px",
      }}
    >
      <Box
        sx={{
          height: 49,
          width: 49,
          borderRadius: "50%",
          backgroundColor:
            status !== AudioDubStatus.REVIEW && stepPhase === currentProgress
              ? "#D0E1FD"
              : "transparent",
          // stepProgress === currentProgress && status === AudioDubStatus.IN_PROGRESS ? "#D0E1FD" : "transparent",
        }}
        p={0.5}
        display="flex"
        alignItems="center"
        // justifyContent="center"
        justifyContent="flex-start"
      >
        <Box
          display="flex"
          sx={{
            height: 41,
            width: 41,
            borderRadius: "100px",
            backgroundColor: getNumberBackgroundColor(
              currentProgress,
              stepPhase,
              status
            ),
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            color={getProgressNumberColor(stepPhase, currentProgress, status)}
            variant="labelLarge"
            // typography="label2"
            fontWeight={700}
          >
            {mapProgressToNumber(stepPhase)}
          </Typography>
        </Box>
      </Box>

      <Box flex={1} pl={1}>
        <Typography variant="bodySmall">
          {mapAudioDubProgressToDisplayName(stepPhase)}
        </Typography>
      </Box>

      <Stack
        sx={{
          width: 26,
          height: 12,
        }}
        alignItems="center"
      >
        {isStepCompleted(currentProgress, stepPhase, status, isApproved) && (
          <SvgColor
            src={`/assets/icons/double-ticks.svg`}
            color="common.green"
            sx={{ width: 32, height: 32 }}
          />
        )}
      </Stack>
    </Stack>
  );
}
