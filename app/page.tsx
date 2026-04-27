import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бриф",
};

export default function HomePage() {
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

      <section className="flex-1 flex items-center justify-center pt-16">
        <div className="max-w-[1100px] mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Бриф на розробку проєкту
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-[700px] mx-auto leading-relaxed">
            Бриф — це коротка анкета, яка допомагає нам зрозуміти Ваш проєкт, цілі та очікування. Заповнивши його, 
            Ви отримаєте більш точну оцінку вартості, термінів і оптимальне рішення для реалізації.
          </p>
          <Link
            href="/brief"
            className="inline-flex px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
          >
            Заповнити бриф
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Бриф. Усі права захищені.
        </p>
      </footer>
    </div>
  );
}