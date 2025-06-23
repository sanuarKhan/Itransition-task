import type { Question } from "./question.types";
export interface FormTemplate {
  id?: string;
  title: string;
  description: string;
  topic: TopicType;
  thumbnail: File | null;
  isPublic: boolean;
  tags: string[];
  questions: Question[];
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export type TopicType =
  | "EDUCATION"
  | "BUDGETS"
  | "QUIZZ"
  | "REPORTS"
  | "RESEARCH"
  | "SURVEY"
  | "PULL"
  | "OTHERS";
