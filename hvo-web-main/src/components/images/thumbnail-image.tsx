import { Box, SxProps } from "@mui/material";
import Image from "../image/image";

type Props = {
  src: string | null | undefined;
  height?: number | string;
  width?: number | string;
  borderRadius?: number;
  sx?: SxProps;
};

export default function ThumbnailImage({
  src,
  height,
  width,
  borderRadius,
  sx,
}: Props) {
  return (
    <Box sx={{ minWidth: width || 92.5, minHeight: height || 48, ...sx }}>
      <Image
        src={src || "/assets/images/thumbnail-placeholder.png"}
        alt="placeholder"
        style={{
          width: width || 92.5,
          height: height || 48,
          borderRadius: `${borderRadius}px` || "8px",
        }}
      />
    </Box>
  );
}
