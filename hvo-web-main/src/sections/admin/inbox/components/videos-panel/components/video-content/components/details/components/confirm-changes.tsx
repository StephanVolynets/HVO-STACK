import Iconify from "@/components/iconify";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";

type Props = {
  handleDiscardChanges: () => void;
  handleSaveChanges: () => void;
  saveLoading?: boolean;
  count: number;
  hasMissingDueDate?: boolean;
};

export default function ConfirmChanges({
  handleDiscardChanges,
  handleSaveChanges,
  saveLoading,
  count,
  hasMissingDueDate,
}: Props) {
  console.log("hasMissingDueDate", hasMissingDueDate);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      justifyContent="flex-end"
      sx={{
        // boxShadow: "0px -4px 16px rgba(38, 38, 38, 0.05)",
        // borderRadius: "4px",
        // borderBottomRightRadius: "16px",
        // borderTop: "1px solid #E6E6E6",
        backgroundColor: "common.white",
        // px: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {/* <SvgColor src="/assets/icons/check-filled-2.svg" /> */}
        <Iconify icon="bi:check-circle-fill" color="#00B280" />
        <Typography variant="bodyRegular">
          {count} Staff Changes Made
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderRadius: "100px",
          }}
          onClick={handleDiscardChanges}
        >
          Discard
        </Button>

        <Button
          variant="contained"
          size="large"
          sx={{
            borderRadius: "100px",
            minWidth: "101px",
          }}
          onClick={handleSaveChanges}
          disabled={saveLoading || hasMissingDueDate} // Disable the button while loading or if there are missing due dates
          title={
            hasMissingDueDate
              ? "Please set due dates for all tasks before saving"
              : undefined
          }
        >
          {saveLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save"
          )}
        </Button>
      </Stack>
    </Stack>
  );
}
