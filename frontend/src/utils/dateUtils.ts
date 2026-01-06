import { formatDistanceToNow, format, isValid, parseISO } from "date-fns";

export const formatSafeDate = (
  dateString: string,
  fallback: string = "Unknown"
) => {
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return isValid(date) ? format(date, "MMM d, yyyy") : fallback;
  } catch {
    return fallback;
  }
};

export const formatRelativeTime = (dateString: string) => {
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return isValid(date)
      ? formatDistanceToNow(date, { addSuffix: true })
      : "recently";
  } catch {
    return "recently";
  }
};
