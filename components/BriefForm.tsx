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
  { id: 4, name: "Дизайн", requiredNote: "* Обов'язкові поля" },
  { id: 5, name: "Обмеження", requiredNote: "* Обов'язкові поля" },
  { id: 6, name: "Додатково", requiredNote: "* Обов'язкові поля" },
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
      goal: "",
      problem: "",
      features: "",
      valueProposition: "",
      targetAudience: "",
      uniqueness: "",
      competitors: "",
      existingWork: "",
      references: "",
      expectations: "",
      functionalModules: "",
      authSystem: "",
      adminPanel: "",
      integrations: "",
      automation: "",
      notifications: "",
      search: "",
      mvpFeatures: "",
      designStyle: "",
      brandStyle: "",
      colors: "",
      designAttention: "",
      designRestrictions: "",
      dislikedDesign: "",
      budget: "",
      deadline: "",
      priority: "",
      fixedDeadlines: "",
      stagedExecution: "",
      additionalConstraints: "",
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
        if (parsed.currentStep) {
          // currentStep logic handled separately to avoid jump on initial load
        }
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, [setValue]);

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
    const isValid = await trigger(stepFields as any, { shouldFocus: true });
    
    if (!isValid) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      return;
    }
    
    // Перевірка всіх попередніх кроків до того, на який хочемо перейти
    for (let s = 1; s < stepId; s++) {
      const stepFields = requiredFieldsByStep[s] || [];
      const isValid = await trigger(stepFields as any);
      if (!isValid) {
        setCurrentStep(s);
        return;
      }
    }
    
    setCurrentStep(stepId);
  };

  const onSubmit = async (data: BriefFormData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Помилка при відправці форми");
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Дякуємо за заявку!</h2>
        <p className="text-gray-500 mb-6">Ваш бриф успішно відправлено. Ми зв&apos;яжемося з вами найближчим часом.</p>
        <button
          onClick={() => setSubmitSuccess(false)}
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
              className={`text-xs font-medium cursor-pointer transition-colors ${
                step.id === currentStep
                  ? "text-blue-600"
                  : step.id < currentStep
                  ? "text-green-600"
                  : "text-gray-300 hover:text-gray-400"
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
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-center mt-3 text-sm text-gray-500">
          Крок {currentStep} з {steps.length}: {steps[currentStep - 1].name}
          <span className="ml-2 text-red-500">* Обов&apos;язкові поля</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-900">Контактна інформація</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Назва компанії <span className="text-red-500">*</span></label>
                <input
                  {...register("companyName")}
                  placeholder="ТОВ &quot;Компанія&quot;"
                  className={`${inputClass} ${errors.companyName ? "border-red-500" : ""}`}
                />
                {errors.companyName && <p className={errorClass}>{errors.companyName.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>ПІБ контактної особи <span className="text-red-500">*</span></label>
                <input
                  {...register("contactName")}
                  placeholder="Іван Іванов"
                  className={`${inputClass} ${errors.contactName ? "border-red-500" : ""}`}
                />
                {errors.contactName && <p className={errorClass}>{errors.contactName.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Номер телефону <span className="text-red-500">*</span></label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+380XXXXXXXXX"
                  className={`${inputClass} ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="email@company.com"
                  className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Зручний спосіб зв&apos;язку <span className="text-red-500">*</span></label>
                <input
                  {...register("contactMethod")}
                  placeholder="Телефон, Telegram, email"
                  className={`${inputClass} ${errors.contactMethod ? "border-red-500" : ""}`}
                />
                {errors.contactMethod && <p className={errorClass}>{errors.contactMethod.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Зручний час для зв&apos;язку <span className="text-red-500">*</span></label>
                <input
                  {...register("contactTime")}
                  placeholder="10:00–18:00"
                  className={`${inputClass} ${errors.contactTime ? "border-red-500" : ""}`}
                />
                {errors.contactTime && <p className={errorClass}>{errors.contactTime.message}</p>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Ідея та цілі проєкту</h2>
            {[
              { id: "features", label: "Опишіть ідею вашого проєкту", placeholder: "Що це за продукт, для чого він створюється" },
              { id: "problem", label: "Яку проблему вирішує проєкт?", placeholder: "Яка потреба існує зараз" },
              { id: "goal", label: "Яка основна мета проєкту?", placeholder: "Результат, якого хочете досягти" },
              { id: "valueProposition", label: "Яку цінність отримає користувач?", placeholder: "Чому люди будуть користуватися продуктом" },
              { id: "targetAudience", label: "Хто ваша цільова аудиторія?", placeholder: "Вік, інтереси, тип" },
              { id: "uniqueness", label: "У чому унікальність вашого проєкту?", placeholder: "Чим відрізняється від інших" },
              { id: "competitors", label: "Чи є подібні рішення або конкуренти?", placeholder: "Приклади схожих продуктів" },
              { id: "existingWork", label: "Чи є у вас вже щось готове?", placeholder: "Ідея, прототип, дизайн" },
              { id: "references", label: "Посилання на приклади (референси)", placeholder: "Сайти або додатки, які вам подобаються" },
              { id: "expectations", label: "Які очікування від результату?", placeholder: "Яким ви бачите кінцевий продукт" },
            ].map((field) => (
              <div key={field.id}>
                <label className={labelClass}>{field.label} <span className="text-red-500">*</span></label>
                <textarea
                  {...register(field.id as keyof BriefFormData)}
                  rows={3}
                  placeholder={field.placeholder}
                  className={`${inputClass} min-h-[100px] ${errors[field.id as keyof BriefFormData] ? "border-red-500" : ""}`}
                />
                {errors[field.id as keyof BriefFormData] && (
                  <p className={errorClass}>{errors[field.id as keyof BriefFormData]?.message}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Функціонал проєкту</h2>
            {[
              { id: "functionalModules", label: "Які функціональні модулі повинні бути?", placeholder: "Реєстрація, каталог, профіль, замовлення" },
              { id: "authSystem", label: "Система доступу (реєстрація, ролі)", placeholder: "Опишіть рівні доступу" },
              { id: "adminPanel", label: "Що має бути в адмін-панелі?", placeholder: "Дії та дані для адміністратора" },
              { id: "integrations", label: "Які інтеграції необхідні?", placeholder: "Платежі, API, CRM" },
              { id: "automation", label: "Автоматичні процеси", placeholder: "Дії, що запускають процеси" },
              { id: "notifications", label: "Система сповіщень", placeholder: "Кому і коли надсилати" },
              { id: "search", label: "Пошук та фільтрація", placeholder: "Що саме потрібно знаходити" },
              { id: "mvpFeatures", label: "Критично важливий функціонал (MVP)", placeholder: "Що реалізувати в першу чергу" },
            ].map((field) => (
              <div key={field.id}>
                <label className={labelClass}>{field.label} <span className="text-red-500">*</span></label>
                <textarea
                  {...register(field.id as keyof BriefFormData)}
                  rows={3}
                  placeholder={field.placeholder}
                  className={`${inputClass} min-h-[100px] ${errors[field.id as keyof BriefFormData] ? "border-red-500" : ""}`}
                />
                {errors[field.id as keyof BriefFormData] && (
                  <p className={errorClass}>{errors[field.id as keyof BriefFormData]?.message}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Дизайн та стиль</h2>
            {[
              { id: "designStyle", label: "Який стиль дизайну вам подобається?", placeholder: "Мінімалізм, сучасний, темний" },
              { id: "brandStyle", label: "Фірмовий стиль або брендбук", placeholder: "Чи є логотип, кольори, шрифти" },
              { id: "colors", label: "Кольори або настрій дизайну", placeholder: "Енергійний, строгий, технологічний" },
              { id: "designAttention", label: "Рівень уваги до дизайну", placeholder: "Базовий, середній, преміум" },
              { id: "designRestrictions", label: "Обмеження або вимоги", placeholder: "Корпоративні стандарти" },
              { id: "dislikedDesign", label: "Що вам НЕ подобається?", placeholder: "Приклади речей, яких уникати" },
            ].map((field) => (
              <div key={field.id}>
                <label className={labelClass}>{field.label} <span className="text-red-500">*</span></label>
                <textarea
                  {...register(field.id as keyof BriefFormData)}
                  rows={3}
                  placeholder={field.placeholder}
                  className={`${inputClass} min-h-[100px] ${errors[field.id as keyof BriefFormData] ? "border-red-500" : ""}`}
                />
                {errors[field.id as keyof BriefFormData] && (
                  <p className={errorClass}>{errors[field.id as keyof BriefFormData]?.message}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Бюджет та терміни</h2>
            {[
              { id: "budget", label: "Орієнтовний бюджет проєкту", placeholder: "Бажаний бюджет або діапазон" },
              { id: "deadline", label: "Бажані терміни реалізації", placeholder: "Коли хочете отримати продукт" },
              { id: "priority", label: "Швидкість, якість чи бюджет?", placeholder: "Що для вас найважливіше" },
              { id: "fixedDeadlines", label: "Чи є фіксовані дедлайни?", placeholder: "Наприклад: запуск до події" },
              { id: "stagedExecution", label: "Чи можливе поетапне виконання?", placeholder: "Чи готові запускати частинами (MVP)" },
              { id: "additionalConstraints", label: "Додаткові обмеження", placeholder: "Фактори, що впливають на реалізацію" },
            ].map((field) => (
              <div key={field.id}>
                <label className={labelClass}>{field.label} <span className="text-red-500">*</span></label>
                <textarea
                  {...register(field.id as keyof BriefFormData)}
                  rows={3}
                  placeholder={field.placeholder}
                  className={`${inputClass} min-h-[100px] ${errors[field.id as keyof BriefFormData] ? "border-red-500" : ""}`}
                />
                {errors[field.id as keyof BriefFormData] && (
                  <p className={errorClass}>{errors[field.id as keyof BriefFormData]?.message}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Додатково</h2>
            <div>
              <label className={labelClass}>Додаткові коментарі <span className="text-red-500">*</span></label>
              <textarea
                {...register("comments")}
                rows={5}
                placeholder="Додаткова інформація, побажання або деталі"
                className={`${inputClass} min-h-[140px] ${errors.comments ? "border-red-500" : ""}`}
              />
              {errors.comments && <p className={errorClass}>{errors.comments.message}</p>}
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {submitError}
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
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              Далі
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-200 shadow-lg shadow-green-600/25 disabled:opacity-50"
            >
              {isSubmitting ? "Відправка..." : "Відправити бриф"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
