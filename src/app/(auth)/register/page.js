"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// GEÇİCİ VERİLER (Backend gelince silinecek)
const MOCK_DEPARTMENTS = [
  { id: "1", name: "Bilgisayar Mühendisliği" },
  { id: "2", name: "Elektrik-Elektronik Mühendisliği" },
  { id: "3", name: "Makine Mühendisliği" },
  { id: "4", name: "İnşaat Mühendisliği" },
  { id: "5", name: "Endüstri Mühendisliği" },
  { id: "6", name: "Mimarlık" },
  { id: "7", name: "Yazılım Mühendisliği" },
  { id: "8", name: "Yapay Zeka ve Makine Öğrenmesi" },
  { id: "9", name: "Harita Mühendisliği" },
];

const ACADEMIC_TITLES = [
  "Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi", 
  "Arş. Gör.", "Öğr. Gör.", "Uzman", "Okutman"
];

export default function RegisterPage() {
  const [userType, setUserType] = useState("graduate");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ARAMA STATE'LERİ
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null);

  const [titleSearchTerm, setTitleSearchTerm] = useState(""); 
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false); 
  const titleDropdownRef = useRef(null);

  // FORM VERİLERİ (Şifre burada tutuluyor)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    departmentId: "",
    password: "",        // Şifre alanı burada
    confirmPassword: "", // Şifre tekrarı burada
    diplomaNo: "", 
    gradYear: "",  
    title: "",     
  });

  // Filtrelemeler
  const filteredDepartments = MOCK_DEPARTMENTS.filter((dept) =>
    dept.name.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr'))
  );

  const filteredTitles = ACADEMIC_TITLES.filter((title) =>
    title.toLocaleLowerCase('tr').includes(titleSearchTerm.toLocaleLowerCase('tr'))
  );

  // Dışarı tıklama kontrolü
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (titleDropdownRef.current && !titleDropdownRef.current.contains(event.target)) {
        setIsTitleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Burada [id] demek: id'si "password" olan input değişirse, state'teki "password"ü güncelle demek.
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 

    // Şifre Kontrolleri
    if (formData.password !== formData.confirmPassword) {
      setError("HATA: Şifreler uyuşmuyor.");
      return; 
    }
    if (formData.password.length < 6) {
      setError("HATA: Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (!formData.departmentId) {
      setError("HATA: Lütfen geçerli bir bölüm seçiniz.");
      return;
    }
    if (userType === "academician" && !formData.title) {
      setError("HATA: Lütfen unvanınızı seçiniz.");
      return;
    }

    setIsLoading(true);

    // Simülasyon (1 saniye bekle)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // PAKETLEME ANI
    const registerPayload = {
      userRole: userType === "graduate" ? "GRADUATE" : "ACADEMIC",
      firstName: formData.name,
      lastName: formData.surname,
      email: formData.email,
      departmentId: formData.departmentId, 
      departmentName: searchTerm,
      password: formData.password, // BURAYA DİKKAT: Şifreyi state'ten alıp pakete koyuyoruz.
      
      ...(userType === "graduate" && {
        diplomaNo: formData.diplomaNo,
        graduationYear: parseInt(formData.gradYear),
      }),
      ...(userType === "academician" && {
        academicTitle: formData.title,
      }),
    };

    // Sadece konsola yazıyoruz (Alert yok)
    console.log("📦 PAKET HAZIRLANDI:", registerPayload);
    
    // Şifrenin gidip gitmediğini özel olarak görmek istersen konsola bakabilirsin:
    console.log("🔑 Şifre Kontrolü:", registerPayload.password ? "✅ Şifre Var" : "❌ Şifre YOK");

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
              placeholder="Ad"
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
              placeholder="Soyad"
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

        {/* AKILLI BÖLÜM KUTUSU */}
        <div className="space-y-1 relative" ref={dropdownRef}>
          <label className="text-sm font-medium dark:text-gray-300">Bölümünüz</label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white placeholder:text-gray-400"
            placeholder="Bölüm Ara (Örn: Bilgisayar)"
            value={searchTerm}
            required
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
              setFormData((prev) => ({ ...prev, departmentId: "" }));
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => {
                      setSearchTerm(dept.name);
                      setFormData((prev) => ({ ...prev, departmentId: dept.id }));
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {dept.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Sonuç yok.</div>
              )}
            </div>
          )}
        </div>

        {/* DİNAMİK ALANLAR */}
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
          <div className="space-y-1 relative" ref={titleDropdownRef}>
            <label className="text-sm font-medium dark:text-gray-300">Unvan</label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:text-white placeholder:text-gray-400"
              placeholder="Unvan Seçiniz veya Yazınız"
              value={titleSearchTerm}
              required
              onChange={(e) => {
                setTitleSearchTerm(e.target.value);
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                setIsTitleDropdownOpen(true);
              }}
              onFocus={() => setIsTitleDropdownOpen(true)}
            />
            {isTitleDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredTitles.length > 0 ? (
                  filteredTitles.map((title, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setTitleSearchTerm(title);
                        setFormData((prev) => ({ ...prev, title: title }));
                        setIsTitleDropdownOpen(false);
                      }}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      {title}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Sonuç yok, yazabilirsiniz.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ŞİFRE ALANLARI */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium dark:text-gray-300">Şifre</label>
            {/* id="password" ile onChange={handleChange} bağlantısı şifreyi kaydeder */}
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

        {/* Hata Mesajı */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-semibold text-center animate-pulse dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full mt-2 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? "İşleniyor..." : "Kayıt Ol"}
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