export const applyGetTasksFilters = (where: any, filter: string) => {
  switch (filter) {
    case "all_videos":
      break;
    case "pending_submission":
      where.autoUploadedPendingSubmission = true;
      break;
    case "ready_for_work":
      where.status = "IN_PROGRESS";
      break;
    case "completed":
      where.status = "COMPLETED";
      break;
    case "upcoming":
      where.status = "PENDING";
      break;
    case "feedback":
      where.audioDub = {
        feedbacks: {
          some: {}, // has at least 1 feedback
        },
      };
      break;
    default:
      break;
  }
};

export const applyGetTaasksSearchTerm = (where: any, searchTerm: string) => {
  if (searchTerm) {
    where.OR = [
      {
        audioDub: {
          video: {
            title: { contains: searchTerm, mode: "insensitive" },
          },
        },
      },
      {
        audioDub: {
          video: {
            description: { contains: searchTerm, mode: "insensitive" },
          },
        },
      },
    ];
  }
};

