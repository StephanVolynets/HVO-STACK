import { updateTaskStaff } from "@/apis/task";
import { AudioDubNew } from "@/components/audio-dub";
import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import { UpdateTaskStaffDTO, updateTaskStaffDTOSchema } from "hvo-shared";
import { useMemo, useState } from "react";
import ConfirmChanges from "./components/confirm-changes";
import { useSnackbar } from "notistack";
import { set } from "lodash";
import LanguagesContent from "./components/languages-content";
import { FeedbacksContent } from "./components/feedbacks-content";

export default function Content() {
  const [currentTab, setCurrentTab] = useState("languages");

  const TABS = [
    {
      value: "languages",
      label: "Languages",
      component: <LanguagesContent />,
    },
    {
      value: "feedback",
      label: "Feedback",
      component: <FeedbacksContent />,
    },
  ];

  return (
    <Stack flex={1}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", pl: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>

      {TABS.map(
        (tab) =>
          currentTab === tab.value && (
            <Box key={tab.value} flex={1}>
              {tab.component}
            </Box>
          )
      )}
    </Stack>
  );
}
