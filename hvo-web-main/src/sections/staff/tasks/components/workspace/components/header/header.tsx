import AccountPopover from "@/layouts/common/account-popover";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { Box, Stack, Skeleton } from "@mui/material";

import { Typography } from "@mui/material";
import TaskSelector from "./components/task-selector";
import { useAuthContext } from "@/auth/hooks";

export default function Header() {
  const { profile } = useAuthContext();
  const {
    selectedVideo,
    selectedTask,
    bulkMethod,
    isMultiSelectActive,
    isVideosLoading,
    isTaskLoading,
  } = useStaffContext();
  console.log("->>>>" + JSON.stringify(profile?.staffType));

  const isLoading = isVideosLoading && !selectedVideo?.title;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      pl={3}
      pt={3}
      pb={1.5}
      position="relative"
    >
      {!isMultiSelectActive ? (
        <Stack
          direction="row"
          flex={1}
          spacing={1.5}
          width="100%"
          height={78}
          alignItems="center"
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ flex: 1, minWidth: 0 }} // allows shrink
          >
            {isLoading ? (
              <Skeleton width="60%" height={40} />
            ) : (
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexShrink: 1,
                  mr: 2,
                }}
              >
                {selectedVideo?.title}
              </Typography>
            )}

            {profile?.staffType !== "TRANSCRIPTOR" ? (
              <>
                {isLoading ? (
                  <Skeleton
                    sx={{ borderRadius: 100 }}
                    width={188}
                    height={40}
                  />
                ) : (
                  <TaskSelector />
                )}
              </>
            ) : null}
          </Stack>

          {/* Placeholder that never shrinks */}
          <Box
            sx={{
              width: "320px",
              minWidth: "320px",
              display: "flex",
              flexShrink: 0,
              mr: 3,
            }}
          />
        </Stack>
      ) : (
        <Typography
          variant="h1"
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          Bulk
          {bulkMethod === "none" && " Actions"}
          {bulkMethod === "upload" && " Upload"}
          {bulkMethod === "download" && " Download"}
        </Typography>
      )}

      <Box sx={{ position: "absolute", top: 25, right: 24 }}>
        <AccountPopover />
      </Box>
    </Stack>
  );
}
