import { Firestore, Timestamp } from "firebase/firestore";
import moment from "moment";

function isSameDate(date1: moment.Moment, date2: moment.Moment): boolean {
  return date1.isSame(date2, "day");
}

export function daysAgoFromDate(timestamp: Date): string {
  const now: moment.Moment = moment();
  const date: moment.Moment = moment(timestamp);

  if (isSameDate(date, now)) {
    return `Today`;
  } else if (isSameDate(date, now.clone().subtract(1, "days"))) {
    return `Yesterday`;
  } else {
    const diffInDays = now.diff(date, "days");
    return `${diffInDays} days ago`;
  }
}

export function daysAgoFromTimestamp(timestamp: Timestamp): string {
  const now: moment.Moment = moment();
  const date: moment.Moment = moment(convertTimestampToDate(timestamp));

  if (isSameDate(date, now)) {
    return `Today`;
  } else if (isSameDate(date, now.clone().subtract(1, "days"))) {
    return `Yesterday`;
  } else {
    const diffInDays = now.diff(date, "days");
    return `${diffInDays} days ago`;
  }
}

/**
 * Temporal fix for mismatch on Timestmap between Client and Server.
 */
function convertTimestampToDate(timestamp: Timestamp): Date {
  const { seconds, nanoseconds } = timestamp;
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;
  const date = new Date(milliseconds);
  return date;
}
