// frontend/src/utils/dateUtils.ts - REUSABLE DATE UTILITIES
import { formatDistanceToNow, format, isValid, parseISO } from "date-fns";

/**
 * Safely format a date string to relative time (e.g., "2 hours ago")
 * @param dateInput - Date string, timestamp, or Date object
 * @param fallback - Fallback text for invalid dates
 * @returns Formatted relative time string
 */
export const formatSafeDate = (
  dateInput: string | number | Date | null | undefined,
  fallback: string = "No date"
): string => {
  if (!dateInput) return fallback;

  try {
    let date: Date;

    // Handle different input types
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput);
    } else if (typeof dateInput === "string") {
      // Try parsing as ISO string first, then fallback to Date constructor
      date = parseISO(dateInput);
      if (!isValid(date)) {
        date = new Date(dateInput);
      }
    } else {
      return fallback;
    }

    // Final validation
    if (!isValid(date)) return fallback;

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Date formatting error:", dateInput, error);
    }
    return fallback;
  }
};

/**
 * Safely format a date to absolute format (e.g., "Jan 15, 2024")
 * @param dateInput - Date string, timestamp, or Date object
 * @param formatPattern - date-fns format pattern
 * @param fallback - Fallback text for invalid dates
 * @returns Formatted date string
 */
export const formatAbsoluteDate = (
  dateInput: string | number | Date | null | undefined,
  formatPattern: string = "MMM dd, yyyy",
  fallback: string = "No date"
): string => {
  if (!dateInput) return fallback;

  try {
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput);
    } else if (typeof dateInput === "string") {
      date = parseISO(dateInput);
      if (!isValid(date)) {
        date = new Date(dateInput);
      }
    } else {
      return fallback;
    }

    if (!isValid(date)) return fallback;

    return format(date, formatPattern);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Date formatting error:", dateInput, error);
    }
    return fallback;
  }
};

/**
 * Check if a date string/object is valid
 * @param dateInput - Date to validate
 * @returns boolean indicating if date is valid
 */
export const isValidDate = (
  dateInput: string | number | Date | null | undefined
): boolean => {
  if (!dateInput) return false;

  try {
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput);
    } else if (typeof dateInput === "string") {
      date = parseISO(dateInput);
      if (!isValid(date)) {
        date = new Date(dateInput);
      }
    } else {
      return false;
    }

    return isValid(date);
  } catch {
    return false;
  }
};

/**
 * Get a safe Date object from various input types
 * @param dateInput - Date string, timestamp, or Date object
 * @returns Valid Date object or null
 */
export const getSafeDate = (
  dateInput: string | number | Date | null | undefined
): Date | null => {
  if (!dateInput) return null;

  try {
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput);
    } else if (typeof dateInput === "string") {
      date = parseISO(dateInput);
      if (!isValid(date)) {
        date = new Date(dateInput);
      }
    } else {
      return null;
    }

    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

/**
 * Format date with multiple fallback options
 * @param dateInput - Date input
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDateWithOptions = (
  dateInput: string | number | Date | null | undefined,
  options: {
    format?: "relative" | "absolute" | "short" | "long";
    fallback?: string;
    pattern?: string;
  } = {}
): string => {
  const {
    format: formatType = "relative",
    fallback = "No date",
    pattern = "MMM dd, yyyy",
  } = options;

  const date = getSafeDate(dateInput);
  if (!date) return fallback;

  try {
    switch (formatType) {
      case "relative":
        return formatDistanceToNow(date, { addSuffix: true });
      case "absolute":
        return format(date, pattern);
      case "short":
        return format(date, "MMM dd");
      case "long":
        return format(date, "MMMM dd, yyyy 'at' h:mm a");
      default:
        return formatDistanceToNow(date, { addSuffix: true });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Date formatting error:", dateInput, error);
    }
    return fallback;
  }
};

// Export commonly used date patterns
export const DATE_PATTERNS = {
  SHORT: "MMM dd",
  MEDIUM: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  WITH_TIME: "MMM dd, yyyy 'at' h:mm a",
  ISO: "yyyy-MM-dd",
  FULL: "EEEE, MMMM dd, yyyy",
} as const;

// Export default formatters for common use cases
export const formatters = {
  relative: (date: string | number | Date | null | undefined) =>
    formatSafeDate(date, "No date"),

  short: (date: string | number | Date | null | undefined) =>
    formatAbsoluteDate(date, DATE_PATTERNS.SHORT, "No date"),

  medium: (date: string | number | Date | null | undefined) =>
    formatAbsoluteDate(date, DATE_PATTERNS.MEDIUM, "No date"),

  withTime: (date: string | number | Date | null | undefined) =>
    formatAbsoluteDate(date, DATE_PATTERNS.WITH_TIME, "No date"),
};
