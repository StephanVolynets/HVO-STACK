"use client";

import { AppLayout } from "@/layouts/app";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
