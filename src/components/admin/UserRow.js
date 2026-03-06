"use client";

import React, { useState } from 'react';

export default function UserRow({ user }) {
  const [isLoading, setIsLoading] = useState(false);

  const fullName = user.profile?.firstName && user.profile?.lastName 
    ? `${user.profile.firstName} ${user.profile.lastName}` 
    : 'Profil Bekleniyor';

  const handleApproveClick = async () => {
    setIsLoading(true);
    try {
      // İleride buraya: import { approveUser } from '@/actions/admin/user-actions' gelecek.
      console.log(`[Action] ${user.id} ID'li kullanıcı için onay isteği atılıyor...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    } catch (error) {
      console.error("[UserRow] Onaylama işlemi başarısız:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr className={`hover:bg-gray-50/50 dark:hover:bg-zinc-700/30 transition-colors ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
      <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{fullName}</td>
      <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{user.email}</td>
      <td className="p-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
          {user.role}
        </span>
      </td>
      <td className="p-4">
        {user.isEmailVerified ? (
          <span className="inline-flex items-center text-green-600 dark:text-green-400 font-medium text-sm">
            Doğrulandı
          </span>
        ) : (
          <span className="inline-flex items-center text-red-600 dark:text-red-400 font-medium text-sm">
            Bekliyor
          </span>
        )}
      </td>
      <td className="p-4">
        {user.isAdminApproved ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
            Onaylı
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
            Onay Bekliyor
          </span>
        )}
      </td>
      <td className="p-4 text-right space-x-2">
        {!user.isAdminApproved && (
          <button 
            onClick={handleApproveClick}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'İşleniyor...' : 'Onayla'}
          </button>
        )}
        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-zinc-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          Yetki Düzenle
        </button>
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
          Sil
        </button>
      </td>
    </tr>
  );
}