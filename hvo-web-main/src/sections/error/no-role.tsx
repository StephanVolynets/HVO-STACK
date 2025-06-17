"use client";

import { m } from "framer-motion";

import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";

import CompactLayout from "src/layouts/compact";
import { SeverErrorIllustration } from "src/assets/illustrations";

import { varBounce, MotionContainer } from "src/components/animate";

// ----------------------------------------------------------------------

export default function NoRoleView() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            You have no role assigned.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: "text.secondary" }}>
            There is a problem with your role. Please contact your administrator for further assistance.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        {/* <Button component={RouterLink} href="/dashboard" size="large" variant="contained">
          Go to Home
        </Button> */}
      </MotionContainer>
    </CompactLayout>
  );
}
