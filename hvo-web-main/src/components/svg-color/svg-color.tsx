import { forwardRef } from "react";

import Box, { BoxProps } from "@mui/material/Box";

// ----------------------------------------------------------------------

export type SvgColorProps = BoxProps & {
  src: string;
  colored?: boolean;
};

const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ src, colored = false, sx, ...other }, ref) => {
    if (colored) {
      return (
        <Box
          component="span"
          className="svg-color"
          ref={ref}
          sx={{
            width: 24,
            height: 24,
            display: "inline-block",
            ...sx,
          }}
          {...other}
        >
          <img
            src={src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      );
    }

    return (
      <Box
        component="span"
        className="svg-color"
        ref={ref}
        sx={{
          width: 24,
          height: 24,
          display: "inline-block",
          bgcolor: "currentColor",
          mask: `url(${src}) no-repeat center / contain`,
          WebkitMask: `url(${src}) no-repeat center / contain`,
          ...sx,
        }}
        {...other}
      />
    );
  }
);

// const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
//   ({ src, sx, ...other }, ref) => (
//     <Box
//       component="span"
//       className="svg-color"
//       ref={ref}
//       sx={{
//         width: 24,
//         height: 24,
//         display: "inline-block",
//         ...sx,
//       }}
//       {...other}
//     >
//       <img
//         src={src}
//         alt=""
//         style={{
//           width: "100%",
//           height: "100%",
//           objectFit: "contain",
//         }}
//       />
//     </Box>
//   )
// );

SvgColor.displayName = "SvgColor";

export default SvgColor;
