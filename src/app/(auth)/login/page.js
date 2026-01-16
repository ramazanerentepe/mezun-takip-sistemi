export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Giriş Yap</h1>
      <p className="text-gray-500">Burasi (auth) grubu altindaki login sayfasidir.</p>
      
      {/* Test amaçlı link */}
      <a href="/register" className="mt-4 text-blue-500 hover:underline">
        Kayit Ol Sayfasina Git
      </a>
    </div>
  );
}