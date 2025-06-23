import type { TopicType } from "./form.types";
export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  isRequired: boolean;
  showInTable: boolean;
  order: number;
  options?: QuestionOption[];
}

export type QuestionType =
  | "SINGLE_LINE"
  | "MULTI_LINE"
  | "INTEGER"
  | "CHECKBOX";

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface TopicOption {
  value: TopicType;
  label: string;
}

export interface QuestionTypeInfo {
  type: QuestionType;
  icon: any;
  label: string;
  limit: number;
}
