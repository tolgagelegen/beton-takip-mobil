import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  HardHat, 
  ShieldCheck, 
  Eye, 
  Smartphone, 
  Monitor, 
  RotateCcw,
  Building2,
  Truck,
  Volume2
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser,
    currentRole, 
    logout,
    isMobileFrame, 
    setIsMobileFrame,
    playNotificationSound
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Üst Marka & Rol Başlığı */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Logo & Aktif Rol Rozeti */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">BETON MOBİL</span>
              {currentRole === 'SAHA_SEFI' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <HardHat className="w-3 h-3" /> Saha Şefi
                </span>
              )}
              {currentRole === 'ADMIN' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
              {currentRole === 'IZLEYICI' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> İzleyici
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {currentUser?.name || 'Giriş Yapıldı'}
            </p>
          </div>
        </div>

        {/* Sağ Alan: Ses Testi & Cihaz Simülasyonu & Çıkış Yap Butonu */}
        <div className="flex items-center gap-2">
          {/* SES TESTİ BUTONU (BİLGİSAYARDA SESİ ETKİNLEŞTİRMEK & TEST ETMEK İÇİN) */}
          <button
            type="button"
            onClick={() => playNotificationSound()}
            title="İkaz sesini test et"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition active:scale-95 cursor-pointer shadow-xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Ses Testi</span>
          </button>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? "Geniş Ekran Görünümüne Geç" : "Telefon Çerçevesi Moduna Geç"}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isMobileFrame 
                ? 'bg-amber-500 text-slate-950 border-amber-400' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isMobileFrame ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            <span>{isMobileFrame ? 'Mobil Çerçeve' : 'Geniş Ekran'}</span>
          </button>

          {/* ÇIKIŞ YAP BUTONU */}
          <button
            onClick={logout}
            title="Oturumu Kapat (Çıkış Yap)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-300 bg-red-950/60 hover:bg-red-900 border border-red-800/80 transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </header>
  );
}
