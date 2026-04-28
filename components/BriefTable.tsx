"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Brief {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  status: string;
  data: any;
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

const statusLabels: Record<string, { label: string; className: string }> = {
  new: { label: "Новий", className: "bg-blue-100 text-blue-700" },
  in_progress: { label: "В роботі", className: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Завершено", className: "bg-green-100 text-green-700" },
};

export default function BriefTable({ briefs }: BriefTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей бриф?")) return;

    setLoading(id);
    try {
      const response = await fetch(`/api/brief/${id}`, { method: "DELETE" });
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      alert("Помилка при видаленні");
    } finally {
      setLoading(null);
    }
  };

  if (briefs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-400 font-medium">Брифів поки немає</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Компанія / Контакт</th>
              <th className="px-6 py-4 font-semibold">Бюджет</th>
              <th className="px-6 py-4 font-semibold">Термін</th>
              <th className="px-6 py-4 font-semibold">Статус</th>
              <th className="px-6 py-4 font-semibold">Дата</th>
              <th className="px-6 py-4 font-semibold text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {briefs.map((brief) => {
              const data = typeof brief.data === 'object' ? brief.data : {};
              const budget = data.budget || "Не вказано";
              const deadline = data.deadline || "Не вказано";
              
              return (
                <tr key={brief.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{brief.companyName}</p>
                    <p className="text-gray-500 text-xs">{brief.contactName} • {brief.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-[150px]">
                    {budget}
                  </td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-[150px]">
                    {deadline}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${statusLabels[brief.status]?.className || statusLabels.new.className}`}>
                      {statusLabels[brief.status]?.label || brief.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(brief.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/brief/${brief.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Перегляд"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(brief.id)}
                        disabled={loading === brief.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Видалити"
                      >
                        {loading === brief.id ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
