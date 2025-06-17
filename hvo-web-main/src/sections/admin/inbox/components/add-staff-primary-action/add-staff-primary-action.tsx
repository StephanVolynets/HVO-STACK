import Iconify from "@/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";
import { Button } from "@mui/material";
import AddStaffModal from "./components/assign-staff-modal";
import SvgColor from "@/components/svg-color";

export default function AddStaffPrimaryAction() {
  const isAddStaffModalOpen = useBoolean();
  return (
    <>
      <Button
        variant="outlined"
        size="large"
        startIcon={<SvgColor src="/assets/icons/add.svg" />}
        onClick={isAddStaffModalOpen.onTrue}
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 16px 0px",
        }}
      >
        Add Staff
      </Button>
      <AddStaffModal
        open={isAddStaffModalOpen.value}
        onClose={isAddStaffModalOpen.onFalse}
      />
    </>
  );
}
