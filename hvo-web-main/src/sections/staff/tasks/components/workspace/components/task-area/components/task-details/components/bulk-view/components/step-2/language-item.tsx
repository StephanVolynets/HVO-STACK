import { Button, Stack, Typography } from "@mui/material";
import { FlagEmoji } from "@/components/flag-emoji";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { downloadBulkVideos } from "@/apis/staff";

interface Props {
  language: string;
  code: string;
  id: number;
  setChosenLanguage: (language: {
    id: number;
    name: string;
    code: string;
  }) => void;
}

export default function LanguageItem({
  language,
  code,
  id,
  setChosenLanguage,
}: Props) {
  const { setBulkState, checkedVideos } = useStaffContext();

  const handleClick = () => {
    setChosenLanguage({ id, name: language, code });
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Button
        variant="outlined"
        sx={{
          backgroundColor: "common.white",
          borderRadius: "100px",
          maxWidth: 600,
          width: 600,
          height: 84,
          p: 3,
          borderWidth: 0,
          "&:hover": {
            borderColor: "common.mainBorder",
            backgroundColor: "rgba(38, 38, 38, 0.02)",
          },
        }}
        onClick={handleClick}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" height={36}>
          <FlagEmoji countryCode={code} maxHeight={24} />
          <Typography fontSize={26} fontWeight={400} color="common.black">
            {language}
          </Typography>
        </Stack>
      </Button>
    </Stack>
  );
}
