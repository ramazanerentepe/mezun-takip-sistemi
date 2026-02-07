"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAction } from "@/actions/auth/verify-action";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL'den email'i al
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // E-posta kontrolü
  useEffect(() => {
    if (!email) {
      setError("E-posta bilgisi bulunamadı. Lütfen tekrar kayıt olun veya giriş yapın.");
    }
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Geçersiz işlem: E-posta adresi eksik.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyAction(email, code);

      if (result.success) {
        setSuccess("Doğrulama başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* --- HEADER KISMI --- */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="relative w-20 h-20 mb-2">
          <Image 
            src="/logo.png" 
            alt="Kurum Logosu" 
            fill 
            className="object-contain"
            priority 
          />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Hesabınızı Doğrulayın
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span> adresine gönderilen kodu giriniz.
        </p>
      </div>

      {/* --- FORM KISMI --- */}
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        
        <div className="space-y-1">
          <label className="text-sm font-medium dark:text-gray-300" htmlFor="code">
            Doğrulama Kodu
          </label>
          
          <input
            id="code"
            name="code"
            type="text"
            maxLength={6}
            className="
              flex h-14 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 
              text-center text-2xl font-bold tracking-[0.5em] 
              placeholder:text-gray-300 placeholder:tracking-normal
              focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent 
              dark:border-zinc-700 dark:text-white
              transition-all duration-200
            "
            // 'uppercase' sınıfını kaldırdık, böylece kullanıcı küçük harf yazdığını görebilir.
            
            value={code}
            onChange={(e) => {
              setCode(e.target.value); // .toUpperCase() KALDIRILDI. Artık olduğu gibi alıyoruz.
              setError(""); 
            }}
            required
            autoComplete="off"
            disabled={isLoading}
          />
        </div>

        {/* HATA VE BAŞARI MESAJLARI */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm text-center">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !code}
          className="
            inline-flex items-center justify-center rounded-md text-sm font-medium 
            bg-blue-600 text-white hover:bg-blue-700 
            h-10 px-4 py-2 w-full mt-2 transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isLoading ? "Kontrol Ediliyor..." : "Doğrula"}
        </button>
      </form>

      {/* --- FOOTER KISMI --- */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Kod gelmedi mi?{" "}
        <button 
          type="button"
          onClick={() => alert("Kod tekrar gönderildi (Burası için ayrı fonksiyon yazılacak)")}
          className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-all"
        >
          Tekrar Gönder
        </button>
        <div className="mt-4">
            <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                &larr; Giriş ekranına dön
            </Link>
        </div>
      </div>
    </div>
  );
}