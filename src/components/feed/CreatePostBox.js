"use client";

import React, { useRef, useTransition } from "react";
import { Image as ImageIcon, Send } from "lucide-react";
import { createPost } from "@/actions/portal/post-actions";

export default function CreatePostBox({ currentUser }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData) {
    startTransition(async () => {
      const result = await createPost(formData);
      if (result.success) formRef.current?.reset();
      else alert(result.error);
    });
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 transition-colors">
      <div className="flex items-start space-x-3">
        <image
          src={currentUser?.avatarUrl} 
          className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-neutral-700" 
          alt="Avatar"
        />
        <form ref={formRef} action={handleAction} className="flex-1">
          <textarea
            name="content"
            placeholder={`Merhaba ${currentUser?.firstName}, ne anlatmak istersin?`}
            className="w-full bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-red-500 dark:focus:border-red-500 focus:ring-1 focus:ring-red-500 transition resize-none"
            rows="2"
            required
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
            <button type="button" className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white px-5 py-1.5 rounded-full text-xs font-bold transition disabled:opacity-50 flex items-center space-x-2 shadow-sm"
            >
              {isPending ? (
                <span>Yükleniyor...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Paylaş</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}