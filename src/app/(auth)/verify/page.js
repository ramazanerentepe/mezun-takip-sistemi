"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAction } from "@/actions/auth/verify-action";

// Sabitler
const OTP_DURATION_SECONDS = 180; // 3 Dakika

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // State Yönetimi
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION_SECONDS);
  const [isClient, setIsClient] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  /**
   * Sayaç Yönetimi (Timer Logic)
   * Sayfa yenilendiğinde veri kaybını önlemek için bitiş süresi localStorage'da tutulur.
   */
  useEffect(() => {
    setIsClient(true);
    if (!email) return;

    const storageKey = `verify_expiry_${email}`;
    let expiryTime = localStorage.getItem(storageKey);

    // Eğer kayıtlı süre yoksa veya süre geçmişse yeni bitiş zamanı belirle
    if (!expiryTime) {
      expiryTime = Date.now() + OTP_DURATION_SECONDS * 1000;
      localStorage.setItem(storageKey, expiryTime);
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer(); // İlk hesaplama
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId); // Cleanup
  }, [email]);

  // E-posta parametre kontrolü
  useEffect(() => {
    if (!email) {
      setStatus(prev => ({ ...prev, error: "E-posta bilgisi eksik. Lütfen tekrar giriş yapın." }));
    }
  }, [email]);

  // Yardımcı Fonksiyon: Saniyeyi MM:SS formatına çevirir
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  /**
   * Kodu Yeniden Gönder
   * Sayacı ve localStorage verisini sıfırlar.
   */
  const handleResendCode = () => {
    // TODO: Backend 'resend-code' servisine bağlanacak.
    alert("Kod tekrar gönderildi!");
    
    const newExpiryTime = Date.now() + OTP_DURATION_SECONDS * 1000;
    localStorage.setItem(`verify_expiry_${email}`, newExpiryTime);
    
    setTimeLeft(OTP_DURATION_SECONDS);
    setStatus({ loading: false, error: "", success: "" });
  };

  /**
   * Doğrulama İşlemi
   */
  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, error: "", success: "" });

    if (timeLeft === 0) {
      setStatus(prev => ({ ...prev, error: "Süre doldu. Lütfen kodu tekrar isteyin." }));
      return;
    }

    if (!email) {
      setStatus(prev => ({ ...prev, error: "Geçersiz işlem: E-posta eksik." }));
      return;
    }

    setStatus(prev => ({ ...prev, loading: true }));

    try {
      const result = await verifyAction(email, code);

      if (result.success) {
        setStatus(prev => ({ ...prev, success: "Doğrulama başarılı! Yönlendiriliyorsunuz..." }));
        localStorage.removeItem(`verify_expiry_${email}`); // Temizlik
        
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus(prev => ({ ...prev, error: result.message }));
      }
    } catch (err) {
      setStatus(prev => ({ ...prev, error: "Sunucu hatası oluştu." }));
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Section */}
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

        {isClient && (
          <div className={`text-sm font-medium transition-colors ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
            Kalan Süre: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Verification Form */}
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
            value={code}
            onChange={(e) => {
              setCode(e.target.value); 
              setStatus(prev => ({ ...prev, error: "" })); 
            }}
            required
            autoComplete="off"
            disabled={status.loading || timeLeft === 0} 
          />
        </div>

        {/* Status Messages */}
        {status.error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center animate-pulse">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm text-center">
            {status.success}
          </div>
        )}

        <button
          type="submit"
          disabled={status.loading || !code || timeLeft === 0} 
          className="
            inline-flex items-center justify-center rounded-md text-sm font-medium 
            bg-blue-600 text-white hover:bg-blue-700 
            h-10 px-4 py-2 w-full mt-2 transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {status.loading ? "Kontrol Ediliyor..." : timeLeft === 0 ? "Süre Doldu" : "Doğrula"}
        </button>
      </form>

      {/* Footer Section */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Kod gelmedi mi?{" "}
        <button 
          type="button"
          onClick={handleResendCode}
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