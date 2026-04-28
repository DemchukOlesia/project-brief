import { z } from "zod";

export const briefSchema = z.object({
  // Step 1: Contacts
  companyName: z.string().min(1, "Обов'язкове поле"),
  contactName: z.string().min(1, "Обов'язкове поле"),
  phone: z.string().min(1, "Обов'язкове поле"),
  email: z.string().min(1, "Обов'язкове поле").email("Невірний email"),
  contactMethod: z.string().min(1, "Обов'язкове поле"),
  messenger: z.string().optional(),
  contactTime: z.string().min(1, "Обов'язкове поле"),
  
  // Step 2: Project
  features: z.string().min(5, "Будь ласка, опишіть ідею детальніше"),
  problem: z.string().min(5, "Опишіть проблему, яку вирішує проєкт"),
  goal: z.string().min(5, "Вкажіть мету проєкту"),
  valueProposition: z.string().min(5, "Опишіть цінність для користувача"),
  targetAudience: z.string().min(5, "Опишіть вашу аудиторію"),
  uniqueness: z.string().min(5, "Вкажіть унікальність проєкту"),
  competitors: z.string().min(5, "Наведіть приклади конкурентів"),
  existingWork: z.string().min(1, "Вкажіть, чи є напрацювання"),
  references: z.string().min(1, "Надайте посилання на референси"),
  expectations: z.string().min(5, "Опишіть ваші очікування"),

  // Step 3: Functional
  functionalModules: z.string().min(5, "Опишіть необхідні модулі"),
  authSystem: z.string().min(5, "Опишіть систему доступу"),
  adminPanel: z.string().min(5, "Опишіть вимоги до адмін-панелі"),
  integrations: z.string().min(5, "Вкажіть необхідні інтеграції"),
  automation: z.string().min(5, "Опишіть автоматичні процеси"),
  notifications: z.string().min(5, "Вкажіть типи сповіщень"),
  search: z.string().min(5, "Опишіть роботу пошуку та фільтрів"),
  mvpFeatures: z.string().min(5, "Виділіть критичні функції для MVP"),

  // Step 4: Design
  designStyle: z.string().min(5, "Опишіть бажаний стиль"),
  brandStyle: z.string().min(1, "Вкажіть наявність фірмового стилю"),
  colors: z.string().min(5, "Опишіть кольорову гаму або настрій"),
  designAttention: z.string().min(1, "Вкажіть рівень уваги до дизайну"),
  designRestrictions: z.string().min(1, "Вкажіть обмеження в дизайні"),
  dislikedDesign: z.string().min(5, "Опишіть, що вам не подобається"),

  // Step 5: Constraints
  budget: z.string().min(1, "Вкажіть орієнтовний бюджет"),
  deadline: z.string().min(1, "Вкажіть бажані терміни"),
  priority: z.string().min(1, "Оберіть пріоритет"),
  fixedDeadlines: z.string().min(1, "Вкажіть наявність фіксованих дат"),
  stagedExecution: z.string().min(1, "Вкажіть можливість поетапного запуску"),
  additionalConstraints: z.string().min(1, "Вкажіть додаткові обмеження"),

  // Step 6: Additional
  comments: z.string().min(1, "Будь ласка, залиште коментар або напишіть 'немає'"),
  
  // Existing fields (keep for compatibility if needed, but they might be redundant now)
  projectType: z.string().optional(),
  needAuth: z.boolean().optional().default(false),
  needApi: z.boolean().optional().default(false),
  exampleSites: z.string().optional(),
});

export type BriefFormData = z.infer<typeof briefSchema>;

export const briefUpdateSchema = briefSchema.partial();

export type BriefUpdateData = z.infer<typeof briefUpdateSchema>;

export const requiredFieldsByStep: Record<number, (keyof BriefFormData)[]> = {
  1: ["companyName", "contactName", "phone", "email", "contactMethod", "contactTime"],
  2: ["features", "problem", "goal", "valueProposition", "targetAudience", "uniqueness", "competitors", "existingWork", "references", "expectations"],
  3: ["functionalModules", "authSystem", "adminPanel", "integrations", "automation", "notifications", "search", "mvpFeatures"],
  4: ["designStyle", "brandStyle", "colors", "designAttention", "designRestrictions", "dislikedDesign"],
  5: ["budget", "deadline", "priority", "fixedDeadlines", "stagedExecution", "additionalConstraints"],
  6: ["comments"],
};

export const stepFieldOrder: Record<number, string[]> = {
  1: ["companyName", "contactName", "phone", "email", "contactMethod", "messenger", "contactTime"],
  2: ["features", "problem", "goal", "valueProposition", "targetAudience", "uniqueness", "competitors", "existingWork", "references", "expectations"],
  3: ["functionalModules", "authSystem", "adminPanel", "integrations", "automation", "notifications", "search", "mvpFeatures"],
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
