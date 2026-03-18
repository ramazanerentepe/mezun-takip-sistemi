"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

export default function SearchInput({ defaultValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(defaultValue || "");

  const handleSearch = (e) => {
    const value = e.target.value;
    setTerm(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative w-full sm:w-auto min-w-[260px] group">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${isPending ? 'text-red-500 animate-spin' : 'text-gray-400 group-focus-within:text-[#9d182e]'}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
      >
        {isPending ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        )}
      </svg>
      <input 
        type="text" 
        value={term}
        onChange={handleSearch}
        placeholder="İsim veya E-posta ara..." 
        className="w-full bg-gray-100/80 dark:bg-zinc-950/50 hover:bg-gray-200/50 dark:hover:bg-zinc-900 text-sm font-medium tracking-wide placeholder:font-normal rounded-xl py-2.5 pl-10 pr-4 outline-none border border-transparent focus:border-red-500/30 focus:ring-4 focus:ring-red-500/10 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300 text-gray-800 dark:text-gray-100"
      />
    </div>
  );
}