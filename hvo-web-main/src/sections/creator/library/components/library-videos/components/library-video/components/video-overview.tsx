import { Box, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import SvgColor from "@/components/svg-color";
import Iconify from "@/components/iconify";
import { useState } from "react";

type Props = {
  id: number;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  translatedView: boolean;
};

export default function VideoOverview({
  id,
  title,
  description,
  thumbnail_url,
  translatedView,
}: Props) {
  const router = useRouter();

  // State to manage which button shows the "okay" icon
  const [copied, setCopied] = useState<{
    title: boolean;
    description: boolean;
  }>({
    title: false,
    description: false,
  });

  const handleVideoClick = () => {
    router.push(paths.dashboard.creator.video(id));
  };

  const handleCopyToClipboard = (
    text: string,
    type: "title" | "description"
  ) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied((prev) => ({ ...prev, [type]: true }));

        // Reset the icon to the copy button after 3 seconds
        setTimeout(() => {
          setCopied((prev) => ({ ...prev, [type]: false }));
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ maxWidth: "370px" }}
    >
      <Tooltip
        title={
          <Typography variant="bodySmall" fontWeight={600}>
            Preview video
          </Typography>
        }
        arrow
      >
        <IconButton
          onClick={handleVideoClick}
          sx={{
            border: "1px solid #E6E6E6",
            borderRadius: 100,
            backgroundColor: "common.white",
            width: 48,
            height: 48,
          }}
        >
          <SvgColor src="/assets/icons/video-play.svg" color="#1A1A1A" />
        </IconButton>
      </Tooltip>

      <Stack justifyContent="center">
        <Stack display="flex" direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="bodyLargeStrong"
            fontWeight={600}
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>
          {translatedView && (
            <IconButton
              onClick={() => handleCopyToClipboard(title!, "title")}
              sx={{ p: 0.5 }}
            >
              {copied.title ? (
                <Iconify
                  icon="material-symbols:check-rounded"
                  color="common.gray"
                  width={16}
                  height={16}
                />
              ) : (
                <Iconify icon="solar:copy-bold" width={16} height={16} />
              )}
            </IconButton>
          )}
        </Stack>
        <Stack display="flex" direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="bodySmall"
            fontWeight={400}
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </Typography>
          {translatedView && (
            <IconButton
              onClick={() => handleCopyToClipboard(description!, "description")}
              sx={{ p: 0.5 }}
            >
              {copied.description ? (
                <Iconify
                  icon="material-symbols:check-rounded"
                  color="common.gray"
                  width={16}
                  height={16}
                />
              ) : (
                <Iconify icon="solar:copy-bold" width={16} height={16} />
              )}
            </IconButton>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
