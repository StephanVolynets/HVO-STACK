import { Box } from "@mui/material";
import Image from "next/image";
import placeholderImage from "public/assets/images/placeholder.png";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface ICoverPhotoProps {
  cover_photo?: string;
  height: number;
}

const CoverPhoto = ({ cover_photo, height }: ICoverPhotoProps) => {
  return cover_photo ? (
    <Box position="relative" sx={{ overflow: "hidden", borderRadius: "28px" }}>
      <img
        src={cover_photo}
        alt="background"
        style={{
          width: "100%",
          height: height,
          objectFit: "cover",
          // borderRadius: "32px",
          filter: "blur(16px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LazyLoadImage
          alt="cover-photo"
          effect="blur"
          style={{
            objectFit: "cover",
            width: "100%",
            // borderRadius: "32px",
            height: height,
            // transform: "translateX(20%)",
          }}
          src={cover_photo}
        />
      </Box>
    </Box>
  ) : (
    <Image
      src={placeholderImage}
      alt="placeholder"
      height={height}
      style={{
        width: "100%",
        objectFit: "cover",
        borderRadius: "32px",
      }}
    />
  );
};

export default CoverPhoto;
