"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

  const [titleSearchTerm, setTitleSearchTerm] = useState(""); 
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false); 
  const titleDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",        
    confirmPassword: "", 
    gradYear: "",  
    title: "",     
  });

  const filteredTitles = ACADEMIC_TITLES.filter((title) =>
    title.toLocaleLowerCase('tr').includes(titleSearchTerm.toLocaleLowerCase('tr'))
  );

  useEffect(() => {
    function handleClickOutside(event) {
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

    if (formData.password !== formData.confirmPassword) {
      setError("HATA: Şifreler uyuşmuyor.");
      return; 
    }
    if (formData.password.length < 6) {
      setError("HATA: Şifre en az 6 karakter olmalıdır.");
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
      password: formData.password,
      
      ...(userType === "graduate" && {
        graduationYear: parseInt(formData.gradYear),
      }),
      ...(userType === "academician" && {
        academicTitle: formData.title,
      }),
    };

    try {
      const result = await registerAction(registerPayload);

      if (result.success) {
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
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
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Aramıza Katılın
        </h1>
        <p className="text-sm text-gray-300">
          Mezun veya Akademisyen hesabı oluşturun.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-800 rounded-lg">
        <button
          type="button"
          onClick={() => { setUserType("graduate"); setError(""); }}
          className={`text-sm font-medium py-2 rounded-md transition-all ${
            userType === "graduate"
              ? "bg-zinc-700 text-white shadow-sm"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Mezun Öğrenci
        </button>
        <button
          type="button"
          onClick={() => { setUserType("academician"); setError(""); }}
          className={`text-sm font-medium py-2 rounded-md transition-all ${
            userType === "academician"
              ? "bg-zinc-700 text-white shadow-sm"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Akademisyen
        </button>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Ad</label>
            <input
              id="name"
              type="text"
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
              placeholder="Ad"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Soyad</label>
            <input
              id="surname"
              type="text"
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
              placeholder="Soyad"
              required
              value={formData.surname}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">E-posta</label>
          <input
            id="email"
            type="email"
            className="flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
            placeholder={userType === "graduate" ? "E-posta Adresi" : "E-posta Adresi"}
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {userType === "graduate" ? (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Mezuniyet Yılı</label>
            <input
              id="gradYear"
              type="number"
              min="2010"
              max={new Date().getFullYear()} 
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
              placeholder="Yıl"
              required
              value={formData.gradYear}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="space-y-1 relative" ref={titleDropdownRef}>
            <label className="text-sm font-medium text-gray-300">Unvan</label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
              placeholder="Unvan Seçiniz"
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
             <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredTitles.length > 0 ? (
                  filteredTitles.map((title, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setTitleSearchTerm(title);
                        setFormData((prev) => ({ ...prev, title: title }));
                        setIsTitleDropdownOpen(false);
                      }}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-100 hover:bg-zinc-700 transition-colors"
                    >
                      {title}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400">Sonuç yok, yazabilirsiniz.</div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Şifre</label>
            <input
              id="password"
              type="password"
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
              placeholder="Şifre"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Şifre Tekrar</label>
            <input
              id="confirmPassword"
              type="password"
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
              placeholder="Şifre Tekrar"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 rounded text-sm font-semibold text-center animate-pulse">
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

      <div className="text-center text-sm text-gray-400">
        Zaten hesabınız var mı?{" "}
        <Link href="/login" className="font-semibold text-blue-500 hover:text-blue-400 transition-all">
          Giriş Yap
        </Link>
      </div>
    </div>
  );
}