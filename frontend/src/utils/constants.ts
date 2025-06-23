import type { TopicOption, QuestionTypeInfo } from "../types/question.types";
import { Type, AlignLeft, Hash, CheckSquare } from "lucide-react";

export const TOPICS: TopicOption[] = [
  { value: "EDUCATION", label: "Education" },
  { value: "BUDGETS", label: "Budgets" },
  { value: "QUIZZ", label: "Quiz" },
  { value: "REPORTS", label: "Reports" },
  { value: "RESEARCH", label: "Research" },
  { value: "SURVEY", label: "Survey" },
  { value: "PULL", label: "Poll" },
  { value: "OTHERS", label: "Others" },
];

export const QUESTION_TYPES: QuestionTypeInfo[] = [
  { type: "SINGLE_LINE", icon: Type, label: "Short Answer", limit: 4 },
  { type: "MULTI_LINE", icon: AlignLeft, label: "Paragraph", limit: 4 },
  { type: "INTEGER", icon: Hash, label: "Number", limit: 4 },
  { type: "CHECKBOX", icon: CheckSquare, label: "Checkbox", limit: 4 },
];

export const SUGGESTED_TAGS = [
  "survey",
  "feedback",
  "research",
  "quiz",
  "poll",
  "registration",
  "application",
  "form",
  "questionnaire",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export const FORM_VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "Form title is required",
  QUESTION_TITLE_REQUIRED: "Question title is required",
  MAX_QUESTIONS_REACHED: "Maximum questions limit reached for this type",
  INVALID_FILE_TYPE: "Only PNG, JPG files are allowed",
  FILE_TOO_LARGE: "File size must be less than 10MB",
};
