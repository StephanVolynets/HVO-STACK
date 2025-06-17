import { Box, Stack, Typography } from "@mui/material";
import {
  ChosenLanguage,
  useStaffContext,
} from "@/sections/staff/tasks/contexts/staff-context";
import { useMemo } from "react";
import LanguageItem from "./language-item";
import { useAuthContext } from "@/auth/hooks";
import { StaffType } from "hvo-shared";

interface Props {}

export default function Step2ChooseLangauge({}: Props) {
  const { profile } = useAuthContext();
  const {
    videos,
    checkedVideos,
    bulkMethod,
    setChosenLanguage,
    setBulkActionsStep,
  } = useStaffContext();

  const uniqueLanguages = useMemo(() => {
    const selectedVideos = videos.filter((video) =>
      checkedVideos.includes(video.id)
    );
    const languagesMap = new Map();

    if (profile?.staffType === StaffType.TRANSCRIPTOR) {
      // Transcriptor
      languagesMap.set(-1, {
        id: -1,
        language: "English",
        code: "US",
      });
    } else {
      // Translator, Actor, Engineer
      selectedVideos.forEach((video) => {
        video.tasks.forEach((task) => {
          if (!languagesMap.has(task.languageId)) {
            languagesMap.set(task.languageId, {
              id: task.languageId,
              language: task.languageName,
              code: task.languageCode,
            });
          }
        });
      });
    }

    return Array.from(languagesMap.values());
  }, [checkedVideos]);

  const handleLanguageClck = (language: ChosenLanguage) => {
    setChosenLanguage(language);
    setBulkActionsStep(2);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "160px",
          background:
            "linear-gradient(180deg, rgba(248, 248, 248, 0) 0%, #F8F8F8 100%)",
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      <Stack
        p={1.5}
        pt={2.5}
        spacing={1.25}
        justifyContent="center"
        sx={{
          flexGrow: 1,
          height: 0,
          overflowY: "auto",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: 8,
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
            margin: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 10,
            border: "2px solid transparent",
            backgroundClip: "content-box",
            transition: "background-color 0.2s ease",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          scrollbarWidth: "thin",
          msOverflowStyle: "none",
        }}
      >
        <Stack alignItems="center" pb={1}>
          <Typography fontSize={36} fontWeight={500} color="primary.surface">
            Select a language
          </Typography>
          <Typography fontSize={18} fontWeight={400} color="primary.surface">
            You can only bulk {bulkMethod} for one language at a time
          </Typography>
        </Stack>
        {uniqueLanguages.map((language) => (
          <LanguageItem
            key={language.id}
            language={language.language}
            code={language.code}
            id={language.id}
            setChosenLanguage={handleLanguageClck}
          />
        ))}
      </Stack>
    </Box>
  );
}
