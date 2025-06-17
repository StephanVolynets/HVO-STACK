import SvgColor from "@/components/svg-color";
import { useGetVideoPreview } from "@/use-queries/video";
import { Button, Stack, Box } from "@mui/material";
import LanguageButton from "./components/language-button";
import ScrollGradients from "./components/scroll-gradients";
import { useEffect, useRef } from "react";
import { useSelectedLanguage } from "../../hooks/use-selected-language";
import { useScrollGradients } from "../../hooks/use-scroll-gradients";

// Default English language option
const DEFAULT_ENGLISH_LANGUAGE = {
  id: -1,
  code: "GB",
  name: "English",
  available: true, // English is always available
};

export default function VideoControls() {
  const { video } = useGetVideoPreview();
  const { selectedLanguage, setSelectedLanguage } = useSelectedLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { showLeftGradient, showRightGradient } =
    useScrollGradients(scrollContainerRef);

  useEffect(() => {
    // Set English as default language when component mounts
    setSelectedLanguage(DEFAULT_ENGLISH_LANGUAGE.id);
  }, []);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={5}
      sx={{ width: "100%" }}
    >
      <Box
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          overflowX: "hidden",
          mr: 1,
          position: "relative",
        }}
      >
        <Box
          ref={scrollContainerRef}
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
            "&::-webkit-scrollbar": {
              height: 1,
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 0,
              // backgroundColor: "rgba(0,0,0,0.2)",
            },
            // pb: 1, // Add padding to ensure scrollbar doesn't overlap content
            py: "1px",
            pr: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              minWidth: "max-content",
              flexWrap: "nowrap",
            }}
          >
            <LanguageButton
              languageCode={DEFAULT_ENGLISH_LANGUAGE.code}
              languageName={DEFAULT_ENGLISH_LANGUAGE.name}
              selected={selectedLanguage === DEFAULT_ENGLISH_LANGUAGE.id}
              available={true}
              onClick={() => setSelectedLanguage(DEFAULT_ENGLISH_LANGUAGE.id)}
            />
            {video?.audioDubs
              .sort((a, b) => {
                // Primary sort: available languages first
                if (a.available !== b.available) {
                  return a.available ? -1 : 1;
                }

                // Secondary sort: by language ID for stable ordering
                return a.language.id - b.language.id;
              })
              .map((audioDub) => (
                <LanguageButton
                  key={audioDub.language.id}
                  languageCode={audioDub.language.code}
                  languageName={audioDub.language.name}
                  selected={selectedLanguage === audioDub.language.id}
                  available={audioDub.available}
                  onClick={() => setSelectedLanguage(audioDub.language.id)}
                />
              ))}
          </Stack>
        </Box>

        <ScrollGradients
          showLeftGradient={showLeftGradient}
          showRightGradient={showRightGradient}
        />
      </Box>

      {/* <Button
        size="large"
        variant="outlined"
        startIcon={<SvgColor src="/assets/icons/download.svg" />}
        sx={{ flexShrink: 0 }}
      >
        Download All
      </Button> */}
    </Stack>
  );
}
