import { StatsMode } from "./components/creator-card/components/stats-card";

export const getFollowUpText = (mode: StatsMode): string => {
  switch (mode) {
    case StatsMode.Queue:
      return "Uploaded today";
    case StatsMode.InProgress:
      return "Started today";
    case StatsMode.Completed:
      return "Completed today";
    default:
      return "";
  }
};

export const getColor = (mode: StatsMode): string => {
  switch (mode) {
    case StatsMode.Queue:
      return "#262626";
    case StatsMode.InProgress:
      return "#4285F4";
    case StatsMode.Completed:
      return "#00B280";
    default:
      return "";
  }
};

export const getTitleText = (mode: StatsMode): string => {
  switch (mode) {
    case StatsMode.Queue:
      return "Videos in Queue";
    case StatsMode.InProgress:
      return "In Progress";
    case StatsMode.Completed:
      return "Completed";
    default:
      return "";
  }
};
