import { deleteUser } from "@/apis/user";
import SvgColor from "@/components/svg-color";
import {
  Button,
  Box,
  Stack,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import { AssistantDTO } from "hvo-shared";
import { enqueueSnackbar } from "notistack";

interface Props {
  item: AssistantDTO;
  onDeleteSuccess?: VoidFunction;
}

export default function RowItem({ item, onDeleteSuccess }: Props) {
  const handleDelete = async () => {
    try {
      await deleteUser(item.id);
      enqueueSnackbar("Assistant deleted successfully", { variant: "success" });
      onDeleteSuccess?.();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to delete assistant", { variant: "error" });
    }
  };

  return (
    <Stack
      minHeight={48}
      direction="row"
      justifyContent="space-between"
      pl={1.5}
      display="flex"
      flex={1}
    >
      <Stack direction="row" alignItems="center">
        <Stack width={245} direction="row" alignItems="center" spacing={0.5}>
          <Avatar src={""} sx={{ width: 24, height: 24 }} />
          <Typography variant="bodyRegular">{item.displayName}</Typography>
        </Stack>
        <Box width={245}>
          <Typography variant="bodyRegular">{item.email}</Typography>
        </Box>
        <Box width={245} display="flex" justifyContent="center">
          <Typography fontSize={16} fontWeight={600}>
            Full
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row">
        <Box
          width={245}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <IconButton
            onClick={handleDelete}
            sx={{
              border: "1px solid #FFCCCC",
              height: 24,
              width: 24,
              p: 0.5,
            }}
          >
            <SvgColor
              src="/assets/icons/bin.svg"
              sx={{ width: 16, height: 16, color: "#B20000" }}
            />
          </IconButton>
        </Box>
      </Stack>
    </Stack>
  );
}
