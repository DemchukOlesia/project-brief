"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Brief {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  projectType: string;
  goal: string;
  budget: string;
  deadline: string;
  priority: string;
  createdAt: string;
}

interface BriefTableProps {
  briefs: Brief[];
}

const priorityLabels: Record<string, { label: string; className: string }> = {
  low: { label: "Низький", className: "bg-green-100 text-green-700" },
  medium: { label: "Середній", className: "bg-yellow-100 text-yellow-700" },
  high: { label: "Високий", className: "bg-orange-100 text-orange-700" },
  critical: { label: "Критичний", className: "bg-red-100 text-red-700" },
};

const projectTypeLabels: Record<string, string> = {
  website: "Веб-сайт",
  mobile: "Мобільний додаток",
  saas: "SaaS",
  ecommerce: "Інтернет-магазин",
  corporate: "Корпоративний портал",
  other: "Інше",
};

export default function BriefTable({ briefs }: BriefTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей бриф?")) return;

    setLoading(id);
    try {
      await fetch(`/api/brief/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      alert("Помилка при видаленні");
    } finally {
      setLoading(null);
    }
  };

  if (briefs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-400">Брифів поки немає</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Компанія</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Контакт</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Бюджет</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Термін</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пріоритет</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {briefs.map((brief) => (
            <tr key={brief.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{brief.companyName}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-gray-900">{brief.contactName}</p>
                <p className="text-xs text-gray-400">{brief.email}</p>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {projectTypeLabels[brief.projectType] || brief.projectType}
              </td>
              <td className="px-6 py-4 text-gray-600">{brief.budget}</td>
              <td className="px-6 py-4 text-gray-600">{brief.deadline}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${priorityLabels[brief.priority]?.className || "bg-gray-100 text-gray-700"}`}>
                  {priorityLabels[brief.priority]?.label || brief.priority}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-400 text-sm">
                {new Date(brief.createdAt).toLocaleDateString("uk-UA")}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <a href={`/admin/${brief.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    Перегляд
                  </a>
                  <button
                    onClick={() => handleDelete(brief.id)}
                    disabled={loading === brief.id}
                    className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {loading === brief.id ? "..." : "Видалити"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}