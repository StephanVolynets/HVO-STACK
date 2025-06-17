import {
  Box,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  Skeleton,
  Stack,
} from "@mui/material";
import VideoOverview from "./components/video-overview";
import { useBoolean } from "@/hooks/use-boolean";
import AudioDubsCollapsed from "./components/audio-dubs-collapsed/audio-dubs-collapsed";
import SvgColor from "@/components/svg-color";
import AudioDubsExpanded from "./components/audio-dubs-expanded/audio-dubs-expanded";
import { LibraryVideoDTO, VideoStatus } from "hvo-shared";
import { useState } from "react";
import { useLibraryContext } from "../../../../contexts/library-context";
import { useGetFolderUrl } from "@/use-queries/storage";

type Props = {
  video: LibraryVideoDTO;
};

export default function LibraryVideo({ video }: Props) {
  const { folderLink } = useGetFolderUrl(video.deliverables_folder_id);

  const handleOnFolderClick = () => {
    console.log("folderLink", video);
    if (folderLink) window.open(folderLink, "_blank");
  };
  const isExpanded = useBoolean();
  const { isDownloadResourcesEnabled, selectedVideos, handleVideoSelect } =
    useLibraryContext();
  const [selectedDub, setSelectedDub] = useState<null | number>(null);

  const title = selectedDub
    ? video.audioDubs.find((dub) => dub.id === selectedDub)?.translatedTitle
    : video.title;
  const description = selectedDub
    ? video.audioDubs.find((dub) => dub.id === selectedDub)
        ?.translatedDescription
    : video.description;

  return (
    <Box
      sx={{
        border: "1px solid #E6E6E6",
        borderRadius: "16px",
        backgroundColor: isExpanded.value ? "#F2F2F2" : "common.white",
        p: 1,
        transition: "background-color 0.5s ease",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {isDownloadResourcesEnabled && (
            <Checkbox
              checked={selectedVideos.includes(video.id)}
              onChange={() => handleVideoSelect(video.id, video.status)}
              disabled={video.status !== VideoStatus.COMPLETED}
              sx={{
                "& .MuiSvgIcon-root": {
                  borderRadius: "50%",
                  opacity: video.status !== VideoStatus.COMPLETED ? 0.25 : 1,
                  cursor:
                    video.status !== VideoStatus.COMPLETED
                      ? "not-allowed"
                      : "pointer",
                },
              }}
            />
          )}
          <VideoOverview
            id={video.id}
            title={title!}
            description={description}
            thumbnail_url={video.thumbnail_url}
            translatedView={!!selectedDub && isExpanded.value}
          />
        </Stack>
        {(video.isInitialized && (
          <Stack direction="row" spacing={1}>
            <AudioDubsCollapsed
              isVisible={!isExpanded.value}
              audioDubs={video.audioDubs}
              isVideoPending={video.status === VideoStatus.BACKLOG}
            />
            {isExpanded.value && (
              <IconButton
                size="small"
                sx={{
                  border: "1px solid #E6E6E6",
                  backgroundColor: "common.white",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                }}
                onClick={handleOnFolderClick}
              >
                <SvgColor src={`/assets/icons/folder.svg`} />
              </IconButton>
            )}
            <IconButton
              size="small"
              sx={{
                border: "1px solid #E6E6E6",
                backgroundColor: "common.white",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
              }}
              onClick={isExpanded.onToggle}
            >
              <SvgColor
                src={`/assets/icons/icon-down.svg`}
                color="black"
                sx={{
                  width: 18,
                  height: 18,
                  transform: isExpanded.value
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </IconButton>
          </Stack>
        )) || (
          <Skeleton variant="text" width={120} height={32} animation="wave" />
        )}
      </Stack>

      <Collapse in={isExpanded.value} timeout="auto" unmountOnExit>
        <AudioDubsExpanded
          audioDubs={video.audioDubs}
          selectedDub={selectedDub}
          onSelectedDubChange={setSelectedDub}
        />
      </Collapse>
    </Box>
  );
}
