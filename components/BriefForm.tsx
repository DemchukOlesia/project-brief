"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { briefSchema, requiredFieldsByStep, BriefFormData } from "@/lib/validation";

const steps = [
  { id: 1, name: "Контакти" },
  { id: 2, name: "Проєкт" },
  { id: 3, name: "Функціонал" },
  { id: 4, name: "Дизайн" },
  { id: 5, name: "Обмеження" },
  { id: 6, name: "Додатково" },
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      excludedFeatures: "",
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
          if (key !== 'currentStep' && parsed[key] !== undefined) {
            setValue(key as keyof BriefFormData, parsed[key]);
          }
        });
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

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    const stepFields = requiredFieldsByStep[currentStep] || [];
    const isValid = await trigger(stepFields as any, { shouldFocus: true });
    
    if (!isValid) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      return;
    }
    
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

  const executeSubmit = async (data: BriefFormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    setShowConfirmModal(false);

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

  const handleOpenConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep !== 6) return;

    const stepFields = requiredFieldsByStep[6] || [];
    const isValid = await trigger(stepFields as any);
    
    if (isValid) {
      setShowConfirmModal(true);
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
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
        >
          Заповнити ще один бриф
        </button>
      </div>
    );
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 md:p-10 relative">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Надіслати бриф?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Ви впевнені, що хочете надіслати заповнену інформацію? Після відправки ви не зможете її змінити самостійно.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Ні, повернутись
              </button>
              <button
                type="button"
                onClick={handleSubmit(executeSubmit)}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/20"
              >
                Так, надіслати
              </button>
            </div>
          </div>
        </div>
      )}

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
        <p className="text-center mt-3 text-sm text-gray-500 font-medium uppercase tracking-wide">
          Крок {currentStep} з {steps.length}: {steps[currentStep - 1].name}
          <span className="ml-2 text-red-500">* Обов&apos;язкові поля</span>
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-900">Контактна інформація</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Назва компанії <span className="text-red-500">*</span></label>
                <input {...register("companyName")} placeholder="ТОВ &quot;Компанія&quot;" className={`${inputClass} ${errors.companyName ? "border-red-500" : ""}`} />
                {errors.companyName && <p className={errorClass}>{errors.companyName.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>ПІБ контактної особи <span className="text-red-500">*</span></label>
                <input {...register("contactName")} placeholder="Іван Іванов" className={`${inputClass} ${errors.contactName ? "border-red-500" : ""}`} />
                {errors.contactName && <p className={errorClass}>{errors.contactName.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Номер телефону <span className="text-red-500">*</span></label>
                <input {...register("phone")} type="tel" placeholder="+380XXXXXXXXX" className={`${inputClass} ${errors.phone ? "border-red-500" : ""}`} />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                <input {...register("email")} type="email" placeholder="email@company.com" className={`${inputClass} ${errors.email ? "border-red-500" : ""}`} />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Зручний спосіб зв&apos;язку <span className="text-red-500">*</span></label>
                <input {...register("contactMethod")} placeholder="Телефон, Telegram, email" className={`${inputClass} ${errors.contactMethod ? "border-red-500" : ""}`} />
                {errors.contactMethod && <p className={errorClass}>{errors.contactMethod.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Зручний час для зв&apos;язку</label>
                <input {...register("contactTime")} placeholder="10:00–18:00" className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Ідея та цілі проєкту</h2>
            {[
              { id: "features", label: "Опишіть ідею вашого проєкту", req: true },
              { id: "problem", label: "Яку проблему вирішує проєкт?", req: true },
              { id: "goal", label: "Яка основна мета проєкту?", req: true },
              { id: "valueProposition", label: "Яку цінність отримає користувач?", req: true },
              { id: "targetAudience", label: "Хто ваша цільова аудиторія?", req: true },
              { id: "uniqueness", label: "У чому унікальність вашого проєкту?", req: true },
              { id: "competitors", label: "Чи є подібні рішення або конкуренти?", req: true },
              { id: "existingWork", label: "Чи є у вас вже щось готове?", req: true },
              { id: "references", label: "Посилання на приклади (референси)", req: true },
              { id: "expectations", label: "Які очікування від результату?", req: false },
            ].map((field) => (
              <div key={field.id}>
                <label className={labelClass}>{field.label} {field.req && <span className="text-red-500">*</span>}</label>
                <textarea
                  {...register(field.id as keyof BriefFormData)}
                  rows={3}
                  className={`${inputClass} min-h-[100px] ${field.req && errors[field.id as keyof BriefFormData] ? "border-red-500" : ""}`}
                />
                {field.req && errors[field.id as keyof BriefFormData] && (
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
              { id: "functionalModules", label: "Які функціональні модулі повинні бути?", req: true },
              { id: "authSystem", label: "Система доступу (реєстрація, ролі)", req: true },
              { id: "adminPanel", label: "Що має бути в адмін-панелі?", req: true },
              { id: "integrations", label: "Які інтеграції необхідні?", req: true },
              { id: "automation", label: "Автоматичні процеси", req: true },
              { id: "notifications", label: "Система сповіщень", req: true },
              { id: "search", label: "Пошук та фільтрація", req: true },
              { id: "mvpFeatures", label: "Критично важливий функціонал (MVP)", req: true },
              { id: "excludedFeatures", label: "Які функції НЕ входять у цей проєкт?", req: false },
            ].map((field) => (
              <div key={field.id}>
                <label className={labelClass}>{field.label} {field.req && <span className="text-red-500">*</span>}</label>
                <textarea
                  {...register(field.id as keyof BriefFormData)}
                  rows={3}
                  className={`${inputClass} min-h-[100px] ${field.req && errors[field.id as keyof BriefFormData] ? "border-red-500" : ""}`}
                />
                {field.req && errors[field.id as keyof BriefFormData] && (
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
              { id: "designStyle", label: "Який стиль дизайну вам подобається?", req: true },
              { id: "brandStyle", label: "Фірмовий стиль або брендбук", req: true },
              { id: "colors", label: "Кольори або настрій дизайну", req: true },
              { id: "designAttention", label: "Рівень уваги до дизайну", req: true },
              { id: "designRestrictions", label: "Обмеження або вимоги", req: true },
              { id: "dislikedDesign", label: "Що вам НЕ подобається?", req: false },
            ].map((field) => (
              <div key={field.id}>
                <label className={labelClass}>{field.label} {field.req && <span className="text-red-500">*</span>}</label>
                <textarea
                  {...register(field.id as keyof BriefFormData)}
                  rows={3}
                  className={`${inputClass} min-h-[100px] ${field.req && errors[field.id as keyof BriefFormData] ? "border-red-500" : ""}`}
                />
                {field.req && errors[field.id as keyof BriefFormData] && (
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
              { id: "budget", label: "Орієнтовний бюджет проєкту", req: true },
              { id: "deadline", label: "Бажані терміни реалізації", req: true },
              { id: "priority", label: "Швидкість, якість чи бюджет?", req: true },
              { id: "fixedDeadlines", label: "Чи є фіксовані дедлайни?", req: true },
              { id: "stagedExecution", label: "Чи можливе поетапне виконання?", req: true },
              { id: "additionalConstraints", label: "Додаткові обмеження", req: false },
            ].map((field) => (
              <div key={field.id}>
                <label className={labelClass}>{field.label} {field.req && <span className="text-red-500">*</span>}</label>
                <textarea
                  {...register(field.id as keyof BriefFormData)}
                  rows={3}
                  className={`${inputClass} min-h-[100px] ${field.req && errors[field.id as keyof BriefFormData] ? "border-red-500" : ""}`}
                />
                {field.req && errors[field.id as keyof BriefFormData] && (
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
              <label className={labelClass}>Додаткові коментарі</label>
              <textarea
                {...register("comments")}
                rows={5}
                placeholder="Додаткова інформація, побажання або деталі"
                className={`${inputClass} min-h-[140px]`}
              />
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
              type="button"
              onClick={handleOpenConfirm}
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
