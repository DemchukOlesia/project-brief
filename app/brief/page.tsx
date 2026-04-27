import type { Metadata } from "next";
import BriefForm from "@/components/BriefForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Заповнити бриф",
  description: "Заповніть бриф для вашого проєкту",
};

export default function BriefPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            Бриф
          </Link>
          <Link
            href="/admin"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Адмін-панель
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Назад
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
              Бриф на розробку проєкту
            </h1>
            <p className="text-gray-500">
              Заповніть форму нижче, щоб отримати детальну пропозицію
            </p>
          </div>
          <BriefForm />
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Бриф. Усі права захищені.
        </p>
      </footer>
    </div>
  );
}