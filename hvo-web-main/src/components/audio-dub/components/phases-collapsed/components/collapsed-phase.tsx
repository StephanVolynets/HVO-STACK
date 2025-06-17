import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { InboxTaskDTO, TaskStatus, toDisplayName } from "hvo-shared";
import { getStatusColor, getStepNumber } from "../../utils";
import { capitalize } from "lodash";
import { CustomChip } from "@/components/custom-chip";
import Iconify from "@/components/iconify";

type Props = {
  phase: InboxTaskDTO;
};

export default function CollapsedPhase({ phase }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ opacity: phase.status === TaskStatus.IN_PROGRESS ? "100%" : "50%" }}
    >
      {/* Phase number & name */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {/* Number */}
        <Box
          sx={{
            borderRadius: "50%",
            width: 32,
            height: 32,
            backgroundColor: getStatusColor(phase.status),
            color: phase.status === TaskStatus.PENDING ? "#262626" : "white",
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="labelLarge"
            fontWeight={700}
            sx={{ color: phase.status === TaskStatus.PENDING ? "#262626" : "common.white" }}
          >
            {getStepNumber(phase.type)}
          </Typography>
        </Box>

        {/* Name */}
        {phase.status === TaskStatus.IN_PROGRESS && (
          <Typography variant="bodyRegularStrong">{toDisplayName(phase.type)}</Typography>
        )}
      </Stack>

      {/* Staff */}
      <Stack
        direction="row"
        alignItems="center"
        p={0.5}
        spacing={0.25}
        sx={{
          borderRadius: 100,
          border: "solid 1px #E6E6E6",
        }}
      >
        {/* <Avatar
          src={phase.staffs[0]?.photo_url || ""}
          alt={phase.staffs[0]?.full_name}
          style={{ width: 22, height: 22 }}
        /> */}

        <Avatar
          src={phase.staffs[0]?.photo_url || ""}
          alt={phase.staffs[0]?.full_name}
          style={{ width: 22, height: 22 }}
        >
          {!phase.staffs[0]?.photo_url && (
            <Typography variant="captionRegular" fontWeight={700}>
              {phase.staffs[0]?.full_name?.charAt(0) || (
                <Box display="flex" sx={{ width: "100%", height: "100%" }} alignItems="center" justifyContent="center">
                  <Iconify icon="material-symbols-light:person-add" width={15} height={15} />
                </Box>
              )}
            </Typography>
          )}
        </Avatar>
        {phase.staffs.length > 1 && (
          <CustomChip
            //   label="2+"
            textVariant="bodySmallStrong"
            backgroundColor="#F4F4F4"
            wrapperSx={{
              py: "1.5px",
            }}
          >
            <Typography variant="bodySmallStrong">{`${phase.staffs.length}+`}</Typography>
          </CustomChip>
        )}
      </Stack>
    </Stack>
  );
}
