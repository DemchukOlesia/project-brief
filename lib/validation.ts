import { z } from "zod";

export const briefSchema = z.object({
  companyName: z.string().min(1, "Обов'язкове поле"),
  contactName: z.string().min(1, "Обов'язкове поле"),
  phone: z.string().min(1, "Обов'язкове поле"),
  email: z.string().min(1, "Обов'язкове поле").email("Невірний email"),
  contactMethod: z.string().min(1, "Обов'язкове поле"),
  messenger: z.string().optional(),
  contactTime: z.string().min(1, "Обов'язкове поле"),
  projectType: z.string().optional(),
  goal: z.string().min(1, "Обов'язкове поле"),
  problem: z.string().min(1, "Обов'язкове поле"),
  features: z.string().min(1, "Обов'язкове поле"),
  functionalModules: z.string().min(1, "Обов'язкове поле"),
  valueProposition: z.string().min(1, "Обов'язкове поле"),
  targetAudience: z.string().min(1, "Обов'язкове поле"),
  uniqueness: z.string().min(1, "Обов'язкове поле"),
  competitors: z.string().min(1, "Обов'язкове поле"),
  existingWork: z.string().min(1, "Обов'язкове поле"),
  references: z.string().min(1, "Обов'язкове поле"),
  expectations: z.string().optional(),
  needAuth: z.boolean(),
  needApi: z.boolean(),
  exampleSites: z.string().optional(),
  designStyle: z.string().min(1, "Обов'язкове поле"),
  budget: z.string().min(1, "Обов'язкове поле"),
  deadline: z.string().min(1, "Обов'язкове поле"),
  priority: z.string().min(1, "Обов'язкове поле"),
  comments: z.string().optional(),
});

export type BriefFormData = z.infer<typeof briefSchema>;

export const briefUpdateSchema = briefSchema.partial();

export type BriefUpdateData = z.infer<typeof briefUpdateSchema>;

export const requiredFieldsByStep: Record<number, (keyof BriefFormData)[]> = {
  1: ["companyName", "contactName", "phone", "email", "contactMethod", "contactTime"],
  2: ["features", "problem", "goal", "valueProposition", "targetAudience", "uniqueness", "competitors", "existingWork", "references"],
  3: ["functionalModules"],
  4: ["designStyle"],
  5: ["budget", "deadline", "priority"],
  6: ["comments"],
};

export const stepFieldOrder: Record<number, string[]> = {
  1: ["companyName", "contactName", "phone", "email", "contactMethod", "messenger", "contactTime"],
  2: ["features", "problem", "goal", "valueProposition", "targetAudience", "uniqueness", "competitors", "existingWork", "references", "expectations"],
  3: ["functionalModules"],
  4: ["designStyle"],
  5: ["budget", "deadline", "priority"],
  6: ["comments"],
};

export const allFieldLabels: Record<string, string> = {
  companyName: "Назва компанії",
  contactName: "Контактна особа",
  phone: "Телефон",
  email: "Email",
  contactMethod: "Зручний спосіб зв'язку",
  messenger: "Мессенджер",
  contactTime: "Зручний час для зв'язку",
  projectType: "Тип проєкту",
  goal: "Мета проєкту",
  problem: "Проблема, яку вирішує",
  features: "Очікуваний функціонал",
  functionalModules: "Функціональні модулі",
  valueProposition: "Унікальна пропозиція",
  targetAudience: "Цільова аудиторія",
  uniqueness: "Унікальність продукту",
  competitors: "Конкуренти",
  existingWork: "Існуюча робота",
  references: "Посилання на референси",
  expectations: "Очікування",
  designStyle: "Стиль дизайну",
  budget: "Бюджет",
  deadline: "Дедлайн",
  priority: "Пріоритети",
  comments: "Додаткові коментарі",
};