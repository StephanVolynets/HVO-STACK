import moment from "moment";

export function formatDate(date: Date): string {
  return moment(date).format("MM/DD/YYYY hh:mm A");
}
