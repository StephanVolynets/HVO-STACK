"use client";
import { Stack, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { CreatorsCardsView } from "./components/cards-view";
import { useLayout } from "@/layouts/app/context/layout-context";
import { Notifications } from "@/components/notifications";
import { ButtonToggle } from "@/components/button-toggle";
import { useBoolean } from "@/hooks/use-boolean";
import { CompactView } from "./components/compact-view";
import AddCreatorPrimaryAction from "../shared/components/add-creator-primary-action";

export default function CreatorsView() {
  const showCompact = useBoolean(true);

  const { setHeaderTitle, setPrimaryAction, setHeaderActions } = useLayout();

  useEffect(() => {
    setHeaderTitle(
      <Stack direction="row" spacing={1.2}>
        <Typography
          variant="h1"
          sx={{
            opacity: 0.75,
            color: "common.surfaceVariant",
            fontWeight: 700,
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          Hi there
        </Typography>
        <Typography
          variant="h1"
          fontWeight={700}
          sx={{
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          Admin!
        </Typography>
      </Stack>
    );

    setPrimaryAction(
      <Stack direction="row" spacing={1.5} alignItems="center">
        <ButtonToggle
          key="button-toggle"
          iconSrc="/assets/icons/list.svg"
          label="Compact view"
          checked={showCompact.value}
          onChange={showCompact.onToggle}
        />
        <AddCreatorPrimaryAction />
      </Stack>
    );

    // setSideContent(<Notifications />);

    return () => {
      setHeaderTitle("");
      // setSideContent(null);
      setPrimaryAction(null);
      setHeaderActions([]);
    };
  }, [showCompact.value, showCompact.onToggle]);

  useEffect(() => {
    // setHeaderActions([
    //   <ButtonToggle
    //     key="button-toggle"
    //     iconSrc="/assets/icons/list.svg"
    //     label="Compact view"
    //     checked={showCompact.value}
    //     onChange={showCompact.onToggle}
    //   />,
    // ]);
  }, [showCompact.value, setHeaderActions]);

  const CurrentView = useMemo(() => {
    return showCompact.value ? <CompactView /> : <CreatorsCardsView />;
  }, [showCompact.value]);

  return <>{CurrentView}</>;
}
