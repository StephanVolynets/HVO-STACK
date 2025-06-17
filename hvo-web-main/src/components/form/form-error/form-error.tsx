import SvgColor from "@/components/svg-color";
import { Box, Stack, Typography } from "@mui/material";

type Props = {
  error: string | null | undefined;
};

export default function FormError({ error }: Props) {
  if (!error) {
    return null;
  }

  return (
    <Stack sx={{ borderRadius: "4px", border: "1px solid #FFE5E4", borderColor: "error.main" }}>
      <Stack
        display="flex"
        direction="row"
        // sx={{ backgroundColor: "#FFE5E4" }}
        sx={{ backgroundColor: "error.main" }}
        px={2}
        py={0.25}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography typography="caption">Error</Typography>
        <SvgColor src="/assets/icons/warning.svg" color="#4D0000" sx={{ width: 24, height: 24 }} />
      </Stack>

      <Box px={2} py={1.5}>
        <Typography variant="caption">{error}</Typography>
      </Box>
    </Stack>
  );
}
