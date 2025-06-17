import { Box, Stack, Typography, Button } from "@mui/material";
import { useInboxContext } from "../../contexts/inbox-context";

export default function InboxStats() {
  const { staffNotAssigned, setStaffNotAssigned, hasFeedback, setHasFeedback } =
    useInboxContext();

  return (
    <Stack
      display="flex"
      direction="row"
      sx={{
        // p: 1,
        // pb: 2,
        // backgroundColor: "common.white",
        borderRadius: "16px",
        // border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        overflow: "hidden",
      }}
    >
      {/* Staff not assigned */}
      <Button
        // disableRipple
        fullWidth
        sx={{
          p: 1,
          pl: 2,
          pb: 2,
          flex: 1,
          height: "auto",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          textTransform: "none",
          backgroundColor: staffNotAssigned
            ? "rgba(38, 38, 38, 0.10)"
            : "common.white",
          "&:hover": {
            backgroundColor: "rgba(38, 38, 38, 0.05)",
          },
          borderRadius: 0,
        }}
        onClick={() => setStaffNotAssigned(!staffNotAssigned)}
      >
        <Stack display="flex" width="100%" spacing={0.5} alignItems="center">
          <Box
            sx={{
              display: "flex",
              flex: 1,
              width: "100%",
              minHeight: "4px",
              height: "4px",
              backgroundColor: "common.red",
              borderRadius: "100px",
            }}
          />
          <Typography variant="labelLarge">Staff not assigned</Typography>
        </Stack>
        <Typography
          variant="display1"
          fontWeight={700}
          color="red.surfaceVariant"
        >
          5
        </Typography>
      </Button>

      {/* Creator Feedbacks */}
      <Button
        // disableRipple
        fullWidth
        sx={{
          p: 1,
          pr: 2,
          pb: 2,
          flex: 1,
          height: "auto",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          textTransform: "none",
          backgroundColor: hasFeedback
            ? "rgba(38, 38, 38, 0.10)"
            : "common.white",
          "&:hover": {
            backgroundColor: "rgba(38, 38, 38, 0.05)",
          },
          borderRadius: 0,
        }}
        onClick={() => setHasFeedback(!hasFeedback)}
      >
        <Stack display="flex" width="100%" spacing={0.5} alignItems="center">
          <Box
            sx={{
              display: "flex",
              flex: 1,
              width: "100%",
              minHeight: "4px",
              height: "4px",
              backgroundColor: "common.orange",
              borderRadius: "100px",
            }}
          />
          <Typography variant="labelLarge">Creator Feedbacks</Typography>
        </Stack>
        <Typography
          variant="display1"
          fontWeight={700}
          color="orange.onSurface"
        >
          7
        </Typography>
      </Button>
    </Stack>
  );
}
