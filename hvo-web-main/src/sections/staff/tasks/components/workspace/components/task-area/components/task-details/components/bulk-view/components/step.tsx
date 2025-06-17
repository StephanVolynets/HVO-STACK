import { Box } from "@mui/material";

import { Typography } from "@mui/material";

import { Stack } from "@mui/material";

interface Props {
  state: "completed" | "active" | "pending";
  title: string;
}

export default function BulkStep({ state, title }: Props) {
  return (
    <Stack flex={1}>
      <Typography
        fontSize={16}
        fontWeight={400}
        sx={{ opacity: state !== "pending" ? 1 : 0.5 }}
        color="primary.surface"
      >
        {title}
      </Typography>
      <Box
        display="flex"
        flex={1}
        sx={{
          minHeight: "8px",
          backgroundColor:
            state === "completed" ? "primary.surface" : "#E6E6E6",
          border: state !== "pending" ? "1.5px solid #333333" : null,
          borderRadius: "100px",
        }}
      />
    </Stack>
  );
}
