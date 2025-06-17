import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InboxVideoDTO } from "hvo-shared";

export const useSelectedInboxVideo = () => {
  const queryClient = useQueryClient();

  const selectVideo = (video: InboxVideoDTO | null) => {
    queryClient.setQueryData(["inbox/video"], video);
  };

  const getSelectedVideo = () => {
    return queryClient.getQueryData(["inbox/video"]) as InboxVideoDTO | null;
  };

  //   const useGetSelectedVideo = () => {
  //     // Return useQuery to subscribe to changes in the selected video
  //     return useQuery({ queryKey: ["inbox/video"] });
  //   };

  return { selectVideo, selectedInboxVideo: getSelectedVideo() };
};

// export const useSelectedInboxVideo = () => {
//   const queryClient = useQueryClient();

//   const selectVideo = (video: InboxVideoDTO | null) => {
//     queryClient.setQueryData(["inbox/video"], video);
//   };

//   //   const getSelectedVideo = () => {
//   //     return queryClient.getQueryData(["inbox/video"]) as InboxVideoDTO;
//   //   };

//   //   const useGetSelectedVideo = () => {
//   //     // Return useQuery to subscribe to changes in the selected video
//   //     return useQuery({ queryKey: ["inbox/video"] });
//   //   };

//   const { data: selectedInboxVideo } = useQuery<InboxVideoDTO | null>({
//     queryKey: ["inbox/video"],
//     // queryFn: () => {},
//   });

//   return { selectVideo, selectedInboxVideo };
// };

// // ----------------------------
// //  Use Inbox Filters
// interface InboxFilters {
//   timePeriod: string;
//   creatorId: number | null;
//   searchTerm: string;
// }

// export const useInboxFilters = () => {
//   const queryClient = useQueryClient();

//   const setFilters = (filters: InboxFilters) => {
//     queryClient.setQueryData(["inbox/filters"], filters);
//   };

//   const getFilters = () => {
//     return (
//       queryClient.getQueryData<InboxFilters>(["inbox/filters"]) || {
//         timePeriod: "today",
//         creatorId: null,
//         searchTerm: "",
//       }
//     );
//   };

//   const { data: filters } = useQuery<InboxFilters>({
//     queryKey: ["inbox/filters"],
//     queryFn: () => getFilters(),
//     initialData: getFilters,
//   });

//   return { filters, setFilters };
// };
