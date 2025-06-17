import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useGetVideosCountForVendor, useGetVideosNew } from "@/use-queries/video";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import ListItemSkeleton from "./components/list-item-skeleton";
import ListItem from "./components/list-item";
import { useInView } from "react-intersection-observer";
import { useInboxFilters } from "@/sections/admin/inbox/hooks/use-inbox-filters";

const SKELETONS_DEFAULT_COUNT = 10;

export default function NavigatorList() {
  const { videosCount } = useGetVideosCountForVendor();
  const { creatorId } = useInboxFilters();

  const { videos, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetVideosNew({
    limit: SKELETONS_DEFAULT_COUNT,
  });
  const { selectedVideo, setSelectedVideo } = useSelectedInboxVideo();

  const skeletonCount = !videosCount
    ? SKELETONS_DEFAULT_COUNT
    : videosCount < SKELETONS_DEFAULT_COUNT
    ? videosCount
    : SKELETONS_DEFAULT_COUNT;

  useEffect(() => {
    // Initialize selected video
    if (!selectedVideo && !!videos && Array.isArray(videos?.pages[0]) && videos?.pages[0]?.length > 0) {
      setSelectedVideo(videos.pages[0][0]);
    }
  }, [videos]);

  //
  const { ref, inView } = useInView({ threshold: 1.0 });

  // Trigger fetching next page when inView changes to true
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <Stack sx={{ overflowY: "auto" }}>
      {/* {isLoading
        ? Array.from({ length: skeletonCount }).map((_, index) => <ListItemSkeleton key={`skeleton-${index}`} />)
        : videos?.map((item) => <ListItem item={item} key={item.id} />)} */}

      {/* Show skeletons on initial load */}
      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <ListItemSkeleton key={`skeleton-${index}`} showProfileImage={!creatorId} />
        ))}

      {/* Render videos */}
      {videos?.pages.map((page, pageIndex) =>
        page.map((item) => <ListItem item={item} key={item.id} showProfileImage={!creatorId} />)
      )}

      {/* Show loading skeletons when fetching next page */}
      {isFetchingNextPage &&
        Array.from({ length: skeletonCount }).map((_, index) => <ListItemSkeleton key={`skeleton-loading-${index}`} />)}

      {/* Infinite scroll trigger */}
      {hasNextPage && !isFetchingNextPage && <div ref={ref} style={{ height: 50 }} />}
    </Stack>
  );
}
