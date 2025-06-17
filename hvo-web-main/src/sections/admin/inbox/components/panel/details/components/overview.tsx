import ThumbnailImage from "@/components/images/thumbnail-image";
import SvgColor from "@/components/svg-color";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { useGetFolderUrl } from "@/use-queries/storage";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import Tippy from "@tippyjs/react";
import moment from "moment";

export default function Overview() {
  const { selectedVideo, setSelectedVideo } = useSelectedInboxVideo();
  const { folderLink } = useGetFolderUrl(selectedVideo?.root_folder_id);

  const handleOnFolderClick = () => {
    if (folderLink) window.open(folderLink, "_blank");
  };

  return (
    <Stack
      direction="row"
      alignItems="start"
      justifyContent="space-between"
      p={2}
      spacing={2}
    >
      <Stack flex={1} direction="row" alignItems="center" spacing={2}>
        {/* <ThumbnailImage src={selectedVideo?.thumbnail_url} width={120} height={67.5} borderRadius={8} /> */}

        <Stack flex={1} spacing={0.5}>
          {/* Title & Expected by */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack flex={1}>
              <Typography
                variant="h5"
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  textOverflow: "ellipsis",
                }}
              >
                {selectedVideo?.title}
              </Typography>
            </Stack>

            {selectedVideo?.expected_by && (
              <Stack
                direction="row"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "100px",
                  border: "solid 1px #E6E6E6",
                  gap: 0.25,
                  px: 1.5,
                  py: 0.5,
                }}
              >
                {/* <SvgColor src={`/assets/icons/calendar.svg`} /> */}
                <Tippy content="Expected by" placement="top" arrow={true}>
                  <Typography
                    variant="bodyRegularStrong"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {selectedVideo?.expected_by
                      ? moment(selectedVideo.expected_by).format("MM/DD/YYYY")
                      : "No date set"}
                  </Typography>
                </Tippy>
              </Stack>
            )}
          </Stack>

          {/* Description */}
          <Typography
            variant="bodySmall"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              textOverflow: "ellipsis",
            }}
          >
            {selectedVideo?.description}
          </Typography>
        </Stack>
      </Stack>

      <Button
        variant="outlined"
        sx={{ padding: "12px", borderRadius: "8px" }}
        onClick={handleOnFolderClick}
      >
        <SvgColor src={`/assets/icons/folder.svg`} />
      </Button>
    </Stack>
  );
}
