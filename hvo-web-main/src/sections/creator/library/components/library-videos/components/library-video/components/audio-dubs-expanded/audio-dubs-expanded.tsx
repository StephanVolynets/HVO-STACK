import { Stack } from "@mui/material";
import AudioDubItem from "./components/audio-dub-item/audio-dub-item";
import { AudioDubStatus, LibraryAudioDubDTO } from "hvo-shared";

type Props = {
  audioDubs: LibraryAudioDubDTO[];
  selectedDub: null | number;
  onSelectedDubChange: (selectedDub: null | number) => void;
};

export default function AudioDubsExpanded({
  audioDubs,
  selectedDub,
  onSelectedDubChange,
}: Props) {
  return (
    <Stack spacing={1} mt={1}>
      {audioDubs
        .sort((a, b) => {
          // Primary sort: completed status (completed first)
          const aCompleted = a.status === AudioDubStatus.COMPLETED;
          const bCompleted = b.status === AudioDubStatus.COMPLETED;

          if (aCompleted !== bCompleted) {
            return aCompleted ? -1 : 1;
          }

          // Secondary sort: by ID
          return a.id - b.id;
        })
        .map((audioDub) => (
          <AudioDubItem
            audioDub={audioDub}
            key={audioDub.id}
            selectedDub={selectedDub}
            onSelectedDubChange={onSelectedDubChange}
          />
        ))}
    </Stack>
  );
}
