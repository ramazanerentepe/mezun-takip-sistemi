"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDepartmentsAction } from "@/actions/department/get-departments-action";
// --- EKLENDİ: Backend Kayıt Fonksiyonu ---
import { registerAction } from "@/actions/auth/register-action"; 

const ACADEMIC_TITLES = [
  "Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi", 
  "Arş. Gör.", "Öğr. Gör.", "Uzman", "Okutman"
];

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState("graduate");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Bölüm Verisi State'i
  const [departments, setDepartments] = useState([]); 

  // ARAMA STATE'LERİ
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null);

  const [titleSearchTerm, setTitleSearchTerm] = useState(""); 
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false); 
  const titleDropdownRef = useRef(null);

  // FORM VERİLERİ
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    departmentId: "",
    password: "",        
    confirmPassword: "", 
    diplomaNo: "", 
    gradYear: "",  
    title: "",     
  });

  // Sayfa açılınca bölümleri çek
  useEffect(() => {
    async function loadDepartments() {
      const result = await getDepartmentsAction();
      if (result.success) {
        setDepartments(result.data);
      }
    }
    loadDepartments();
  }, []);

  // Filtrelemeler
  const filteredDepartments = departments.filter((dept) =>
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
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 

    // Validasyonlar
    if (formData.password !== formData.confirmPassword) {
      setError("HATA: Şifreler uyuşmuyor.");
      return; 
    }
    if (formData.password.length < 6) {
      setError("HATA: Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (!formData.departmentId) {
      setError("HATA: Lütfen listeden geçerli bir bölüm seçiniz.");
      return;
    }
    if (userType === "academician" && !formData.title) {
      setError("HATA: Lütfen unvanınızı seçiniz.");
      return;
    }

    setIsLoading(true);

    const registerPayload = {
      userRole: userType === "graduate" ? "GRADUATE" : "ACADEMIC",
      firstName: formData.name,
      lastName: formData.surname,
      email: formData.email,
      departmentId: formData.departmentId, 
      password: formData.password,
      
      ...(userType === "graduate" && {
        diplomaNo: formData.diplomaNo,
        // Backend int beklediği için dönüşüm yapıyoruz
        graduationYear: parseInt(formData.gradYear),
      }),
      ...(userType === "academician" && {
        academicTitle: formData.title,
      }),
    };

    try {
      // Backend fonksiyonunu çağırıyoruz
      const result = await registerAction(registerPayload);

      if (result.success) {
        // --- YÖNLENDİRME MANTIĞI ---
        if (userType === "graduate") {
          // Mezunlar kod doğrulamaya gider (Maili de taşıyoruz)
          router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
        } else {
          // Akademisyenler girişe gider (Şu an backend kapalı ama mantık bu)
          router.push("/login");
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Beklenmedik bir hata oluştu.");
    } finally {
      setIsLoading(false); 
    }
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
            placeholder="Bölüm"
            value={searchTerm}
            required
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
              setFormData((prev) => ({ ...prev, departmentId: "" })); 
            }}
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
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {departments.length === 0 ? "Bölümler yükleniyor..." : "Sonuç bulunamadı."}
                </div>
              )}
            </div>
          )}
        </div>

        {/* DİNAMİK ALANLAR (Diploma No / Unvan) */}
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
              placeholder="Unvan"
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