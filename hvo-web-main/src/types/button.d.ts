import '@mui/material/Button';

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    danger: true;
  }

  interface ButtonPropsSizeOverrides {
    extraLarge: true;
  }

  interface ButtonPropsVariantOverrides {
    soft: true;
  }

  // interface ButtonProps {
  //   cornersType?: "rounded" | "squared";
  // }
}
