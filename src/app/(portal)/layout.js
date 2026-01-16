export default function PortalLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      {/* Geçici Navbar */}
      <nav className="w-full h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800 flex items-center px-6 shadow-sm">
        <div className="text-xl font-bold text-blue-600">MezunSistemi</div>
        <div className="ml-auto text-sm text-gray-500">Kullanıcı Menüsü</div>
      </nav>

      {/* Sayfa İçeriği */}
      <main className="flex-1 container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}