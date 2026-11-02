import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Eye, 
  Calendar, 
  Building2, 
  CreditCard,
  Truck, 
  Layers, 
  AlertTriangle, 
  Search,
  UserCheck
} from 'lucide-react';

export default function IzleyiciView() {
  const { 
    santiyeler, 
    baglantilar,
    sahaDokumleri 
  } = useApp();

  const [seciliSantiyeId, setSeciliSantiyeId] = useState('TUMU');
  const [aramaMetni, setAramaMetni] = useState('');
  const [tarihFiltresi, setTarihFiltresi] = useState('');

  // Finansal Bakiye Hesapları
  const toplamBaglantiTutari = baglantilar.reduce((acc, curr) => acc + (curr.toplamTutar || 0), 0);
  const toplamKalanBakiye = baglantilar.reduce((acc, curr) => acc + (curr.kalanTutar || 0), 0);
  const toplamHarcananTutar = toplamBaglantiTutari - toplamKalanBakiye;
  const genelKullanimYuzdesi = toplamBaglantiTutari > 0 
    ? Math.round((toplamHarcananTutar / toplamBaglantiTutari) * 100) 
    : 0;

  // Toplam Dökülen Metraj & Araba (Mikser) Sayısı
  const toplamDokulenM3 = sahaDokumleri.reduce((acc, curr) => acc + (curr.toplamM3 || 0), 0);
  const toplamArabaSayisi = sahaDokumleri.reduce((acc, curr) => acc + (curr.mikserSayisi || 0), 0);
  const toplamIadeM3 = sahaDokumleri
    .filter(d => d.iadeVarMi)
    .reduce((acc, curr) => acc + (curr.iadeM3 || 0), 0);

  // Filtrelenmiş Saha Dökümleri
  const seciliStObj = santiyeler.find(s => s.id === seciliSantiyeId);
  const filtrelenmisDokumler = sahaDokumleri.filter(dok => {
    const santiyeUygun = seciliSantiyeId === 'TUMU' || 
      dok.santiyeId === seciliSantiyeId ||
      (seciliStObj && dok.santiyeAdi && dok.santiyeAdi.trim().toLowerCase() === seciliStObj.ad.trim().toLowerCase()) ||
      (seciliStObj && dok.santiye && dok.santiye.trim().toLowerCase() === seciliStObj.ad.trim().toLowerCase());
    const tarihUygun = !tarihFiltresi || dok.tarih === tarihFiltresi;
    const aramaUygun = !aramaMetni || 
      (dok.yapiKismi && String(dok.yapiKismi).toLowerCase().includes(aramaMetni.toLowerCase())) ||
      (dok.santiyeAdi && String(dok.santiyeAdi).toLowerCase().includes(aramaMetni.toLowerCase())) ||
      (dok.betonSinifi && String(dok.betonSinifi).toLowerCase().includes(aramaMetni.toLowerCase()));

    return santiyeUygun && tarihUygun && aramaUygun;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* ÜST BİLGİ ROZETİ */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                İzleyici / Yönetici Modu
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight mt-1.5">
              Genel Şantiye Döküm & Bağlantı Takibi
            </h2>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">
              Hangi gün nereye ne kadar beton döküldü, kaç araba geldi ve bağlantı durumlarını takip edin.
            </p>
          </div>
        </div>
      </div>

      {/* 1. BÖLÜM: BETON BAĞLANTILARI */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Beton Bağlantıları
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Toplam Bakiye: {toplamKalanBakiye.toLocaleString('tr-TR')} ₺
          </span>
        </div>

        {/* 4'LÜ ÖZET KARTLARI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Kalan Bakiye</span>
            <span className="text-base sm:text-lg font-black text-emerald-600 block mt-0.5">
              {toplamKalanBakiye.toLocaleString('tr-TR')} ₺
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">% {100 - genelKullanimYuzdesi} Bakiye Mevcut</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Kullanılan Tutar</span>
            <span className="text-base sm:text-lg font-black text-slate-800 block mt-0.5">
              {toplamHarcananTutar.toLocaleString('tr-TR')} ₺
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">% {genelKullanimYuzdesi} Harcandı</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Toplam Dökülen Metraj</span>
            <span className="text-base sm:text-lg font-black text-amber-600 block mt-0.5">
              {toplamDokulenM3} m³
            </span>
            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
              <Truck className="w-3 h-3 text-amber-500" />
              {toplamArabaSayisi} Araba Geldi
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">İade Edilen Beton</span>
            <span className={`text-base sm:text-lg font-black block mt-0.5 ${toplamIadeM3 > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
              {toplamIadeM3} m³
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Geri Gönderilen</span>
          </div>
        </div>

        {/* BAĞLANTI DETAY KARTLARI (TEDARİKÇİ & SÖZLEŞME BAZINDA) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {baglantilar.map((bag) => {
            const kullanilan = bag.toplamTutar - bag.kalanTutar;
            const yuzde = Math.min(100, Math.round((kullanilan / bag.toplamTutar) * 100));

            return (
              <div 
                key={bag.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">{bag.sozlesmeNo}</span>
                      <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        Bütçe Bazlı
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">{bag.tedarikci}</h4>
                    <span className="text-[11px] text-slate-600 font-semibold block">
                      {bag.santiyeAdlari && bag.santiyeAdlari.length > 0 ? bag.santiyeAdlari.join(', ') : bag.santiyeAdi}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Kalan Bakiye</span>
                    <span className="text-sm font-black text-emerald-600">
                      {(Number(bag.kalanTutar) || 0).toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>

                {/* Finansal Özet */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Toplam Sözleşme</span>
                    <span className="text-xs font-black text-slate-800">{(Number(bag.toplamTutar) || 0).toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Harcanan Bütçe</span>
                    <span className="text-xs font-black text-rose-600">{(Number(kullanilan) || 0).toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>

                {/* İlerleme Çubuğu */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Kullanım: %{yuzde}</span>
                    <span>Kalan: %{100 - yuzde}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        yuzde > 80 ? 'bg-rose-500' : yuzde > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${yuzde}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. BÖLÜM: HANGİ GÜN NEREYE NE KADAR BETON DÖKÜLDÜ? */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Hangi Gün Nereye Ne Kadar Beton Döküldü?
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Saha şeflerinin girdiği anlık döküm akışı ({filtrelenmisDokumler.length} Kayıt)
            </span>
          </div>

          {/* FİLTRELEME ALANI */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Şantiye Seçici */}
            <select
              value={seciliSantiyeId}
              onChange={(e) => setSeciliSantiyeId(e.target.value)}
              className="bg-white border border-slate-300 text-xs font-bold rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="TUMU">Tüm Şantiyeler</option>
              {santiyeler.map(s => (
                <option key={s.id} value={s.id}>{s.ad}</option>
              ))}
            </select>

            {/* Tarih Seçici */}
            <input
              type="date"
              value={tarihFiltresi}
              onChange={(e) => setTarihFiltresi(e.target.value)}
              className="bg-white border border-slate-300 text-xs rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            {tarihFiltresi && (
              <button
                onClick={() => setTarihFiltresi('')}
                className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded cursor-pointer"
              >
                Tarihi Temizle
              </button>
            )}
          </div>
        </div>

        {/* HIZLI ARAMA */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Yapı kısmı veya şantiye ara (Örn: Radye Temel, Döşeme, Boulevard)..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* DÖKÜM KRONOLOJİSİ / LİSTESİ */}
        {filtrelenmisDokumler.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs font-semibold">
            Kriterlere uygun beton döküm kaydı bulunamadı.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtrelenmisDokumler.map((dokum) => (
              <div
                key={dokum.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Sol Taraf: Nereye Döküldü & Beton Sınıfı */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-slate-900">
                        {dokum.santiyeAdi}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                        {dokum.betonSinifi}
                      </span>
                      {dokum.iadeVarMi && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          {dokum.iadeM3 > 0 ? `${dokum.iadeM3} m³ İADE` : 'İADE VAR'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-700 font-extrabold flex items-center gap-1.5 pt-0.5">
                      <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{dokum.yapiKismi}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg w-fit mt-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Giren Kullanıcı: <strong className="font-extrabold text-emerald-950">{dokum.sahaSefi || dokum.kaydeden || 'Saha Sorumlusu'}</strong></span>
                    </div>
                  </div>

                  {/* Sağ Taraf: Kaç m³ Döküldü & Kaç Araba Geldi */}
                  <div className="text-right shrink-0 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
                    <div className="text-lg font-black text-slate-900">
                      {dokum.toplamM3} m³
                    </div>
                    <div className="text-xs font-black text-amber-600 flex items-center justify-end gap-1 mt-0.5">
                      <Truck className="w-3.5 h-3.5 text-amber-500" />
                      <span>{dokum.mikserSayisi} Araba</span>
                    </div>
                  </div>
                </div>

                {/* Alt Kısım: Tarih & Saat */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-900">{dokum.tarih}</span>
                    <span className="text-slate-400 font-normal">• Saat {dokum.saat}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-semibold">
                    Durum: {dokum.iadeVarMi ? <span className="text-rose-600 font-bold">İadeli Döküm</span> : <span className="text-emerald-700 font-bold">Tamamlandı</span>}
                  </div>
                </div>

                {/* İade Nedeni Bilgisi */}
                {dokum.iadeVarMi && dokum.iadeNedeni && (
                  <div className="mt-2 text-[11px] bg-rose-50 text-rose-800 p-2 rounded-lg font-medium border border-rose-200">
                    ⚠️ <strong>İade Açıklaması:</strong> {dokum.iadeNedeni}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
