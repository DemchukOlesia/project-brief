"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Brief {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  createdAt: string;
  status: string;
  [key: string]: any;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: "Новий", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "В роботі", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Завершено", color: "bg-green-100 text-green-700" },
};

export default function AdminPage() {
  const router = useRouter();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBriefs();
  }, []);

  const fetchBriefs = async () => {
    try {
      const response = await fetch("/api/brief");
      if (!response.ok) {
        throw new Error("Failed to fetch briefs");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setBriefs(data);
      } else {
        setBriefs([]);
      }
    } catch (error) {
      console.error("Error fetching briefs:", error);
      setBriefs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/brief/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBriefs();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const viewBrief = (brief: Brief) => {
    router.push(`/admin/brief/${brief.id}`);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Завантаження...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Всі брифи</h1>
          <p className="text-gray-500 text-sm mt-1">{briefs.length} брифів</p>
        </div>
        <button
          onClick={fetchBriefs}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Оновити
        </button>
      </div>

      {briefs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
          <p className="mb-2">Брифів поки немає</p>
          <button
            onClick={fetchBriefs}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Оновити список
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Компанія</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Дата</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {briefs.map((brief) => (
                <tr key={brief.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {brief.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {brief.companyName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {brief.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(brief.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={brief.status || "new"}
                      onChange={(e) => updateStatus(brief.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusLabels[brief.status]?.color || statusLabels.new.color}`}
                    >
                      <option value="new">Новий</option>
                      <option value="in_progress">В роботі</option>
                      <option value="completed">Завершено</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewBrief(brief)}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Переглянути
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
)}
    </div>
  );
}