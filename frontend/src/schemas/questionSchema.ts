import { z } from "zod";

export const createQuestionSchema = z.object({
  type: z.enum(["SINGLE_LINE", "MULTI_LINE", "INTEGER", "CHECKBOX"]),
});

export const updateQuestionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  isRequired: z.boolean().optional(),
  showInTable: z.boolean().optional(),
  order: z.number().min(0).optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
