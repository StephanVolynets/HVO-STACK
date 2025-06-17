import React from "react";
import { CircularProgress, Box } from "@mui/material";

const LoadingState = () => {
  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress size={48} thickness={3} />
    </Box>
  );
};

export default LoadingState;
