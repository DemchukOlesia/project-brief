"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { briefSchema, requiredFieldsByStep, BriefFormData } from "@/lib/validation";

const steps = [
  { id: 1, name: "Контакти", requiredNote: "* Обов'язкові поля" },
  { id: 2, name: "Проєкт", requiredNote: "* Обов'язкові поля" },
  { id: 3, name: "Функціонал", requiredNote: "* Обов'язкові поля" },
  { id: 4, name: "Дизайн", requiredNote: "" },
  { id: 5, name: "Обмеження", requiredNote: "* Обов'язкові поля" },
  { id: 6, name: "Додатково", requiredNote: "" },
];

const projectTypes = [
  { value: "website", label: "Веб-сайт" },
  { value: "mobile", label: "Мобільний додаток" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "Інтернет-магазин" },
  { value: "corporate", label: "Корпоративний портал" },
  { value: "other", label: "Інше" },
];

const featuresList = [
  "Каталог товарів/послуг",
  "Кошик",
  "Оформлення замовлення",
  "Особистий кабінет",
  "Блог",
  "Контактна форма",
  "Пошук",
  "Фільтри",
  "Відгуки/рейтинг",
  "Чат-підтримка",
];

const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200";
const labelClass = "block text-sm font-medium text-gray-700 mb-2";
const errorClass = "text-red-500 text-sm mt-1";

