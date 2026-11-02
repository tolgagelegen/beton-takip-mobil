import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import SahaSefiView from './components/SahaSefiView';
import AdminView from './components/AdminView';
import IzleyiciView from './components/IzleyiciView';
import InstallPrompt from './components/InstallPrompt';
import ErrorBoundary from './components/ErrorBoundary';
import { Bell, Volume2 } from 'lucide-react';

function MainContent() {
  const { 
    currentUser, 
    currentRole, 
    isMobileFrame,
    yeniSahaBildirimi,
    setYeniSahaBildirimi,
    playNotificationSound
  } = useApp();

  // Kullanıcı giriş yapmamışsa doğrudan Login Ekranı gösterilir
  if (!currentUser || !currentUser.username || !currentRole) {
    return <LoginView />;
  }

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col ${isMobileFrame ? 'py-4 sm:py-8 items-center justify-center bg-slate-900/90' : ''}`}>
      
      {/* Cihaz Çerçevesi (Telefon Modu aktifse telefon kılıfı şeklinde görünür) */}
      <div 
        className={`w-full bg-slate-100 flex flex-col transition-all duration-300 ${
          isMobileFrame 
            ? 'max-w-[440px] min-h-[880px] rounded-[42px] shadow-2xl ring-12 ring-slate-800 border-4 border-slate-950 overflow-hidden relative' 
            : 'max-w-4xl mx-auto min-h-screen'
        }`}
      >
        {/* Telefon Çerçevesi Hoparlör / Dinamik Ada Notchu */}
        {isMobileFrame && (
          <div className="bg-slate-950 pt-2 pb-1 flex justify-center items-center">
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800 ml-8"></div>
            </div>
          </div>
        )}

        {/* Üst Menü & Kullanıcı Bilgisi & Çıkış */}
        <Navbar />

        {/* CANLI YENİ SAHA DÖKÜMÜ AÇILIR BİLDİRİMİ (YÖNETİCİLER VE MERKEZ İÇİN) */}
        {yeniSahaBildirimi && currentUser?.role !== 'SAHA_SEFI' && (
          <div className="mx-3.5 sm:mx-5 mt-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-300 flex items-center justify-between gap-3 animate-bounce z-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shrink-0 shadow-md">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full">
                    🚨 YENİ SAHA DÖKÜMÜ GELDİ!
                  </span>
                  <span className="text-[11px] text-amber-100 font-semibold">
                    ⏰ {yeniSahaBildirimi.saat || 'Az önce'}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold mt-0.5 text-slate-950">
                  {yeniSahaBildirimi.santiye} — {yeniSahaBildirimi.m3} m³ ({yeniSahaBildirimi.yapiKismi})
                </h4>
                <p className="text-xs text-slate-950/90 font-medium">
                  👷 <strong>Giren Kullanıcı:</strong> <span className="underline font-black">{yeniSahaBildirimi.kaydeden}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => playNotificationSound()}
                title="İkaz sesini tekrar çal"
                className="p-2 bg-slate-950/40 hover:bg-slate-950/70 text-white rounded-xl transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
              </button>
              <button
                type="button"
                onClick={() => setYeniSahaBildirimi(null)}
                title="Kapat"
                className="text-white hover:text-slate-950 text-sm font-black p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Ana Dinamik İçerik: SADECE KULLANICININ KENDİ SAYFASI RENDER EDİLİR */}
        <main className="flex-1 p-3.5 sm:p-5 overflow-y-auto">
          {currentRole === 'ADMIN' ? (
            <AdminView />
          ) : currentRole === 'IZLEYICI' ? (
            <IzleyiciView />
          ) : (
            <SahaSefiView />
          )}
        </main>

        {/* Telefon Home Indicator (Telefon Çerçevesinde alt çizgi) */}
        {isMobileFrame && (
          <div className="bg-white py-1 flex justify-center">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Android / Mobil Uygulama Olarak Yükleme Bildirimi */}
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
