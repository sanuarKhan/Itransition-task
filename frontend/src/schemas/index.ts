import { z } from "zod";

// Zod Enums
export const RoleSchema = z.enum(["USER", "ADMIN"]);
export const LanguageSchema = z.enum(["EN", "RU", "BN"]);
export const ThemeSchema = z.enum(["LIGHT", "DARK"]);
export const TopicSchema = z.enum([
  "EDUCATION",
  "BUDGETS",
  "QUIZZ",
  "REPORTS",
  "RESEARCH",
  "SURVEY",
  "PULL",
  "OTHERS",
]);
export const QuestionTypeSchema = z.enum([
  "SINGLE_LINE",
  "MULTI_LINE",
  "INTEGER",
  "CHECKBOX",
]);

// Base Zod Schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  pass: z.string().min(1),
  name: z.string().min(1),
  img: z.string().url().optional(),
  lang: LanguageSchema.default("EN"),
  theme: ThemeSchema.default("LIGHT"),
  role: RoleSchema.default("USER"),
  isBlocked: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  topic: TopicSchema,
  thumbnail: z.string().url().optional(),
  isPublic: z.boolean().default(true),
  ownerId: z.string().uuid(),
});

export const TemplateAccessSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export const TagOnTemplateSchema = z.object({
  templateId: z.string().uuid(),
  tagId: z.string().uuid(),
});

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: QuestionTypeSchema,
  showInTable: z.boolean().default(false),
  order: z.number().int().min(0),
  isRequired: z.boolean().default(false),
});

export const AnswerSchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  formId: z.string().uuid(),
  valueText: z.string().optional(),
  valueInt: z.number().int().optional(),
  valueBool: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const FormSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const CommentSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LikeSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Extended Schemas with Relations
export const UserWithRelationsSchema = UserSchema.extend({
  templates: z.array(TemplateSchema).optional(),
  forms: z.array(FormSchema).optional(),
  comments: z.array(CommentSchema).optional(),
  likes: z.array(LikeSchema).optional(),
  accessTo: z.array(TemplateAccessSchema).optional(),
});

export const TemplateWithRelationsSchema = TemplateSchema.extend({
  owner: UserSchema.optional(),
  allowedUsers: z.array(TemplateAccessSchema).optional(),
  questions: z.array(QuestionSchema).optional(),
  forms: z.array(FormSchema).optional(),
  comments: z.array(CommentSchema).optional(),
  likes: z.array(LikeSchema).optional(),
  tags: z.array(TagOnTemplateSchema).optional(),
});

export const QuestionWithRelationsSchema = QuestionSchema.extend({
  template: TemplateSchema.optional(),
  answers: z.array(AnswerSchema).optional(),
});

export const AnswerWithRelationsSchema = AnswerSchema.extend({
  question: QuestionSchema.optional(),
  form: FormSchema.optional(),
});

export const FormWithRelationsSchema = FormSchema.extend({
  template: TemplateSchema.optional(),
  user: UserSchema.optional(),
  answers: z.array(AnswerSchema).optional(),
});

export const CommentWithRelationsSchema = CommentSchema.extend({
  template: TemplateSchema.optional(),
  user: UserSchema.optional(),
});

export const LikeWithRelationsSchema = LikeSchema.extend({
  template: TemplateSchema.optional(),
  user: UserSchema.optional(),
});

// Create/Update Schemas
export const CreateUserSchema = z.object({
  email: z.string().email(),
  pass: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  img: z.string().url().optional(),
  lang: LanguageSchema.optional(),
  theme: ThemeSchema.optional(),
  role: RoleSchema.optional(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  img: z.string().url().optional(),
  lang: LanguageSchema.optional(),
  theme: ThemeSchema.optional(),
  isBlocked: z.boolean().optional(),
});

export const CreateTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  topic: TopicSchema,
  thumbnail: z.string().url().optional(),
  isPublic: z.boolean().default(true),
  ownerId: z.string().uuid(),
});

export const UpdateTemplateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  topic: TopicSchema.optional(),
  thumbnail: z.string().url().optional(),
  isPublic: z.boolean().optional(),
});

export const CreateQuestionSchema = z.object({
  templateId: z.string().uuid(),
  title: z.string().min(1, "Question title is required"),
  description: z.string().optional(),
  type: QuestionTypeSchema,
  showInTable: z.boolean().default(false),
  order: z.number().int().min(0),
  isRequired: z.boolean().default(false),
});

export const UpdateQuestionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: QuestionTypeSchema.optional(),
  showInTable: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  isRequired: z.boolean().optional(),
});

