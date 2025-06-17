import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import { useBoolean } from "@/hooks/use-boolean";
import { paths } from "@/routes/paths";
import { AssignStaffModal } from "@/sections/admin/shared/components/assign-staff-modal";
import AddStaffModal from "@/sections/admin/shared/components/assign-staff-modal/assign-staff-modal";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header() {
  const isAssignStaffModalOpen = useBoolean();
  const isAddStaffModalOpen = useBoolean();
  const router = useRouter();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h1" fontWeight={700}>
          Inbox
        </Typography>
        <Box sx={{ width: 12, height: 12, borderRadius: 100, backgroundColor: "common.red" }} />
        <Typography variant="h1">14 Videos Need Attention</Typography>
      </Stack>

      <Stack direction="row" spacing={1.5}>
        {/* <Button variant="outlined" color="secondary" onClick={isAssignStaffModalOpen.onTrue}>
          Assign Staff
        </Button> */}

        <Button
          variant="contained"
          color="secondary"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={isAddStaffModalOpen.onTrue}
        >
          Add Staff
        </Button>
      </Stack>

      <AssignStaffModal open={isAssignStaffModalOpen.value} onClose={isAssignStaffModalOpen.onFalse} />
      <AddStaffModal open={isAddStaffModalOpen.value} onClose={isAddStaffModalOpen.onFalse} />
    </Stack>
  );
}
