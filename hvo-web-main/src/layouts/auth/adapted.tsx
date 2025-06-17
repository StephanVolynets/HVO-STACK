import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useResponsive } from "src/hooks/use-responsive";

import { bgGradient } from "@/theme/css";
import { useAuthContext } from "src/auth/hooks";

import Logo from "src/components/logo";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";

import { useState } from "react";

// ----------------------------------------------------------------------

const METHODS = [
  // {
  //   id: 'jwt',
  //   label: 'Jwt',
  //   path: paths.auth.jwt.login,
  //   icon: '/assets/icons/auth/ic_jwt.svg',
  // },
  {
    id: "firebase",
    label: "Firebase",
    path: paths.auth.login,
    icon: "/assets/icons/auth/ic_firebase.svg",
  },
  // {
  //   id: 'amplify',
  //   label: 'Amplify',
  //   path: paths.auth.amplify.login,
  //   icon: '/assets/icons/auth/ic_amplify.svg',
  // },
  // {
  //   id: 'auth0',
  //   label: 'Auth0',
  //   path: paths.auth.auth0.login,
  //   icon: '/assets/icons/auth/ic_auth0.svg',
  // },
  // {
  //   id: 'supabase',
  //   label: 'Supabase',
  //   path: paths.auth.supabase.login,
  //   icon: '/assets/icons/auth/ic_supabase.svg',
  // },
];

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthAdaptedLayout({ children, image, title }: Props) {
  const { method } = useAuthContext();

  const theme = useTheme();

  const mdUp = useResponsive("up", "md");

  const appType = process.env.NEXT_PUBLIC_APP_TYPE;

  const simpleView = !mdUp || appType === "staff";

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: "absolute",
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: "auto",
        // maxWidth: 480,
        maxWidth: 580,
        px: { xs: 2, md: 8 },
        // pt: { xs: 15, md: 20 },
        pb: { xs: 15, md: 0 },
        justifyContent: "center",
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      display="flex"
      sx={{
        width: 480,
        height: "100vh",
        backgroundImage: "url('/assets/images/login/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={6}
    >
      {/* Welcome Text */}
      <Stack sx={{ textAlign: "center", px: 6 }} spacing={2}>
        <Typography variant="h1" fontWeight="bold">
          Hi, Welcome back
        </Typography>
        <Typography variant="h6" fontWeight={500}>
          More effectively with optimized workflows.
        </Typography>
      </Stack>

      {/* Center Logo */}
      <Logo sx={{ width: 240, height: 240 }} disabledLink />

      {/* Creator Logos Carousel */}
      <CreatorCarousel />
      {/* <Box
        sx={{
          mt: 10,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          width: "100%",
          height: 200,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            transform: "translateX(0)",
            transition: "transform 0.5s ease-in-out",
          }}
          id="carousel"
        >
          <img src="/assets/images/login/creator/1.webp" alt="Logo 1" style={{ width: 100, height: 100 }} />
          <img src="/assets/images/login/creator/2.webp" alt="Logo 2" style={{ width: 100, height: 100 }} />
          <img src="/assets/images/login/creator/3.webp" alt="Logo 3" style={{ width: 200, height: 200 }} />
          <img src="/assets/images/login/creator/4.webp" alt="Logo 4" style={{ width: 100, height: 100 }} />
          <img src="/assets/images/login/creator/5.webp" alt="Logo 5" style={{ width: 100, height: 100 }} />
        </Box>
      </Box> */}
    </Stack>
    // <Stack
    //   sx={{
    //     width: 1,
    //     mx: "auto",
    //     maxWidth: 480,
    //     // px: { xs: 2, md: 8 },
    //     // pt: { xs: 15, md: 20 },
    //     // pb: { xs: 15, md: 0 },
    //   }}
    // >
    //   <Typography variant="h3" sx={{ maxWidth: 480, textAlign: "center" }}>
    //     {title || "Hi, Welcome back"}
    //   </Typography>

    //   <Box
    //     component="img"
    //     alt="auth"
    //     src={image || "/assets/illustrations/illustration_dashboard.png"}
    //     sx={{
    //       maxWidth: {
    //         xs: 480,
    //         lg: 560,
    //         xl: 720,
    //       },
    //     }}
    //   />

    //   <Stack direction="row" spacing={2}>
    //     {METHODS.map((option) => (
    //       <Tooltip key={option.label} title={option.label}>
    //         <Link component={RouterLink} href={option.path}>
    //           <Box
    //             component="img"
    //             alt={option.label}
    //             src={option.icon}
    //             sx={{
    //               width: 32,
    //               height: 32,
    //               ...(method !== option.id && {
    //                 filter: "grayscale(100%)",
    //               }),
    //             }}
    //           />
    //         </Link>
    //       </Tooltip>
    //     ))}
    //   </Stack>
    // </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* {renderLogo} */}

      {!simpleView && renderSection}

      {renderContent}
    </Stack>
  );
}

const creatorLogos = [
  "/assets/images/login/creators/1.webp",
  "/assets/images/login/creators/2.webp",
  "/assets/images/login/creators/3.webp",
  "/assets/images/login/creators/4.webp",
  "/assets/images/login/creators/5.webp",
  "/assets/images/login/creators/6.webp",
  "/assets/images/login/creators/7.webp",
  "/assets/images/login/creators/8.webp",
  "/assets/images/login/creators/9.webp",
  "/assets/images/login/creators/10.webp",
];

export function CreatorCarousel() {
  // <Image src="/assets/images/login/creators/10.webp" alt="creator-logo" width={200} height={200} />

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Swiper
      // spaceBetween={20} // Add spacing between slides
      spaceBetween={-20} // No gap between slides
      slidesPerView={3.5} // Show 3.5 slides (to partially show 1st and 5th slides)
      centeredSlides // Center the current active slide
      loop // Infinite looping
      autoplay={{
        delay: 1000, // Auto-change every 3 seconds
        disableOnInteraction: false, // Keep autoplay after user interaction
      }}
      speed={500} // Smooth transition speed
      allowTouchMove={false}
      onSlideChange={(swiper) => {
        setActiveIndex(swiper.realIndex); // Update the active index
      }}
    >
      {creatorLogos.map((logo, index) => (
        <SwiperSlide
          key={index}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt={`Creator ${index + 1}`}
            style={{
              width: index === activeIndex ? "200px" : "100px",
              height: index === activeIndex ? "200px" : "100px",
              transition: "width 0.5s ease-in-out, height 0.5s ease-in-out",
              // margin: "0 0",
              objectFit: "contain", // Prevents distortion
            }}
          />
          {/* <Image src={logo} alt={`Creator ${index + 1}`} width={200} height={200} /> */}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
