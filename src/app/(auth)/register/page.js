export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Kayit Ol</h1>
      <p className="text-gray-500">Mezun veya Akademisyen kaydiburadan yapilacak.</p>
      
      <a href="/login" className="mt-4 text-blue-500 hover:underline">
        Giriş Ekranına Dön
      </a>
    </div>
  );
}