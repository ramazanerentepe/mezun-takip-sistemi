"use client";

import React, { useRef, useState, useTransition } from "react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { createPost } from "@/actions/portal/post-actions"; 

export default function CreatePostBox({ currentUser }) {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      alert("En fazla 5 fotoğraf seçebilirsiniz.");
      return;
    }
    
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setSelectedImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  async function handleAction(formData) {
    selectedImages.forEach(img => {
      formData.append("images", img.file);
    });

    startTransition(async () => {
      const result = await createPost(formData);
      if (result.success) {
        formRef.current?.reset();
        setSelectedImages([]);
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-4 transition-colors mb-4">
      <div className="flex items-start space-x-3">
        <img 
          src={currentUser?.avatarUrl || "/logo.png"} 
          className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-neutral-700" 
          alt="Avatar"
        />
        <form ref={formRef} action={handleAction} className="flex-1">
          <textarea
            name="content"
            placeholder={`Merhaba ${currentUser?.firstName || "Mezun"}, ne anlatmak istersin?`}
            className="w-full bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-red-500 transition resize-none"
            rows="2"
          />

          {selectedImages.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  {/* imgage HATASI BURADA DÜZELTİLDİ VE alt ETİKETİ EKLENDİ */}
                  <img 
                    src={img.preview} 
                    alt={`Önizleme ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-neutral-700" 
                  />
                  <button 
                    onClick={() => removeImage(index)}
                    type="button"
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Fotoğraf Ekle ({selectedImages.length}/5)</span>
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white px-5 py-1.5 rounded-full text-xs font-bold transition disabled:opacity-50 flex items-center space-x-2 shadow-sm"
            >
              {isPending ? <span>Yükleniyor...</span> : <><Send className="w-3.5 h-3.5" /><span>Paylaş</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}