import { z } from "zod";

export const briefSchema = z.object({
  companyName: z.string().min(1, "Обов'язкове поле"),
  contactName: z.string().min(1, "Обов'язкове поле"),
  phone: z.string().min(1, "Обов'язкове поле"),
  email: z.string().min(1, "Обов'язкове поле").email("Невірний email"),
  contactMethod: z.string().min(1, "Обов'язкове поле"),
  messenger: z.string().optional(),
  contactTime: z.string().optional(),
  projectType: z.string().optional(),
  goal: z.string().min(1, "Обов'язкове поле"),
  problem: z.string().min(1, "Обов'язкове поле"),
  features: z.string().min(1, "Обов'язкове поле"),
  functionalModules: z.string().min(1, "Обов'язкове поле"),
  valueProposition: z.string().optional(),
  targetAudience: z.string().optional(),
  uniqueness: z.string().optional(),
  competitors: z.string().optional(),
  existingWork: z.string().optional(),
  references: z.string().optional(),
  expectations: z.string().optional(),
  needAuth: z.boolean(),
  needApi: z.boolean(),
  exampleSites: z.string().optional(),
  designStyle: z.string().optional(),
  budget: z.string().min(1, "Обов'язкове поле"),
  deadline: z.string().min(1, "Обов'язкове поле"),
  priority: z.string().min(1, "Обов'язкове поле"),
  comments: z.string().optional(),
});

export type BriefFormData = z.infer<typeof briefSchema>;

export const briefUpdateSchema = briefSchema.partial();

export type BriefUpdateData = z.infer<typeof briefUpdateSchema>;

export const requiredFieldsByStep: Record<number, (keyof BriefFormData)[]> = {
  1: ["companyName", "contactName", "phone", "email", "contactMethod"],
  2: ["goal", "problem", "features"],
  3: ["functionalModules"],
  4: [],
  5: ["budget", "deadline", "priority"],
  6: [],
};