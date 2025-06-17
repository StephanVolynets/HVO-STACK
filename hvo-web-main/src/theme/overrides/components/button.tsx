import { alpha, Theme } from "@mui/material/styles";
import { ButtonProps, buttonClasses } from "@mui/material";

// ----------------------------------------------------------------------

const COLORS = [
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "error",
] as const;

// NEW VARIANT
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

// ----------------------------------------------------------------------

export function button(theme: Theme) {
  const lightMode = theme.palette.mode === "light";

  const rootStyles = (ownerState: ButtonProps) => {
    const inheritColor = ownerState.color === "inherit";

    const containedVariant = ownerState.variant === "contained";

    const outlinedVariant = ownerState.variant === "outlined";

    const textVariant = ownerState.variant === "text";

    const softVariant = ownerState.variant === "soft";

    const smallSize = ownerState.size === "small";

    const mediumSize = ownerState.size === "medium";

    const largeSize = ownerState.size === "large";

    const extraLargeSize = ownerState.size === "extraLarge";

    const defaultStyle = {
      ...(inheritColor && {
        // CONTAINED
        ...(containedVariant && {
          // color: lightMode
          //   ? theme.palette.common.white
          //   : theme.palette.grey[800],
          // backgroundColor: lightMode
          //   ? theme.palette.grey[800]
          //   : theme.palette.common.white,
          // "&:hover": {
          //   backgroundColor: lightMode
          //     ? theme.palette.grey[700]
          //     : theme.palette.grey[400],
          // },
          color: "#FFF!important",
          backgroundColor: "#262626",
          "&:hover": {
            backgroundColor: alpha("#262626", 0.9),
          },
        }),
        // OUTLINED
        ...(outlinedVariant && {
          backgroundColor: "#FFFFFF", // REVISION: Check if this is okay
          borderColor: alpha(theme.palette.grey[500], 0.32),
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
        // TEXT
        ...(textVariant && {
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
          "&:hover": {
            backgroundColor: alpha(theme.palette.grey[500], 0.24),
          },
        }),
      }),
      ...(outlinedVariant && {
        "&:hover": {
          borderColor: "currentColor",
          boxShadow: "0 0 0 0.5px currentColor",
        },
      }),

      borderRadius: "100px",
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        // CONTAINED
        ...(containedVariant && {
          ...(color === "secondary" && {
            backgroundColor: "rgba(38, 38, 38, 0.1)",
            // color: "#1A1A1A",
            color: "#FFF",
            border: "1px solid #E6E6E6",
            "&:hover": {
              backgroundColor: "rgba(38, 38, 38, 0.05)",
              boxShadow: "none",
            },
          }),
          ...(color !== "secondary" && {
            "&:hover": {
              boxShadow: theme.customShadows[color],
            },
          }),
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette[color][lightMode ? "dark" : "light"],
          backgroundColor: alpha(theme.palette[color].main, 0.16),
          "&:hover": {
            backgroundColor: alpha(theme.palette[color].main, 0.32),
          },
        }),
      }),
    }));

    const disabledState = {
      [`&.${buttonClasses.disabled}`]: {
        // SOFT
        ...(softVariant && {
          backgroundColor: theme.palette.action.disabledBackground,
        }),
        // CONTAINED
        ...(containedVariant && {
          backgroundColor: "#262626",
        }),
      },
    };

    const size = {
      ...(smallSize && {
        height: 30,
        fontSize: 13,
        paddingLeft: 8,
        paddingRight: 8,
        ...(textVariant && {
          paddingLeft: 4,
          paddingRight: 4,
        }),
      }),
      ...(mediumSize && {
        // paddingLeft: 12,
        // paddingRight: 12,
        height: 48,
        paddingLeft: 16, // * Custom *
        paddingRight: 16, // * Custom *
        paddingTop: 8, // * Custom *
        paddingBottom: 8, // * Custom *
        fontSize: 16,
        fontWeight: 600,
        color: "#1A1A1A",

        ...(textVariant && {
          paddingLeft: 8,
          paddingRight: 8,
        }),
      }),
      ...(largeSize && {
        // ✅
        height: 48,
        fontSize: 18,
        fontWeight: 400, // * Custom *
        color: "#1A1A1A",
        // lineHeight: 24,
        paddingHorizontal: 20,
        paddingVertical: 120,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 12,

        ...(textVariant &&
          {
            // paddingLeft: 10,
            // paddingRight: 10,
          }),
      }),
      ...(extraLargeSize && {
        height: 56,
        fontSize: 18,
        fontWeight: "400 !important",
        paddingLeft: 24,
        paddingRight: 24,

        ...(textVariant && {
          paddingLeft: 16,
          paddingRight: 16,
        }),
      }),
    };

    return [defaultStyle, ...colorStyle, disabledState, size];
  };

  return {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ButtonProps }) =>
          rootStyles(ownerState),
      },
    },
  };
}
