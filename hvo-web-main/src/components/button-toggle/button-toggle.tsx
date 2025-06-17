import IOSSwitch from "@/components/inputs/ios-switch";
import SvgColor from "@/components/svg-color";
import { Stack, Typography } from "@mui/material";

interface ButtonToggleProps {
  iconSrc: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  iconColor?: string;
  labelColor?: string;
}

export default function ButtonToggle({
  iconSrc,
  label,
  checked,
  onChange,
  iconColor,
  labelColor = "common.border",
}: ButtonToggleProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      p="11px" // the border is 1px
      pl={2.5}
      sx={{
        borderRadius: 100,
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
      }}
    >
      <SvgColor src={iconSrc} sx={{ color: iconColor }} />
      <Typography
        fontSize={18}
        fontWeight={400}
        lineHeight="24px"
        sx={{
          flexGrow: 1,
          color: labelColor,
        }}
      >
        {label}
      </Typography>
      <IOSSwitch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </Stack>
  );
}
