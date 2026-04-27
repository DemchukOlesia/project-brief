"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";

interface Brief {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  contactMethod: string;
  messenger?: string;
  contactTime?: string;
  projectType?: string;
  goal: string;
  problem: string;
  features: string;
  functionalModules: string;
  valueProposition?: string;
  targetAudience?: string;
  uniqueness?: string;
  competitors?: string;
  existingWork?: string;
  references?: string;
  expectations?: string;
  designStyle?: string;
  budget?: string;
  deadline?: string;
  priority?: string;
  comments?: string;
  createdAt: string;
  status: string;
}

const fieldLabels: Record<string, string> = {
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

const stepsMap: Record<number, { name: string; fields: string[] }> = {
  1: { name: "Контакти", fields: ["companyName", "contactName", "phone", "email", "contactMethod", "messenger", "contactTime"] },
  2: { name: "Проєкт", fields: ["projectType", "goal", "problem"] },
  3: { name: "Функціонал", fields: ["features", "functionalModules"] },
  4: { name: "Дизайн", fields: ["valueProposition", "targetAudience", "uniqueness", "competitors", "existingWork", "references", "designStyle"] },
  5: { name: "Бюджет та терміни", fields: ["budget", "deadline", "priority"] },
  6: { name: "Додатково", fields: ["expectations", "comments"] },
};

export default function BriefDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBrief = useCallback(async () => {
    try {
      const response = await fetch(`/api/brief/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch brief");
      }
      const data = await response.json();
      setBrief(data);
    } catch (err) {
      setError("Бриф не знайдено");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchBrief();
  }, [fetchBrief]);

  const updateStatus = async (newStatus: string) => {
    if (!brief) return;
    try {
      await fetch(`/api/brief/${brief.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setBrief({ ...brief, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Завантаження...
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || "Бриф не знайдено"}</p>
        <button
          onClick={() => router.push("/admin")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Назад до списку
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/admin")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад до списку
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Бриф #{brief.id.slice(0, 8)}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Створено: {new Date(brief.createdAt).toLocaleDateString("uk-UA")}
            </p>
          </div>
          <select
            value={brief.status || "new"}
            onChange={(e) => updateStatus(e.target.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border-0 cursor-pointer ${
              brief.status === "completed"
                ? "bg-green-100 text-green-700"
                : brief.status === "in_progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <option value="new">Новий</option>
            <option value="in_progress">В роботі</option>
            <option value="completed">Завершено</option>
          </select>
        </div>
      </div>

      {Object.entries(stepsMap).map(([step, data]) => (
        <div key={step} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Крок {step}: {data.name}</h2>
          <div className="space-y-4">
            {data.fields.map((field) => {
              const value = brief[field as keyof Brief];
              if (!value) return null;
              return (
                <div key={field}>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {fieldLabels[field] || field}
                  </h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}