export const metadata = {
  title: "İş ve Staj İlanları | KTÜN Mezun Takip",
};

export default function JobsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">İlanlar</h1>
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-zinc-800 text-center text-gray-500">
        İş, staj ve proje arkadaşı ilanları burada listelenecek.
      </div>
    </div>
  );
}