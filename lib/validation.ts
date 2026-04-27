import { z } from "zod";

export const briefSchema = z.object({
  companyName: z.string(),
  contactName: z.string(),
  phone: z.string(),
  email: z.string(),
  contactMethod: z.string(),
  messenger: z.string().optional(),
  contactTime: z.string().optional(),
  projectType: z.string().optional(),
  goal: z.string(),
  problem: z.string(),
  features: z.string(),
  functionalModules: z.string(),
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
  budget: z.string(),
  deadline: z.string(),
  priority: z.string(),
  comments: z.string().optional(),
});

export type BriefFormData = z.infer<typeof briefSchema>;

export const briefUpdateSchema = briefSchema.partial();

export type BriefUpdateData = z.infer<typeof briefUpdateSchema>;