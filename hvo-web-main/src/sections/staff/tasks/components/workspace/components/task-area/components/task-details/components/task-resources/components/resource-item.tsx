import SvgColor from "@/components/svg-color";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { ResourceItemDTO } from "hvo-shared";
import { getIconName } from "../../file-manager/utils";

type Props = {
  resource: ResourceItemDTO;
};

export default function ResourceItem({ resource }: Props) {
  return (
    <Stack
      sx={{
        backgroundColor: "common.white",
        borderRadius: "100px",
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        cursor: "default",
        width: "302px",
      }}
      direction="row"
      justifyContent="space-between"
    >
      <Stack
        alignItems="center"
        direction="row"
        px={2.5}
        py={1.5}
        spacing={1}
        sx={{ flex: 1, minWidth: 0 }}
      >
        <SvgColor
          src={`/assets/icons/staff/files/${getIconName(resource.name)}.svg`}
          sx={{ width: 24, height: 24, flexShrink: 0 }}
        />
        <Typography
          variant="bodyLarge"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
            minWidth: 0,
          }}
        >
          {/* {(() => {
            const extension = resource.name.substring(resource.name.lastIndexOf("."));
            const nameWithoutExt = resource.name.substring(0, resource.name.lastIndexOf("."));
            return nameWithoutExt.length > 10 ? `${nameWithoutExt.substring(0, 10)}..${extension}` : resource.name;
          })()} */}
          {resource.name}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ width: 48, minWidth: 48 }}
      >
        <Divider orientation="vertical" />
        <IconButton
          sx={{
            borderRadius: "0 100px 100px 0",
            height: "100%",
            width: "100%",
            padding: 0,
          }}
          onClick={() => {
            window.open(resource.downloadUrl, "_blank");
          }}
        >
          <SvgColor
            src={`/assets/icons/download.svg`}
            sx={{
              width: 24,
              height: 24,
              color: "#1A1A1A",
            }}
          />
        </IconButton>
      </Stack>
    </Stack>
  );
}
