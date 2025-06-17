import { getVendorFeedbacks, getVideoFeedbacks } from "@/apis/feedback";
import { getBulkUploadTemplate, getLibraryVideos, getVideoPreview, getVideoPreviewMedia, getVideos, getVideosCount, getVideosCountNew, getVideosInReview, getVideosInReviewCount, getYoutubeChannels } from "@/apis/video";
import { useAuthContext } from "@/auth/hooks";
import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
// import { useInboxFilters } from "@/sections/admin/inbox-old/hooks/use-inbox-filters";
import { useInboxFilters } from "@/sections/admin/inbox/hooks/use-inbox-filters";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
// import { useSelectedInboxVideo } from "@/sections/admin/inbox-old/hooks/use-selected-inbox-video";
import { useLibraryFilters } from "@/sections/creator/library/hooks/use-library-filters";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { FeedbackDTO, InboxVideoDTO, LibraryVideoDTO, StaffType, VideoPreviewDTO, VideoPreviewMediaDTO, YoutubeChannelBasicDTO } from "hvo-shared";
import { useParams, useRouter } from "next/navigation";

export const useGetVideosCount = () => {
  const { searchTerm } = useInboxFilters();
  const { user } = useAuthContext();
  const creatorId = user?.email;

  console.log("Fetching videos for user", user);

  const { data: videosCount, isSuccess } = useQuery<number>({
    queryKey: ["videos/count", searchTerm],
    queryFn: async () => await getVideosCountNew(creatorId, searchTerm),
  });

  return { videosCount, isSuccess };
};

export const useGetVideosCountForVendor = () => {
  const { creatorId, searchTerm } = useInboxFilters();

  const { data: videosCount, isSuccess } = useQuery<number>({
    queryKey: ["inbox/videos/count", creatorId, searchTerm],
    queryFn: async () => await getVideosCount(creatorId, searchTerm),
  });

  return { videosCount, isSuccess };
};

export const useGetVideosOLD = () => {
  const { creatorId, searchTerm } = useInboxFilters();
  const { selectedVideo, setSelectedVideo } = useSelectedInboxVideo();

  const {
    data: videos,
    isLoading,
    error,
  } = useQuery<InboxVideoDTO[]>({
    queryKey: ["inbox/videos", creatorId, searchTerm],
    queryFn: async () => {
      setSelectedVideo(null);
      return await getVideos(1, 10, creatorId, searchTerm);
    },
  });

  return { videos, isLoading, error };
};

export const useGetVideosNew = ({ limit = 5 }: { limit?: number }) => {
  // const { creatorId, searchTerm } = useInboxFilters();
  // const { selectedVideo, setSelectedVideo } = useSelectedInboxVideo();
  const { selectedVideo, setSelectedVideo, creatorId: _creatorId, search } = useInboxContext();
  const creatorId = _creatorId != -1 ? _creatorId : null;

  const {
    data: videos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<InboxVideoDTO[]>({
    queryKey: ["inbox/videos", creatorId, search],
    // queryFn: ({ pageParam }) =>
    //   getLibraryVideos(pageParam as number, limit, timePeriod, creatorId, videoStatus, searchTerm),
    queryFn: async ({ pageParam }) => {
      // selectVideo(null);
      const videos = await getVideos(pageParam as number, limit, creatorId || null, search);
      // If new results do not contain the selected video, select the first one
      if (!videos.some((task) => task.id === selectedVideo?.id)) {
        setSelectedVideo(videos[0]);
      }
      return videos;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
  });

  return { videos, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading };
};

// export const useGetVideosPendingRoleAssignment = (staffType: StaffType) => {
//   const { data: videos } = useQuery({
//     queryKey: ["videos/pending-role-assignment", staffType],
//     queryFn: async () => {
//       return await getVideosPendingRoleAssignment(staffType);
//     },
//   });

//   return { videos };
// };

export const useGetLibraryVideosOld = () => {
  const { user } = useAuthContext();
  const creatorId = user?.uid;

  const { timePeriod, videoStatus, searchTerm } = useLibraryFilters();

  const {
    data: videos,
    isLoading,
    error,
  } = useQuery<LibraryVideoDTO[]>({
    queryKey: ["library/videos", creatorId, timePeriod, searchTerm],
    queryFn: async () => await getLibraryVideos(1, 5, timePeriod, creatorId, videoStatus, searchTerm),
  });

  return { videos, isLoading, error };
};

export const useGetLibraryVideos = () => {
  const { user } = useAuthContext();
  // const creatorId = user?.uid;
  const creatorId = user?.email;

  const { timePeriod, videoStatus, searchTerm } = useLibraryFilters();

  const limit = 5;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<LibraryVideoDTO[]>({
    queryKey: ["library/videos", creatorId, timePeriod, videoStatus, searchTerm],
    queryFn: ({ pageParam }) => getLibraryVideos(pageParam as number, limit, timePeriod, creatorId, videoStatus, searchTerm),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
  });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage };
};

export const useGetVideosInReview = () => {
  const { user } = useAuthContext();
  // const creatorId = user?.uid;
  const creatorId = user?.email;

  const limit = 5;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<LibraryVideoDTO[]>({
    queryKey: ["overview/videos", creatorId],
    queryFn: ({ pageParam }) => getVideosInReview(pageParam as number, limit, creatorId),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
  });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage };
};

export const useGetVideosInReviewCount = () => {
  const { user } = useAuthContext();
  const creatorId = user?.email;

  const { data: videosCount, isSuccess } = useQuery<number>({
    queryKey: ["overview/review/count"],
    queryFn: async () => await getVideosInReviewCount(creatorId),
  });

  return { videosCount, isSuccess };
};

export const useGetVideoPreview = () => {
  const { id } = useParams();

  const {
    data: video,
    isLoading,
    error,
  } = useQuery<VideoPreviewDTO>({
    queryKey: ["library/video-preview", id],
    queryFn: async () => await getVideoPreview(+id),
  });

  return { video, isLoading, error };
};

export const useGetVideoPreviewMedia = () => {
  const { id } = useParams();

  const {
    data: videoMedia,
    isLoading,
    error,
  } = useQuery<VideoPreviewMediaDTO>({
    queryKey: ["library/video-preview-media", id],
    queryFn: async () => await getVideoPreviewMedia(+id),
  });

  return { videoMedia, isLoading, error };
};

export const useGetYoutubeChannels = () => {
  const { user } = useAuthContext();
  const creatorId = user?.email;

  const {
    data: channels,
    isLoading,
    error,
  } = useQuery<YoutubeChannelBasicDTO[]>({
    queryKey: ["add-video/channels", creatorId],
    queryFn: async () => await getYoutubeChannels(creatorId),
  });

  return { channels, isLoading, error };
};
