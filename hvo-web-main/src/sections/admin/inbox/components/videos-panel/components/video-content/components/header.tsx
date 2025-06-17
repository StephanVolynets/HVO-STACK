import SvgColor from "@/components/svg-color";
import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
import { formatDueDate } from "@/sections/staff/tasks/components/workspace/components/task-area/components/task-details/components/task-resources/utils";
import { useGetFolderUrl } from "@/use-queries/storage";
import { Button, IconButton, Skeleton, Typography } from "@mui/material";

import { Stack } from "@mui/material";

export default function VideoContentHeader() {
  const { selectedVideo } = useInboxContext();
  const { folderLink } = useGetFolderUrl(selectedVideo?.root_folder_id);

  const handleOnFolderClick = () => {
    if (folderLink) window.open(folderLink, "_blank");
  };

  return (
    <Stack direction="row" spacing={3}>
      {/* Title and Description */}
      <Stack sx={{ flex: 1 }} justifyContent="center">
        {selectedVideo ? (
          <Typography variant="h3" color="primary.surface">
            {selectedVideo?.title}
          </Typography>
        ) : (
          <Skeleton
            variant="rectangular"
            width="80%"
            height={32}
            sx={{ borderRadius: "24px" }}
          />
        )}

        {/* {selectedVideo ? (
          <Typography
            variant="bodySmall"
            color="#333"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "2.5em",
              lineHeight: "1.25em",
            }}
          >
            {selectedVideo?.description}
          </Typography>
        ) : (
          <Stack>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={15}
              sx={{ borderRadius: "24px", mt: 0.5 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={15}
              sx={{ borderRadius: "24px", mt: 0.5 }}
            />
          </Stack>
        )} */}
      </Stack>

      {/* Due Date & Resources */}
      <Stack direction="row" spacing={1.5}>
        <Stack
          sx={{
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
            backgroundColor: "common.white",
            borderRadius: 100,
            px: 2.5,
            py: 1,
            flexDirection: "row",
            height: 48,
            alignItems: "center",
          }}
          spacing={0.5}
        >
          <SvgColor src={`/assets/icons/calendar.svg`} />
          <Typography variant="bodyRegularStrong" sx={{ whiteSpace: "nowrap" }}>
            {formatDueDate(
              selectedVideo?.expected_by || new Date("2000-01-01"),
              true
            )}
          </Typography>
        </Stack>

        <IconButton
          onClick={handleOnFolderClick}
          sx={{
            height: 48,
            width: 48,
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
            backgroundColor: "common.white",
            borderRadius: 100,
          }}
        >
          <SvgColor src={`/assets/icons/folder.svg`} />
        </IconButton>
      </Stack>
    </Stack>
  );
}