export const CreateAnswerSchema = z
  .object({
    questionId: z.string().uuid(),
    formId: z.string().uuid(),
    valueText: z.string().optional(),
    valueInt: z.number().int().optional(),
    valueBool: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const values = [data.valueText, data.valueInt, data.valueBool].filter(
        (v) => v !== undefined
      );
      return values.length === 1;
    },
    {
      message: "Exactly one value field must be provided",
    }
  );

export const CreateCommentSchema = z.object({
  templateId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1, "Comment content is required"),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});

// API Response Schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  });

// Filter Schemas
export const UserFiltersSchema = z.object({
  role: RoleSchema.optional(),
  lang: LanguageSchema.optional(),
  theme: ThemeSchema.optional(),
  isBlocked: z.boolean().optional(),
  search: z.string().optional(),
});

export const TemplateFiltersSchema = z.object({
  topic: TopicSchema.optional(),
  isPublic: z.boolean().optional(),
  ownerId: z.string().uuid().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const QuestionFiltersSchema = z.object({
  templateId: z.string().uuid().optional(),
  type: QuestionTypeSchema.optional(),
  isRequired: z.boolean().optional(),
  showInTable: z.boolean().optional(),
});

// Auth Schemas
export const LoginCredentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  img: z.string().url().optional(),
  lang: LanguageSchema,
  theme: ThemeSchema,
  role: RoleSchema,
});

export const AuthResponseSchema = z.object({
  user: AuthUserSchema,
  token: z.string(),
  refreshToken: z.string().optional(),
});

// Form Submission Schema
export const FormSubmissionSchema = z.object({
  templateId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      value: z.union([z.string(), z.number(), z.boolean()]),
    })
  ),
});

// Sort Options Schema
export const SortOptionsSchema = z.object({
  field: z.string().min(1),
  direction: z.enum(["asc", "desc"]),
});

// Template Statistics Schema
export const TemplateStatisticsSchema = z.object({
  totalForms: z.number().int().min(0),
  totalComments: z.number().int().min(0),
  totalLikes: z.number().int().min(0),
  averageCompletionTime: z.number().optional(),
});

export const TemplateDetailsSchema = TemplateWithRelationsSchema.extend({
  statistics: TemplateStatisticsSchema.optional(),
  userHasLiked: z.boolean().optional(),
  userHasAccess: z.boolean().optional(),
  userForm: FormSchema.optional(),
});

// Type Inference - Generate TypeScript types from Zod schemas
export type Role = z.infer<typeof RoleSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export type User = z.infer<typeof UserSchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type TemplateAccess = z.infer<typeof TemplateAccessSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type TagOnTemplate = z.infer<typeof TagOnTemplateSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type Form = z.infer<typeof FormSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type Like = z.infer<typeof LikeSchema>;

export type UserWithRelations = z.infer<typeof UserWithRelationsSchema>;
export type TemplateWithRelations = z.infer<typeof TemplateWithRelationsSchema>;
export type QuestionWithRelations = z.infer<typeof QuestionWithRelationsSchema>;
export type AnswerWithRelations = z.infer<typeof AnswerWithRelationsSchema>;
export type FormWithRelations = z.infer<typeof FormWithRelationsSchema>;
export type CommentWithRelations = z.infer<typeof CommentWithRelationsSchema>;
export type LikeWithRelations = z.infer<typeof LikeWithRelationsSchema>;

export type CreateUserData = z.infer<typeof CreateUserSchema>;
export type UpdateUserData = z.infer<typeof UpdateUserSchema>;
export type CreateTemplateData = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplateData = z.infer<typeof UpdateTemplateSchema>;
export type CreateQuestionData = z.infer<typeof CreateQuestionSchema>;
export type UpdateQuestionData = z.infer<typeof UpdateQuestionSchema>;
export type CreateAnswerData = z.infer<typeof CreateAnswerSchema>;
export type CreateCommentData = z.infer<typeof CreateCommentSchema>;
export type CreateTagData = z.infer<typeof CreateTagSchema>;

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type UserFilters = z.infer<typeof UserFiltersSchema>;
export type TemplateFilters = z.infer<typeof TemplateFiltersSchema>;
export type QuestionFilters = z.infer<typeof QuestionFiltersSchema>;
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type FormSubmission = z.infer<typeof FormSubmissionSchema>;
export type SortOptions = z.infer<typeof SortOptionsSchema>;
export type TemplateStatistics = z.infer<typeof TemplateStatisticsSchema>;
export type TemplateDetails = z.infer<typeof TemplateDetailsSchema>;

// Utility type aliases
export type UserId = string;
export type TemplateId = string;
export type QuestionId = string;
export type FormId = string;
export type AnswerId = string;
export type CommentId = string;
export type LikeId = string;
export type TagId = string;
