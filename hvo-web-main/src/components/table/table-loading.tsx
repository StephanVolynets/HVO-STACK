import { Box, CircularProgress } from "@mui/material";

export default function TableLoading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={10}
    >
      <CircularProgress />
    </Box>
  );
}
