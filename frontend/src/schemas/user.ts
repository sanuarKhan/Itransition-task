import z from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  pass: z.string().min(4, "Password must be at least 4 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  pass: z.string().min(4, "Password must be at least 4 characters long"),
});

export { registerSchema, loginSchema };
