import { z } from "zod";

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(["SINGLE_LINE", "MULTI_LINE", "INTEGER", "CHECKBOX"]),
  title: z.string().min(1, "Question title is required"),
  description: z.string().optional(),
  isRequired: z.boolean().default(false),
  showInTable: z.boolean().default(false),
  order: z.number().min(0),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const formTemplateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  topic: z.enum([
    "EDUCATION",
    "BUDGETS",
    "QUIZZ",
    "REPORTS",
    "RESEARCH",
    "SURVEY",
    "PULL",
    "OTHERS",
  ]),
  thumbnail: z.string().optional(),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()),
  allowUserIds: z.array(z.string()).optional(),
});

export type FormTemplateInput = z.infer<typeof formTemplateSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;

export const formSubmissionSchema = z.object({
  responses: z.record(z.string(), z.any()),
});
