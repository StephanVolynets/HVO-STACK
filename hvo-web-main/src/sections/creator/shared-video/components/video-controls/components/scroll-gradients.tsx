import { Box } from "@mui/material";

const GRADIENT_WIDTH = 30;

interface Props {
  showLeftGradient: boolean;
  showRightGradient: boolean;
  backgroundColor?: string;
}

export default function ScrollGradients({
  showLeftGradient,
  showRightGradient,
  backgroundColor = "rgba(248,248,248,1)",
}: Props) {
  return (
    <>
      {/* Left side gradient overlay */}
      {showLeftGradient && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: GRADIENT_WIDTH,
            background: `linear-gradient(to left, rgba(248,248,248,0), ${backgroundColor})`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Right side gradient overlay */}
      {showRightGradient && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: GRADIENT_WIDTH,
            background: `linear-gradient(to right, rgba(248,248,248,0), ${backgroundColor})`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
    </>
  );
}
