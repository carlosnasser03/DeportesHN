import { CategoriesGrid } from "./components/CategoriesGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">DeportesHN ⚽</h1>
          <p className="text-blue-100 mt-1">
            Gestión de torneos de fútbol infantil
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 px-4 mb-6">
            Categorías
          </h2>
          <CategoriesGrid />
        </section>
      </main>
    </div>
  );
}
