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

export const projectCategories = ["Web", "Mobile"] as const;

export const projectSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase, digits and hyphens only"),
  name: z.string().min(1),
  category: z.enum(projectCategories),
  summary: z.string().min(1),
  /** Card/hero screenshot. Local path under /public so next/image can optimise it. */
  image: z.string().regex(/^\/projects\/[\w-]+\.(png|jpg|webp)$/, "image must be a local /projects/<name>.<ext> path"),
  tech: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(2018).max(2100),
  featured: z.boolean(),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
});

export type Stat = z.infer<typeof statSchema>;
export type Client = z.infer<typeof clientSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
