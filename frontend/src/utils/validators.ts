import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "./constants";

export const validateFile = (file: File) => {
  const errors: string[] = [];

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push("Only PNG, JPG files are allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push("File size must be less than 10MB");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isRequired = (value: any): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value != null;
};
