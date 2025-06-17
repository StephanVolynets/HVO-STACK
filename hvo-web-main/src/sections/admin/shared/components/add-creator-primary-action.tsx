import Iconify from "@/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";
import { Button, Stack } from "@mui/material";
import { AddCreatorModal } from "../../creators/components/add-creator-modal";

export default function AddCreatorPrimaryAction() {
  const isModalOpen = useBoolean();

  return (
    <>
      <Button
        size="large"
        variant="outlined"
        startIcon={<Iconify icon="mdi:plus" />}
        onClick={isModalOpen.onTrue}
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 16px 0px",
        }}
      >
        Add Creator
      </Button>
      <AddCreatorModal open={isModalOpen.value} onClose={isModalOpen.onFalse} />
    </>
  );
}
