"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminStatus = localStorage.getItem("isAdmin");
      const currentPath = window.location.pathname;
      
      if (adminStatus === "true") {
        setIsAdmin(true);
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const currentPath = window?.location?.pathname || "";
      const isLoginPage = currentPath === "/admin-login";
      
      if (!isAdmin && !isLoginPage) {
        router.push("/admin-login");
      }
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Завантаження...</div>
      </div>
    );
  }

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isLoginPage = currentPath === "/admin-login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-lg font-semibold text-gray-900">
              Адмін-панель
            </Link>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Брифи
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/brief" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Бриф
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6">{children}</div>
      </main>
    </div>
  );
}