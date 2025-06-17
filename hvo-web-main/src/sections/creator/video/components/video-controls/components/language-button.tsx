import { FlagEmoji } from "@/components/flag-emoji";
import SvgColor from "@/components/svg-color";
import { Button, Stack } from "@mui/material";
import { PreviewAudioDubDTO } from "hvo-shared";

interface Props {
  languageCode: string;
  languageName: string;
  available: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function LanguageButton({
  languageCode,
  languageName,
  available,
  selected,
  onClick,
}: Props) {
  const startIcon = (
    <Stack direction="row" alignItems="center">
      {/* <SvgColor src="/assets/icons/audio.svg" sx={{ width: 24, height: 24 }} /> */}
      <FlagEmoji countryCode={languageCode} size={24} maxHeight={24} />
    </Stack>
  );

  return (
    <Button
      size="large"
      variant="outlined"
      startIcon={startIcon}
      onClick={onClick}
      sx={{
        ...(selected && {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          pointerEvents: "none",
          pointer: "default",
        }),
        ...(!available && {
          opacity: 0.5,
          pointerEvents: "none",
          pointer: "default",
        }),
      }}
    >
      {languageName}
    </Button>
  );
}
