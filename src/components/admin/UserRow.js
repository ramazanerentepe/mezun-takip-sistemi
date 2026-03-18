"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { approveUser, deleteUser, updateUserRole } from '@/actions/admin/user-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserRow({ user }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fullName = user.profile?.firstName && user.profile?.lastName 
    ? `${user.profile.firstName} ${user.profile.lastName}` 
    : 'Profil Bekleniyor';

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveUser(user.id);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh(); 
    }
    setIsLoading(false);
  };

  const handleRoleSave = async () => {
    if (selectedRole === user.role) {
      setIsEditingRole(false);
      return;
    }
    
    setIsLoading(true);
    const result = await updateUserRole(user.id, selectedRole);
    if (result.error) {
      alert(result.error);
    } else {
      setIsEditingRole(false);
      router.refresh(); 
    }
    setIsLoading(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setDeleteReason("");
    setDeleteError("");
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteReason("");
    setDeleteError("");
  };

  const executeDelete = async () => {
    if (deleteReason.trim() === "") {
      setDeleteError("Lütfen geçerli bir silme sebebi giriniz.");
      return;
    }
    
    setIsLoading(true);
    const result = await deleteUser(user.id, deleteReason);
    
    if (result.error) {
      setDeleteError(result.error);
      setIsLoading(false);
    } else {
      closeDeleteModal();
      router.refresh(); 
    }
  };

  return (
    <>
      <tr className={`hover:bg-gray-50/50 dark:hover:bg-zinc-700/30 transition-colors ${isLoading && !isDeleteModalOpen ? 'opacity-50 pointer-events-none' : ''}`}>
        <td className="p-4 font-medium">
          <Link 
            href={`/profile/${user.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
          >
            {fullName}
          </Link>
        </td>
        <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{user.email}</td>
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
          {!user.isAdminApproved && (
            <button 
              onClick={handleApprove}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Onayla
            </button>
          )}
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
          <button 
            onClick={openDeleteModal}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Sil
          </button>
        </td>
      </tr>

      {isDeleteModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-zinc-800 transform transition-all">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Kullanıcıyı Sil
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">{fullName}</strong> adlı kullanıcıyı kalıcı olarak silmek üzeresiniz. Lütfen kullanıcıya e-posta ile iletilecek silme sebebini giriniz:
              </p>
              <div className="space-y-2">
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#9d182e]/50 resize-none placeholder:text-gray-400"
                  rows="3"
                  placeholder="Örn: Sahte profil kullanımı..."
                  value={deleteReason}
                  onChange={(e) => {
                    setDeleteReason(e.target.value);
                    if (deleteError) setDeleteError("");
                  }}
                  autoFocus
                ></textarea>
                {deleteError && (
                  <p className="text-red-500 text-xs font-medium pl-1">{deleteError}</p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={executeDelete}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {isLoading ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}