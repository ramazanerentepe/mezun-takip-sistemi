"use client";

import React, { useState } from 'react';
import { approveUser, deleteUser, updateUserRole } from '@/actions/admin/user-actions';

export default function UserRow({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const fullName = user.profile?.firstName && user.profile?.lastName 
    ? `${user.profile.firstName} ${user.profile.lastName}` 
    : 'Profil Bekleniyor';

  // Onaylama İşlemi
  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveUser(user.id);
    if (result.error) alert(result.error);
    setIsLoading(false);
  };

  // Silme İşlemi
  const handleDelete = async () => {
    if (!window.confirm(`${fullName} adlı kullanıcıyı silmek istediğinize emin misiniz?`)) return;
    
    setIsLoading(true);
    const result = await deleteUser(user.id);
    if (result.error) alert(result.error);
    setIsLoading(false);
  };

  // Yetki Kaydetme İşlemi
  const handleRoleSave = async () => {
    if (selectedRole === user.role) {
      setIsEditingRole(false);
      return;
    }
    
    setIsLoading(true);
    const result = await updateUserRole(user.id, selectedRole);
    if (result.error) alert(result.error);
    setIsEditingRole(false);
    setIsLoading(false);
  };

  return (
    <tr className={`hover:bg-gray-50/50 dark:hover:bg-zinc-700/30 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{fullName}</td>
      <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{user.email}</td>
      
      {/* Yetki Sütunu */}
      <td className="p-4">
        {isEditingRole ? (
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs font-medium rounded p-1 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 outline-none"
          >
            <option value="GRADUATE">Mezun/Öğrenci</option>
            <option value="ACADEMIC">Akademisyen</option>
            <option value="ADMIN">Yönetici</option>
            <option value="SUPER_ADMIN">Süper Admin</option>
          </select>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
            {user.role}
          </span>
        )}
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
        
        {/* Onayla Butonu */}
        {!user.isAdminApproved && (
          <button 
            onClick={handleApprove}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            Onayla
          </button>
        )}

        {/* Yetki Düzenle / Kaydet Butonu */}
        {isEditingRole ? (
          <button 
            onClick={handleRoleSave}
            className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Kaydet
          </button>
        ) : (
          <button 
            onClick={() => setIsEditingRole(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-zinc-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Yetki Düzenle
          </button>
        )}

        {/* Sil Butonu */}
        <button 
          onClick={handleDelete}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Sil
        </button>
      </td>
    </tr>
  );
}