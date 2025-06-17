import {
  approveFeedback,
  getStaffFeedbacks,
  getVendorFeedbacks,
  getVideoFeedbacks,
  rejectFeedback,
  rejectFeedbackIssue,
} from "@/apis/feedback";
import { useInboxContext } from "@/sections/admin/inbox/contexts/inbox-context";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApproveFeedbackDTO, FeedbackDTO, FeedbackStatus } from "hvo-shared";
import { useParams } from "next/navigation";

export const useGetVideoFeedbacks = () => {
  const { id } = useParams();

  const {
    data: feedbacks,
    isLoading,
    error,
    refetch,
  } = useQuery<FeedbackDTO[]>({
    queryKey: ["library/video-preview/feedbacks", id],
    queryFn: async () => await getVideoFeedbacks(+id),
  });

  return { feedbacks, isLoading, error, refetch };
};

export const useGetVendorFeedbacks = () => {
  // const { selectedVideo } = useSelectedInboxVideo();
  const { selectedVideo } = useInboxContext();
  const id = selectedVideo?.id || -1;

  const {
    data: feedbacks,
    isLoading,
    error,
    refetch,
  } = useQuery<FeedbackDTO[]>({
    queryKey: ["feedbacks/vendor", id],
    queryFn: async () => await getVendorFeedbacks(id),
  });

  return { feedbacks, isLoading, error, refetch };
};

// Uses: Cache Update
export const useApproveFeedback = (feedbackId: number) => {
  const queryClient = useQueryClient();

  const { selectedVideo } = useSelectedInboxVideo();
  const videoId = selectedVideo?.id || -1;

  const mutation = useMutation({
    mutationFn: async (dataDTO: ApproveFeedbackDTO) => {
      return approveFeedback(feedbackId, dataDTO);
    },
    onSuccess: (_, data) => {
      queryClient.setQueryData(["feedbacks/vendor", videoId], (oldData?: FeedbackDTO[]) => {
        if (!oldData) return [];
        return oldData.map((feedback) =>
          feedback.id === feedbackId ? { ...feedback, status: FeedbackStatus.IN_PROGRESS } : feedback
        );
      });
    },
    onError: (error) => {
      console.error("Error approving feedback:", error);
    },
  });

  return { mutate: mutation.mutate, isLoading: mutation.isPending };
};

// Uses: Optimistic Update
export const useRejectFeedback = () => {
  const queryClient = useQueryClient();

  const { selectedVideo } = useSelectedInboxVideo();
  const videoId = selectedVideo?.id || -1;

  const mutation = useMutation({
    mutationFn: async (feedbackId: number) => {
      return rejectFeedback(feedbackId);
    },
    onMutate: async (feedbackId) => {
      await queryClient.cancelQueries({ queryKey: ["feedbacks/vendor", videoId] });

      // Get previous state before removing the feedback (used for rollback in case of failure)
      const previousFeedbacks = queryClient.getQueryData<FeedbackDTO[]>(["feedbacks/vendor", videoId]);

      // Optimistically update the cache
      queryClient.setQueryData(["feedbacks/vendor", videoId], (oldData?: FeedbackDTO[]) => {
        if (!oldData) return [];

        return oldData.map((feedback) =>
          feedback.id === feedbackId ? { ...feedback, status: FeedbackStatus.REJECTED } : feedback
        );
      });

      return { previousFeedbacks };
    },
    onError: (error, _, context) => {
      console.error("Error rejecting feedback issue:", error);

      // Rollback to previous state if mutation fails
      if (context?.previousFeedbacks) {
        queryClient.setQueryData(["feedbacks/vendor", videoId], context.previousFeedbacks);
      }
    },
  });

  return { mutate: mutation.mutate, isLoading: mutation.isPending };
};

// Uses: Optimistic Update
export const useRejectFeedbackIssue = (feedbackId: number) => {
  const queryClient = useQueryClient();

  const { selectedVideo } = useSelectedInboxVideo();
  const videoId = selectedVideo?.id || -1;

  return useMutation({
    mutationFn: async (issueId: number) => {
      return rejectFeedbackIssue(issueId);
    },
    onMutate: async (issueId) => {
      await queryClient.cancelQueries({ queryKey: ["feedbacks/vendor", videoId] });

      // Get previous state before removing the issue (used for rollback in case of failure)
      const previousFeedbacks = queryClient.getQueryData<FeedbackDTO[]>(["feedbacks/vendor", videoId]);

      // Optimistically update the cache
      queryClient.setQueryData(["feedbacks/vendor", videoId], (oldData?: FeedbackDTO[]) => {
        if (!oldData) return [];

        console.log("Optimistically updating cache - ", feedbackId, issueId);

        return oldData.map((feedback) =>
          feedback.id === feedbackId
            ? {
              ...feedback,
              issues: feedback.issues.filter((issue) => issue.id !== issueId),
            }
            : feedback
        );
      });

      return { previousFeedbacks };
    },
    onError: (error, _, context) => {
      console.error("Error rejecting feedback issue:", error);

      // Rollback to previous state if mutation fails
      if (context?.previousFeedbacks) {
        queryClient.setQueryData(["feedbacks/vendor", videoId], context.previousFeedbacks);
      }
    },
    onSuccess: () => {
      // enqueueSnackbar("Issue rejected successfully!", { variant: "success" });
    },
  });
};

//  -------------- Staff Feedbacks --------------
// export const useGetStaffFeedbacksDeprecated = () => {
//   const { selectedTask } = useSelectedTask();
//   const id = selectedTask || -1;

//   const {
//     data: feedbacks,
//     isLoading,
//     error,
//     refetch,
//   } = useQuery<FeedbackDTO[]>({
//     queryKey: ["feedbacks/vendor", id],
//     queryFn: async () => await getStaffFeedbacks(id),
//   });

//   return { feedbacks, isLoading, error, refetch };
// };


export const useGetStaffFeedbacks = ({ taskId }: { taskId: number | undefined }) => {
  const {
    data: feedbacks,
    isLoading,
    error,
    refetch,
  } = useQuery<FeedbackDTO[]>({
    queryKey: ["staff/feedbacks", taskId],
    queryFn: async () => await getStaffFeedbacks(taskId as number),
    enabled: !!taskId,
  });

  return { feedbacks, isLoading, error, refetch };
};
