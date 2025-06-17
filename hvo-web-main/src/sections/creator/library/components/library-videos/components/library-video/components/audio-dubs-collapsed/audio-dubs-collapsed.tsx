import { Box, Stack, Typography } from "@mui/material";
import AudioDubItem from "./components/audio-dub-item";
import { AudioDubPhase, AudioDubStatus, LibraryAudioDubDTO } from "hvo-shared";

type Props = {
  isVisible: boolean;
  audioDubs: LibraryAudioDubDTO[];
  isVideoPending: boolean;
};

export default function AudioDubsCollapsed({
  isVisible,
  audioDubs,
  isVideoPending,
}: Props) {
  const maxVisibleItems = 5;
  const hiddenItemCount = audioDubs?.length - maxVisibleItems;

  return (
    <Stack
      direction="row"
      sx={{
        backgroundColor: "common.white",
        borderRadius: "100px",
        border: "solid 1px #E6E6E6",
        height: "49px",
        opacity: isVisible ? 1 : 0,
        // visibility: isVisible ? "visible" : "hidden",
        transition: "opacity 0.25s ease",
      }}
      p={0.5}
      spacing={1}
      alignItems="center"
    >
      {audioDubs
        .sort((a, b) => {
          // Primary sort: completed/approved items first
          const aCompleted =
            a.status === AudioDubStatus.COMPLETED ||
            (a.status === AudioDubStatus.REVIEW && !!a.approved);
          const bCompleted =
            b.status === AudioDubStatus.COMPLETED ||
            (b.status === AudioDubStatus.REVIEW && !!b.approved);

          if (aCompleted !== bCompleted) {
            return aCompleted ? -1 : 1;
          }

          // Secondary sort: by ID for stable ordering
          return a.id - b.id;
        })
        .slice(0, maxVisibleItems)
        .map((audioDub) => (
          <AudioDubItem
            audioDub={audioDub}
            key={audioDub.id}
            isVideoPending={isVideoPending}
          />
        ))}
      {hiddenItemCount > 0 && (
        <Box
          display="flex"
          sx={{
            backgroundColor: "#EFEFEF",
            borderRadius: "100px",
            px: 1.5,
            py: 0.5,
          }}
          alignItems="center"
        >
          <Typography variant="h5">{`${hiddenItemCount}+`}</Typography>
        </Box>
      )}
    </Stack>
  );
}
