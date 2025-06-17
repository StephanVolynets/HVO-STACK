import "@mui/material/styles";
import "@mui/material/Typography";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    // d1: React.CSSProperties;
    // d2: React.CSSProperties;
    // d3: React.CSSProperties;
    // body3: React.CSSProperties;
    // caption1: React.CSSProperties;
    // caption2: React.CSSProperties;
    // footnote: React.CSSProperties;
    // label1: React.CSSProperties;
    // label2: React.CSSProperties;
    //
    display1: React.CSSProperties;
    display2: React.CSSProperties;
    display3: React.CSSProperties;
    bodyLargeStrong: React.CSSProperties;
    bodyRegularStrong: React.CSSProperties;
    bodySmallStrong: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyRegular: React.CSSProperties;
    bodySmall: React.CSSProperties;
    captionRegular: React.CSSProperties;
    captionSmall: React.CSSProperties;
    footnote: React.CSSProperties;
    // error: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    // d1: React.CSSProperties;
    // d2: React.CSSProperties;
    // d3: React.CSSProperties;
    // body3: React.CSSProperties;
    // caption1: React.CSSProperties;
    // caption2: React.CSSProperties;
    // footnote: React.CSSProperties;
    // label1: React.CSSProperties;
    // label2: React.CSSProperties;
    //
    display1: React.CSSProperties;
    display2: React.CSSProperties;
    display3: React.CSSProperties;
    bodyLargeStrong: React.CSSProperties;
    bodyRegularStrong: React.CSSProperties;
    bodySmallStrong: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyRegular: React.CSSProperties;
    bodySmall: React.CSSProperties;
    labelLarge: React.CSSProperties;
    labelRegular: React.CSSProperties;
    captionRegular: React.CSSProperties;
    captionSmall: React.CSSProperties;
    footnote: React.CSSProperties;
    // caption1: React.CSSProperties;
    // caption2: React.CSSProperties;
    // label1: React.CSSProperties;
    // label2: React.CSSProperties;
    // error: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    // d1: true;
    // d2: true;
    // d3: true;
    // body3: true;
    // caption1: true;
    // caption2: true;
    // footnote: true;
    // label1: true;
    // label2: true;
    // error: true;
    display1: true;
    display2: true;
    display3: true;
    bodyLargeStrong: true;
    bodyRegularStrong: true;
    bodySmallStrong: true;
    bodyLarge: true;
    bodyRegular: true;
    bodySmall: true;
    labelLarge: true;
    labelRegular: true;
    captionRegular: true;
    captionSmall: true;
    footnote: true;
  }

  interface TypographyPropsColorOverrides {
    danger: true;
  }
}
