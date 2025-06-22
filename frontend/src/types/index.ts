import { z } from "zod";

export const QuestionType = z.enum([
  "SINGLE_LINE",
  "MULTI_LINE",
  "INTEGER",
  "CHECKBOX",
]);
export type QuestionType = z.infer<typeof QuestionType>;

export const Topic = z.enum([
  "EDUCATION",
  "BUDGETS",
  "QUIZZ",
  "REPORTS",
  "RESEARCH",
  "SURVEY",
  "PULL",
  "OTHERS",
]);
export type Topic = z.infer<typeof Topic>;

export const QuestionSchema = z.object({
  id: z.string(),
  type: QuestionType,
  title: z.string().min(1, "Question title is required"),
  description: z.string().optional(),
  isRequired: z.boolean().default(false),
  showInTable: z.boolean().default(false),
  order: z.number().min(0),
});
export type Question = z.infer<typeof QuestionSchema>;

export const FormTemplateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  topic: Topic,
  thumbnail: z.string().nullable().optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()),
  questions: z.array(QuestionSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type FormTemplate = z.infer<typeof FormTemplateSchema>;

export const CreateFormTemplateSchema = FormTemplateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateFormTemplate = z.infer<typeof CreateFormTemplateSchema>;

export const UpdateFormTemplateSchema = FormTemplateSchema.partial().omit({
  createdAt: true,
});

export type UpdateFormTemplate = z.infer<typeof UpdateFormTemplateSchema>;

export interface QuestionTypesConfig {
  type: QuestionType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  limit: number;
}

export interface TopicOption {
  value: Topic;
  label: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type activeTab = "settings" | "questions" | "preview";

export interface FormBuilderState {
  template: FormTemplate;
  activeTab: activeTab;
  selectedUsers: string[];
  draggedItem: number | null;
  newTag: string;
  showTagSuggestions: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}
