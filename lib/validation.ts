import { z } from "zod";

const requiredMsg = "Це поле обов'язкове, заповніть його, будь ласка";

export const briefSchema = z.object({
  // Step 1: Contacts
  companyName: z.string().min(1, requiredMsg),
  contactName: z.string().min(1, requiredMsg),
  phone: z.string().min(1, requiredMsg),
  email: z.string().min(1, requiredMsg).email("Невірний email"),
  contactMethod: z.string().min(1, requiredMsg),
  messenger: z.string().optional(),
  contactTime: z.string().optional(),
  
  // Step 2: Project
  features: z.string().min(1, requiredMsg),
  problem: z.string().min(1, requiredMsg),
  goal: z.string().min(1, requiredMsg),
  valueProposition: z.string().min(1, requiredMsg),
  targetAudience: z.string().min(1, requiredMsg),
  uniqueness: z.string().min(1, requiredMsg),
  competitors: z.string().min(1, requiredMsg),
  existingWork: z.string().min(1, requiredMsg),
  references: z.string().min(1, requiredMsg),
  expectations: z.string().optional(),

  // Step 3: Functional
  functionalModules: z.string().min(1, requiredMsg),
  authSystem: z.string().min(1, requiredMsg),
  adminPanel: z.string().min(1, requiredMsg),
  integrations: z.string().min(1, requiredMsg),
  automation: z.string().min(1, requiredMsg),
  notifications: z.string().min(1, requiredMsg),
  search: z.string().min(1, requiredMsg),
  mvpFeatures: z.string().min(1, requiredMsg),
  excludedFeatures: z.string().min(1, requiredMsg), // Тепер обов'язкове

  // Step 4: Design
  designStyle: z.string().min(1, requiredMsg),
  brandStyle: z.string().min(1, requiredMsg),
  colors: z.string().min(1, requiredMsg),
  designAttention: z.string().min(1, requiredMsg),
  designRestrictions: z.string().min(1, requiredMsg),
  dislikedDesign: z.string().optional(),

  // Step 5: Constraints
  budget: z.string().min(1, requiredMsg),
  deadline: z.string().min(1, requiredMsg),
  priority: z.string().min(1, requiredMsg),
  fixedDeadlines: z.string().min(1, requiredMsg),
  stagedExecution: z.string().min(1, requiredMsg),
  additionalConstraints: z.string().optional(),

  // Step 6: Additional
  comments: z.string().optional(),
  
  // Existing fields
  projectType: z.string().optional(),
  needAuth: z.boolean().optional().default(false),
  needApi: z.boolean().optional().default(false),
  exampleSites: z.string().optional(),
});

export type BriefFormData = z.infer<typeof briefSchema>;

export const requiredFieldsByStep: Record<number, (keyof BriefFormData)[]> = {
  1: ["companyName", "contactName", "phone", "email", "contactMethod"],
  2: ["features", "problem", "goal", "valueProposition", "targetAudience", "uniqueness", "competitors", "existingWork", "references"],
  3: ["functionalModules", "authSystem", "adminPanel", "integrations", "automation", "notifications", "search", "mvpFeatures", "excludedFeatures"],
  4: ["designStyle", "brandStyle", "colors", "designAttention", "designRestrictions"],
  5: ["budget", "deadline", "priority", "fixedDeadlines", "stagedExecution"],
  6: [],
};

export const stepFieldOrder: Record<number, string[]> = {
  1: ["companyName", "contactName", "phone", "email", "contactMethod", "contactTime"],
  2: ["features", "problem", "goal", "valueProposition", "targetAudience", "uniqueness", "competitors", "existingWork", "references", "expectations"],
  3: ["functionalModules", "authSystem", "adminPanel", "integrations", "automation", "notifications", "search", "mvpFeatures", "excludedFeatures"],
  4: ["designStyle", "brandStyle", "colors", "designAttention", "designRestrictions", "dislikedDesign"],
  5: ["budget", "deadline", "priority", "fixedDeadlines", "stagedExecution", "additionalConstraints"],
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
  goal: "Мета проєкту",
  problem: "Проблема, яку вирішує",
  features: "Очікуваний функціонал",
  functionalModules: "Функціональні модулі",
  authSystem: "Система доступу",
  adminPanel: "Адмін-панель",
  integrations: "Інтеграції",
  automation: "Автоматизація",
  notifications: "Сповіщення",
  search: "Пошук та фільтри",
  mvpFeatures: "Критичні функції MVP",
  excludedFeatures: "Функції, що НЕ входять у проєкт",
  valueProposition: "Унікальна пропозиція",
  targetAudience: "Цільова аудиторія",
  uniqueness: "Унікальність продукту",
  competitors: "Конкуренти",
  existingWork: "Існуюча робота",
  references: "Посилання на референси",
  expectations: "Очікування",
  designStyle: "Стиль дизайну",
  brandStyle: "Фірмовий стиль",
  colors: "Кольори та настрій",
  designAttention: "Увага до дизайну",
  designRestrictions: "Обмеження дизайну",
  dislikedDesign: "Що не подобається в дизайні",
  budget: "Бюджет",
  deadline: "Дедлайн",
  priority: "Пріоритети",
  fixedDeadlines: "Фіксовані дедлайни",
  stagedExecution: "Поетапне виконання",
  additionalConstraints: "Додаткові обмеження",
  comments: "Додаткові коментарі",
};
