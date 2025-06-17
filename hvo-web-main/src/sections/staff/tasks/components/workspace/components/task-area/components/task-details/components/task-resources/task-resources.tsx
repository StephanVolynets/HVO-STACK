import { useGetTaskResources } from "@/use-queries/task";
import { Box, Button, Stack, Typography, Skeleton } from "@mui/material";
import ResourceItem from "./components/resource-item";
import ResourceItemSkeleton from "./components/resource-item-skeleton";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import Tippy from "@tippyjs/react";
import SvgColor from "@/components/svg-color";
import { useGetFolderUrl } from "@/use-queries/storage";
import { formatDueDate } from "./utils";

export default function TaskResources() {
  const { selectedTask } = useStaffContext();
  const { resourceItems, isLoading } = useGetTaskResources({
    task: selectedTask!,
  });

  const { folderLink } = useGetFolderUrl(selectedTask?.resources_folder_id!);

  const handleOnFolderClick = () => {
    if (folderLink) window.open(folderLink, "_blank");
  };
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize={24} fontWeight={600}>
          Resources
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* <Tippy content="Expected by" placement="top" arrow={true}> */}
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
            {selectedTask ? (
              <Typography
                variant="bodyRegularStrong"
                sx={{ whiteSpace: "nowrap" }}
              >
                {formatDueDate(selectedTask.expected_delivery_date)}
              </Typography>
            ) : (
              <Skeleton variant="text" width={185} height={30} />
            )}
          </Stack>
          {/* </Tippy> */}

          <Button
            variant="outlined"
            sx={{
              borderRadius: "50%",
              width: 48,
              height: 48,
              minWidth: 48,
              padding: 0,
              borderColor: "common.mainBorder",
            }}
            onClick={handleOnFolderClick}
          >
            <SvgColor src={`/assets/icons/folder.svg`} />
          </Button>
        </Stack>
      </Stack>
      <Box
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          pb: 1,
          // Hide scrollbar completely
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For IE/Edge
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ minWidth: "min-content" }}>
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <Box key={`skeleton-${index}`} sx={{ minWidth: 200 }}>
                  <ResourceItemSkeleton />
                </Box>
              ))
            : resourceItems?.map((resourceItem) => (
                <Box key={resourceItem.fileId} sx={{ minWidth: 200 }}>
                  <ResourceItem resource={resourceItem} />
                </Box>
              ))}
        </Stack>
      </Box>

      {/* {
        !isLoading && !resourceItems?.length && (
          <Typography variant="bodyRegular" color="textSecondary">
            No resources available
          </Typography>
        )
      } */}
    </Stack>
  );
}
