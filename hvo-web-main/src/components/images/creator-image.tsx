import { Box } from "@mui/material";
import Image from "../image/image";

type Props = {
  src: string | null | undefined;
  width?: number | string;
  height?: number | string;
};

export default function CreatorImage({ src, width, height }: Props) {
  return (
    <Box sx={{ minWidth: width || 40, minHeight: height || 40 }}>
      <Image
        src={src || "/assets/images/profile-placeholder.png"}
        alt="placeholder"
        style={{
          width: width || 40,
          height: height || 40,
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}
