import Navbar from "@/components/Navbar"; 

export default function PortalLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      
      <Navbar />

      {/* İÇERİK ALANI */}
      <main className="flex-1 container mx-auto p-4 md:p-6 pb-24 md:pb-6 max-w-5xl">
        {children}
      </main>
      
    </div>
  );
}