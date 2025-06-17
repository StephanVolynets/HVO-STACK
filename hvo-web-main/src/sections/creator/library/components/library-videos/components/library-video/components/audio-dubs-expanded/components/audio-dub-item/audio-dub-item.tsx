import Image from "@/components/image";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import AudioDubStep from "./components/audio-dub-step";
import { AudioDubPhase, AudioDubStatus, LibraryAudioDubDTO } from "hvo-shared";
import SvgColor from "@/components/svg-color";
import { FlagEmoji } from "@/components/flag-emoji";
import { useEffect, useState } from "react";
import { getUploadFolder } from "@/apis/common";

type Props = {
  audioDub: LibraryAudioDubDTO;
  // selected: boolean;
  selectedDub: null | number;
  onSelectedDubChange: (selectedDub: null | number) => void;
};

export default function AudioDubItem({
  audioDub,
  selectedDub,
  onSelectedDubChange,
}: Props) {
  const [folderUrl, setFolderUrl] = useState<string | null>(null);

  const enablePreviewButton =
    (audioDub.status === AudioDubStatus.REVIEW ||
      audioDub.status === AudioDubStatus.COMPLETED) &&
    audioDub.approved;

  const isSelected = selectedDub === audioDub.id;

  useEffect(() => {
    const fetchFolderUrl = async () => {
      if (audioDub.approved && audioDub.final_folder_id) {
        try {
          const url = await getUploadFolder(audioDub.final_folder_id);
          setFolderUrl(url);
        } catch (error) {
          console.error("Error getting folder URL:", error);
        }
      }
    };

    fetchFolderUrl();
  }, [audioDub.approved, audioDub.final_folder_id]);

  const handleSelectDub = () => {
    if (!audioDub.approved) {
      return;
    }

    if (selectedDub === audioDub.id) {
      onSelectedDubChange(null);
    } else {
      onSelectedDubChange(audioDub.id);
    }
  };

  const handlePreviewClick = () => {
    if (!enablePreviewButton || !folderUrl) {
      return;
    }

    // Add logic to get and handle the folder URL here
    window.open(folderUrl, "_blank");
  };

  return (
    <Stack
      direction="row"
      sx={{
        borderRadius: "100px",
        backgroundColor: "#F8F8F8",
        // height: "48px",
        boxShadow: "0px 4px 16px 0px rgba(38, 38, 38, 0.05)",
      }}
      justifyContent="space-between"
      spacing={1}
    >
      <Stack flex={1} p={0.5} pr={0} spacing={1} direction="row">
        <Box
          p={0.5}
          sx={{
            borderRadius: "100px",
            backgroundColor: "white",
          }}
        >
          <Stack
            //   display="flex"
            direction="row"
            sx={{
              borderRadius: "100px",
              backgroundColor: isSelected ? "#E9E9E9" : "#F8F8F8",
              width: "200px",
              overflow: "hidden",
              cursor: audioDub.approved ? "pointer" : "default",
            }}
            alignItems="center"
            spacing={1}
            py={1}
            px={1}
            pl={1.5}
            onClick={handleSelectDub}
          >
            <Box
              display="flex"
              sx={{
                width: 32,
                height: 25,
              }}
              alignItems="center"
              justifyContent="center"
            >
              <FlagEmoji countryCode={audioDub.language.code} />
            </Box>

            <Typography
              variant="bodySmall"
              fontWeight={700}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {audioDub.language.name}
            </Typography>
          </Stack>
        </Box>

        <AudioDubStep
          stepPhase={AudioDubPhase.TRANSCRIPTION}
          currentProgress={audioDub.phase}
          status={audioDub.status}
          isApproved={!!audioDub.approved}
        />
        <AudioDubStep
          stepPhase={AudioDubPhase.TRANSLATION}
          currentProgress={audioDub.phase}
          status={audioDub.status}
          isApproved={!!audioDub.approved}
        />
        <AudioDubStep
          stepPhase={AudioDubPhase.VOICE_OVER}
          currentProgress={audioDub.phase}
          status={audioDub.status}
          isApproved={!!audioDub.approved}
        />
        <AudioDubStep
          stepPhase={AudioDubPhase.AUDIO_ENGINEERING}
          currentProgress={audioDub.phase}
          status={audioDub.status}
          isApproved={!!audioDub.approved}
        />
      </Stack>

      <IconButton
        size="small"
        sx={{
          border: "1px solid #E6E6E6",
          borderRadius: "50%",
          width: "57px",
          height: "57px",
          opacity: enablePreviewButton ? 1 : 0.5,
          backgroundColor: enablePreviewButton
            ? "common.green"
            : "common.white",
          "&:hover": {
            backgroundColor: enablePreviewButton ? "green.dark" : "inherit",
          },
          "&:active": {
            backgroundColor: enablePreviewButton ? "green.darker" : "inherit",
          },
        }}
        disabled={!enablePreviewButton}
        onClick={handlePreviewClick}
      >
        <SvgColor
          src={`/assets/icons/pop-out.svg`}
          color={enablePreviewButton ? "common.white" : "main.surface"}
          sx={{ width: 18, height: 18 }}
        />
      </IconButton>
    </Stack>
  );
}
