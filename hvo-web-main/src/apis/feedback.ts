import { get, post } from "@/services/api";
import { ApproveFeedbackDTO, FeedbackDTO, SubmitFeedbackDTO } from "hvo-shared";

export async function submitFeedback(submitFeedbackDTO: SubmitFeedbackDTO) {
  try {
    const response = await post(`videos/add-feedback`, submitFeedbackDTO);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`[submitFeedback] ${error}`);
    throw error;
  }
}

export async function getVideoFeedbacks(videoId: number): Promise<FeedbackDTO[]> {
  try {
    const response = await get(`videos/${videoId}/feedbacks/creator`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVideoFeedbacks] ${error}`);
    throw error;
  }
}

export async function getVendorFeedbacks(videoId: number): Promise<FeedbackDTO[]> {
  try {
    const response = await get(`videos/${videoId}/feedbacks/vendor`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVendorFeedbacks] ${error}`);
    throw error;
  }
}

export async function rejectFeedbackIssue(feedbackIssueId: number) {
  try {
    const response = await post(`videos/feedback-issues/${feedbackIssueId}/reject`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`[rejectFeedbackIssue] ${error}`);
    throw error;
  }
}

export async function approveFeedback(feedbackId: number, dataDTO: ApproveFeedbackDTO) {
  try {
    const response = await post(`videos/feedbacks/${feedbackId}/approve`, dataDTO);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`[approveFeedback] ${error}`);
    throw error;
  }
}

export async function rejectFeedback(feedbackId: number) {
  try {
    const response = await post(`videos/feedbacks/${feedbackId}/reject`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`[rejectFeedback] ${error}`);
    throw error;
  }
}

// --------- Staff ---------
export async function getStaffFeedbacks(taskId: number): Promise<FeedbackDTO[]> {
  try {
    const response = await get(`videos/${taskId}/feedbacks/staff`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getStaffFeedbacks] ${error}`);
    throw error;
  }
}
