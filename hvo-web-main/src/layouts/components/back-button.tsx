"use client";

import SvgColor from "@/components/svg-color";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

interface IBackButtonProps {}

const BackButton: FC<IBackButtonProps> = ({}: IBackButtonProps) => {
  const pathname = usePathname();

  if (pathname === "/") {
    return <></>;
  }

  return (
    <Link href="/">
      <Button
        variant="outlined"
        size="large"
        startIcon={
          <SvgColor
            src="/assets/icons/arrow-back.svg"
            color="#1A1A1A"
            sx={{ width: 24, height: 24 }}
          />
        }
        sx={{ height: 56 }}
      >
        Back to all jobs
      </Button>
    </Link>
  );
};

export default BackButton;
