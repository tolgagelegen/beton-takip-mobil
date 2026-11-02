import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  Layers, 
  Building, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Send, 
  FileText, 
  Calendar,
  Clock,
  Trash2,
  Bell,
  Check,
  X,
  Edit3,
  UserCheck,
  Search
} from 'lucide-react';

export default function SahaSefiView() {
  const { 
    santiyeler, 
    betonSiniflari, 
    addBetonSinifi,
    yapiKisimlari, 
    sahaDokumleri, 
    addSahaDokum, 
    updateSahaDokum,
    deleteSahaDokum,
    eksikBildirimler,
    sahaSefiBildirimCevapla,
    currentUser
  } = useApp();

  // Bildirim Cevaplama State
  const [seciliBildirimId, setSeciliBildirimId] = useState(null);
  const [bildirimYapiKismi, setBildirimYapiKismi] = useState('');
  const [bildirimSahaNotu, setBildirimSahaNotu] = useState('');

  // Geçmiş Döküm Arama & Tarih Filtre State
  const [filtreTarih, setFiltreTarih] = useState('');
  const [filtreArama, setFiltreArama] = useState('');

  // Giriş Yapan Saha Elemanı Bilgisi
  const aktifKullaniciAdi = currentUser?.name 
    ? `${currentUser.name} (${currentUser.username})` 
    : (currentUser?.username || 'Saha Sorumlusu');

  // Form State
  const [santiyeId, setSantiyeId] = useState(santiyeler[0]?.id || '');
  const [dokumTarihi, setDokumTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [yapiKismi, setYapiKismi] = useState('');
  const [betonSinifi, setBetonSinifi] = useState(betonSiniflari[2] || 'C30/37');
  const [mikserSayisi, setMikserSayisi] = useState('');
  const [toplamM3, setToplamM3] = useState('');
  const [iadeVarMi, setIadeVarMi] = useState(false);
  const [irsaliyeNolari, setIrsaliyeNolari] = useState('');
  const [notlar, setNotlar] = useState('');
  const [kayitBasarili, setKayitBasarili] = useState(false);

  // Düzenleme / Güncelleme Modal State
  const [duzenleModalAcik, setDuzenleModalAcik] = useState(false);
  const [duzenlenenDokum, setDuzenlenenDokum] = useState(null);
  const [editSantiyeId, setEditSantiyeId] = useState('');
  const [editDokumTarihi, setEditDokumTarihi] = useState('');
  const [editYapiKismi, setEditYapiKismi] = useState('');
  const [editBetonSinifi, setEditBetonSinifi] = useState('');
  const [editMikserSayisi, setEditMikserSayisi] = useState('');
  const [editToplamM3, setEditToplamM3] = useState('');
  const [editIadeVarMi, setEditIadeVarMi] = useState(false);
  const [editIadeM3, setEditIadeM3] = useState('');
  const [editIrsaliyeNolari, setEditIrsaliyeNolari] = useState('');
  const [editNotlar, setEditNotlar] = useState('');
  const [guncellemeBasarili, setGuncellemeBasarili] = useState(false);

  const handleDuzenleBaslat = (dokum) => {
    setDuzenlenenDokum(dokum);
    const mevcutSantiye = santiyeler.find(s => s.id === dokum.santiyeId || s.ad === dokum.santiyeAdi);
    setEditSantiyeId(mevcutSantiye ? mevcutSantiye.id : (santiyeler[0]?.id || ''));
    setEditDokumTarihi(dokum.tarih || new Date().toISOString().split('T')[0]);
    setEditYapiKismi(dokum.yapiKismi || '');
    setEditBetonSinifi(dokum.betonSinifi || betonSiniflari[0] || 'C30/37');
    setEditMikserSayisi(dokum.mikserSayisi || '');
    setEditToplamM3(dokum.toplamM3 || '');
    setEditIadeVarMi(Boolean(dokum.iadeVarMi));
    setEditIadeM3(dokum.iadeM3 || '');
    setEditIrsaliyeNolari(dokum.irsaliyeNolari && dokum.irsaliyeNolari !== 'Girilmedi' ? dokum.irsaliyeNolari : '');
    setEditNotlar(dokum.notlar || '');
    setDuzenleModalAcik(true);
  };

  const handleDuzenleKaydet = async (e) => {
    e.preventDefault();
    if (!duzenlenenDokum) return;

    const secilenSantiye = santiyeler.find(s => s.id === editSantiyeId);

    await updateSahaDokum(duzenlenenDokum.id, {
      tarih: editDokumTarihi || duzenlenenDokum.tarih || new Date().toISOString().split('T')[0],
      saat: duzenlenenDokum.saat,
      santiyeId: editSantiyeId,
      santiyeAdi: secilenSantiye ? secilenSantiye.ad : duzenlenenDokum.santiyeAdi,
      santiye: secilenSantiye ? secilenSantiye.ad : duzenlenenDokum.santiyeAdi,
      yapiKismi: editYapiKismi.trim() || 'Genel İnşaat Dökümü',
      betonSinifi: editBetonSinifi,
      mikserSayisi: Number(editMikserSayisi) || 0,
      toplamM3: Number(editToplamM3) || 0,
      iadeVarMi: Boolean(editIadeVarMi),
      iadeM3: editIadeVarMi ? (Number(editIadeM3) || 0) : 0,
      irsaliyeNolari: editIrsaliyeNolari.trim() || 'Girilmedi',
      notlar: editNotlar.trim(),
      kaydeden: duzenlenenDokum.kaydeden || duzenlenenDokum.sahaSefi || aktifKullaniciAdi,
      sahaSefi: duzenlenenDokum.sahaSefi || duzenlenenDokum.kaydeden || aktifKullaniciAdi
    });

    setDuzenleModalAcik(false);
    setDuzenlenenDokum(null);
    setGuncellemeBasarili(true);
    setTimeout(() => setGuncellemeBasarili(false), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const secilenSantiye = santiyeler.find(s => s.id === santiyeId);

    const yeniKayit = {
      tarih: dokumTarihi || new Date().toISOString().split('T')[0],
      saat: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      santiyeId,
      santiyeAdi: secilenSantiye ? secilenSantiye.ad : 'Şantiye',
      yapiKismi: yapiKismi.trim() || 'Genel İnşaat Dökümü',
      betonSinifi,
      mikserSayisi: Number(mikserSayisi) || 0,
      toplamM3: Number(toplamM3) || 0,
      iadeVarMi: Boolean(iadeVarMi),
      iadeM3: 0,
      iadeNedeni: '',
      irsaliyeNolari: irsaliyeNolari.trim() || 'Girilmedi',
      sahaSefi: aktifKullaniciAdi,
      kaydeden: aktifKullaniciAdi,
      kullaniciAdi: currentUser?.username || '',
      notlar: notlar.trim()
    };

    addSahaDokum(yeniKayit);

    // Formu temizle ve başarı mesajı göster
    setKayitBasarili(true);
    setTimeout(() => setKayitBasarili(false), 3500);

    // Reset alanlar
    setYapiKismi('');
    setMikserSayisi('');
    setToplamM3('');
    setIrsaliyeNolari('');
    setNotlar('');
    setIadeVarMi(false);
  };

  // Saha kullanıcıları sadece kendi girdikleri dökümleri görebilir
  const kullaniciDokumleri = sahaDokumleri.filter(dok => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true; // Admin her şeyi görebilir

    const uClean = (currentUser.username || '').trim().toLowerCase();
    const nameClean = (currentUser.name || '').trim().toLowerCase();

    const dokUserClean = (dok.kullaniciAdi || '').trim().toLowerCase();
    const kClean = (dok.kaydeden || '').trim().toLowerCase();
    const sClean = (dok.sahaSefi || '').trim().toLowerCase();

    if (uClean && dokUserClean && dokUserClean === uClean) return true;
    if (uClean && (kClean.includes(`(${uClean})`) || kClean === uClean || sClean.includes(`(${uClean})`) || sClean === uClean)) return true;
    if (nameClean && (kClean.includes(nameClean) || sClean.includes(nameClean))) return true;

    return false;
  });

  // Yalnızca bu kullanıcıya ait (veya herkese açık genel) bekleyen eksik irsaliye bildirimleri
  const kullaniciBekleyenBildirimler = useMemo(() => {
    return (eksikBildirimler || []).filter(bild => {
      if (bild.durum !== 'BEKLIYOR') return false;
      if (!currentUser) return false;
      if (currentUser.role === 'ADMIN') return true; // Admin her şeyi görebilir

      const hedefId = bild.hedefKullaniciId;
      const hedefUser = (bild.hedefKullaniciUsername || '').trim().toLowerCase();
      const hedefAd = (bild.hedefKullaniciAdi || '').trim().toLowerCase();

      // Genel bildirim ('TUMU' veya belirtilmemişse) herkes görür
      if (!hedefId || hedefId === 'TUMU' || hedefUser === 'tumu' || (!hedefUser && !hedefAd && !hedefId)) {
        return true;
      }

      const myId = currentUser.id;
      const myUser = (currentUser.username || '').trim().toLowerCase();
      const myName = (currentUser.name || '').trim().toLowerCase();

      // Bu kullanıcıya atanmışsa görür
      if (hedefId && myId && hedefId === myId) return true;
      if (hedefUser && myUser && (hedefUser === myUser || myUser.includes(hedefUser) || hedefUser.includes(myUser))) return true;
      if (hedefAd && myName && (hedefAd === myName || myName.includes(hedefAd) || hedefAd.includes(myName))) return true;

      return false;
    });
  }, [eksikBildirimler, currentUser]);

  // Belirli bir tarihteki dökümleri anında filtrele ve listeye kaydır
  const handleBuTarihtekiDokumleriFiltrele = (tarih) => {
    setFiltreTarih(tarih || '');
    setFiltreArama('');
    setTimeout(() => {
      const el = document.getElementById('saha-gecmis-dokumler');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Filtrelenmiş Dökümler
  const filtrelenmisDokumler = kullaniciDokumleri.filter(dok => {
    const tUygun = !filtreTarih || dok.tarih === filtreTarih;
    const qUygun = !filtreArama || (
      (dok.yapiKismi && dok.yapiKismi.toLowerCase().includes(filtreArama.toLowerCase())) ||
      (dok.santiyeAdi && dok.santiyeAdi.toLowerCase().includes(filtreArama.toLowerCase())) ||
      (dok.betonSinifi && dok.betonSinifi.toLowerCase().includes(filtreArama.toLowerCase())) ||
      (dok.irsaliyeNolari && dok.irsaliyeNolari.toLowerCase().includes(filtreArama.toLowerCase())) ||
      (dok.notlar && dok.notlar.toLowerCase().includes(filtreArama.toLowerCase()))
    );
    return tUygun && qUygun;
  });

  // Toplam bugün dökülen m3 hesabı (yalnızca bu kullanıcının dökümleri)
  const bugun = new Date().toISOString().split('T')[0];
  const bugunDokulenM3 = kullaniciDokumleri
    .filter(d => d.tarih === bugun)
    .reduce((acc, curr) => acc + (curr.toplamM3 || 0), 0);

  const bugunMikserToplam = kullaniciDokumleri
    .filter(d => d.tarih === bugun)
    .reduce((acc, curr) => acc + (curr.mikserSayisi || 0), 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Üst Bilgilendirme Kartı */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-slate-950 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-950/15 px-2 py-0.5 rounded-full">
              👷 Saha Şefi Modu
            </span>
            <h2 className="text-xl font-extrabold tracking-tight mt-1 text-slate-950">
              Yeni Beton Döküm Girişi
            </h2>
            <p className="text-xs text-slate-900/80 font-medium mt-0.5">
              Gelen mikserleri, dökülen metrajı ve iadeleri anında kaydedin.
            </p>
          </div>

          <div className="bg-slate-950 text-white rounded-xl px-3 py-2 text-right shadow-sm shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bugün Dökülen</span>
            <span className="text-lg font-black text-amber-400">{bugunDokulenM3} m³</span>
            <span className="text-[10px] text-slate-400 block font-semibold">{bugunMikserToplam} mikser</span>
          </div>
        </div>
      </div>

      {/* Başarılı Bildirimi */}
      {kayitBasarili && (
        <div className="bg-emerald-500 text-white p-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div className="text-xs sm:text-sm font-bold">
            Döküm kaydı başarıyla sisteme işlendi! Fatura eşleştirmesi için Admin onayına gönderildi.
          </div>
        </div>
      )}

      {guncellemeBasarili && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div className="text-xs sm:text-sm font-bold">
            Döküm kaydı başarıyla güncellendi! Yapılan değişiklikler merkeze ve veritabanına kaydedildi.
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MERKEZDEN GELEN EKSİK İRSALİYE BİLDİRİMLERİ (KULLANICI İSTEĞİ) */}
      {/* ============================================================== */}
      {kullaniciBekleyenBildirimler.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg space-y-3 animate-pulse-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base tracking-tight">
                  🚨 MERKEZDEN EKSİK İRSALİYE BİLDİRİMİ!
                </h3>
                <p className="text-[11px] text-rose-100 font-medium">
                  Merkeze gelen irsaliyelerden sahadan henüz girilmemiş olanlar var. Lütfen tarihli koçanları arayıp bulunuz.
                </p>
              </div>
            </div>
            <span className="bg-white text-rose-700 text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
              {kullaniciBekleyenBildirimler.length} Bekleyen
            </span>
          </div>

          {/* Bekleyen Bildirimler Listesi */}
          <div className="space-y-2.5">
            {kullaniciBekleyenBildirimler.map((bild) => {
              const buBildirimSecili = seciliBildirimId === bild.id;
              const irsTarihi = bild.irsaliyeTarihi || bild.tarih;

              return (
                <div key={bild.id} className="bg-white text-slate-900 rounded-xl p-3.5 shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-300">
                          {bild.irsaliyeNo}
                        </span>
                        <span className="bg-amber-100 text-amber-950 font-black text-xs px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          <span>İRSALİYE TARİHİ: {irsTarihi}</span>
                        </span>
                        {bild.hedefKullaniciAdi && bild.hedefKullaniciAdi !== 'Tüm Saha Şefleri' && (
                          <span className="bg-purple-100 text-purple-900 font-extrabold text-[11px] px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1 shadow-2xs">
                            <UserCheck className="w-3 h-3 text-purple-700" />
                            <span>👤 Size Özel Gönderildi ({bild.hedefKullaniciAdi})</span>
                          </span>
                        )}
                        <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded">
                          {bild.tedarikci} ({bild.santiyeAdi || 'Şantiye'})
                        </span>
                        <span className="bg-slate-100 text-slate-900 text-[11px] font-black px-2 py-0.5 rounded">
                          {bild.metrajM3} m³ - {bild.betonCinsi}
                        </span>
                      </div>

                      <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-950 mt-1">
                        <p className="font-bold flex items-center gap-1">
                          <span>📌 <strong>Merkez Talimatı:</strong> Lütfen <u>{irsTarihi}</u> tarihindeki şantiye irsaliye koçanlarınızı / döküm kayıtlarınızı arayınız.</span>
                        </p>
                        {bild.mesaj && (
                          <p className="text-[11px] text-slate-600 mt-1 italic">
                            Açıklama: {bild.mesaj}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          Fatura: {bild.faturaNo || 'Gelen Fatura'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Onay veya İtiraz Butonları */}
                  {buBildirimSecili ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 text-xs">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-emerald-900 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Kayıt Tarihi: <strong>{irsTarihi}</strong> olarak sisteme işlenecektir.</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Bu Mikser İnşaatın Hangi Kısmına Döküldü? *
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: Radye Temel, 2. Kat Tabliye..."
                          value={bildirimYapiKismi}
                          onChange={(e) => setBildirimYapiKismi(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-300 p-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Saha Şefi Teyit Notu:
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: Evet fişi arşivden buldum, tabliyeye dökülmüştü."
                          value={bildirimSahaNotu}
                          onChange={(e) => setBildirimSahaNotu(e.target.value)}
                          className="w-full bg-white border border-slate-300 p-2 rounded-lg text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setSeciliBildirimId(null)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Vazgeç
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sahaSefiBildirimCevapla(bild.id, false, bildirimSahaNotu || 'Şantiyede bu irsaliye bulunamadı.', '', currentUser);
                            setSeciliBildirimId(null);
                          }}
                          className="px-3 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 cursor-pointer"
                        >
                          ❌ Aradım, Gelmedi (İtiraz Et)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sahaSefiBildirimCevapla(bild.id, true, bildirimSahaNotu || 'Saha tarafından teyit edildi.', bildirimYapiKismi || 'Genel İnşaat', currentUser);
                            setSeciliBildirimId(null);
                          }}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                        >
                          ✅ Buldum (Dökümü Onayla & Sisteme Ekle)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 flex-wrap pt-1">
                      <button
                        type="button"
                        onClick={() => handleBuTarihtekiDokumleriFiltrele(irsTarihi)}
                        className="py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        title="Bu tarihteki geçmiş döküm kayıtlarını ekranda filtreler"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>🔍 Bu Tarihteki ({irsTarihi}) Dökümleri Ara</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSeciliBildirimId(bild.id);
                          setBildirimYapiKismi('');
                          setBildirimSahaNotu('');
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>✅ İrsaliyeyi Buldum (Teyit Et & Sisteme Ekle)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const not = prompt(`"${bild.irsaliyeNo}" numaralı irsaliye için itiraz gerekçesi:\n(Örn: ${irsTarihi} tarihindeki koçanlar arandı, şantiyeye böyle bir mikser gelmedi)`);
                          if (not !== null) {
                            sahaSefiBildirimCevapla(bild.id, false, not || 'Şantiyede böyle bir irsaliye bulunamadı.');
                          }
                        }}
                        className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>❌ Aradım, Gelmedi (İtiraz)</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DÖKÜM GİRİŞ FORMU */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* 1. ŞANTİYE VE TARİH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-500" />
              1. Hangi Şantiyeye Döküldü? *
            </label>
            <select
              value={santiyeId}
              onChange={(e) => setSantiyeId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition"
            >
              {santiyeler.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.ad} — ({st.sehir})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              Beton Döküm Tarihi *
            </label>
            <input
              type="date"
              value={dokumTarihi}
              onChange={(e) => setDokumTarihi(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition"
            />
          </div>
        </div>

        {/* 2. İNŞAATIN HANGİ KISMINA DÖKÜLDÜ? (SERBEST METİN GİRİŞİ) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            2. İnşaatın Hangi Kısmına Döküldü? *
          </label>
          <input
            type="text"
            placeholder="Örn: Radye Temel, 2. Kat Tabliye, Kolon, Perde, İstinat Duvarı..."
            value={yapiKismi}
            onChange={(e) => setYapiKismi(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* 3. HANGİ BETON SINIFI DÖKÜLDÜ? */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              3. Hangi Beton Sınıfı Döküldü?
            </label>
            <button
              type="button"
              onClick={() => {
                const yeni = prompt('Yeni Beton Sınıfı Adı Giriniz (Örn: C30/37 Antifrizli, C50/60):');
                if (yeni && yeni.trim()) {
                  addBetonSinifi(yeni.trim());
                  setBetonSinifi(yeni.trim());
                }
              }}
              className="text-[11px] font-extrabold text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"
            >
              + Yeni Beton Cinsi
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {betonSiniflari.map((bs) => (
              <button
                key={bs}
                type="button"
                onClick={() => setBetonSinifi(bs)}
                className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                  betonSinifi === bs
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {bs}
              </button>
            ))}
          </div>
        </div>

        {/* 4. KAÇ MİKSER VE TOPLAM KAÇ m3 (BİRBİRİNDEN TAMAMEN BAĞIMSIZ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* KAÇ MİKSER ARABA GELDİ */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                4. Kaç Mikser Geldi? *
              </span>
              <span className="text-amber-600 font-extrabold text-xs">Araba</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMikserSayisi(prev => Math.max(1, (Number(prev) || 1) - 1))}
                className="w-10 h-10 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 transition cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                placeholder="Örn: 5"
                value={mikserSayisi}
                onChange={(e) => setMikserSayisi(e.target.value)}
                required
                className="w-full text-center font-black text-xl bg-white border border-slate-300 rounded-lg py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setMikserSayisi(prev => (Number(prev) || 0) + 1)}
                className="w-10 h-10 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TOPLAM KAÇ m3 DÖKÜLDÜ */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                5. Toplam Kaç m³ Döküldü? *
              </span>
              <span className="text-amber-600 font-extrabold text-xs">Metraj (m³)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Örn: 42.5"
                value={toplamM3}
                onChange={(e) => setToplamM3(e.target.value)}
                required
                className="w-full text-center font-black text-xl text-amber-600 bg-white border border-slate-300 rounded-lg py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">m³</span>
            </div>
          </div>
        </div>

        {/* 6. İADE VAR MI YOK MU? (SADECE VAR / YOK) */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          iadeVarMi ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className={`w-4 h-4 ${iadeVarMi ? 'text-rose-600' : 'text-slate-400'}`} />
                6. İade Var mı? (Beton Geri Gönderildi mi?)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Şantiyeden mikser veya beton geri gönderildiyse işaretleyiniz
              </p>
            </div>

            {/* Evet / Hayır Butonları */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-300 shrink-0">
              <button
                type="button"
                onClick={() => setIadeVarMi(false)}
                className={`px-4 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                  !iadeVarMi ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                YOK
              </button>
              <button
                type="button"
                onClick={() => setIadeVarMi(true)}
                className={`px-4 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
                  iadeVarMi ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                VAR
              </button>
            </div>
          </div>
        </div>

        {/* 7. İRSALİYE NOLARI & NOTLAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              İrsaliye No (Mikserlerden gelen):
            </label>
            <input
              type="text"
              placeholder="Örn: IRS-9201, IRS-9202..."
              value={irsaliyeNolari}
              onChange={(e) => setIrsaliyeNolari(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Saha Notu / Slump Değeri:
            </label>
            <input
              type="text"
              placeholder="Örn: Slump 18cm, 3 küp numune alındı"
              value={notlar}
              onChange={(e) => setNotlar(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* BÜYÜK MOBİL KAYDET BUTONU */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Send className="w-5 h-5" />
          <span>DÖKÜM BİLGİSİNİ KAYDET & MERKEZE İLET</span>
        </button>
      </form>

      {/* SAHA DÖKÜM GEÇMİŞİ LİSTESİ */}
      <div id="saha-gecmis-dokumler" className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1 flex-wrap gap-2">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            Girdiğiniz Döküm Kayıtları ({filtrelenmisDokumler.length} / {kullaniciDokumleri.length})
          </h3>
          {(filtreTarih || filtreArama) && (
            <button
              type="button"
              onClick={() => { setFiltreTarih(''); setFiltreArama(''); }}
              className="text-xs text-rose-600 hover:text-rose-800 font-extrabold underline cursor-pointer"
            >
              Filtreyi Temizle (Tümünü Göster)
            </button>
          )}
        </div>

        {/* ARAMA VE TARİH FİLTRELEME ÇUBUĞU */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="İrsaliye no, şantiye, yapı kısmı veya beton ara..."
              value={filtreArama}
              onChange={(e) => setFiltreArama(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-600 shrink-0">Tarih:</label>
            <input
              type="date"
              value={filtreTarih}
              onChange={(e) => setFiltreTarih(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            />
            {filtreTarih && (
              <button
                type="button"
                onClick={() => setFiltreTarih('')}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 px-1 cursor-pointer"
                title="Tarih filtresini kaldır"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Aktif Tarih Filtresi Bildirimi */}
        {filtreTarih && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-900 font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>📅 <strong>{filtreTarih}</strong> tarihindeki dökümler listeleniyor ({filtrelenmisDokumler.length} kayıt bulundu)</span>
            </div>
            <button
              type="button"
              onClick={() => setFiltreTarih('')}
              className="text-blue-700 hover:text-blue-900 underline text-[11px] cursor-pointer"
            >
              Tüm Tarihleri Göster
            </button>
          </div>
        )}

        <div className="space-y-2.5">
          {filtrelenmisDokumler.map((dokum) => (
            <div
              key={dokum.id}
              className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-slate-900">
                      {dokum.santiyeAdi}
                    </span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                      {dokum.betonSinifi}
                    </span>
                    {dokum.iadeVarMi && (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {dokum.iadeM3} m³ İADE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-bold mt-1">
                    📍 {dokum.yapiKismi}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md w-fit mt-1">
                    <UserCheck className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>Giren: <strong className="font-bold text-blue-950">{dokum.sahaSefi || dokum.kaydeden || 'Saha Sorumlusu'}</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-slate-900">
                    {dokum.toplamM3} m³
                  </div>
                  <div className="text-[11px] font-bold text-amber-600">
                    {dokum.mikserSayisi} Mikser
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {dokum.tarih} {dokum.saat}
                  </span>
                  <span>•</span>
                  <span>İrsaliye: <strong className="text-slate-700">{dokum.irsaliyeNolari}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    dokum.faturaDurumu?.includes('Eşleşti')
                      ? 'bg-emerald-100 text-emerald-800'
                      : dokum.faturaDurumu?.includes('Uyuşmazlık')
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {dokum.faturaDurumu || 'Bekliyor'}
                  </span>

                  {/* DÜZENLEME BUTONU */}
                  <button
                    type="button"
                    onClick={() => handleDuzenleBaslat(dokum)}
                    title="Döküm Bilgisini Düzenle"
                    className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[11px] px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Düzenle</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Bu döküm kaydını silmek istediğinize emin misiniz?\n(${dokum.santiyeAdi} - ${dokum.toplamM3} m³)`)) {
                        deleteSahaDokum(dokum.id);
                      }
                    }}
                    title="Kaydı sil"
                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {dokum.iadeVarMi && (
                <div className="mt-2 text-[11px] text-rose-700 bg-rose-50/80 p-2 rounded-lg font-bold border border-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>⚠️ İade Var (Beton Geri Gönderildi)</span>
                </div>
              )}
            </div>
          ))}

          {filtrelenmisDokumler.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs font-semibold">
              {filtreTarih
                ? `📅 ${filtreTarih} tarihinde girilmiş herhangi bir döküm kaydı bulunamadı.`
                : 'Henüz tarafınızdan sisteme girilmiş kriterlere uygun beton döküm kaydı bulunmamaktadır.'}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SAHA DÖKÜM DÜZENLEME / GÜNCELLEME MODALI */}
      {/* ============================================================== */}
      {duzenleModalAcik && duzenlenenDokum && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Başlığı */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    Döküm Bilgisini Düzenle
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Kaydı Giren: <strong className="text-slate-700">{duzenlenenDokum.sahaSefi || duzenlenenDokum.kaydeden || 'Saha Sorumlusu'}</strong>
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setDuzenleModalAcik(false);
                  setDuzenlenenDokum(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDuzenleKaydet} className="space-y-3.5 text-xs">
              {/* 1. Şantiye & Döküm Tarihi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-500" />
                    1. Şantiye *
                  </label>
                  <select
                    value={editSantiyeId}
                    onChange={(e) => setEditSantiyeId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                  >
                    {santiyeler.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.ad} — ({st.sehir})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Döküm Tarihi *
                  </label>
                  <input
                    type="date"
                    value={editDokumTarihi}
                    onChange={(e) => setEditDokumTarihi(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Yapı Kısmı */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  2. İnşaatın Hangi Kısmına Döküldü? *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Radye Temel, 2. Kat Tabliye, Kolon, Perde..."
                  value={editYapiKismi}
                  onChange={(e) => setEditYapiKismi(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* 3. Beton Sınıfı */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  3. Beton Sınıfı *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {betonSiniflari.map((bs) => (
                    <button
                      key={bs}
                      type="button"
                      onClick={() => setEditBetonSinifi(bs)}
                      className={`p-2 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                        editBetonSinifi === bs
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {bs}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Mikser & Metraj */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Mikser Sayısı */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-amber-500" />
                      4. Mikser Sayısı *
                    </span>
                    <span className="text-amber-600 font-bold">Araba</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditMikserSayisi(prev => Math.max(1, (Number(prev) || 1) - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={editMikserSayisi}
                      onChange={(e) => setEditMikserSayisi(e.target.value)}
                      required
                      className="w-full text-center font-black text-base bg-white border border-slate-300 rounded-lg py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setEditMikserSayisi(prev => (Number(prev) || 0) + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Toplam m3 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-amber-500" />
                      5. Toplam Metraj *
                    </span>
                    <span className="text-amber-600 font-bold">m³</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={editToplamM3}
                      onChange={(e) => setEditToplamM3(e.target.value)}
                      required
                      className="w-full text-center font-black text-base text-amber-600 bg-white border border-slate-300 rounded-lg py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400 pointer-events-none">m³</span>
                  </div>
                </div>
              </div>

              {/* 5. İade Var mı? */}
              <div className={`p-2.5 rounded-xl border transition ${
                editIadeVarMi ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className={`w-3.5 h-3.5 ${editIadeVarMi ? 'text-rose-600' : 'text-slate-400'}`} />
                    İade Var mı?
                  </span>
                  <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setEditIadeVarMi(false)}
                      className={`px-3 py-1 text-[11px] font-black rounded transition cursor-pointer ${
                        !editIadeVarMi ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      YOK
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditIadeVarMi(true)}
                      className={`px-3 py-1 text-[11px] font-black rounded transition cursor-pointer ${
                        editIadeVarMi ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      VAR
                    </button>
                  </div>
                </div>

                {editIadeVarMi && (
                  <div className="mt-2 pt-2 border-t border-rose-200 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-rose-800">İade Edilen Miktar (m³):</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Örn: 2.5"
                      value={editIadeM3}
                      onChange={(e) => setEditIadeM3(e.target.value)}
                      className="w-24 bg-white border border-rose-300 text-rose-900 font-black text-center text-xs rounded-lg p-1 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 6. İrsaliye No & Saha Notu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    İrsaliye Noları:
                  </label>
                  <input
                    type="text"
                    value={editIrsaliyeNolari}
                    onChange={(e) => setEditIrsaliyeNolari(e.target.value)}
                    placeholder="Örn: IRS-9201"
                    className="w-full bg-slate-50 border border-slate-300 text-xs rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Saha Notu:
                  </label>
                  <input
                    type="text"
                    value={editNotlar}
                    onChange={(e) => setEditNotlar(e.target.value)}
                    placeholder="Saha açıklaması"
                    className="w-full bg-slate-50 border border-slate-300 text-xs rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setDuzenleModalAcik(false);
                    setDuzenlenenDokum(null);
                  }}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition active:scale-[0.99] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>DEĞİŞİKLİKLERİ KAYDET</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
