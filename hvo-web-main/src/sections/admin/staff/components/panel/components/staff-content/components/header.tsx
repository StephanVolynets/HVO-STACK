import { CustomChip } from "@/components/custom-chip";
import { FlagEmoji } from "@/components/flag-emoji";
import SvgColor from "@/components/svg-color";
import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
import { useStaffContext } from "@/sections/admin/staff/contexts/staff-context";
import { formatDueDate } from "@/sections/staff/tasks/components/workspace/components/task-area/components/task-details/components/task-resources/utils";
import { useGetFolderUrl } from "@/use-queries/storage";
import {
  Avatar,
  Button,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";

import { Stack } from "@mui/material";
import { StaffType } from "hvo-shared";

const formatStaffType = (type: StaffType | undefined): string => {
  if (!type) return "";

  const typeMap: Record<StaffType, string> = {
    [StaffType.VOICE_ACTOR]: "Voice Actor",
    [StaffType.TRANSLATOR]: "Translator",
    [StaffType.AUDIO_ENGINEER]: "Audio Engineer",
    [StaffType.TRANSCRIPTOR]: "Transcriptor",
  };

  return typeMap[type] || type;
};

const getStaffTypeIcon = (type: StaffType | undefined): string => {
  if (!type) return "/assets/icons/staff/mic.svg";

  const iconMap: Record<StaffType, string> = {
    [StaffType.VOICE_ACTOR]: "/assets/icons/staff/mic.svg",
    [StaffType.TRANSLATOR]: "/assets/icons/staff/translate.svg",
    [StaffType.AUDIO_ENGINEER]: "/assets/icons/staff/tune.svg",
    [StaffType.TRANSCRIPTOR]: "/assets/icons/staff/transcribe.svg",
  };

  return iconMap[type] || "/assets/icons/staff/mic.svg";
};

export default function StaffContentHeader() {
  const { selectedStaff } = useStaffContext();

  return (
    <Stack
      spacing={3}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack spacing={1.5} direction="row" alignItems="center">
        <Avatar
          src={selectedStaff?.photo_url || ""}
          sx={{ width: 64, height: 64 }}
        />
        <Typography variant="h3" color="primary.surface">
          {selectedStaff?.full_name}
        </Typography>
        <CustomChip
          backgroundColor="common.white"
          wrapperSx={{
            border: "1px solid #E6E6E6",
            py: 1,
            px: 2,
            height: "40px",
          }}
        >
          <Stack direction="row" spacing={0.5}>
            <SvgColor
              src={getStaffTypeIcon(selectedStaff?.staff_type)}
              color="primary.surface"
            />
            <Typography variant="bodyRegularStrong" color="primary.surface">
              {formatStaffType(selectedStaff?.staff_type)}
            </Typography>
          </Stack>
        </CustomChip>
        <CustomChip
          backgroundColor="common.white"
          wrapperSx={{
            border: "1px solid #E6E6E6",
            py: 1,
            px: 2,
            height: "40px",
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <FlagEmoji
              countryCode={selectedStaff?.language.code || ""}
              maxHeight={16}
            />
            <Typography variant="bodyRegularStrong" color="primary.surface">
              {selectedStaff?.language.name}
            </Typography>
          </Stack>
        </CustomChip>
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <IconButton
          sx={{
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
            borderRadius: 100,
            width: 48,
            height: 48,
          }}
        >
          <SvgColor
            src="/assets/icons/more-horizontal.svg"
            color="primary.surface"
            sx={{ width: 24, height: 24, transform: "rotate(90deg)" }}
          />
        </IconButton>
      </Stack>
    </Stack>
  );
}
