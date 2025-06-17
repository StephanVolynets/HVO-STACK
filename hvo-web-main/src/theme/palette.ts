import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export type ColorSchema = "primary" | "secondary" | "info" | "success" | "warning" | "error";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// SETUP COLORS

export const grey = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

// export const primary = {
//   lighter: "#C8FAD6",
//   light: "#5BE49B",
//   main: "#00ABB2",
//   dark: "#007867",
//   darker: "#00494D",
//   contrastText: "#FFFFFF",
// };

export const primary = {
  lighter: "#C8FAD6",
  light: "#5BE49B",
  main: "#262626",
  dark: "#007867",
  darker: "#00494D",
  contrastText: "#FFFFFF",
  surface: "#1A1A1A",
};

// Custom
export const gray = {
  main: "#E6E6E6",
};

export const secondary = {
  lighter1: "#EDEDED", // 50
  lighter: "#D4D4D4", // 100
  light: "#A1A1A1", // 200
  main: "#393E46", // 300
  dark: "#212121", // 400
  darker: "#000000", // 500
  contrastText: "#FFFFFF",
};

export const info = {
  lighter: "#CAFDF5",
  light: "#61F3F3",
  main: "#00B8D9",
  dark: "#006C9C",
  darker: "#003768",
  contrastText: "#FFFFFF",
};

export const success = {
  lighter: "#D3FCD2",
  light: "#77ED8B",
  main: "#22C55E",
  dark: "#118D57",
  darker: "#065E49",
  contrastText: "#ffffff",
};

export const warning = {
  lighter: "#FFF5CC",
  light: "#FFD666",
  main: "#FFAB00",
  dark: "#B76E00",
  darker: "#7A4100",
  contrastText: grey[800],
};

export const error = {
  lighter: "#FFE9D5",
  light: "#FFAC82",
  main: "#FF5630",
  dark: "#B71D18",
  darker: "#7A0916",
  contrastText: "#FFFFFF",
};

export const common = {
  black: "#000000",
  white: "#FFFFFF",
  orange: "#FFA500",
  green: "#00B280",
  blue: "#4285F4",
  red: "#B20000",
  background: "#F8F8F8",
  mainBorder: "#E6E6E6",
  surfaceVariant: "#333333",
  surface2: "#F2F2F2",
  surfaceGreen: "#004D37",
};

export const green = {
  lighter: "#A3E4A1",
  light: "#77ED8B",
  // main: "#00B280",
  // main: "#23C095",
  main: "#00B280",
  dark: "#008A66",
  darker: "#065E49",
  contrastText: "#ffffff",
};

export const orange = {
  border: "#FFDC98",
  onSurface: "#4D3200",
};

  
export const red = {
  surface: "#4D0000",
  surface2: "#FFE5E5",
  surfaceVariant: "#800000",
  main: "#B20000",
  border: "#FFCCCC",
  onSurface: "#4D0000",
  surface1: "#FFFAFA",
}

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  red,
  common,
  green,
  orange,
  gray,
  divider: "#E6E6E6", //alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------

export function palette(mode: "light" | "dark") {
  const light = {
    ...base,
    mode: "light",
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: "#FFFFFF",
      default: "#FFFFFF",
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };

  const dark = {
    ...base,
    mode: "dark",
    text: {
      primary: "#FFFFFF",
      secondary: grey[500],
      disabled: grey[600],
    },
    background: {
      paper: grey[800],
      default: grey[900],
      neutral: alpha(grey[500], 0.12),
    },
    action: {
      ...base.action,
      active: grey[500],
    },
  };

  return mode === "light" ? light : dark;
}
