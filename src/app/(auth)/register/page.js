"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [userType, setUserType] = useState("graduate");
  const [isLoading, setIsLoading] = useState(false);
  
  // Hata mesajlarını yöneteceğimiz tek nokta
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    diplomaNo: "", 
    gradYear: "",  
    title: "",     
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Kullanıcı düzeltme yaparken hata mesajını ekrandan kaldır
    if (error) setError("");
  };

  /**
   * MOCK (Taklit) DOĞRULAMA
   */
  const checkIdentityFromSchoolDB = async (type, uniqueId) => {
    console.log(`${type} - ${uniqueId} sorgulanıyor...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return true; 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 

    // 1. Şifre Eşleşme Kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError("HATA: Girdiğiniz şifreler birbiriyle uyuşmuyor. Lütfen kontrol ediniz.");
      return; 
    }

    // 2. Şifre Uzunluk Kontrolü
    if (formData.password.length < 6) {
      setError("HATA: Güvenliğiniz için şifreniz en az 6 karakter olmalıdır.");
      return;
    }

    setIsLoading(true);

    // 3. Okul Veritabanı Kontrolü
    const uniqueIdToCheck = userType === "graduate" ? formData.diplomaNo : formData.email;
    const isVerified = await checkIdentityFromSchoolDB(userType, uniqueIdToCheck);

    if (!isVerified) {
      setError("HATA: Okul kayıtlarında bu bilgilerle eşleşen bir kişi bulunamadı! Lütfen bilgilerinizi kontrol edin.");
      setIsLoading(false);
      return; 
    }

    // 4. Paketleme
    const registerPayload = {
      type: userType,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
      ...(userType === "graduate" && {
        diplomaNumber: formData.diplomaNo,
        graduationYear: formData.gradYear,
      }),
      ...(userType === "academician" && {
        academicTitle: formData.title,
      }),
    };

    console.log("Kayıt Başarılı, Paket:", registerPayload);
    setIsLoading(false); 
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="relative w-16 h-16 mb-1">
          <Image src="/logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Aramıza Katılın
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mezun veya Akademisyen hesabı oluşturun.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => { setUserType("graduate"); setError(""); }}
          className={`text-sm font-medium py-2 rounded-md transition-all ${
            userType === "graduate"
              ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          Mezun Öğrenci
        </button>
        <button
          type="button"
          onClick={() => { setUserType("academician"); setError(""); }}
          className={`text-sm font-medium py-2 rounded-md transition-all ${
            userType === "academician"
              ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-700 dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          Akademisyen
        </button>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        
        {/* Ad - Soyad */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium dark:text-gray-300">Ad</label>
            <input
              id="name"
              type="text"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white"
              placeholder="Ad" // GÜNCELLENDİ
              required
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium dark:text-gray-300">Soyad</label>
            <input
              id="surname"
              type="text"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white"
              placeholder="Soyad" // GÜNCELLENDİ
              required
              onChange={handleChange}
            />
          </div>
        </div>

        {/* E-posta */}
        <div className="space-y-1">
          <label className="text-sm font-medium dark:text-gray-300">E-posta</label>
          <input
            id="email"
            type="email"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white"
            placeholder={userType === "graduate" ? "ogrenci@ktun.edu.tr" : "akademisyen@ktun.edu.tr"}
            required
            onChange={handleChange}
          />
        </div>

        {/* Dinamik Alanlar */}
        {userType === "graduate" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium dark:text-gray-300">Diploma No</label>
              <input
                id="diplomaNo"
                type="text"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white"
                placeholder="Diploma No" 
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium dark:text-gray-300">Mezuniyet Yılı</label>
              <input
                id="gradYear"
                type="number"
                min="1970"
                max="2100"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white"
                placeholder="Yıl (Örn: 2023)"
                required
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-sm font-medium dark:text-gray-300">Unvan</label>
            <select
              id="title"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white dark:bg-black"
              required
              onChange={handleChange}
              defaultValue=""
            >
              <option value="" disabled>Seçiniz</option>
              <option value="Prof. Dr.">Prof. Dr.</option>
              <option value="Doç. Dr.">Doç. Dr.</option>
              <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
              <option value="Arş. Gör.">Arş. Gör.</option>
              <option value="Öğr. Gör.">Öğr. Gör.</option>
            </select>
          </div>
        )}

        {/* Şifre Alanları */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium dark:text-gray-300">Şifre</label>
            <input
              id="password"
              type="password"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white"
              placeholder="Şifre"
              required
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium dark:text-gray-300">Şifre Tekrar</label>
            <input
              id="confirmPassword"
              type="password"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white"
              placeholder="Şifre Tekrar"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Hata Alanı */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-semibold text-center animate-pulse dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Buton */}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full mt-2 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          Kayıt Ol
        </button>
      </form>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Zaten hesabınız var mı?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-all">
          Giriş Yap
        </Link>
      </div>
    </div>
  );
}