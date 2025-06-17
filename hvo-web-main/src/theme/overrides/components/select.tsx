import { SelectProps } from "@mui/material";
import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function select(theme: Theme) {
  const rootStyles = (ownerState: SelectProps) => {
    const smallSize = ownerState.size === "small";

    const mediumSize = ownerState.size === "medium";

    const size = {
      ...(smallSize && {
        height: 40,
      }),
      ...(mediumSize &&
        {
          // Add your styles here
        }),
    };

    return [size];
  };

  return {
    MuiSelect: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: SelectProps }) => rootStyles(ownerState),
        icon: {
          right: 10,
          width: 18,
          height: 18,
          top: "calc(50% - 9px)",
        },
      },
    },
    MuiNativeSelect: {
      styleOverrides: {
        icon: {
          right: 10,
          width: 18,
          height: 18,
          top: "calc(50% - 9px)",
        },
      },
    },
  };
}
