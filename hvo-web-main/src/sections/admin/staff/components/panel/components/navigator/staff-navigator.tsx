import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { InboxVideoDTO } from "hvo-shared";
import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
import { useGetVideosCountForVendor } from "@/use-queries/video";
import { useGetVideosNew } from "@/use-queries/video";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { useInView } from "react-intersection-observer";
import VideoItem from "./components/staff-item";
import { useGetStaff } from "@/use-queries/staff";
import { useGetStaffCount } from "@/use-queries/staff";
import { useStaffContext } from "@/sections/admin/staff/contexts/staff-context";
import StaffItem from "./components/staff-item";

const SKELETONS_DEFAULT_COUNT = 10;

export default function StaffNavigator() {
  const { selectedStaff, setSelectedStaff } = useStaffContext();
  const { count } = useGetStaffCount();

  const { staff, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetStaff({
      limit: SKELETONS_DEFAULT_COUNT,
    });

  useEffect(() => {
    if (
      !selectedStaff &&
      !!staff &&
      Array.isArray(staff?.pages[0]) &&
      staff?.pages[0]?.length > 0
    ) {
      setSelectedStaff(staff.pages[0][0]);
    }
  }, [staff]);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px 0px",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <Stack
      p={1.5}
      spacing={0.5}
      sx={{
        width: "400px",
        overflowY: "scroll",
        overflowX: "hidden",
        maxHeight: "100%", // Make sure it stays within the parent's height
        minHeight: 0, // Critical for preventing parent overflow
        flexShrink: 0,
        scrollbarWidth: "none", // Hide scrollbar for Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar for Chrome, Safari, Edge
        },
      }}
    >
      {!isLoading && staff?.pages[0]?.length === 0 && (
        <Stack height="100%" alignItems="center" justifyContent="center" p={4}>
          <Typography variant="body2" color="text.secondary">
            0 Videos Found
          </Typography>
        </Stack>
      )}

      {isLoading ? (
        <Stack spacing={0}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Box key={index} sx={{ p: 1 }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: "24px" }}
                />
              </Box>
            ))}
        </Stack>
      ) : (
        <>
          {staff?.pages
            .flatMap((page) => page)
            // .slice(0, 7)
            .map((item) => (
              <StaffItem
                key={item.id}
                item={item}
                isSelected={selectedStaff?.id === item.id}
                onClick={() => setSelectedStaff(item)}
              />
            ))}

          {/* Infinite scroll trigger element */}
          {hasNextPage && <Box ref={ref} sx={{ height: 1, width: "100%" }} />}

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <Stack spacing={0}>
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <Box key={index} sx={{ p: 1 }}>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      sx={{ borderRadius: "24px" }}
                    />
                  </Box>
                ))}
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
}
