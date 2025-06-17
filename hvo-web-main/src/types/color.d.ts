import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    danger: Palette['primary'];
  }

  interface PaletteOptions {
    danger?: PaletteOptions['primary'];
  }

  interface CommonColors {
    mainBorder: string;
    orange: string;
    green: string;
    blue: string;
    red: string;
    background: string;
  }

  interface RedColors {
    surface: string;
    surface2: string;
    border: string;
  }
  

  // interface PrimaryColors {
  //   main: string;
  //   lighter: string;
  //   light: string;
  //   dark: string;
  //   darker: string;
  //   contrastText: string;
  //   surface: string;
  // }
}