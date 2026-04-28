"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { requiredFieldsByStep, stepFieldOrder, allFieldLabels } from "@/lib/validation";

interface Brief {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  status: string;
  data: any; // Всі відповіді тут
  createdAt: string;
}

const stepsMap: Record<number, { name: string; fields: string[] }> = {
  1: { name: "Контакти", fields: stepFieldOrder[1] },
  2: { name: "Проєкт", fields: stepFieldOrder[2] },
  3: { name: "Функціонал", fields: stepFieldOrder[3] },
  4: { name: "Дизайн", fields: stepFieldOrder[4] },
  5: { name: "Бюджет та терміни", fields: stepFieldOrder[5] },
  6: { name: "Додатково", fields: stepFieldOrder[6] },
};

const fieldLabels = allFieldLabels;

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || "Бриф не знайдено"}</p>
        <button
          onClick={() => router.push("/admin")}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Назад до списку
        </button>
      </div>
    );
  }

  // Об'єднуємо дані з топ-рівня та з об'єкта data для зручності
  const fullData = {
    ...brief,
    ...(typeof brief.data === "object" ? brief.data : {}),
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.push("/admin")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад до списку
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Бриф #{brief.id.slice(0, 8)}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                brief.status === "completed" ? "bg-green-100 text-green-700" :
                brief.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {brief.status === "completed" ? "Завершено" : brief.status === "in_progress" ? "В роботі" : "Новий"}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Створено: {new Date(brief.createdAt).toLocaleString("uk-UA")}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Статус:</span>
            <select
              value={brief.status || "new"}
              onChange={(e) => updateStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all cursor-pointer"
            >
              <option value="new">Новий</option>
              <option value="in_progress">В роботі</option>
              <option value="completed">Завершено</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(stepsMap).map(([step, data]) => (
          <div key={step} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Крок {step}: {data.name}</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6">
                {data.fields.map((field) => {
                  const value = fullData[field];
                  if (value === undefined || value === null || value === "") return null;
                  
                  return (
                    <div key={field} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {fieldLabels[field] || field}
                      </label>
                      <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {typeof value === "boolean" ? (value ? "Так" : "Ні") : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
