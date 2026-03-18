"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function PendingFilterButton({ pendingCount }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isPendingOnly = searchParams.get("pendingOnly") === "true";

  const toggleFilter = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (isPendingOnly) {
        params.delete("pendingOnly");
      } else {
        params.set("pendingOnly", "true");
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <button
      onClick={toggleFilter}
      disabled={isPending}
      className={`relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 w-full sm:w-auto ${
        isPendingOnly
          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
          : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/60"
      } ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Onay Bekleyenler
      {pendingCount > 0 && (
        <span className={`flex items-center justify-center min-w-[22px] h-5 px-1.5 text-xs font-bold rounded-full ${
          isPendingOnly ? "bg-white text-amber-600" : "bg-amber-500 text-white"
        }`}>
          {pendingCount}
        </span>
      )}
    </button>
  );
}