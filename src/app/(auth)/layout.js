export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-zinc-800">
        {/* Login veya Register sayfası buraya (children içine) gelecek */}
        {children}
      </div>
    </div>
  );
}