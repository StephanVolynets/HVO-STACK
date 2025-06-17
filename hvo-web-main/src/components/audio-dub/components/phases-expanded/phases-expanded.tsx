import { InboxAudioDubDTO, TaskType } from "hvo-shared";
import { Stack } from "@mui/material";
import ExpandedPhase from "./components/expanded-phase/expanded-phase";

type Props = {
  audioDub: InboxAudioDubDTO;
  onUpdateChange: (taskId: number, key: "staffIds" | "expectedDeliveryDate", value: any) => void;
  hideTranscript?: boolean;
};

export default function PhasesExpanded({ audioDub, onUpdateChange, hideTranscript }: Props) {
  return (
    <Stack spacing={1} py={1}>
      {audioDub.tasks
        .filter((task) => !hideTranscript || task.type !== TaskType.TRANSCRIPTION)
        .map((phase) => (
          <ExpandedPhase phase={phase} key={phase.id} onUpdateChange={onUpdateChange} />
        ))}
    </Stack>
  );
}
