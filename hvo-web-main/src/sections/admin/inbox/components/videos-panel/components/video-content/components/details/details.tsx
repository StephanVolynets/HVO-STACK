import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
import { Typography } from "@mui/material";

import { Stack } from "@mui/material";
import LanguagesContent from "./components/languages-content";
import { FeedbacksContent } from "./components/feedbacks-content";

export default function VideoContentDetails() {
  const { activeTab } = useInboxContext();

  return (
    <Stack
      sx={{
        // backgroundColor: "common.background",
        // borderRadius: "24px",
        // borderTop: "1px solid #E6E6E6",
        // boxShadow: "0px 4px 8px 0px rgba(38, 38, 38, 0.05) inset",
        height: "100%",
        minHeight: 0,
        // overflow: "auto",
      }}
    >
      {activeTab === "languages" ? <LanguagesContent /> : <FeedbacksContent />}
    </Stack>
  );
}
