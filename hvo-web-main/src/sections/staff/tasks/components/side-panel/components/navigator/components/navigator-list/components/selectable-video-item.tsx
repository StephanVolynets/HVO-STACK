import { CustomChip } from "@/components/custom-chip";
import { FlagEmoji } from "@/components/flag-emoji";
import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import { paths } from "@/routes/paths";
import { Checkbox, Skeleton, Stack, Typography } from "@mui/material";
import { StaffType, StaffVideoDTO } from "hvo-shared";
import { useRouter } from "next/navigation";

interface Props {
  video: StaffVideoDTO;
  isChecked: boolean;
  staffType: StaffType;
  onCheckChange: (checked: boolean) => void;
}

export default function SelectableVideoItem({
  video,
  isChecked,
  onCheckChange,
  staffType,
}: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      // justifyContent="space-between"
      py={1}
      pl={2}
      pr={1}
      sx={{
        borderRadius: 100,
        border: (theme) =>
          `2px solid ${
            isChecked ? theme.palette.common.mainBorder : "transparent"
          }`,
        backgroundColor: isChecked ? "#F4F4F4" : "transparent",
        // Hover effect
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: isChecked ? "#F4F4F4" : "#F9F9F9", // Subtle hover effect
        },
        boxSizing: "border-box",
      }}
      spacing={1}
      onClick={() => onCheckChange(!isChecked)}
    >
      {/* <Stack direction="row" alignItems="center" spacing={1}> */}
      <Checkbox
        checked={isChecked}
        // onClick={handleCheckboxClick}
        // icon={<SvgColor src="/assets/icons/checkbox-unselected.svg" />}
        icon={
          <Iconify
            icon="mdi:checkbox-blank-circle-outline"
            height={24}
            width={24}
            color="primary.main"
          />
        }
        checkedIcon={
          <Iconify icon="ic:round-check-circle" height={24} width={24} />
        }
        sx={{
          p: 0.5,
          color: (theme) => theme.palette.text.secondary,
          "&.Mui-checked": {
            color: (theme) => theme.palette.primary.main,
          },
        }}
      />

      <Typography
        variant="bodyLargeStrong"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
        pr={1}
      >
        {video.title}
      </Typography>
      {/* </Stack> */}
      {staffType !== StaffType.TRANSCRIPTOR && (
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
      )}
    </Stack>
  );
}

export const VideoItemSkeleton = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py={1}
      pl={2}
      pr={1}
      sx={{
        borderRadius: 100,
      }}
    >
      <Skeleton variant="text" width="100%" height={28} />
    </Stack>
  );
};
