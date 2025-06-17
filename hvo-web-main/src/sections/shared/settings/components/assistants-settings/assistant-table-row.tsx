// AssistantTableRow.tsx
import { Avatar, Box, Button, IconButton, ListItemText, MenuItem, TableCell, TableRow } from "@mui/material";
import { useBoolean } from "src/hooks/use-boolean";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { useSnackbar } from "notistack";
import { AssistantDTO } from "hvo-shared";
import { deleteUser } from "@/apis/user";

type Props = {
  row: AssistantDTO;
  dense?: boolean;
  onDeleteSuccess?: VoidFunction;
};

export default function AssistantTableRow({ row, dense, onDeleteSuccess }: Props) {
  const { id, displayName, email, totalPermissions, assistantPermissionsCount } = row;

  const confirmDeletion = useBoolean();
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();

  // Get first letter for Avatar
  const avatarLetter = displayName.charAt(0).toUpperCase();

  // Create permissions label
  const permissionLabel =
    assistantPermissionsCount === totalPermissions ? `Full` : `${assistantPermissionsCount}/${totalPermissions}`;

  const handleDelete = async () => {
    try {
      // TODO: Implement deletion with API call
      await deleteUser(id);
      enqueueSnackbar("Assistant deleted successfully", { variant: "success" });
      onDeleteSuccess?.();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to delete assistant", { variant: "error" });
    }
    confirmDeletion.onFalse();
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt={displayName}
            sx={{
              mr: 2,
              ...(dense ? { width: 30, height: 30 } : {}),
              bgcolor: "primary.main",
            }}
          >
            {avatarLetter}
          </Avatar>

          <Box>
            <ListItemText
              primary={displayName}
              primaryTypographyProps={{ typography: "body2", fontWeight: "medium" }}
            />
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{email}</TableCell>

        <TableCell>
          {/* <Box
            sx={{
              typography: "bodySmall",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: "primary.lighter",
              color: "primary.main",
              display: "inline-block",
            }}
          > */}
          {permissionLabel}
          {/* </Box> */}
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
          <IconButton color={popover.open ? "inherit" : "default"} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            popover.onClose();
            enqueueSnackbar("Feature coming soon", { variant: "info" });
          }}
          disabled
        >
          <Iconify icon="solar:pen-bold" />
          Permissions
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDeletion.onTrue();
            popover.onClose();
            
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDeletion.value}
        onClose={confirmDeletion.onFalse}
        title="Delete Assistant"
        content={`Are you sure you want to delete ${displayName}?`}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
