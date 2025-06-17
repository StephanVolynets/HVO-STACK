import { Stack, Skeleton, Divider, Box } from "@mui/material";

export default function ResourceItemSkeleton() {
  return (
    <Stack
      sx={{
        backgroundColor: "common.white",
        borderRadius: "100px", // Updated to match the new design
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        width: "302px" // Fixed width to match the new design
      }}
      direction="row"
      justifyContent="space-between"
    >
      {/* Left Side: Icon and Name */}
      <Stack alignItems="center" direction="row" px={2.5} py={1.5} spacing={1}>
        {/* Placeholder for icon */}
        <Skeleton
          variant="rectangular"
          width={24}
          height={24}
          sx={{
            flexShrink: 0,
            borderRadius: 1
          }}
        />

        {/* Placeholder for text */}
        <Skeleton
          variant="text"
          width="160px"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
            minWidth: 0
          }}
        />
      </Stack>

      {/* Right Side: Divider and Button */}
      <Stack direction="row" alignItems="center" sx={{ width: 48, minWidth: 48 }}>
        <Divider orientation="vertical" />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Skeleton
            variant="rectangular"
            width={24}
            height={24}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}