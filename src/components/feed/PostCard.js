"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
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
import { toggleLike } from "@/actions/portal/post-actions";

export default function PostCard({ post }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false); 
  
  const [isLiked, setIsLiked] = useState(post.isLikedByMe);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isPending, startTransition] = useTransition();

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    startTransition(async () => {
      const result = await toggleLike(post.id);
      if (result.error) {
        setIsLiked(isLiked);
        setLikesCount(likesCount);
        alert(result.error);
      }
    });
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    alert("Gönderi bağlantısı panoya kopyalandı!");
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-visible relative">
      
      <div className="p-4 flex justify-between items-start">
        <div className="flex space-x-3 cursor-pointer">
          <img src={post.author.avatarUrl} alt="Author" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 hover:underline">
              {post.author.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{post.author.title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{post.time}</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition focus:outline-none"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 py-2 z-50">
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center transition">
                <Bookmark className="w-4 h-4 mr-3 text-gray-500" /> 
                <span className="font-medium">Gönderiyi Kaydet</span>
              </button>
              <button onClick={handleShare} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center transition">
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

      <div className="px-4 pb-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {post.images && post.images.length > 0 && (
        <div className={`mt-2 grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.map((image, idx) => (
             <img key={image.id || idx} src={image.url} alt="Gönderi Fotoğrafı" className="w-full h-auto max-h-[500px] object-cover" />
          ))}
        </div>
      )}

      <div className="px-4 py-2 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <div className="bg-red-600 rounded-full p-1">
            <ThumbsUp className="w-3 h-3 text-white" fill="currentColor" />
          </div>
          <span className="hover:underline cursor-pointer">{likesCount} Beğeni</span>
        </div>
        <div 
          onClick={() => setShowComments(!showComments)}
          className="hover:text-red-600 hover:underline cursor-pointer transition"
        >
          {post.comments} yorum
        </div>
      </div>

      <div className="px-2 py-1 flex justify-between items-center">
        <button 
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-medium rounded-lg transition ${
            isLiked 
              ? "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/10" 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-500"
          }`}
        >
          <ThumbsUp className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
          <span>Beğen</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition hover:text-red-600 dark:hover:text-red-500"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Yorum Yap</span>
        </button>

        <button 
          onClick={handleShare}
          className="flex-1 hidden sm:flex items-center justify-center space-x-2 p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition hover:text-red-600 dark:hover:text-red-500"
        >
          <Share2 className="w-5 h-5" />
          <span>Paylaş</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition hover:text-red-600 dark:hover:text-red-500">
          <Send className="w-5 h-5" />
          <span>Gönder</span>
        </button>
      </div>

      {showComments && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-900/50 border-t border-gray-200 dark:border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex-shrink-0 flex justify-center items-center text-white text-xs font-bold">
              Sen
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Yorum ekle..." 
                className="w-full bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-sm rounded-full px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition pr-10"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3 italic">Yorumlar backend bağlantısı yapıldığında burada listelenecektir.</p>
        </div>
      )}
      
    </div>
  );
}