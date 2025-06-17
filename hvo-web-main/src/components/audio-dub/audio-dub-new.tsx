import { useBoolean } from "@/hooks/use-boolean";
import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import { InboxAudioDubDTO, Role } from "hvo-shared";
import { useState } from "react";
import { FlagEmoji } from "../flag-emoji";
import { PhasesCollapsed } from "./components/phases-collapsed";
import SvgColor from "../svg-color";
import { PhasesExpanded } from "./components/phases-expanded";
import Iconify from "../iconify";
import ApproveDubModal from "./components/approve-dub-modal";
import { useAuthContext } from "@/auth/hooks";

type Props = {
  audioDub: InboxAudioDubDTO;
  onUpdateChange: (
    taskId: number,
    key: "staffIds" | "expectedDeliveryDate",
    value: any
  ) => void;
  hideTranscript?: boolean;
};
export default function AudioDubNew({
  audioDub,
  onUpdateChange,
  hideTranscript,
}: Props) {
  const { profile } = useAuthContext();
  const isExpanded = useBoolean();
  const isModalOpen = useBoolean();

  return (
    <Box
      sx={{
        border: "1px solid transparent",
        borderColor: isExpanded.value ? "transparent" : "#E6E6E6",
        backgroundColor: "common.white",
        // borderColor: isExpanded.value ? "transparent" : audioDub.approved ? "common.green" : "#E6E6E6",
        borderRadius: "16px",
        boxShadow: isExpanded.value
          ? "0px 4px 16px rgba(0, 0, 0, 0.08)"
          : "none",
        transition: "border-color 0.5s ease, box-shadow 0.5s ease",
        willChange: "border-color, box-shadow",
        px: 2,
        py: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Language */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <FlagEmoji
              countryCode={audioDub.language.code}
              size={38}
              maxHeight={38}
            />
            <Typography variant="bodyLargeStrong">
              {/* {isExpanded.value
                ? audioDub.language.name
                : `${audioDub.language.name.slice(0, 4)}...`} */}
              {audioDub.language.name}
            </Typography>
          </Stack>

          {/* Collapsed  */}
          <PhasesCollapsed
            audioDub={audioDub}
            isVisible={!isExpanded.value}
            hideTranscript={hideTranscript}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          {/* Assign Stuff Button Here */}
          {profile?.role === Role.ADMIN && (
            <IconButton
              size="small"
              sx={{
                border: `1px solid ${
                  audioDub.approved ? "#CCFFCC" : "#E6E6E6"
                }`,
                backgroundColor: "common.white",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                p: 0,
              }}
              onClick={isModalOpen.onTrue}
              disabled={!!audioDub.approved || audioDub.status !== "REVIEW"}
            >
              <Iconify
                icon="mdi:approve"
                color={audioDub.approved ? "common.green" : "main.dark"}
              />
            </IconButton>
          )}
          <IconButton
            size="small"
            sx={{
              border: "1px solid #E6E6E6",
              backgroundColor: "common.white",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              transform: isExpanded.value ? "rotate(180deg)" : "rotate(0deg)",
              p: 0,
            }}
            onClick={isExpanded.onToggle}
          >
            <SvgColor src={`/assets/icons/icon-down.svg`} />
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={isExpanded.value} timeout="auto" unmountOnExit>
        {/* <AudioDubsExpanded audioDubs={video.audioDubs} /> */}
        <PhasesExpanded
          audioDub={audioDub}
          onUpdateChange={onUpdateChange}
          hideTranscript={hideTranscript}
        />
      </Collapse>

      <ApproveDubModal
        open={isModalOpen.value}
        onClose={isModalOpen.onFalse}
        dubId={audioDub.id}
      />
    </Box>
  );
}
