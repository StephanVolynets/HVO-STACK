import { CustomChip } from "@/components/custom-chip";
import { FlagEmoji } from "@/components/flag-emoji";
import { Stack, Typography } from "@mui/material";
import { StaffVideoDTO } from "hvo-shared";

interface Props {
  video: StaffVideoDTO;
}

export default function LanguagesChip({ video }: Props) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        backgroundColor: "common.white",
        borderRadius: 100,
        p: 0.5,
        pl: 1,
        ...(video.tasks.length === 1 && {
          pr: 1,
        }),
      }}
    >
      <Stack direction="row">
        {video.tasks.length === 1 && video.tasks[0].languageId === -1 && (
          <FlagEmoji countryCode="US" maxHeight={16} size={16} />
        )}
        {video.tasks.slice(0, 2).map((task, index) => (
          <FlagEmoji
            key={index}
            countryCode={task.languageCode}
            maxHeight={16}
            size={16}
          />
        ))}
      </Stack>
      {video.tasks.length > 2 && (
        <CustomChip>
          <Typography sx={{ fontSize: 8, fontWeight: 700 }}>
            {video.tasks.length - 2}
          </Typography>
        </CustomChip>
      )}
    </Stack>
  );
}
