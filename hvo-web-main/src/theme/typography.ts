import { Barlow, Public_Sans, Inter } from "next/font/google";
import { primary } from "./palette";

// ----------------------------------------------------------------------

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }: { sm: number; md: number; lg: number }) {
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties["fontFamily"];
    fontWeightSemiBold: React.CSSProperties["fontWeight"];
  }
}

// export const primaryFont = Public_Sans({
//   weight: ["400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
//   display: "swap",
//   fallback: ["Helvetica", "Arial", "sans-serif"],
// });

export const primaryFont = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const secondaryFont = Barlow({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// ----------------------------------------------------------------------

// LEARN MORE
// https://nextjs.org/docs/basic-features/font-optimization#google-fonts

export const typography = {
  fontFamily: primaryFont.style.fontFamily,
  fontSecondaryFamily: secondaryFont.style.fontFamily,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  allVariants: {
    color: '#262626',
  },
  // h1: {
  //   fontWeight: 800,
  //   lineHeight: 80 / 64,
  //   fontSize: pxToRem(40),
  //   ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  // },
  // h2: {
  //   fontWeight: 700,
  //   lineHeight: 64 / 48,
  //   // fontSize: pxToRem(32),
  //   fontSize: pxToRem(28),
  //   // ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  //   ...responsiveFontSizes({ sm: 28, md: 28, lg: 28 }),
  // },
  // h3: {
  //   fontWeight: 700,
  //   lineHeight: 1.5,
  //   fontSize: pxToRem(24),
  //   ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  // },
  // h4: {
  //   fontWeight: 700,
  //   lineHeight: 1.5,
  //   fontSize: pxToRem(20),
  //   ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  // },
  // h5: {
  //   fontWeight: 700,
  //   lineHeight: 1.5,
  //   fontSize: pxToRem(18),
  //   ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  // },
  // h6: {
  //   fontWeight: 700,
  //   lineHeight: 28 / 18,
  //   fontSize: pxToRem(17),
  //   ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  // },
  // subtitle1: {
  //   fontWeight: 600,
  //   lineHeight: 1.5,
  //   fontSize: pxToRem(16),
  // },
  // subtitle2: {
  //   fontWeight: 600,
  //   lineHeight: 22 / 14,
  //   fontSize: pxToRem(14),
  // },
  // body1: {
  //   lineHeight: 1.5,
  //   fontSize: pxToRem(16),
  // },
  // body2: {
  //   lineHeight: 22 / 14,
  //   fontSize: pxToRem(14),
  // },
  // caption: {
  //   lineHeight: 1.5,
  //   fontSize: pxToRem(12),
  // },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: "uppercase",
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: "unset",
  },
  //
  display1: {
    fontSize: pxToRem(64),
    lineHeight: pxToRem(76),
    fontWeight: 400,
    // marginBottom: pxToRem(8),
  },
  display2: { // ✅ webApps/Headlines/Small/Display/2
    fontSize: pxToRem(52),
    lineHeight: pxToRem(64),
    fontWeight: 400,
    // marginBottom: pxToRem(8),
  },
  display3: {  // ✅ webApps/Headlines/Small/Display/3
    fontSize: pxToRem(44),
    lineHeight: pxToRem(56),
    fontWeight: 700,
    // marginBottom: pxToRem(8),
  },
  h1: { // ✅ webApps/Headlines/Small/Heading/1
    fontSize: pxToRem(36),
    lineHeight: pxToRem(44),
    fontWeight: 500,
    // marginBottom: pxToRem(16),
  },
  h2: { // ✅ webApps/Headlines/Small/Heading/2
    fontSize: pxToRem(28), // pxToRem(32),
    lineHeight: pxToRem(36),
    // fontWeight: 500,
    fontWeight: 500,
    // marginBottom: pxToRem(16),
  },
  h3: { // ✅ webApps/Headlines/Small/Heading/3
    fontSize: pxToRem(28),
    lineHeight: pxToRem(32),
    fontWeight: 600,
    // marginBottom: pxToRem(16),
  },
  h4: { // ✅ webApps/Headlines/Small/Heading/4
    fontSize: pxToRem(26),
    lineHeight: pxToRem(32),
    fontWeight: 600,
    // marginBottom: pxToRem(16),
  },
  h5: {
    fontSize: pxToRem(24),
    lineHeight: pxToRem(28),
    fontWeight: 700,
    // marginBottom: pxToRem(16),
  },
  h6: { // ✅ webApps/Headlines/Small/Heading/6
    fontSize: pxToRem(22),
    lineHeight: pxToRem(26),
    fontWeight: 700,
    // marginBottom: pxToRem(16),
  },
  bodyLarge: {
    fontSize: pxToRem(18),
    lineHeight: pxToRem(24),
    fontWeight: 400,
    // marginBottom: pxToRem(16),
  },
  bodyRegular: { // ✅ webApps/Body/Regular
    fontSize: pxToRem(16),
    lineHeight: pxToRem(24),
    fontWeight: 400,
    // marginBottom: pxToRem(16),
  },
  bodySmall: { // ✅ webApps/Body/Small
    fontSize: pxToRem(14),
    lineHeight: pxToRem(18),
    fontWeight: 400,
    // marginBottom: pxToRem(16),
  },
  bodyLargeStrong: { // ✅ webApps/Body/Large/Strong
    fontSize: pxToRem(18),
    lineHeight: pxToRem(24),
    fontWeight: 600,
    // marginBottom: pxToRem(8),
  },
  bodyRegularStrong: {
    fontSize: pxToRem(16),
    lineHeight: pxToRem(24),
    fontWeight: 600,
    // marginBottom: pxToRem(8),
  },
  bodySmallStrong: {
    fontSize: pxToRem(14),
    lineHeight: pxToRem(18),
    fontWeight: 700,
    // marginBottom: pxToRem(8),
  },
  labelLarge: { // ✅ webApps/Label/Large
    fontSize: pxToRem(16),
    lineHeight: pxToRem(20),
    fontWeight: 400,
    // marginBottom: pxToRem(8),
  },
  labelRegular: {
    fontSize: pxToRem(14),
    lineHeight: pxToRem(18),
    fontWeight: 400,
    // marginBottom: pxToRem(8),
  },
  captionRegular: {
    fontSize: pxToRem(12),
    lineHeight: pxToRem(16),
    fontWeight: 400,
    // marginBottom: pxToRem(8),
  },
  captionSmall: {
    fontSize: pxToRem(11),
    lineHeight: pxToRem(14),
    fontWeight: 400,
    // marginBottom: pxToRem(8),
  },
  footnote: {
    fontSize: pxToRem(10),
    lineHeight: pxToRem(12),
    fontWeight: 400,
    // marginBottom: pxToRem(8),
  },
} as const;
