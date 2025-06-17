import { TaskStatus } from "hvo-shared";

export const applyTaskStatusFilterForTranscriptor = (where: any, filter: string) => {
    switch (filter) {
        case "all_videos":
            break;
        //   case "pending_submission":
        //     where.transcriptionTask.autoUploadedPendingSubmission = true;
        //     break;
        case "ready_for_work":
            where.transcriptionTask.status = TaskStatus.IN_PROGRESS;
            break;
        case "completed":
            where.transcriptionTask.status = TaskStatus.COMPLETED;
            break;
        case "upcoming":
            where.transcriptionTask.status = TaskStatus.PENDING;
            break;
        case "feedback":
            where.transcriptionTask.feedbacks = {
                some: {} // has at least 1 feedback
            };
            break;
        default:
            break;
    }
};

export const applyTaskStatusFilterForOtherStaff = (where: any, filter: string) => {
    // Ensure the AND array exists
    if (!where.audioDubs.some.tasks.some.AND) {
        where.audioDubs.some.tasks.some.AND = [];
    }

    switch (filter) {
        case "all_videos":
            break;
        // case "pending_submission":
        //     where.audioDubs.some.tasks.AND.push({
        //         autoUploadedPendingSubmission: true
        //     });
        //     break;
        case "ready_for_work":
            where.audioDubs.some.tasks.some.AND.push({
                status: TaskStatus.IN_PROGRESS
            });
            break;
        case "completed":
            where.audioDubs.some.tasks.some.AND.push({
                status: TaskStatus.COMPLETED
            });
            break;
        case "upcoming":
            where.audioDubs.some.tasks.some.AND.push({
                status: TaskStatus.PENDING
            });
            break;
        case "feedback":
            where.audioDubs.some.tasks.some.AND.push({
                feedbacks: {
                    some: {} // has at least 1 feedback
                }
            });
            break;
        default:
            break;
    }
};

export const applyVideoSearchTerm = (where: any, searchTerm: string) => {
    if (searchTerm) {
        where.OR = [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } }
        ];
    }
};

