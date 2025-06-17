import { Box, SxProps, Typography, TypographyProps } from "@mui/material";

type Props = {
  textVariant?: TypographyProps["variant"];
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
  children?: React.ReactNode;
  wrapperSx?: SxProps;
};

export default function CustomChip({
  textVariant,
  backgroundColor,
  textColor,
  fontSize,
  fontWeight = 700,
  wrapperSx,
  children,
}: Props) {
  const defaultBackgroundColor = "#EFEFEF";

  return (
    <Box
      display="flex"
      sx={{
        backgroundColor: backgroundColor || defaultBackgroundColor,
        borderRadius: "100px",
        px: "8px",
        py: "3px",
        ...wrapperSx,
      }}
      alignItems="center"
      flexDirection="row"
    >
      <Typography
        variant={textVariant}
        fontSize={fontSize || "inherit"}
        color={textColor || "inherit"}
        textAlign="center"
        fontWeight={fontWeight || "inherit"}
      >
        {children}
      </Typography>
    </Box>
  );
}
