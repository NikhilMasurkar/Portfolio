import { z } from "zod";

export const statSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const clientSchema = z.object({
  name: z.string().min(1),
  mark: z.string().length(2),
});

export const experienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  summary: z.string().min(1),
});

export type Stat = z.infer<typeof statSchema>;
export type Client = z.infer<typeof clientSchema>;
export type Experience = z.infer<typeof experienceSchema>;
