import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
import { Button, Stack } from "@mui/material";

export default function VideoContentTabs() {
  const { activeTab, setActiveTab } = useInboxContext();

  const buttonStyles = {
    lineHeight: "24px",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "none",
    height: 40,
  };

  return (
    <Stack direction="row" spacing={1}>
      <Button
        size="medium"
        variant={activeTab === "languages" ? "contained" : "outlined"}
        sx={{
          ...buttonStyles,
          ...(activeTab === "languages" && { pointerEvents: "none" }),
        }}
        onClick={() => setActiveTab("languages")}
      >
        Languages
      </Button>
      <Button
        size="medium"
        variant={activeTab === "feedback" ? "contained" : "outlined"}
        sx={{
          ...buttonStyles,
          ...(activeTab === "feedback" && { pointerEvents: "none" }),
        }}
        onClick={() => setActiveTab("feedback")}
      >
        Feedback
      </Button>
    </Stack>
  );
}
