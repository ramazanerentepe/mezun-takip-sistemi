export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-zinc-900">
      {/* Geçici Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <div className="p-2 hover:bg-slate-700 rounded cursor-pointer">Kullanıcılar</div>
          <div className="p-2 hover:bg-slate-700 rounded cursor-pointer">Ayarlar</div>
        </nav>
      </aside>

      {/* Admin İçeriği */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}