import { Stack } from "@mui/material";
import { InboxAudioDubDTO, TaskType } from "hvo-shared";
import CollapsedPhase from "./components/collapsed-phase";
type Props = {
  audioDub: InboxAudioDubDTO;
  isVisible: boolean;
  hideTranscript?: boolean;
};
export default function PhasesCollapsed({ audioDub, isVisible, hideTranscript }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      alignItems="center"
      spacing={1.25}
    >
      {audioDub.tasks
        .filter((task) => !hideTranscript || task.type !== TaskType.TRANSCRIPTION)
        .map((task) => (
          <CollapsedPhase phase={task} key={task.id} />
        ))}
    </Stack>
  );
}
