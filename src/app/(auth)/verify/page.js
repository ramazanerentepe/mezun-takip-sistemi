"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAction } from "@/actions/auth/verify-action";
import { resendCodeAction } from "@/actions/auth/resend-code-action"; 

const OTP_DURATION_SECONDS = 180; 

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION_SECONDS);
  const [isClient, setIsClient] = useState(false);
  
  const [status, setStatus] = useState({ 
    loading: false, 
    resendLoading: false,
    error: "", 
    success: "" 
  });

  useEffect(() => {
    setIsClient(true);
    if (!email) return;

    const storageKey = `verify_expiry_v1_${email}`;
    let expiryTime = localStorage.getItem(storageKey);

    if (!expiryTime) {
      expiryTime = Date.now() + OTP_DURATION_SECONDS * 1000;
      localStorage.setItem(storageKey, expiryTime);
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      
      if (remaining > OTP_DURATION_SECONDS) {
         setTimeLeft(OTP_DURATION_SECONDS);
      } else {
         setTimeLeft(remaining);
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [email]);

  useEffect(() => {
    if (!email) {
      setStatus(prev => ({ ...prev, error: "E-posta bilgisi eksik. Lütfen tekrar giriş yapın." }));
    }
  }, [email]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleResendCode = async () => {
    if (!email) return;

    setStatus(prev => ({ ...prev, resendLoading: true, error: "", success: "" }));

    try {
      const result = await resendCodeAction(email);

      if (result.success) {
        const storageKey = `verify_expiry_v1_${email}`;
        const newExpiryTime = Date.now() + OTP_DURATION_SECONDS * 1000;
        localStorage.setItem(storageKey, newExpiryTime);
        
        setTimeLeft(OTP_DURATION_SECONDS);
        
        setStatus(prev => ({ 
          ...prev, 
          success: result.message 
        }));
      } else {
        setStatus(prev => ({ ...prev, error: result.message }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, error: "Kod gönderilemedi." }));
    } finally {
      setStatus(prev => ({ ...prev, resendLoading: false }));
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus(prev => ({ ...prev, loading: false, error: "", success: "" }));

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
        setStatus(prev => ({ ...prev, success: "Doğrulama başarılı! Admin onayından sonra giriş yapabilirsiniz!" }));
        localStorage.removeItem(`verify_expiry_v1_${email}`);
        
        setTimeout(() => router.push("/login"), 3000);
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
        
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Hesabınızı Doğrulayın
        </h1>

        {isClient && (
          <div className={`text-sm font-medium transition-colors ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
            Kalan Süre: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300" htmlFor="code">
            Doğrulama Kodu
          </label>
          
          <input
            id="code"
            name="code"
            type="text"
            maxLength={6}
            className="flex h-14 w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-center text-2xl font-bold tracking-[0.5em] text-white placeholder:text-gray-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
            value={code}
            onChange={(e) => {
              setCode(e.target.value); 
              setStatus(prev => ({ ...prev, error: "" })); 
            }}
            required
            autoComplete="off"
            disabled={status.loading || status.resendLoading || timeLeft === 0} 
          />
        </div>

        {status.error && (
          <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 rounded text-sm text-center animate-pulse">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="p-3 bg-green-900/30 border border-green-800 text-green-400 rounded text-sm text-center">
            {status.success}
          </div>
        )}

        <button
          type="submit"
          disabled={status.loading || status.resendLoading || !code || timeLeft === 0} 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full mt-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status.loading ? "Kontrol Ediliyor..." : timeLeft === 0 ? "Süre Doldu" : "Doğrula"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-400">
        Kod gelmedi mi?{" "}
        <button 
          type="button"
          onClick={handleResendCode}
          disabled={status.resendLoading || status.loading}
          className="font-semibold text-blue-500 hover:text-blue-400 transition-all disabled:opacity-50"
        >
          {status.resendLoading ? "Gönderiliyor..." : "Tekrar Gönder"}
        </button>
        <div className="mt-4">
            <Link href="/login" className="text-xs text-gray-400 hover:text-gray-300">
                &larr; Giriş ekranına dön
            </Link>
        </div>
      </div>
    </div>
  );
}