export default function BriefForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm<BriefFormData>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
      contactMethod: "",
      messenger: "",
      contactTime: "",
      projectType: "",
      goal: "",
      problem: "",
      features: "",
      functionalModules: "",
      valueProposition: "",
      targetAudience: "",
      uniqueness: "",
      competitors: "",
      existingWork: "",
      references: "",
      expectations: "",
      needAuth: false,
      needApi: false,
      exampleSites: "",
      designStyle: "",
      budget: "",
      deadline: "",
      priority: "",
      comments: "",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("brief-form-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach((key) => {
          if (key !== 'currentStep' && parsed[key]) {
            setValue(key as keyof BriefFormData, parsed[key]);
          }
        });
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, [setValue]);

  const watchedContactMethod = watch("contactMethod");
  const showMessengerField = watchedContactMethod === "telegram" || watchedContactMethod === "viber";
  const watchedValues = watch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dataToSave = {
        ...watchedValues,
        currentStep,
      };
      localStorage.setItem("brief-form-data", JSON.stringify(dataToSave));
    }
  }, [watchedValues, currentStep]);

  const handleNext = async () => {
    const stepFields = requiredFieldsByStep[currentStep] || [];
    const isValid = await trigger(stepFields as any);
    
    if (!isValid) {
      return;
    }
    const maxCompletedStep = Math.min(currentStep + 1, steps.length);
    setCurrentStep(maxCompletedStep);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      return;
    }
    
    const stepFields = requiredFieldsByStep[currentStep] || [];
    const isValid = await trigger(stepFields as any);
    
    if (isValid && stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      console.log("Submitting data:", data);
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Response:", response.status, result);
      
      if (!response.ok) {
        throw new Error(result.error || result.details || "Помилка при відправці форми");
      }

      localStorage.removeItem("brief-form-data");
      reset();
      setCurrentStep(1);
      setSubmitSuccess(true);
    } catch (error: any) {
      console.error("Submit error:", error);
      setSubmitError(error.message || "Сталася помилка. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Дякуємо за заявку!
        </h2>
        <p className="text-gray-500 mb-6">
          Ваш бриф успішно відправлено. Ми зв&apos;яжемося з вами найближчим часом.
        </p>
        <button
          onClick={() => router.push("/brief")}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Заповнити ще один бриф
        </button>
      </div>
    );
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 md:p-10">
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`text-xs font-medium cursor-pointer hover:opacity-80 ${
                step.id === currentStep
                  ? "text-blue-600"
                  : step.id < currentStep
                  ? "text-green-600"
                  : "text-gray-300"
              }`}
            >
              {step.id < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : step.id}
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center mt-3 text-sm text-gray-500">
          Крок {currentStep} з {steps.length}: {steps[currentStep - 1].name}
          {steps[currentStep - 1].requiredNote && (
            <span className="ml-2 text-red-500">{steps[currentStep - 1].requiredNote}</span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-900">Контактна інформація</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>
                  Назва компанії <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("companyName")}
                  placeholder="ТОВ &quot;Компанія&quot;"
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                    errors.companyName ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message as string}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>ПІБ контактної особи <span className="text-red-500">*</span></label>
                <input
                  {...register("contactName")}
                  placeholder="Іван Іванов"
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                    errors.contactName ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.contactName && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactName.message as string}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Номер телефону <span className="text-red-500">*</span></label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+380XXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="email@company.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className={labelClass}>Зручний спосіб зв&apos;язку <span className="text-red-500">*</span></label>
                <input
                  {...register("contactMethod")}
                  placeholder="Наприклад: телефон, Telegram, email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className={labelClass}>Зручний час для зв&apos;язку</label>
                <input
                  {...register("contactTime")}
                  placeholder="Наприклад: 10:00–18:00"
                  className={inputClass}
                />
              </div>
              {showMessengerField && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      Контакт у {watchedContactMethod === "telegram" ? "Telegram" : "Viber"}
                    </label>
                    <input
                      {...register("messenger")}
                      placeholder={watchedContactMethod === "telegram" ? "@username" : "+380XXXXXXXXX"}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 max-w-[800px] mx-auto">
            <h2 className="text-xl font-semibold text-gray-900">Ідея та цілі проєкту</h2>
            
            <div>
              <label className={labelClass}>Опишіть ідею вашого проєкту <span className="text-red-500">*</span></label>
              <textarea
                {...register("features")}
                rows={4}
                placeholder="Що це за продукт, для чого він створюється та в чому його суть"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[120px] resize-vertical"
              />
              
            </div>

            <div>
              <label className={labelClass}>Яку проблему вирішує ваш проєкт? <span className="text-red-500">*</span></label>
              <textarea
                {...register("problem")}
                rows={4}
                placeholder="Яка потреба або проблема існує зараз і як ваш продукт її вирішує"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[120px] resize-vertical"
              />
              
            </div>

            <div>
              <label className={labelClass}>Яка основна мета проєкту? <span className="text-red-500">*</span></label>
              <textarea
                {...register("goal")}
                rows={4}
                placeholder="Якого результату ви хочете досягти (наприклад: прибуток, автоматизація, зручність для користувачів)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[120px] resize-vertical"
              />
              
            </div>

            <div>
              <label className={labelClass}>Яку цінність отримає користувач?</label>
              <textarea
                {...register("valueProposition")}
                rows={4}
                placeholder="Чому люди будуть користуватися вашим продуктом, яку користь він дає"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Хто ваша цільова аудиторія?</label>
              <textarea
                {...register("targetAudience")}
                rows={4}
                placeholder="Опишіть користувачів: вік, інтереси, тип (B2B, B2C тощо)"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>У чому унікальність вашого проєкту?</label>
              <textarea
                {...register("uniqueness")}
                rows={3}
                placeholder="Чим ваш продукт відрізняється від інших або конкурентів"
                className={`${inputClass} min-h-[100px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Чи є вже подібні рішення або конкуренти?</label>
              <textarea
                {...register("competitors")}
                rows={3}
                placeholder="Наведіть приклади конкурентів або схожих продуктів"
                className={`${inputClass} min-h-[100px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Чи є у вас вже щось готове?</label>
              <textarea
                {...register("existingWork")}
                rows={3}
                placeholder="Ідея, прототип, дизайн, готовий продукт або нічого"
                className={`${inputClass} min-h-[100px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Посилання на приклади (референси)</label>
              <textarea
                {...register("references")}
                rows={3}
                placeholder="Сайти або додатки, які вам подобаються (і чому)"
                className={`${inputClass} min-h-[100px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Які очікування від результату?</label>
              <textarea
                {...register("expectations")}
                rows={3}
                placeholder="Яким ви бачите кінцевий продукт"
                className={`${inputClass} min-h-[100px] resize-vertical`}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 max-w-[750px] mx-auto">
            <h2 className="text-xl font-semibold text-gray-900">Функціонал проєкту</h2>
            
            <div>
              <label className={labelClass}>Які функціональні модулі повинні бути в системі? <span className="text-red-500">*</span></label>
              <textarea
                {...register("functionalModules")}
                rows={4}
                placeholder="Наприклад: реєстрація, каталог, профіль, замовлення, аналітика"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[120px] resize-vertical"
              />
              
            </div>

            <div>
              <label className={labelClass}>Як має працювати система доступу (реєстрація, авторизація, ролі)?</label>
              <textarea
                rows={4}
                placeholder="Опишіть способи входу та рівні доступу"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Що має бути доступно в особистому кабінеті та/або адмін-панелі?</label>
              <textarea
                rows={4}
                placeholder="Які дії та дані доступні для користувача і адміністратора"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Які інтеграції необхідні для роботи системи?</label>
              <textarea
                rows={4}
                placeholder="Платежі, API, CRM або інші сервіси"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Які дії повинні запускати автоматичні процеси?</label>
              <textarea
                rows={4}
                placeholder="Наприклад: після створення заявки, оплати або реєстрації"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Які повідомлення або сповіщення повинна надсилати система?</label>
              <textarea
                rows={4}
                placeholder="Коли і кому надсилаються повідомлення"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Який функціонал повинен мати пошук або фільтрація?</label>
              <textarea
                rows={4}
                placeholder="Що саме потрібно знаходити або сортувати"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Які функції є критично важливими для першої версії (MVP)? <span className="text-red-500">*</span></label>
              <textarea
                rows={4}
                placeholder="Що має бути реалізовано в першу чергу"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Які функції НЕ входять у цей проєкт?</label>
              <textarea
                rows={4}
                placeholder="Вкажіть межі функціоналу"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8 max-w-[750px] mx-auto">
            <h2 className="text-xl font-semibold text-gray-900">Дизайн та стиль</h2>
            
            <div>
              <label className={labelClass}>Який стиль дизайну вам подобається?</label>
              <textarea
                {...register("designStyle")}
                rows={4}
                placeholder="Наприклад: мінімалізм, сучасний, корпоративний, яскравий, темний"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Чи є у вас фірмовий стиль або брендбук?</label>
              <textarea
                rows={4}
                placeholder="Логотип, кольори, шрифти або інші елементи"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Які кольори або настрій повинен передавати дизайн?</label>
              <textarea
                rows={4}
                placeholder="Наприклад: спокійний, строгий, енергійний, технологічний"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Який рівень уваги до дизайну важливий для вас?</label>
              <textarea
                rows={4}
                placeholder="Наприклад: базовий, середній, преміум дизайн"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Чи є обмеження або вимоги до дизайну?</label>
              <textarea
                rows={4}
                placeholder="Наприклад: корпоративні стандарти, простота, мінімум анімацій"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Що вам НЕ подобається в дизайні?</label>
              <textarea
                rows={4}
                placeholder="Опишіть приклади або речі, яких варто уникати"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Завантажте файли (логотип, дизайн, брендбук, приклади)</label>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".jpg,.jpeg,.png,.svg,.pdf,.fig"
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files || []);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 font-medium">Перетягніть файли сюди або натисніть для завантаження</p>
                  <p className="text-sm text-gray-400">JPG, PNG, SVG, PDF, Figma</p>
                </div>
              </button>
              <p className="text-sm text-gray-400 mt-2">Ви можете додати логотип, макети, брендбук або будь-які приклади дизайну</p>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-8 max-w-[750px] mx-auto">
            <h2 className="text-xl font-semibold text-gray-900">Бюджет та терміни</h2>
            
            <div>
              <label className={labelClass}>Який орієнтовний бюджет проєкту? <span className="text-red-500">*</span></label>
              <textarea
                {...register("budget")}
                rows={4}
                placeholder="Вкажіть бажаний бюджет або діапазон"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[120px] resize-vertical"
              />
              
            </div>

            <div>
              <label className={labelClass}>Які бажані терміни реалізації? <span className="text-red-500">*</span></label>
              <textarea
                {...register("deadline")}
                rows={4}
                placeholder="Коли ви хочете отримати готовий продукт"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[120px] resize-vertical"
              />
              
            </div>

            <div>
              <label className={labelClass}>Що для вас важливіше: швидкість, якість чи бюджет? <span className="text-red-500">*</span></label>
              <textarea
                {...register("priority")}
                rows={4}
                placeholder="Оберіть пріоритет або опишіть баланс між ними"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[120px] resize-vertical"
              />
            </div>

            <div>
              <label className={labelClass}>Чи є фіксовані дедлайни або важливі дати?</label>
              <textarea
                rows={4}
                placeholder="Наприклад: запуск до певної події"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Чи можливе поетапне виконання (MVP → розширення)?</label>
              <textarea
                rows={4}
                placeholder="Чи готові запускати проєкт частинами"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>

            <div>
              <label className={labelClass}>Чи є додаткові обмеження або умови?</label>
              <textarea
                rows={4}
                placeholder="Будь-які фактори, які можуть вплинути на реалізацію"
                className={`${inputClass} min-h-[120px] resize-vertical`}
              />
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6 max-w-[750px] mx-auto">
            <h2 className="text-xl font-semibold text-gray-900">Додатково</h2>
            <div>
              <label className={labelClass}>Коментарі</label>
              <textarea
                {...register("comments")}
                rows={5}
                placeholder="Додаткова інформація, побажання або деталі, які ви хочете уточнити"
                className={`${inputClass} min-h-[140px] resize-vertical`}
              />
            </div>
          </div>
        )}

        {currentStep === steps.length && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Натискаючи кнопку «Відправити», ви погоджуєтесь на обробку наданої інформації.
            </p>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            Не вдалося відправити форму. Спробуйте ще раз або перевірте введені дані.
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Назад
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
            >
              Далі
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-200 shadow-lg shadow-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Відправка..." : "Відправити"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}