"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Send, 
  MoreHorizontal,
  Bookmark,
  Flag,
  EyeOff,
  Link as LinkIcon
} from "lucide-react";

export default function PostCard({ post }) {
  // Açılır menü durumu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Menü dışına tıklanınca menüyü kapatma mantığı
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-visible relative">
      
      {/* Post Üst (Yazar Bilgisi ve Menü Butonu) */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex space-x-3 cursor-pointer">
          <img src={post.author.avatarUrl} alt="Author" className="w-12 h-12 rounded-full" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 hover:underline">
              {post.author.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{post.author.title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{post.time}</p>
          </div>
        </div>

        {/* Aksiyon Menüsü (3 Nokta) Alanı */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition focus:outline-none"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Açılır Menü (Dropdown) */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 py-2 z-50">
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center transition">
                <Bookmark className="w-4 h-4 mr-3 text-gray-500" /> 
                <span className="font-medium">Gönderiyi Kaydet</span>
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center transition">
                <LinkIcon className="w-4 h-4 mr-3 text-gray-500" /> 
                <span className="font-medium">Bağlantıyı Kopyala</span>
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center transition">
                <EyeOff className="w-4 h-4 mr-3 text-gray-500" /> 
                <span className="font-medium">Bu gönderiyi gizle</span>
              </button>
              
              <div className="h-px bg-gray-200 dark:bg-neutral-700 my-1"></div>
              
              <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition">
                <Flag className="w-4 h-4 mr-3" /> 
                <span className="font-medium">Şikayet Et</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post İçeriği */}
      <div className="px-4 pb-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
        {post.content}
      </div>

      {/* Resim Varsa Göster */}
      {post.imageUrl && (
        <div className="mt-2 w-full flex justify-center bg-gray-50 dark:bg-neutral-950">
          <img src={post.imageUrl} alt="Post media" className="w-full max-h-[600px] object-cover" />
        </div>
      )}

      {/* Beğeni ve Yorum Sayıları */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1 cursor-pointer hover:text-red-600 transition">
          <div className="bg-red-600 rounded-full p-1">
            <ThumbsUp className="w-3 h-3 text-white" fill="currentColor" />
          </div>
          <span className="hover:underline">{post.likes}</span>
        </div>
        <div className="hover:text-red-600 hover:underline cursor-pointer transition">
          {post.comments} yorum
        </div>
      </div>

      {/* Post Aksiyon Butonları */}
      <div className="px-2 py-1 flex justify-between items-center">
        <button className="flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition hover:text-red-600 dark:hover:text-red-500">
          <ThumbsUp className="w-5 h-5" />
          <span>Beğen</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition hover:text-red-600 dark:hover:text-red-500">
          <MessageCircle className="w-5 h-5" />
          <span>Yorum Yap</span>
        </button>
        <button className="flex-1 hidden sm:flex items-center justify-center space-x-2 p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition hover:text-red-600 dark:hover:text-red-500">
          <Share2 className="w-5 h-5" />
          <span>Paylaş</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition hover:text-red-600 dark:hover:text-red-500">
          <Send className="w-5 h-5" />
          <span>Gönder</span>
        </button>
      </div>
    </div>
  );
}