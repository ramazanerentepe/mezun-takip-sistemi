"use client";

import React, { useState } from 'react';
import UserRow from './UserRow'; // Aynı klasörde oldukları için direkt çağırıyoruz

export default function UsersTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);

  if (!users || users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
        Sistemde henüz kayıtlı kullanıcı bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700">
      <table className="w-full text-left border-collapse bg-white dark:bg-zinc-800">
        <thead>
          <tr className="bg-gray-50 dark:bg-zinc-900/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
            <th className="p-4 font-medium border-b border-gray-200 dark:border-zinc-700">Ad Soyad</th>
            <th className="p-4 font-medium border-b border-gray-200 dark:border-zinc-700">E-posta</th>
            <th className="p-4 font-medium border-b border-gray-200 dark:border-zinc-700">Yetki Rolü</th>
            <th className="p-4 font-medium border-b border-gray-200 dark:border-zinc-700">E-posta Durumu</th>
            <th className="p-4 font-medium border-b border-gray-200 dark:border-zinc-700">Admin Onayı</th>
            <th className="p-4 font-medium border-b border-gray-200 dark:border-zinc-700 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
          {users.map((user) => (
            <UserRow 
              key={user.id} 
              user={user} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}