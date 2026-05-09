export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-rose-50 to-pink-50">
      <h1 className="text-4xl font-bold mb-4 text-rose-700">💍 Свадебное приглашение</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Добро пожаловать! Организаторы могут управлять списком гостей через админ-панель.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <a href="/admin/add-guest" className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition">
          ➕ Добавить гостя
        </a>
        <a href="/admin/dashboard" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
          📊 Панель организатора
        </a>
      </div>
    </main>
  );
}