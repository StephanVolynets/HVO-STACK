import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { InboxVideoDTO } from "hvo-shared";
import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
import { useGetVideosCountForVendor } from "@/use-queries/video";
import { useGetVideosNew } from "@/use-queries/video";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { useInView } from "react-intersection-observer";
import VideoItem from "./components/video-item";

const SKELETONS_DEFAULT_COUNT = 10;

export default function VideoNavigator() {
  const { videosCount } = useGetVideosCountForVendor();
  const {
    staffNotAssigned,
    hasFeedback,
    search,
    creatorId,
    selectedVideo,
    setSelectedVideo,
  } = useInboxContext();

  const { videos, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetVideosNew({
      limit: SKELETONS_DEFAULT_COUNT,
    });

  useEffect(() => {
    if (
      !selectedVideo &&
      !!videos &&
      Array.isArray(videos?.pages[0]) &&
      videos?.pages[0]?.length > 0
    ) {
      setSelectedVideo(videos.pages[0][0]);
    }
  }, [videos]);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px 0px",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // if (!isLoading && videos?.pages[0]?.length === 0) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         height: "100%",
  //         width: "100%",
  //         textAlign: "center",
  //         py: 8,
  //         px: 2,
  //       }}
  //     >
  //       <Box
  //         sx={{
  //           p: 2,
  //           textAlign: "center",
  //           color: "text.secondary",
  //         }}
  //       >
  //         No videos match your current filter criteria. Try adjusting your
  //         filters to see more results.
  //       </Box>
  //     </Box>
  //   );
  // }

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
      {!isLoading && videos?.pages[0]?.length === 0 && (
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
          {videos?.pages
            .flatMap((page) => page)
            // .slice(0, 7)
            .map((item) => (
              <VideoItem
                key={item.id}
                video={item}
                isSelected={selectedVideo?.id === item.id}
                onClick={() => setSelectedVideo(item)}
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
