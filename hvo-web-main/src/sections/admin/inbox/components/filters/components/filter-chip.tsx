import { CustomChip } from "@/components/custom-chip";
import { IconButton, Stack, Typography } from "@mui/material";
import SvgColor from "@/components/svg-color";

type FilterChipProps = {
  label: string;
  onRemove: () => void;
  type: "staffNotAssigned" | "hasFeedback";
  count?: number;
};

export default function FilterChip({
  label,
  onRemove,
  type,
  count,
}: FilterChipProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      px={2}
      py={1}
      borderRadius={100}
      sx={{ border: "1px solid #E6E6E6", backgroundColor: "common.white" }}
      spacing={0.5}
    >
      <Typography
        variant="bodyRegularStrong"
        color={type === "staffNotAssigned" ? "#4D0000" : "#664200"}
      >
        {label}
      </Typography>

      {count !== undefined && (
        <CustomChip
          fontWeight={700}
          fontSize={14}
          backgroundColor={
            type === "staffNotAssigned" ? "#B20000" + "0D" : "#FFA500" + "0D"
          }
          textColor={type === "staffNotAssigned" ? "#800000" : "#4D3200"}
        >
          {count}
        </CustomChip>
      )}

      <IconButton size="small" onClick={onRemove}>
        <SvgColor
          src={`/assets/icons/icon-close.svg`}
          color={type === "staffNotAssigned" ? "#4D0000" : "#664200"}
          sx={{ width: 18, height: 18 }}
        />
      </IconButton>
    </Stack>
  );
}
