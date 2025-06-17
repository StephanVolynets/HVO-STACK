import { Box, Stack, Skeleton, Typography } from "@mui/material";

type Props = {
  showProfileImage?: boolean;
};

export default function ListItemSkeleton({ showProfileImage = true }: Props) {
  return (
    <Box
      sx={
        {
          // borderTop: "1px solid #E0E0E0", // Simulate a subtle border
          // borderBottom: "1px solid #E0E0E0",
          // backgroundColor: "#F2F2F2", // Mimic a neutral background
        }
      }
    >
      <Box
        sx={{
          cursor: "default", // No interaction for the skeleton
          "&:hover": {
            transform: "none", // No hover effect for skeleton
          },
        }}
      >
        <Stack direction="row" px={2} py="5px" spacing={1.5} alignItems="center">
          {/* Creator Image Skeleton */}
          {showProfileImage && <Skeleton variant="circular" width={40} height={40} />}

          {/* Thumbnail Image Skeleton */}
          {/* <Skeleton variant="rectangular" width={92} height={48} sx={{ borderRadius: "8px" }} /> */}

          {/* Text Content Skeleton */}
          <Stack sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={18} />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
