import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          position: "relative",
          boxShadow: theme.customShadows.card,
          borderRadius: theme.shape.borderRadius * 2,
          zIndex: 0, // Fix Safari overflow: hidden with border radius
          border: `solid 1px #E6E6E6`,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}
