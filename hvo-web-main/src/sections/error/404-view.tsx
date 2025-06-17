"use client";

import { m } from "framer-motion";
import { Box, Container, Typography, Button, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// ----------------------------------------------------------------------

const StyledSection = styled("section")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  position: "relative",
  overflow: "hidden",
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  textAlign: "center",
  color: "white",
  position: "relative",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    fontSize: "3.5rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 400,
  opacity: 0.9,
  maxWidth: "600px",
  margin: "0 auto",
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    fontSize: "1.5rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "12px 32px",
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "50px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "white",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(10px)",
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": {
    left: "100%",
  },
}));

const NumberDisplay = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: "10%",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "12rem",
  fontWeight: 900,
  color: "rgba(255, 255, 255, 0.1)",
  userSelect: "none",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    fontSize: "8rem",
    right: "5%",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "6rem",
    position: "static",
    transform: "none",
    marginTop: theme.spacing(4),
  },
}));

// Floating particles animation
const FloatingParticle = styled(m.div)(({ theme }) => ({
  position: "absolute",
  width: "4px",
  height: "4px",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  borderRadius: "50%",
}));

// ----------------------------------------------------------------------

export default function View404() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <StyledSection>
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      <StyledContainer maxWidth="lg">
        <ContentWrapper>
          <m.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Title variant="h1">
              Oops! This Page is Still in Post-Production 🎬
            </Title>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Subtitle variant="h3">
              Looks like you've stumbled into the behind-the-scenes of our
              website. The final cut isn't ready yet, but don't worry—we'll get
              you back on set!
            </Subtitle>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <m.button
              onClick={handleBackToHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <StyledButton size="large">Back to home</StyledButton>
            </m.button>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <NumberDisplay>404</NumberDisplay>
          </m.div>
        </ContentWrapper>
      </StyledContainer>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingParticle
          key={i}
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 1000),
          }}
          animate={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 1000),
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
        />
      ))}
    </StyledSection>
  );
}
