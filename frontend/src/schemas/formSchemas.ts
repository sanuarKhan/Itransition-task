import { z } from "zod";

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(["SINGLE_LINE", "MULTI_LINE", "INTEGER", "CHECKBOX"]),
  title: z.string().min(1, "Question title is required"),
  description: z.string().optional(),
  isRequired: z.boolean(),
  showInTable: z.boolean(),
  order: z.number(),
});

export const formTemplateSchema = z.object({
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  topic: z.enum([
    "EDUCATION",
    "BUDGETS",
    "QUIZZ",
    "REPORTS",
    "RESEARCH",
    "SURVEY",
    "POLL",
    "OTHERS",
  ]),
  thumbnail: z.string().nullable().optional(), // Assuming thumbnail will be a URL string
  isPublic: z.boolean(),
  tags: z.array(z.string()),
  questions: z.array(questionSchema),
});

export const formSettingsSchema = z.object({
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  topic: z.enum([
    "EDUCATION",
    "BUDGETS",
    "QUIZZ",
    "REPORTS",
    "RESEARCH",
    "SURVEY",
    "POLL",
    "OTHERS",
  ]),
  thumbnail: z.string().nullable().optional(),
  isPublic: z.boolean(),
  tags: z.array(z.string()),
});

//types
export type QuestionType = z.infer<typeof questionSchema>;
export type FormTemplateType = z.infer<typeof formTemplateSchema>;
export type FormSettingsType = z.infer<typeof formSettingsSchema>;
