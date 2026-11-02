import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Receipt, 
  FileCheck, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Building2, 
  Calendar, 
  Trash2, 
  TrendingDown, 
  Edit3, 
  Check, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal,
  FileText,
  Truck,
  Send,
  Bell,
  Clock,
  AlertTriangle,
  Users,
  Key,
  UserCheck,
  RotateCcw,
  HardHat,
  Layers,
  Search,
  Copy,
  Volume2,
  VolumeX,
  Sparkles,
  Wand2,
  X
} from 'lucide-react';

export default function AdminView() {
  const { 
    baglantilar, 
    santiyeler, 
    addSantiye,
    deleteSantiye,
    betonSiniflari, 
    addBetonSinifi,
    deleteBetonSinifi,
    updateBaglantiSinifFiyat,
    sahaDokumleri, 
    deleteSahaDokum,
    updateSahaDokum,
    faturalar, 
    irsaliyeler,
    addIrsaliye,
    updateIrsaliye,
    deleteIrsaliye,
    eksikBildirimler,
    gonderEksikIrsaliyeBildirimi,
    deleteEksikBildirim,
    addBaglanti, 
    updateBaglanti,
    deleteBaglanti,
    addFatura, 
    updateFatura,
    deleteFatura,
    clearAllTestData,
    lastWipedBackup,
    restoreWipedBackup,
    yeniSahaBildirimi,
    setYeniSahaBildirimi,
    playNotificationSound,
    sesliIkazAcik,
    setSesliIkazAcik,
    users,
    addUser,
    updateUser,
    deleteUser
  } = useApp();

  // Aktif Sekme: 'IRSALIYE_KAYDI' | 'FATURA_KARSILASTIRMA' | 'SAHA_DOKUMLERI' | 'BAGLANTILAR' | 'BETON_CINSLERI' | 'PROJELER' | 'KULLANICILAR'
  const [activeTab, setActiveTab] = useState('IRSALIYE_KAYDI');
  const [yeniBaglantiModal, setYeniBaglantiModal] = useState(false);
  const [faturaListeModal, setFaturaListeModal] = useState(false);
  const [duzenlenenFatura, setDuzenlenenFatura] = useState(null);
  const [editFaturaNo, setEditFaturaNo] = useState('');
  const [editFaturaTarih, setEditFaturaTarih] = useState('');
  const [editFaturaIrsaliyeler, setEditFaturaIrsaliyeler] = useState('');
  const [editFaturaTutar, setEditFaturaTutar] = useState('');
  const [betonCinsiModal, setBetonCinsiModal] = useState(false);
  const [yeniBetonCinsiInput, setYeniBetonCinsiInput] = useState('');

  // Saha Dökümleri Filtre State'leri
  const [sahaFilterSantiye, setSahaFilterSantiye] = useState('TUMU');
  const [sahaFilterTarih, setSahaFilterTarih] = useState('');
  const [sahaFilterSearch, setSahaFilterSearch] = useState('');

  // Çift Güvenlikli Sıfırlama State'leri
  const [sifirlaModalOpen, setSifirlaModalOpen] = useState(false);
  const [sifirlaOnayMetni, setSifirlaOnayMetni] = useState('');

  // Kullanıcı Yönetimi State (Kullanıcı İsteği: Kullanıcı adlarına göre tanımlamayı admin seçsin)
  const [userModal, setUserModal] = useState(false);
  const [yeniUsername, setYeniUsername] = useState('');
  const [yeniPassword, setYeniPassword] = useState('1234');
  const [yeniRole, setYeniRole] = useState('SAHA_SEFI');
  const [yeniName, setYeniName] = useState('');

  // Proje Tanımlama State (Kullanıcı İsteği: Proje isimlerini de ben gireyim admin)
  const [projeModal, setProjeModal] = useState(false);
  const [yeniProjeAdi, setYeniProjeAdi] = useState('');
  const [yeniProjeSehir, setYeniProjeSehir] = useState('');

  // 1. İRSALİYE KAYIT FORMU STATE (Admin önce gelen irsaliyeleri kaydeder)
  const [irsaliyeNoInput, setIrsaliyeNoInput] = useState('');
  const [irsaliyeTarihi, setIrsaliyeTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [irsaliyeSantiyeId, setIrsaliyeSantiyeId] = useState(santiyeler[0]?.id || '');
  const [irsaliyeBaglantiId, setIrsaliyeBaglantiId] = useState(baglantilar[0]?.id || '');
  const [irsaliyeBetonCinsi, setIrsaliyeBetonCinsi] = useState(betonSiniflari[2] || 'C30/37');
  const [irsaliyeMetrajM3, setIrsaliyeMetrajM3] = useState(8);
  const [irsaliyeAciklama, setIrsaliyeAciklama] = useState('');

  // İrsaliye Düzenleme Modal State
  const [duzenleIrsaliyeModal, setDuzenleIrsaliyeModal] = useState(false);
  const [duzenlenenIrsaliye, setDuzenlenenIrsaliye] = useState(null);
  const [editIrsaliyeNo, setEditIrsaliyeNo] = useState('');
  const [editIrsaliyeTarihi, setEditIrsaliyeTarihi] = useState('');
  const [editIrsaliyeAciklama, setEditIrsaliyeAciklama] = useState('');
  const [editIrsaliyeSantiyeId, setEditIrsaliyeSantiyeId] = useState('');
  const [editIrsaliyeBaglantiId, setEditIrsaliyeBaglantiId] = useState('');
  const [editIrsaliyeBetonCinsi, setEditIrsaliyeBetonCinsi] = useState('');
  const [editIrsaliyeMetrajM3, setEditIrsaliyeMetrajM3] = useState('');
  const [editIrsaliyeDurum, setEditIrsaliyeDurum] = useState('Beklemede');
  const [editIrsaliyeFaturaNo, setEditIrsaliyeFaturaNo] = useState('');

  // 2. FATURA GİRİŞ FORMU STATE (BİRDEN ÇOK BETON KALEMİ DESTEKLİ)
  const [faturaNo, setFaturaNo] = useState('');
  const [faturaTarihi, setFaturaTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [baglantiId, setBaglantiId] = useState(baglantilar[0]?.id || '');
  const [faturadakiIrsaliyelerText, setFaturadakiIrsaliyelerText] = useState('');
  const [faturaKalemleri, setFaturaKalemleri] = useState([
    { id: 'kalem-1', santiyeAdi: santiyeler[0]?.ad || 'Şantiye', betonCinsi: betonSiniflari[0] || 'C30/37', metrajM3: '', birimFiyat: '' }
  ]);
  const [aciklama, setAciklama] = useState('');
  const [basariMesaji, setBasariMesaji] = useState('');

  // Eksik İrsaliye Bildirim State'leri
  const sahaKullanicilari = useMemo(() => {
    return (users || []).filter(u => u.role === 'SAHA_SEFI' || u.role === 'saha' || (u.role && u.role.toLowerCase().includes('saha')));
  }, [users]);
  const [eksikIrsaliyeTarihleri, setEksikIrsaliyeTarihleri] = useState({});
  const [eksikIrsaliyeKullanicilari, setEksikIrsaliyeKullanicilari] = useState({});
  const [topluEksikKullaniciId, setTopluEksikKullaniciId] = useState('TUMU');
  const [yeniEksikModalAcik, setYeniEksikModalAcik] = useState(false);
  const [manuelEksikSantiyeId, setManuelEksikSantiyeId] = useState(santiyeler[0]?.id || '');
  const [manuelEksikTedarikci, setManuelEksikTedarikci] = useState(baglantilar[0]?.tedarikci || '');
  const [manuelEksikIrsaliyeNo, setManuelEksikIrsaliyeNo] = useState('');
  const [manuelEksikTarih, setManuelEksikTarih] = useState(new Date().toISOString().split('T')[0]);
  const [manuelEksikMetraj, setManuelEksikMetraj] = useState(8);
  const [manuelEksikBetonCinsi, setManuelEksikBetonCinsi] = useState(betonSiniflari[2] || 'C30/37');
  const [manuelEksikMesaj, setManuelEksikMesaj] = useState('');
  const [manuelEksikKullaniciId, setManuelEksikKullaniciId] = useState('TUMU');

  // Hangi bağlantının fiyat listesi açık (akordiyon)
  const [acikFiyatListesiBaglantiId, setAcikFiyatListesiBaglantiId] = useState(null);
  const [duzenlenenSinifKey, setDuzenlenenSinifKey] = useState(null);
  const [duzenlenenSinifFiyat, setDuzenlenenSinifFiyat] = useState('');

  // Yeni Bağlantı Form State (Birden çok şantiye seçebilme & Tutar/Bütçe bazlı anlaşma)
  const [yeniTedarikci, setYeniTedarikci] = useState('');
  const [yeniSozlesmeNo, setYeniSozlesmeNo] = useState('');
  const [yeniSantiyeIds, setYeniSantiyeIds] = useState([]);
  const [yeniToplamTutar, setYeniToplamTutar] = useState(10000000);
  const [yeniTahminiMetraj, setYeniTahminiMetraj] = useState('');
  const [yeniSinifFiyatlari, setYeniSinifFiyatlari] = useState({});
  const [yeniAciklama, setYeniAciklama] = useState('');

  // Bağlantı Düzenleme Modal State
  const [duzenleBaglantiModal, setDuzenleBaglantiModal] = useState(false);
  const [editBaglantiId, setEditBaglantiId] = useState(null);
  const [editTedarikci, setEditTedarikci] = useState('');
  const [editSozlesmeNo, setEditSozlesmeNo] = useState('');
  const [editSantiyeIds, setEditSantiyeIds] = useState([]);
  const [editToplamTutar, setEditToplamTutar] = useState(0);
  const [editKalanTutar, setEditKalanTutar] = useState(0);
  const [editTahminiMetraj, setEditTahminiMetraj] = useState('');
  const [editSinifFiyatlari, setEditSinifFiyatlari] = useState({});
  const [editAciklama, setEditAciklama] = useState('');

  // Saha Dökümü Düzenleme State (Admin)
  const [duzenleSahaModal, setDuzenleSahaModal] = useState(false);
  const [duzenlenenSahaDokum, setDuzenlenenSahaDokum] = useState(null);
  const [editSahaSantiyeId, setEditSahaSantiyeId] = useState('');
  const [editSahaTarih, setEditSahaTarih] = useState('');
  const [editSahaYapiKismi, setEditSahaYapiKismi] = useState('');
  const [editSahaBetonSinifi, setEditSahaBetonSinifi] = useState('');
  const [editSahaMikserSayisi, setEditSahaMikserSayisi] = useState('');
  const [editSahaToplamM3, setEditSahaToplamM3] = useState('');
  const [editSahaIadeVarMi, setEditSahaIadeVarMi] = useState(false);
  const [editSahaIadeM3, setEditSahaIadeM3] = useState('');
  const [editSahaIrsaliyeNolari, setEditSahaIrsaliyeNolari] = useState('');
  const [editSahaNotlar, setEditSahaNotlar] = useState('');

  // Tevkifat State (Fatura Girişi: %20 KDV, %40 / 4/10 Yapım İşi Tevkifatı)
  const [kdvOrani, setKdvOrani] = useState(20);
  const [tevkifatOrani, setTevkifatOrani] = useState(40); // 4/10 = %40
  const [tevkifatUygula, setTevkifatUygula] = useState(true);

  // Seçili bağlantı
  const seciliBaglanti = baglantilar.find(b => b.id === baglantiId);

  // Otomatik fiyatı getiren fonksiyon
  const getFiyatForBaglantiAndSinif = (bag, sinif) => {
    if (!bag) return 0;
    if (bag.fiyatListesi && typeof bag.fiyatListesi === 'object' && bag.fiyatListesi[sinif] !== undefined && bag.fiyatListesi[sinif] !== '') {
      const f = Number(bag.fiyatListesi[sinif]);
      return !isNaN(f) ? f : 0;
    }
    const bf = Number(bag.birimFiyat);
    return !isNaN(bf) ? bf : 0;
  };

  // Bağlantı veya beton sınıfları hazır olduğunda faturadaki kalemlerin birim fiyatını otomatik ata
  useEffect(() => {
    if (!baglantilar || baglantilar.length === 0) return;
    const aktifBagId = baglantiId || baglantilar[0]?.id;
    if (!aktifBagId) return;

    if (!baglantiId) {
      setBaglantiId(aktifBagId);
      return;
    }
    const bag = baglantilar.find(b => b.id === aktifBagId);
    if (bag) {
      setFaturaKalemleri(prev => {
        let degisti = false;
        const yeni = prev.map(k => {
          if (!k.birimFiyat || k.birimFiyat === '' || k.birimFiyat === 0) {
            const otoFiyat = getFiyatForBaglantiAndSinif(bag, k.betonCinsi);
            if (otoFiyat && otoFiyat !== k.birimFiyat) {
              degisti = true;
              return { ...k, birimFiyat: otoFiyat };
            }
          }
          return k;
        });
        return degisti ? yeni : prev;
      });
    }
  }, [baglantilar, baglantiId]);

  const handleBaglantiSecimi = (id) => {
    setBaglantiId(id);
    const bag = baglantilar.find(b => b.id === id);
    if (bag) {
      setFaturaKalemleri(prev => prev.map(k => ({
        ...k,
        birimFiyat: getFiyatForBaglantiAndSinif(bag, k.betonCinsi)
      })));
    }
  };

  // Fatura Kalemleri Yönetimi (Ekle, Sil, Değiştir)
  const handleKalemSantiyeChange = (kalemId, yeniSantiye) => {
    setFaturaKalemleri(prev => prev.map(k => {
      if (k.id === kalemId) {
        return { ...k, santiyeAdi: yeniSantiye };
      }
      return k;
    }));
  };

  const handleKalemBetonCinsiChange = (kalemId, yeniSinif) => {
    setFaturaKalemleri(prev => prev.map(k => {
      if (k.id === kalemId) {
        const bag = baglantilar.find(b => b.id === baglantiId) || baglantilar[0];
        const otoFiyat = bag ? getFiyatForBaglantiAndSinif(bag, yeniSinif) : k.birimFiyat;
        return { ...k, betonCinsi: yeniSinif, birimFiyat: otoFiyat !== undefined && otoFiyat > 0 ? otoFiyat : k.birimFiyat };
      }
      return k;
    }));
  };

  const handleKalemMetrajChange = (kalemId, yeniMetraj) => {
    setFaturaKalemleri(prev => prev.map(k => {
      if (k.id === kalemId) {
        return { ...k, metrajM3: yeniMetraj };
      }
      return k;
    }));
  };

  const handleKalemBirimFiyatChange = (kalemId, yeniFiyat) => {
    setFaturaKalemleri(prev => prev.map(k => {
      if (k.id === kalemId) {
        return { ...k, birimFiyat: yeniFiyat };
      }
      return k;
    }));
  };

  const handleKalemEkle = () => {
    const defaultSinif = betonSiniflari[0] || 'C30/37';
    const bag = baglantilar.find(b => b.id === baglantiId) || baglantilar[0];
    const varsayilanFiyat = bag ? getFiyatForBaglantiAndSinif(bag, defaultSinif) : 2600;
    const defaultSantiye = seciliBaglanti?.santiyeAdi || (santiyeler[0]?.ad || 'Şantiye');
    setFaturaKalemleri(prev => [
      ...prev,
      {
        id: 'kalem-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        santiyeAdi: defaultSantiye,
        betonCinsi: defaultSinif,
        metrajM3: '',
        birimFiyat: varsayilanFiyat || ''
      }
    ]);
  };

  const handleKalemSil = (kalemId) => {
    if (faturaKalemleri.length <= 1) {
      alert('Faturada en az 1 beton kalemi bulunmalıdır!');
      return;
    }
    setFaturaKalemleri(prev => prev.filter(k => k.id !== kalemId));
  };

  // 1. ADIM: İRSALİYE KAYDETME (Admin irsaliyeleri havuza işler)
  const handleIrsaliyeSubmit = (e) => {
    e.preventDefault();
    const seciliSt = santiyeler.find(s => s.id === irsaliyeSantiyeId);
    const seciliBag = baglantilar.find(b => b.id === irsaliyeBaglantiId);
    const aciklamaMetni = irsaliyeAciklama.trim();

    const yeniIrs = {
      irsaliyeNo: irsaliyeNoInput.trim().toUpperCase(),
      tarih: irsaliyeTarihi,
      santiyeId: irsaliyeSantiyeId,
      santiyeAdi: seciliSt ? seciliSt.ad : 'Şantiye',
      tedarikci: seciliBag ? seciliBag.tedarikci : 'Santral',
      baglantiId: irsaliyeBaglantiId,
      betonCinsi: irsaliyeBetonCinsi,
      metrajM3: Number(irsaliyeMetrajM3) || 8,
      aciklama: aciklamaMetni,
      mikserPlaka: aciklamaMetni
    };

    addIrsaliye(yeniIrs);
    setBasariMesaji(`İrsaliye (${yeniIrs.irsaliyeNo}) başarıyla sisteme kaydedildi.`);
    setTimeout(() => setBasariMesaji(''), 3000);

    // Temizle
    setIrsaliyeNoInput('');
    setIrsaliyeAciklama('');
  };

  // İRSALİYE DÜZENLEME BAŞLAT & KAYDET
  const handleIrsaliyeDuzenleBaslat = (irs) => {
    setDuzenlenenIrsaliye(irs);
    setEditIrsaliyeNo(irs.irsaliyeNo || '');
    setEditIrsaliyeTarihi(irs.tarih || new Date().toISOString().split('T')[0]);
    setEditIrsaliyeAciklama(irs.aciklama || (irs.mikserPlaka && irs.mikserPlaka !== 'Plaka Girilmedi' ? irs.mikserPlaka : ''));
    
    const mevcutSantiye = santiyeler.find(s => s.id === irs.santiyeId || s.ad === irs.santiyeAdi);
    setEditIrsaliyeSantiyeId(mevcutSantiye ? mevcutSantiye.id : (santiyeler[0]?.id || ''));
    
    const mevcutBag = baglantilar.find(b => b.id === irs.baglantiId || b.tedarikci === irs.tedarikci);
    setEditIrsaliyeBaglantiId(mevcutBag ? mevcutBag.id : (baglantilar[0]?.id || ''));
    
    setEditIrsaliyeBetonCinsi(irs.betonCinsi || betonSiniflari[0] || 'C30/37');
    setEditIrsaliyeMetrajM3(irs.metrajM3 || 8);
    setEditIrsaliyeDurum(irs.durum || 'Beklemede');
    setEditIrsaliyeFaturaNo(irs.faturaNo || '');
    setDuzenleIrsaliyeModal(true);
  };

  const handleIrsaliyeDuzenleKaydet = async (e) => {
    e.preventDefault();
    if (!duzenlenenIrsaliye) return;

    const seciliSt = santiyeler.find(s => s.id === editIrsaliyeSantiyeId);
    const seciliBag = baglantilar.find(b => b.id === editIrsaliyeBaglantiId);
    const aciklamaMetni = editIrsaliyeAciklama.trim();

    await updateIrsaliye(duzenlenenIrsaliye.id, {
      irsaliyeNo: editIrsaliyeNo.trim().toUpperCase(),
      tarih: editIrsaliyeTarihi,
      santiyeId: editIrsaliyeSantiyeId,
      santiyeAdi: seciliSt ? seciliSt.ad : duzenlenenIrsaliye.santiyeAdi,
      tedarikci: seciliBag ? seciliBag.tedarikci : duzenlenenIrsaliye.tedarikci,
      baglantiId: editIrsaliyeBaglantiId,
      betonCinsi: editIrsaliyeBetonCinsi,
      metrajM3: Number(editIrsaliyeMetrajM3) || 0,
      aciklama: aciklamaMetni,
      mikserPlaka: aciklamaMetni,
      durum: editIrsaliyeDurum,
      faturaNo: editIrsaliyeFaturaNo.trim()
    });

    setDuzenleIrsaliyeModal(false);
    setDuzenlenenIrsaliye(null);
    setBasariMesaji(`İrsaliye (${editIrsaliyeNo.trim().toUpperCase()}) başarıyla güncellendi.`);
    setTimeout(() => setBasariMesaji(''), 3500);
  };

  // 2. ADIM: FATURADAKİ İRSALİYELERİ PARSE ET VE HAVUZLA KARŞILAŞTIR
  const faturadakiIrsaliyeListesi = faturadakiIrsaliyelerText
    ? [...new Set(faturadakiIrsaliyelerText.split(/[\s,;]+/).map(s => s.trim().toUpperCase()).filter(Boolean))]
    : [];

  // Sistemde kayıtlı olan ve olmayan (EKSİK) irsaliyeleri bul
  const kayitliIrsaliyeNolari = (irsaliyeler || [])
    .map(i => (i && i.irsaliyeNo ? String(i.irsaliyeNo).trim().toUpperCase() : ''))
    .filter(Boolean);
  const eslesenIrsaliyeler = faturadakiIrsaliyeListesi.filter(no => kayitliIrsaliyeNolari.includes(no));
  const eksikIrsaliyeler = faturadakiIrsaliyeListesi.filter(no => !kayitliIrsaliyeNolari.includes(no));

  // Kesilmiş faturalarda geçen irsaliye numaraları -> numara: fatura no
  const faturaliIrsaliyeHaritasi = {};
  (faturalar || []).forEach(f => {
    const kaynak = [
      ...(Array.isArray(f.irsaliyeNolar) ? f.irsaliyeNolar : []),
      ...(f.irsaliyeNo ? [f.irsaliyeNo] : [])
    ].join(',');
    kaynak.split(/[\s,;]+/).map(s => s.trim().toUpperCase()).filter(Boolean).forEach(no => {
      faturaliIrsaliyeHaritasi[no] = f.faturaNo || '';
    });
  });

  // Faturası kesilmişse durum otomatik "Faturalandırıldı" görünür
  const getIrsaliyeDurumBilgisi = (irs) => {
    const no = irs?.irsaliyeNo ? String(irs.irsaliyeNo).trim().toUpperCase() : '';
    const faturaNoBulunan = no ? faturaliIrsaliyeHaritasi[no] : undefined;
    const faturali = faturaNoBulunan !== undefined;
    return {
      faturali,
      faturaNo: faturaNoBulunan || '',
      etiket: faturali ? 'Faturalandırıldı' : 'Beklemede'
    };
  };

  // KESİLMİŞ FATURA DÜZENLEME
  const handleFaturaDuzenleBaslat = (fat) => {
    setDuzenlenenFatura(fat);
    setEditFaturaNo(fat.faturaNo || '');
    setEditFaturaTarih(fat.faturaTarihi || fat.tarih || '');
    setEditFaturaIrsaliyeler(
      Array.isArray(fat.irsaliyeNolar) && fat.irsaliyeNolar.length > 0
        ? [...new Set(fat.irsaliyeNolar.join(',').split(/[\s,;]+/).filter(Boolean))].join(', ')
        : (fat.irsaliyeNo || '')
    );
    setEditFaturaTutar(String(fat.toplamTutar ?? ''));
  };

  const handleFaturaDuzenleKaydet = async (e) => {
    e.preventDefault();
    if (!duzenlenenFatura) return;
    if (!editFaturaNo.trim()) {
      alert('Fatura numarası boş olamaz!');
      return;
    }
    await updateFatura(duzenlenenFatura.id, {
      faturaNo: editFaturaNo.trim(),
      faturaTarihi: editFaturaTarih,
      irsaliyeNo: editFaturaIrsaliyeler,
      toplamTutar: Number(editFaturaTutar) || 0
    });
    setDuzenlenenFatura(null);
    setBasariMesaji('Fatura başarıyla güncellendi.');
    setTimeout(() => setBasariMesaji(''), 3500);
  };

  // Seçili bağlantıya ait, henüz faturalandırılmamış bekleyen irsaliyeler
  const bekleyenBaglantiIrsaliyeleri = useMemo(() => {
    if (!seciliBaglanti) return [];
    const santiyeList = seciliBaglanti.santiyeAdlari && seciliBaglanti.santiyeAdlari.length > 0
      ? seciliBaglanti.santiyeAdlari
      : (seciliBaglanti.santiyeAdi ? [seciliBaglanti.santiyeAdi] : []);

    return (irsaliyeler || []).filter(irs => {
      const d = getIrsaliyeDurumBilgisi(irs);
      if (d.faturali) return false;

      // Tedarikçi kontrolü
      const tedarikciEslesiyor = !seciliBaglanti.tedarikci || !irs.tedarikci ||
        irs.tedarikci.toLowerCase().includes(seciliBaglanti.tedarikci.toLowerCase()) ||
        seciliBaglanti.tedarikci.toLowerCase().includes(irs.tedarikci.toLowerCase());

      // Şantiye kontrolü
      const santiyeEslesiyor = santiyeList.length === 0 || santiyeList.some(s =>
        s && irs.santiyeAdi && (
          irs.santiyeAdi.toLowerCase().includes(s.toLowerCase()) ||
          s.toLowerCase().includes(irs.santiyeAdi.toLowerCase())
        )
      );

      return tedarikciEslesiyor && santiyeEslesiyor;
    });
  }, [seciliBaglanti, irsaliyeler, faturalar]);

  // Tüm bekleyen irsaliyeleri faturaya tek tıkla otomatik doldur
  const handleTumBekleyenIrsaliyeleriAktar = () => {
    if (bekleyenBaglantiIrsaliyeleri.length === 0) return;
    const nolar = bekleyenBaglantiIrsaliyeleri.map(i => i.irsaliyeNo).filter(Boolean);
    setFaturadakiIrsaliyelerText(nolar.join(', '));

    // Kalemleri şantiye ve beton sınıflarına göre otomatik grupla ve doldur
    const grup = {};
    bekleyenBaglantiIrsaliyeleri.forEach(i => {
      const cinsi = i.betonCinsi || betonSiniflari[0] || 'C30/37';
      const sAd = i.santiyeAdi || seciliBaglanti?.santiyeAdi || santiyeler[0]?.ad || 'Şantiye';
      const key = `${sAd}___${cinsi}`;
      if (!grup[key]) {
        grup[key] = { santiyeAdi: sAd, betonCinsi: cinsi, metrajM3: 0 };
      }
      grup[key].metrajM3 += (Number(i.metrajM3) || 0);
    });

    const yeniKalemler = Object.values(grup).map((item, idx) => {
      const otoFiyat = seciliBaglanti ? getFiyatForBaglantiAndSinif(seciliBaglanti, item.betonCinsi) : 0;
      return {
        id: 'kalem-' + Date.now() + '-' + idx,
        santiyeAdi: item.santiyeAdi,
        betonCinsi: item.betonCinsi,
        metrajM3: item.metrajM3,
        birimFiyat: otoFiyat || ''
      };
    });

    if (yeniKalemler.length > 0) {
      setFaturaKalemleri(yeniKalemler);
    }

    const topM3 = bekleyenBaglantiIrsaliyeleri.reduce((sum, i) => sum + (Number(i.metrajM3) || 0), 0);
    setBasariMesaji(`⚡ ${nolar.length} adet bekleyen irsaliye (${topM3} m³) faturaya otomatik aktarıldı!`);
    setTimeout(() => setBasariMesaji(''), 4000);
  };

  // Tek tek irsaliyeye tıklayınca listeye ekle / çıkar (Toggle)
  const handleIrsaliyeTiklaToggle = (irsNo) => {
    if (!irsNo) return;
    const cleanNo = irsNo.trim().toUpperCase();
    const liste = faturadakiIrsaliyeListesi;
    let yeniListe;
    if (liste.includes(cleanNo)) {
      yeniListe = liste.filter(n => n !== cleanNo);
    } else {
      yeniListe = [...liste, cleanNo];
    }
    setFaturadakiIrsaliyelerText(yeniListe.join(', '));
  };

  const handleTekIrsaliyeEkle = (irsNo) => {
    if (!irsNo) return;
    const cleanNo = irsNo.trim().toUpperCase();
    if (!faturadakiIrsaliyeListesi.includes(cleanNo)) {
      const yeniText = faturadakiIrsaliyelerText.trim()
        ? `${faturadakiIrsaliyelerText.trim()}, ${cleanNo}`
        : cleanNo;
      setFaturadakiIrsaliyelerText(yeniText);
    }
  };

  // Fatura Tutar ve Tevkifat Hesaplamaları (Tüm Kalemlerin Matrah Toplamı)
  const toplamGirilenMetraj = faturaKalemleri.reduce((sum, k) => sum + (Number(k.metrajM3) || 0), 0);
  const matrahTutari = faturaKalemleri.reduce((sum, k) => {
    const m = Number(k.metrajM3) || 0;
    const f = Number(k.birimFiyat) || 0;
    return sum + (m * f);
  }, 0);

  const hesaplananKdv = (matrahTutari * Number(kdvOrani)) / 100; // %20 Hesaplanan KDV
  const tevkifatTutari = tevkifatUygula ? (hesaplananKdv * Number(tevkifatOrani)) / 100 : 0; // %40 (4/10) Tevkifat
  const beyanEdilenKdv = hesaplananKdv - tevkifatTutari; // Faturada Kalan KDV
  const vergilerDahilTutar = matrahTutari + hesaplananKdv;
  const odenecekTutar = tevkifatUygula ? (matrahTutari + beyanEdilenKdv) : vergilerDahilTutar;

  // 3. ADIM: SAHADAN GELEN DÖKÜMLER FİLTRE & HESAPLAMA
  const seciliFiltreSantiyeObj = santiyeler.find(s => s.id === sahaFilterSantiye);
  const filtrelenmisSahaDokumleri = sahaDokumleri.filter(d => {
    const sUygun = sahaFilterSantiye === 'TUMU' || 
      d.santiyeId === sahaFilterSantiye || 
      d.santiyeAdi === sahaFilterSantiye ||
      (seciliFiltreSantiyeObj && d.santiyeAdi && d.santiyeAdi.trim().toLowerCase() === seciliFiltreSantiyeObj.ad.trim().toLowerCase()) ||
      (seciliFiltreSantiyeObj && d.santiye && d.santiye.trim().toLowerCase() === seciliFiltreSantiyeObj.ad.trim().toLowerCase());
    const tUygun = !sahaFilterTarih || d.tarih === sahaFilterTarih;
    const qUygun = !sahaFilterSearch || 
      (d.yapiKismi && d.yapiKismi.toLowerCase().includes(sahaFilterSearch.toLowerCase())) ||
      (d.santiyeAdi && d.santiyeAdi.toLowerCase().includes(sahaFilterSearch.toLowerCase())) ||
      (d.sahaSefi && d.sahaSefi.toLowerCase().includes(sahaFilterSearch.toLowerCase())) ||
      (d.betonSinifi && d.betonSinifi.toLowerCase().includes(sahaFilterSearch.toLowerCase())) ||
      (d.irsaliyeNolari && d.irsaliyeNolari.toLowerCase().includes(sahaFilterSearch.toLowerCase()));
    return sUygun && tUygun && qUygun;
  });

  const toplamSahaDokumM3 = filtrelenmisSahaDokumleri.reduce((sum, d) => sum + (Number(d.toplamM3) || 0), 0);
  const toplamSahaMikserSayisi = filtrelenmisSahaDokumleri.reduce((sum, d) => sum + (Number(d.mikserSayisi) || 0), 0);
  const toplamSahaIadeM3 = filtrelenmisSahaDokumleri.filter(d => d.iadeVarMi).reduce((sum, d) => sum + (Number(d.iadeM3) || 0), 0);

  // EKSİK İRSALİYEYİ SAHA ŞEFİNE BİLDİR (TARİHİYLE VE KULLANICI SEÇİMİYLE BİRLİKTE)
  const handleSahaSefineBildir = (eksikNo, ozelTarih, ozelKullaniciId) => {
    const seciliSt = santiyeler.find(s => s.id === seciliBaglanti?.santiyeId) || santiyeler[0];
    const birincilSinif = faturaKalemleri[0]?.betonCinsi || (betonSiniflari[0] || 'C30/37');
    const irsTarihi = ozelTarih || eksikIrsaliyeTarihleri[eksikNo] || faturaTarihi || new Date().toISOString().split('T')[0];
    const metraj = Number(faturaKalemleri[0]?.metrajM3) || 8;

    const hedefUserId = ozelKullaniciId || eksikIrsaliyeKullanicilari[eksikNo] || topluEksikKullaniciId || 'TUMU';
    const hedefUserObj = (users || []).find(u => u.id === hedefUserId);
    const hedefKullaniciAdi = hedefUserObj ? (hedefUserObj.name || hedefUserObj.username) : 'Tüm Saha Şefleri';
    const hedefKullaniciUsername = hedefUserObj ? hedefUserObj.username : 'TUMU';
    
    gonderEksikIrsaliyeBildirimi({
      faturaNo: faturaNo.trim() || 'Fatura Taslağı',
      tedarikci: seciliBaglanti ? seciliBaglanti.tedarikci : 'Santral',
      santiyeId: seciliSt ? seciliSt.id : '',
      santiyeAdi: seciliSt ? seciliSt.ad : 'Şantiye',
      irsaliyeNo: eksikNo,
      tarih: irsTarihi,
      irsaliyeTarihi: irsTarihi,
      betonCinsi: birincilSinif,
      metrajM3: metraj,
      hedefKullaniciId: hedefUserId,
      hedefKullaniciAdi,
      hedefKullaniciUsername,
      mesaj: `Merkez Talimatı: Lütfen ${irsTarihi} tarihindeki irsaliye makbuzlarınızı / şantiye defterinizi arayıp bulunuz.`
    });

    const kime = hedefUserObj ? `Saha Şefi "${hedefKullaniciAdi}" kullanıcısına` : 'Tüm Saha Şeflerine';
    setBasariMesaji(`"${eksikNo}" (${irsTarihi}) numaralı irsaliye ${kime} aratılmak üzere iletildi!`);
    setTimeout(() => setBasariMesaji(''), 4000);
  };

  // Tüm eksik irsaliyeleri tarihleri ve seçilen kullanıcılarıyla topluca ilet
  const handleTumEksikleriSahaSefineIlet = () => {
    if (eksikIrsaliyeler.length === 0) return;
    eksikIrsaliyeler.forEach(no => {
      const ozelTarih = eksikIrsaliyeTarihleri[no] || faturaTarihi;
      const ozelKullanici = eksikIrsaliyeKullanicilari[no] || topluEksikKullaniciId;
      handleSahaSefineBildir(no, ozelTarih, ozelKullanici);
    });
    setBasariMesaji(`⚡ ${eksikIrsaliyeler.length} adet eksik irsaliye seçilen saha kullanıcılarına iletildi!`);
    setTimeout(() => setBasariMesaji(''), 4500);
  };

  // Manuel (Faturadan bağımsız) Sahadan Gelmeyen İrsaliye Bildirimi Gönder
  const handleManuelEksikBildirimiGonder = (e) => {
    e.preventDefault();
    if (!manuelEksikIrsaliyeNo.trim()) {
      alert('Lütfen en az bir irsaliye numarası giriniz!');
      return;
    }

    const seciliSt = santiyeler.find(s => s.id === manuelEksikSantiyeId) || santiyeler[0];
    const hedefUserObj = (users || []).find(u => u.id === manuelEksikKullaniciId);
    const hedefKullaniciAdi = hedefUserObj ? (hedefUserObj.name || hedefUserObj.username) : 'Tüm Saha Şefleri';
    const hedefKullaniciUsername = hedefUserObj ? hedefUserObj.username : 'TUMU';

    const nolar = manuelEksikIrsaliyeNo
      .split(/[\s,;]+/)
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    nolar.forEach(no => {
      gonderEksikIrsaliyeBildirimi({
        faturaNo: 'Sahadan Gelmeyen İrsaliye',
        tedarikci: manuelEksikTedarikci || 'Santral',
        santiyeId: seciliSt ? seciliSt.id : '',
        santiyeAdi: seciliSt ? seciliSt.ad : 'Şantiye',
        irsaliyeNo: no,
        tarih: manuelEksikTarih,
        irsaliyeTarihi: manuelEksikTarih,
        betonCinsi: manuelEksikBetonCinsi,
        metrajM3: Number(manuelEksikMetraj) || 8,
        hedefKullaniciId: manuelEksikKullaniciId || 'TUMU',
        hedefKullaniciAdi,
        hedefKullaniciUsername,
        mesaj: manuelEksikMesaj.trim() || `Merkez Talimatı: Lütfen ${manuelEksikTarih} tarihindeki irsaliye makbuzlarınızı / şantiye defterinizi arayıp bulunuz.`
      });
    });

    setYeniEksikModalAcik(false);
    setManuelEksikIrsaliyeNo('');
    setManuelEksikMesaj('');
    const kime = hedefUserObj ? `Saha Şefi "${hedefKullaniciAdi}" kullanıcısına` : 'Tüm Saha Şeflerine';
    setBasariMesaji(`⚡ ${nolar.length} adet irsaliye (${manuelEksikTarih} tarihli) ${kime} iletildi!`);
    setTimeout(() => setBasariMesaji(''), 4500);
  };

  // FATURAYI KAYDET VE BAĞLANTIDAN DÜŞ
  const handleFaturaSubmit = (e) => {
    e.preventDefault();

    if (!baglantiId) {
      alert('Lütfen faturanın düşüleceği bir bağlantı seçiniz!');
      return;
    }

    if (toplamGirilenMetraj <= 0) {
      alert('Lütfen faturadaki kalemler için geçerli bir metraj giriniz!');
      return;
    }

    const kalemOzet = faturaKalemleri.map(k => `${k.santiyeAdi ? `${k.santiyeAdi}: ` : ''}${k.metrajM3} m³ ${k.betonCinsi}`).join(', ');

    const yeniFatura = {
      faturaNo: faturaNo.trim(),
      faturaTarihi,
      tedarikci: seciliBaglanti ? seciliBaglanti.tedarikci : 'Tedarikçi',
      baglantiId,
      baglantiNo: seciliBaglanti ? seciliBaglanti.sozlesmeNo : '',
      santiyeAdi: seciliBaglanti ? (seciliBaglanti.santiyeAdlari?.join(', ') || seciliBaglanti.santiyeAdi) : '',
      betonCinsi: kalemOzet,
      kalemler: faturaKalemleri.map(k => ({
        santiyeAdi: k.santiyeAdi || (seciliBaglanti ? (seciliBaglanti.santiyeAdlari?.join(', ') || seciliBaglanti.santiyeAdi) : 'Şantiye'),
        betonCinsi: k.betonCinsi,
        metrajM3: Number(k.metrajM3) || 0,
        birimFiyat: Number(k.birimFiyat) || 0,
        tutar: (Number(k.metrajM3) || 0) * (Number(k.birimFiyat) || 0)
      })),
      irsaliyeNo: faturadakiIrsaliyeListesi.join(', '),
      metrajM3: toplamGirilenMetraj,
      birimFiyat: faturaKalemleri.length === 1 ? (Number(faturaKalemleri[0].birimFiyat) || 0) : (matrahTutari / (toplamGirilenMetraj || 1)),
      matrahTutari,
      kdvOrani: Number(kdvOrani),
      hesaplananKdv,
      tevkifatUygula,
      tevkifatOrani: Number(tevkifatOrani),
      tevkifatTutari,
      odenecekTutar,
      toplamTutar: odenecekTutar, // Bağlantı bütçesinden ödenecek net tutar düşer
      karsilastirmaDurumu: eksikIrsaliyeler.length === 0 ? 'UYUMLU' : `EKSİK (${eksikIrsaliyeler.length} Adet)`,
      farkM3: 0,
      aciklama: aciklama.trim()
    };

    addFatura(yeniFatura);

    // Eşleşen irsaliyelerin durumunu Faturalandı yap
    eslesenIrsaliyeler.forEach(no => {
      const irs = (irsaliyeler || []).find(i => (i && i.irsaliyeNo ? String(i.irsaliyeNo).trim().toUpperCase() : '') === no);
      if (irs) {
        updateIrsaliye(irs.id, { durum: 'Faturalandırıldı', faturaNo: faturaNo.trim() });
      }
    });

    setBasariMesaji(`Fatura (${faturaNo}) ${faturaKalemleri.length} kalem ile işlendi ve ${seciliBaglanti?.sozlesmeNo} bağlantısından ${odenecekTutar.toLocaleString('tr-TR')} ₺ (Tevkifatlı Ödenecek) düşüldü!`);
    setTimeout(() => setBasariMesaji(''), 4500);

    // Temizle
    setFaturaNo('');
    setFaturadakiIrsaliyelerText('');
    setFaturaKalemleri([
      {
        id: 'kalem-1',
        santiyeAdi: seciliBaglanti?.santiyeAdi || santiyeler[0]?.ad || 'Şantiye',
        betonCinsi: betonSiniflari[0] || 'C30/37',
        metrajM3: '',
        birimFiyat: seciliBaglanti ? getFiyatForBaglantiAndSinif(seciliBaglanti, betonSiniflari[0] || 'C30/37') : ''
      }
    ]);
    setAciklama('');
  };

  // Yeni Beton Cinsi Kaydetme
  const handleYeniBetonCinsiKaydet = (e) => {
    e.preventDefault();
    if (!yeniBetonCinsiInput.trim()) return;

    const basarili = addBetonSinifi(yeniBetonCinsiInput.trim());
    if (basarili) {
      setBasariMesaji(`"${yeniBetonCinsiInput.trim()}" beton cinsi eklendi.`);
      setYeniBetonCinsiInput('');
      setBetonCinsiModal(false);
      setTimeout(() => setBasariMesaji(''), 3500);
    }
  };

  // Yeni Proje / Şantiye Kaydetme (Kullanıcı İsteği: Proje isimlerini de ben gireyim admin)
  const handleYeniProjeKaydet = (e) => {
    e.preventDefault();
    if (!yeniProjeAdi.trim()) return;

    const res = addSantiye({ ad: yeniProjeAdi.trim(), sehir: yeniProjeSehir.trim() });
    if (res) {
      setBasariMesaji(`"${res.ad}" projesi başarıyla sisteme eklendi.`);
      setYeniProjeAdi('');
      setYeniProjeSehir('');
      setProjeModal(false);
      setTimeout(() => setBasariMesaji(''), 3500);
    }
  };

  // Yeni Bağlantı Kaydetme (Birden fazla proje/şantiye seçimi destekli)
  const handleBaglantiSubmit = (e) => {
    e.preventDefault();

    if (yeniSantiyeIds.length === 0) {
      alert('Lütfen bu bağlantının geçerli olduğu en az bir proje/şantiye seçin!');
      return;
    }

    const secilenSantiyeler = santiyeler.filter(s => yeniSantiyeIds.includes(s.id));
    const secilenSantiyeAdlari = secilenSantiyeler.map(s => s.ad);
    const topTutar = Number(yeniToplamTutar) || 0;
    const varsayilanFiyat = Number(yeniSinifFiyatlari[betonSiniflari[0]]) || 2600;
    const topMetraj = Number(yeniTahminiMetraj) || (varsayilanFiyat > 0 ? Math.round(topTutar / varsayilanFiyat) : 0);

    const yeniBag = {
      tedarikci: yeniTedarikci.trim(),
      sozlesmeNo: yeniSozlesmeNo.trim(),
      baslangicTarihi: new Date().toISOString().split('T')[0],
      bitisTarihi: '2026-12-31',
      santiyeId: yeniSantiyeIds[0], // Birincil şantiye ID
      santiyeIds: yeniSantiyeIds, // Bağlantılı tüm şantiye ID'leri
      santiyeAdi: secilenSantiyeAdlari.join(', '),
      santiyeAdlari: secilenSantiyeAdlari,
      betonCinsi: betonSiniflari[0],
      birimFiyat: varsayilanFiyat,
      fiyatListesi: yeniSinifFiyatlari,
      toplamTutar: topTutar,
      kalanTutar: topTutar,
      toplamMetraj: topMetraj,
      kalanMetraj: topMetraj,
      aciklama: yeniAciklama.trim()
    };

    addBaglanti(yeniBag);
    setYeniBaglantiModal(false);
    setYeniTedarikci('');
    setYeniSozlesmeNo('');
    setYeniSantiyeIds([]);
    setYeniToplamTutar(10000000);
    setYeniTahminiMetraj('');
    setYeniSinifFiyatlari({});
    setYeniAciklama('');

    setBasariMesaji(`Yeni bağlantı (${yeniBag.sozlesmeNo}) ${topTutar.toLocaleString('tr-TR')} ₺ bütçe ile ${secilenSantiyeAdlari.length} proje için oluşturuldu.`);
    setTimeout(() => setBasariMesaji(''), 4000);
  };

  // BAĞLANTI DÜZENLEME MODALINI AÇ
  const handleBaglantiDuzenleAc = (bag) => {
    setEditBaglantiId(bag.id);
    setEditTedarikci(bag.tedarikci || '');
    setEditSozlesmeNo(bag.sozlesmeNo || '');
    const initialIds = bag.santiyeIds && bag.santiyeIds.length > 0
      ? bag.santiyeIds
      : (bag.santiyeId ? [bag.santiyeId] : (santiyeler.length > 0 ? [santiyeler[0].id] : []));
    setEditSantiyeIds(initialIds);
    setEditToplamTutar(bag.toplamTutar || 0);
    setEditKalanTutar(bag.kalanTutar !== undefined ? bag.kalanTutar : (bag.toplamTutar || 0));
    setEditTahminiMetraj(bag.toplamMetraj || '');
    
    // Fiyat listesini yükle
    const currentFiyatlar = {};
    betonSiniflari.forEach(s => {
      currentFiyatlar[s] = bag.fiyatListesi?.[s] || bag.birimFiyat || 2600;
    });
    setEditSinifFiyatlari(currentFiyatlar);
    setEditAciklama(bag.aciklama || '');
    setDuzenleBaglantiModal(true);
  };

  // BAĞLANTI DÜZENLEMEYİ KAYDET
  const handleBaglantiDuzenleSubmit = (e) => {
    e.preventDefault();
    if (!editBaglantiId) return;

    if (editSantiyeIds.length === 0) {
      alert('Lütfen bu bağlantının geçerli olduğu en az bir proje/şantiye seçin!');
      return;
    }

    const secilenSantiyeler = santiyeler.filter(s => editSantiyeIds.includes(s.id));
    const secilenSantiyeAdlari = secilenSantiyeler.map(s => s.ad);
    const topTutar = Number(editToplamTutar) || 0;
    const kalTutar = Number(editKalanTutar) || 0;
    const varsayilanFiyat = Number(editSinifFiyatlari[betonSiniflari[0]]) || 2600;
    const topMetraj = Number(editTahminiMetraj) || (varsayilanFiyat > 0 ? Math.round(topTutar / varsayilanFiyat) : 0);

    updateBaglanti(editBaglantiId, {
      tedarikci: editTedarikci.trim(),
      sozlesmeNo: editSozlesmeNo.trim(),
      santiyeId: editSantiyeIds[0],
      santiyeIds: editSantiyeIds,
      santiyeAdi: secilenSantiyeAdlari.join(', '),
      santiyeAdlari: secilenSantiyeAdlari,
      toplamTutar: topTutar,
      kalanTutar: kalTutar,
      birimFiyat: varsayilanFiyat,
      fiyatListesi: editSinifFiyatlari,
      toplamMetraj: topMetraj,
      kalanMetraj: topMetraj,
      aciklama: editAciklama.trim()
    });

    setDuzenleBaglantiModal(false);
    setBasariMesaji(`Bağlantı (${editSozlesmeNo}) başarıyla güncellendi.`);
    setTimeout(() => setBasariMesaji(''), 4000);
  };

  // SAHA DÖKÜMÜ DÜZENLEME BAŞLAT & KAYDET (ADMIN)
  const handleSahaDokumDuzenleBaslat = (dokum) => {
    setDuzenlenenSahaDokum(dokum);
    const mevcutSantiye = santiyeler.find(s => s.id === dokum.santiyeId || s.ad === dokum.santiyeAdi);
    setEditSahaSantiyeId(mevcutSantiye ? mevcutSantiye.id : (santiyeler[0]?.id || ''));
    setEditSahaTarih(dokum.tarih || new Date().toISOString().split('T')[0]);
    setEditSahaYapiKismi(dokum.yapiKismi || '');
    setEditSahaBetonSinifi(dokum.betonSinifi || betonSiniflari[0] || 'C30/37');
    setEditSahaMikserSayisi(dokum.mikserSayisi || '');
    setEditSahaToplamM3(dokum.toplamM3 || '');
    setEditSahaIadeVarMi(Boolean(dokum.iadeVarMi));
    setEditSahaIadeM3(dokum.iadeM3 || '');
    setEditSahaIrsaliyeNolari(dokum.irsaliyeNolari && dokum.irsaliyeNolari !== 'Girilmedi' ? dokum.irsaliyeNolari : '');
    setEditSahaNotlar(dokum.notlar || '');
    setDuzenleSahaModal(true);
  };

  const handleSahaDokumDuzenleSubmit = async (e) => {
    e.preventDefault();
    if (!duzenlenenSahaDokum) return;

    const secilenSantiye = santiyeler.find(s => s.id === editSahaSantiyeId);

    await updateSahaDokum(duzenlenenSahaDokum.id, {
      tarih: editSahaTarih || duzenlenenSahaDokum.tarih || new Date().toISOString().split('T')[0],
      saat: duzenlenenSahaDokum.saat,
      santiyeId: editSahaSantiyeId,
      santiyeAdi: secilenSantiye ? secilenSantiye.ad : duzenlenenSahaDokum.santiyeAdi,
      santiye: secilenSantiye ? secilenSantiye.ad : duzenlenenSahaDokum.santiyeAdi,
      yapiKismi: editSahaYapiKismi.trim() || 'Genel İnşaat Dökümü',
      betonSinifi: editSahaBetonSinifi,
      mikserSayisi: Number(editSahaMikserSayisi) || 0,
      toplamM3: Number(editSahaToplamM3) || 0,
      iadeVarMi: Boolean(editSahaIadeVarMi),
      iadeM3: editSahaIadeVarMi ? (Number(editSahaIadeM3) || 0) : 0,
      irsaliyeNolari: editSahaIrsaliyeNolari.trim() || 'Girilmedi',
      notlar: editSahaNotlar.trim(),
      kaydeden: duzenlenenSahaDokum.kaydeden || duzenlenenSahaDokum.sahaSefi || 'Saha Sorumlusu',
      sahaSefi: duzenlenenSahaDokum.sahaSefi || duzenlenenSahaDokum.kaydeden || 'Saha Sorumlusu'
    });

    setDuzenleSahaModal(false);
    setDuzenlenenSahaDokum(null);
    setBasariMesaji('Saha döküm kaydı başarıyla güncellendi!');
    setTimeout(() => setBasariMesaji(''), 3500);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Üst Bilgilendirme Kartı */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              💼 Admin / Satınalma & Muhasebe
            </span>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">
              İrsaliye Havuzu, Fatura Mutabakat & Eksik Takibi
            </h2>
            <p className="text-xs text-blue-100 font-medium mt-0.5">
              Önce irsaliyeleri kaydedin, fatura geldiğinde karşılaştırın; gelmemiş eksik irsaliyeleri saha şefine bildirin.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sesli İkaz Test Butonu */}
            <button
              type="button"
              onClick={() => {
                playNotificationSound();
                setBasariMesaji('🔊 İkaz sesi test edildi ve aktif!');
                setTimeout(() => setBasariMesaji(''), 3000);
              }}
              className="text-[11px] font-bold bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white px-3 py-2 rounded-xl border border-white/20 transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              title="Sahadan yeni döküm geldiğinde çalacak ikaz sesini test edin"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Sesli İkaz Test</span>
            </button>

            {lastWipedBackup && (
              <button
                type="button"
                onClick={async () => {
                  const res = await restoreWipedBackup();
                  if (res) {
                    setBasariMesaji('Silinen veriler başarıyla GERİ ALINDI!');
                    setTimeout(() => setBasariMesaji(''), 4500);
                  }
                }}
                className="text-[11px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md animate-pulse"
                title="Son silinen verileri geri yükle"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Geri Al (Kurtar)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSifirlaOnayMetni('');
                setSifirlaModalOpen(true);
              }}
              className="text-[11px] font-bold bg-white/10 hover:bg-rose-500 text-white px-3 py-2 rounded-xl border border-white/20 transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              title="Dökülmüş betonları ve deneme kayıtlarını temizle (Çift Güvenlikli)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Denemeleri Sıfırla</span>
            </button>
          </div>
        </div>

        {/* 4 Ana Sekme */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-white/20 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('IRSALIYE_KAYDI')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'IRSALIYE_KAYDI'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            1. Gelen İrsaliyeleri Kaydet ({irsaliyeler.length})
          </button>

          <button
            onClick={() => setActiveTab('FATURA_KARSILASTIRMA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'FATURA_KARSILASTIRMA'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            2. Fatura Girişi & İrsaliye Karşılaştır
          </button>

          <button
            onClick={() => setActiveTab('SAHA_DOKUMLERI')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'SAHA_DOKUMLERI'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            3. Sahadan Gelen Dökümler ({sahaDokumleri.length})
          </button>

          <button
            onClick={() => setActiveTab('BAGLANTILAR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'BAGLANTILAR'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            4. Bağlantılar & Fiyatlar ({baglantilar.length})
          </button>

          <button
            onClick={() => setActiveTab('BETON_CINSLERI')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'BETON_CINSLERI'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            5. Beton Cinsleri ({betonSiniflari.length})
          </button>

          <button
            onClick={() => setActiveTab('PROJELER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'PROJELER'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            6. Projeler / Şantiyeler ({santiyeler.length})
          </button>

          <button
            onClick={() => setActiveTab('KULLANICILAR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              activeTab === 'KULLANICILAR'
                ? 'bg-purple-400 text-slate-950 shadow-sm font-extrabold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            7. Kullanıcı Yönetimi ({users.length})
          </button>
        </div>
      </div>

      {/* Geri Al Kurtarma Bandı */}
      {lastWipedBackup && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-900">
                Veriler Sıfırlandı (Kurtarma Yedeği Hazır)
              </h4>
              <p className="text-[11px] font-medium text-amber-800">
                Yanlışlıkla bastıysanız, son silinen tüm kayıtları (dökümler, irsaliyeler, faturalar) tek tıkla geri yükleyebilirsiniz.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              const res = await restoreWipedBackup();
              if (res) {
                setBasariMesaji('Silinen tüm veriler eksiksiz olarak GERİ ALINDI!');
                setTimeout(() => setBasariMesaji(''), 4500);
              }
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Geri Al (Kurtar)</span>
          </button>
        </div>
      )}

      {/* Başarı Bildirimi */}
      {basariMesaji && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-6 h-6 shrink-0" />
          <div className="text-xs sm:text-sm font-bold">
            {basariMesaji}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. SEKME: ADMİN ÖNCE GELEN İRSALİYELERİ KAYDEDER */}
      {/* ============================================================== */}
      {activeTab === 'IRSALIYE_KAYDI' && (
        <div className="space-y-5">
          {/* İrsaliye Giriş Formu */}
          <form onSubmit={handleIrsaliyeSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Gelen Beton İrsaliyesi Girişi (İrsaliye Havuzu)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Santralden veya şantiyeden merkeze ulaşan irsaliyeleri faturadan önce sisteme kaydedin.
                </p>
              </div>
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Adım 1: İrsaliye Kaydı
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">İrsaliye No: *</label>
                <input
                  type="text"
                  placeholder="Örn: IRS-8910"
                  value={irsaliyeNoInput}
                  onChange={(e) => setIrsaliyeNoInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 font-mono font-bold text-sm rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">İrsaliye Tarihi:</label>
                <input
                  type="date"
                  value={irsaliyeTarihi}
                  onChange={(e) => setIrsaliyeTarihi(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-xs rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">İrsaliye Açıklaması / Not:</label>
                <input
                  type="text"
                  placeholder="Örn: A Blok Temel Dökümü, Pompa No vb."
                  value={irsaliyeAciklama}
                  onChange={(e) => setIrsaliyeAciklama(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-xs font-bold rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Şantiye:</label>
                <select
                  value={irsaliyeSantiyeId}
                  onChange={(e) => setIrsaliyeSantiyeId(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-xs font-semibold rounded-lg p-2 focus:outline-none"
                >
                  {santiyeler.map(s => (
                    <option key={s.id} value={s.id}>{s.ad}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bağlantı / Tedarikçi:</label>
                <select
                  value={irsaliyeBaglantiId}
                  onChange={(e) => setIrsaliyeBaglantiId(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-xs font-semibold rounded-lg p-2 focus:outline-none"
                >
                  {baglantilar.map(b => (
                    <option key={b.id} value={b.id}>{b.tedarikci} ({b.sozlesmeNo})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Beton Cinsi:</label>
                <select
                  value={irsaliyeBetonCinsi}
                  onChange={(e) => setIrsaliyeBetonCinsi(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-xs font-bold rounded-lg p-2 focus:outline-none"
                >
                  {betonSiniflari.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Metraj (m³): *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={irsaliyeMetrajM3}
                  onChange={(e) => setIrsaliyeMetrajM3(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 font-black text-sm text-amber-600 rounded-lg p-1.5 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>İRSALİYEYİ SİSTEME KAYDET (HAVUZA EKLE)</span>
            </button>
          </form>

          {/* KAYITLI İRSALİYELER HAVUZU TABLOSU */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Sisteme İşlenmiş İrsaliyeler ({irsaliyeler.length} Adet)
              </h4>
              <span className="text-xs text-slate-500 font-semibold">
                Toplam: <strong>{irsaliyeler.reduce((a, b) => a + (b.metrajM3 || 0), 0)} m³</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                  <tr>
                    <th className="p-2.5">İrsaliye No</th>
                    <th className="p-2.5">Tarih</th>
                    <th className="p-2.5">Şantiye</th>
                    <th className="p-2.5">Tedarikçi</th>
                    <th className="p-2.5">Beton Sınıfı</th>
                    <th className="p-2.5">Metraj</th>
                    <th className="p-2.5">Açıklama</th>
                    <th className="p-2.5">Fatura Durumu</th>
                    <th className="p-2.5 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {irsaliyeler.map((irs) => (
                    <tr key={irs.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-mono font-black text-slate-900">{irs.irsaliyeNo}</td>
                      <td className="p-2.5 text-slate-600">{irs.tarih}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{irs.santiyeAdi}</td>
                      <td className="p-2.5 text-slate-600">{irs.tedarikci}</td>
                      <td className="p-2.5">
                        <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {irs.betonCinsi}
                        </span>
                      </td>
                      <td className="p-2.5 font-black text-slate-900">{irs.metrajM3} m³</td>
                      <td className="p-2.5 text-slate-600 font-medium">{irs.aciklama || (irs.mikserPlaka && irs.mikserPlaka !== 'Plaka Girilmedi' ? irs.mikserPlaka : '-')}</td>
                      <td className="p-2.5">
                        {(() => {
                          const d = getIrsaliyeDurumBilgisi(irs);
                          return (
                            <span
                              title={d.faturali && d.faturaNo ? `Fatura No: ${d.faturaNo}` : ''}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                d.faturali
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {d.etiket}{d.faturali && d.faturaNo ? ` (${d.faturaNo})` : ''}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="p-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleIrsaliyeDuzenleBaslat(irs)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="İrsaliyeyi Düzenle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`${irs.irsaliyeNo} numaralı irsaliyeyi silmek istediğinize emin misiniz?`)) {
                                deleteIrsaliye(irs.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="İrsaliyeyi Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SEKME: FATURA GİRİŞİ, İRSALİYE KARŞILAŞTIRMA & EKSİK TESPİTİ */}
      {/* ============================================================== */}
      {activeTab === 'FATURA_KARSILASTIRMA' && (
        <div className="space-y-5">
          {/* Fatura Giriş ve Karşılaştırma Formu */}
          <form onSubmit={handleFaturaSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  Gelen Fatura Bilgisi & İrsaliye Karşılaştırması
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Faturada geçen irsaliye numaralarını yazın; sistem kayıtlı irsaliyelerle kıyaslayıp eksikleri tespit eder.
                </p>
              </div>
              <span className="text-xs font-extrabold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Adım 2: Fatura Mutabakatı
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Bağlantı Seçimi */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  Hangi Bağlantıdan Düşecek? *
                </label>
                <select
                  value={baglantiId}
                  onChange={(e) => handleBaglantiSecimi(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {baglantilar.map((bag) => (
                    <option key={bag.id} value={bag.id}>
                      {bag.sozlesmeNo} | {bag.tedarikci} ({bag.santiyeAdi}) - Kalan: {(Number(bag.kalanTutar) || 0).toLocaleString('tr-TR')} ₺
                    </option>
                  ))}
                </select>

                {seciliBaglanti && (
                  <div className="mt-1.5 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 font-semibold flex items-center justify-between">
                    <span>Tedarikçi: <strong className="text-blue-950 font-black">{seciliBaglanti.tedarikci}</strong></span>
                    <span>Kalan Bakiye: <strong>{(Number(seciliBaglanti.kalanTutar) || 0).toLocaleString('tr-TR')} ₺</strong></span>
                  </div>
                )}
              </div>

              {/* Faturadaki İrsaliye Numaraları */}
              <div>
                <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Faturada Geçen İrsaliye Noları: *
                  </label>
                  {bekleyenBaglantiIrsaliyeleri.length > 0 && (
                    <button
                      type="button"
                      onClick={handleTumBekleyenIrsaliyeleriAktar}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                      title="Sistemde bu bağlantıya ait bekleyen tüm irsaliyeleri faturaya otomatik doldurur"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>⚡ Bekleyen İrsaliyeleri Otomatik Doldur ({bekleyenBaglantiIrsaliyeleri.length} Adet)</span>
                    </button>
                  )}
                </div>

                <textarea
                  rows="2"
                  placeholder="Örn: IRS-8821, IRS-8822, IRS-8910..."
                  value={faturadakiIrsaliyelerText}
                  onChange={(e) => setFaturadakiIrsaliyelerText(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-xs font-mono font-bold rounded-xl p-2 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {/* BEKLEYEN İRSALİYELER HIZLI SEÇİM BUTONLARI */}
                {bekleyenBaglantiIrsaliyeleri.length > 0 && (
                  <div className="mt-1.5 p-2 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                      <span className="flex items-center gap-1">
                        <Wand2 className="w-3 h-3 text-blue-600" />
                        Tıklayarak faturaya ekle / çıkar:
                      </span>
                      <span className="text-[10px] text-blue-700">
                        {bekleyenBaglantiIrsaliyeleri.filter(i => faturadakiIrsaliyeListesi.includes(i.irsaliyeNo)).length} / {bekleyenBaglantiIrsaliyeleri.length} seçili
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {bekleyenBaglantiIrsaliyeleri.map(i => {
                        const secili = faturadakiIrsaliyeListesi.includes(i.irsaliyeNo);
                        return (
                          <button
                            key={i.id}
                            type="button"
                            onClick={() => handleIrsaliyeTiklaToggle(i.irsaliyeNo)}
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border transition cursor-pointer flex items-center gap-1 ${
                              secili
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                                : 'bg-white hover:bg-blue-100 text-slate-800 border-blue-300'
                            }`}
                            title={`${i.santiyeAdi} • ${i.metrajM3} m³ • ${i.betonCinsi}`}
                          >
                            <span>{secili ? '✓' : '+'}</span>
                            <span>{i.irsaliyeNo}</span>
                            <span className={secili ? 'text-emerald-100' : 'text-slate-500 font-semibold'}>
                              ({i.metrajM3} m³)
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fatura No ve Fatura Tarihi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Fatura No: *</label>
                <input
                  type="text"
                  placeholder="FAT-2026-0901"
                  value={faturaNo}
                  onChange={(e) => setFaturaNo(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 text-xs font-mono font-bold rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Fatura Tarihi: *</label>
                <input
                  type="date"
                  value={faturaTarihi}
                  onChange={(e) => setFaturaTarihi(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 text-xs rounded-lg p-2 focus:outline-none"
                />
              </div>
            </div>

            {/* FATURA BETON KALEMLERİ TABLOSU (BİRDEN FAZLA BETON KALEMİ EKLEME) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Faturadaki Beton Kalemleri ({faturaKalemleri.length} Kalem)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleKalemEkle}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ YENİ BETON KALEMİ EKLE</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {faturaKalemleri.map((kalem, idx) => {
                  const kalemMatrah = (Number(kalem.metrajM3) || 0) * (Number(kalem.birimFiyat) || 0);
                  const bagFiyat = seciliBaglanti ? getFiyatForBaglantiAndSinif(seciliBaglanti, kalem.betonCinsi) : 0;

                  return (
                    <div key={kalem.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="w-36 sm:w-44">
                            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Döküm Sahası:</label>
                            <select
                              value={kalem.santiyeAdi || ''}
                              onChange={(e) => handleKalemSantiyeChange(kalem.id, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 rounded-lg p-1.5 focus:outline-none"
                            >
                              {santiyeler.map(s => (
                                <option key={s.id} value={s.ad}>{s.ad}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="w-32 sm:w-36 ml-8 sm:ml-0">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Beton Cinsi:</label>
                          <select
                            value={kalem.betonCinsi}
                            onChange={(e) => handleKalemBetonCinsiChange(kalem.id, e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 text-xs font-extrabold text-slate-800 rounded-lg p-1.5 focus:outline-none"
                          >
                            {betonSiniflari.map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Metraj (m³): *</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            placeholder="Örn: 15"
                            value={kalem.metrajM3}
                            onChange={(e) => handleKalemMetrajChange(kalem.id, e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-300 font-black text-sm text-amber-700 rounded-lg p-1.5 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10px] font-bold text-slate-600">
                              Birim Fiyat (TL/m³): *
                            </label>
                            {bagFiyat > 0 && Number(kalem.birimFiyat) !== bagFiyat && (
                              <button
                                type="button"
                                onClick={() => handleKalemBirimFiyatChange(kalem.id, bagFiyat)}
                                className="text-[9px] text-blue-600 hover:text-blue-800 font-extrabold underline cursor-pointer"
                                title="Sözleşmedeki orijinal birim fiyata geri dön"
                              >
                                Sözleşmeye Dön
                              </button>
                            )}
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            placeholder={bagFiyat > 0 ? bagFiyat.toString() : "2700.00"}
                            value={kalem.birimFiyat}
                            onChange={(e) => handleKalemBirimFiyatChange(kalem.id, e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-300 font-bold text-xs text-slate-900 rounded-lg p-1.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-right font-mono"
                          />
                          {bagFiyat > 0 && (
                            <span className="text-[9px] mt-0.5 block truncate">
                              {Number(kalem.birimFiyat) === bagFiyat ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                  ✓ Sözleşme Fiyatı Otomatik Geldi
                                </span>
                              ) : (
                                <span className="text-amber-700 font-bold flex items-center gap-0.5" title={`Sözleşmedeki orijinal fiyat: ${bagFiyat} ₺`}>
                                  ⚡ Manuel Değiştirildi ({(Number(bagFiyat) || 0).toLocaleString('tr-TR')} ₺)
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kalem Matrahı:</label>
                          <div className="bg-slate-100/80 rounded-lg p-1.5 text-right font-mono font-black text-xs text-slate-900">
                            {kalemMatrah.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                          </div>
                        </div>
                      </div>

                      {faturaKalemleri.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleKalemSil(kalem.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition self-center"
                          title="Kalemi Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Kalemler Toplam Özeti */}
              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center justify-between text-xs font-bold text-amber-950">
                <span>Toplam Fatura Metrajı: <strong className="text-sm font-black text-amber-900">{toplamGirilenMetraj} m³</strong></span>
                <span>Toplam Mal/Hizmet Matrahı: <strong className="text-sm font-black text-amber-900">{matrahTutari.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong></span>
              </div>
            </div>

            {/* TEVKİFATLI FATURA HESAPLAMA VE ÖZET TABLOSU (Görseldeki Tevkifat Faturası Formatı) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                    Tevkifatlı Fatura Hesap Tablosu
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={tevkifatUygula}
                    onChange={(e) => setTevkifatUygula(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-amber-400 font-extrabold">Tevkifatlı Fatura (4/10 Yapım İşi)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mal / Hizmet Tutarı (Matrah)</span>
                  <span className="text-sm font-black text-white font-mono mt-0.5 block">
                    {matrahTutari.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </span>
                </div>

                <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Hesaplanan KDV (%20)</span>
                  <span className="text-sm font-black text-amber-300 font-mono mt-0.5 block">
                    {hesaplananKdv.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </span>
                </div>

                <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Tevkifat (%40 - 4/10)</span>
                  <span className="text-sm font-black text-amber-400 font-mono mt-0.5 block">
                    - {tevkifatTutari.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </span>
                </div>

                <div className="bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-500/60 shadow-sm">
                  <span className="text-[10px] text-emerald-300 uppercase font-black block">Bağlantıdan Düşecek Ödenecek Tutar</span>
                  <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                    {odenecekTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* AKILLI İRSALİYE KARŞILAŞTIRMA & EKSİK TESPİT PANELİ (ÖZEL KURAL) */}
            {/* ============================================================== */}
            {faturadakiIrsaliyeListesi.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                  <span>İrsaliye Karşılaştırma Sonucu:</span>
                  <span>Toplam {faturadakiIrsaliyeListesi.length} İrsaliye İncelendi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sistemde Kayıtlı Olanlar */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Sistemde Mevcut İrsaliyeler ({eslesenIrsaliyeler.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {eslesenIrsaliyeler.map(no => (
                        <span key={no} className="bg-white border border-emerald-300 text-emerald-900 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {no} ✓
                        </span>
                      ))}
                      {eslesenIrsaliyeler.length === 0 && (
                        <span className="text-[11px] text-slate-400">Hiçbiri sistemde kayıtlı değil.</span>
                      )}
                    </div>
                  </div>

                  {/* SİSTEMDE GELMEMİŞ / EKSİK OLAN İRSALİYELER (KULLANICI İSTEĞİ) */}
                  <div className={`rounded-lg p-2.5 space-y-1 border ${
                    eksikIrsaliyeler.length > 0 
                      ? 'bg-rose-50 border-rose-300 text-rose-900' 
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    <span className="text-[11px] font-bold flex items-center gap-1 text-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Sistemde Gelmemiş / Eksik İrsaliyeler ({eksikIrsaliyeler.length}):
                    </span>

                    {eksikIrsaliyeler.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex flex-wrap gap-1">
                          {eksikIrsaliyeler.map(no => (
                            <span key={no} className="bg-white border border-rose-300 text-rose-900 font-mono text-[10px] font-black px-1.5 py-0.5 rounded">
                              {no} (Eksik)
                            </span>
                          ))}
                        </div>

                        <div className="bg-rose-100/90 p-3 rounded-xl text-xs font-medium text-rose-950 space-y-2 border border-rose-300">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="font-bold">
                              ⚠️ <strong>Faturadaki bu irsaliyeler henüz sahadan girilmemiş!</strong> İrsaliye tarihlerini ve iletilecek saha kullanıcısını seçip bildirebilirsiniz:
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 bg-white border border-rose-300 rounded-lg px-2.5 py-1 shadow-2xs">
                                <label className="text-[10px] font-bold text-slate-700">Toplu Saha Şefi:</label>
                                <select
                                  value={topluEksikKullaniciId}
                                  onChange={(e) => setTopluEksikKullaniciId(e.target.value)}
                                  className="text-[11px] font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                                >
                                  <option value="TUMU">👥 Tüm Saha Şefleri</option>
                                  {sahaKullanicilari.map(u => (
                                    <option key={u.id} value={u.id}>👷 {u.name || u.username}</option>
                                  ))}
                                </select>
                              </div>
                              {eksikIrsaliyeler.length > 1 && (
                                <button
                                  type="button"
                                  onClick={handleTumEksikleriSahaSefineIlet}
                                  className="bg-rose-700 hover:bg-rose-800 text-white font-black text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Tüm Eksikleri Saha Şefine İlet</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {eksikIrsaliyeler.map(no => {
                              const bildirimVar = eksikBildirimler.find(b => b.irsaliyeNo === no);
                              return (
                                <div key={no} className="bg-white p-2.5 rounded-lg border border-rose-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shadow-2xs">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono font-black text-xs text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-300">
                                      {no}
                                    </span>
                                    {bildirimVar ? (
                                      <div className="flex items-center gap-1">
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                          bildirimVar.durum === 'ONAYLANDI'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : bildirimVar.durum === 'ITIRAZ_EDILDI'
                                            ? 'bg-rose-100 text-rose-800'
                                            : 'bg-amber-100 text-amber-900'
                                        }`}>
                                          {bildirimVar.durum === 'ONAYLANDI' ? '✅ Saha Şefi Onayladı' :
                                           bildirimVar.durum === 'ITIRAZ_EDILDI' ? '❌ İtiraz Edildi' :
                                           '⏳ Saha Teyidi Bekleniyor'}
                                        </span>
                                        {bildirimVar.hedefKullaniciAdi && (
                                          <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-1.5 py-0.5 rounded border border-purple-200">
                                            👤 {bildirimVar.hedefKullaniciAdi}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-[10px] font-bold text-slate-500">
                                        Henüz İletilmedi
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <div className="flex items-center gap-1">
                                      <label className="text-[10px] font-bold text-slate-600">Tarih:</label>
                                      <input
                                        type="date"
                                        value={eksikIrsaliyeTarihleri[no] || faturaTarihi}
                                        onChange={(e) => setEksikIrsaliyeTarihleri(prev => ({ ...prev, [no]: e.target.value }))}
                                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                                      />
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <label className="text-[10px] font-bold text-slate-600">Saha Şefi:</label>
                                      <select
                                        value={eksikIrsaliyeKullanicilari[no] || topluEksikKullaniciId}
                                        onChange={(e) => setEksikIrsaliyeKullanicilari(prev => ({ ...prev, [no]: e.target.value }))}
                                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
                                      >
                                        <option value="TUMU">👥 Tüm Saha Şefleri</option>
                                        {sahaKullanicilari.map(u => (
                                          <option key={u.id} value={u.id}>👷 {u.name || u.username}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleSahaSefineBildir(no)}
                                      className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
                                    >
                                      <Send className="w-3 h-3" />
                                      <span>Saha Şefine İlet</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold block pt-1">
                        Tebrikler! Faturadaki tüm irsaliyeler sistemde eksiksiz mevcuttur.
                      </span>
                    )}
                  </div>
                </div>

                {/* ŞANTİYEYE AİT DİĞER BEKLEYEN İRSALİYELER VARSA TEK TIKLA EKLEME ÖNERİSİ */}
                {bekleyenBaglantiIrsaliyeleri.filter(i => !faturadakiIrsaliyeListesi.includes(i.irsaliyeNo)).length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 space-y-1.5">
                    <span className="font-extrabold flex items-center gap-1 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Sistemde bu bağlantıya ait henüz faturaya eklenmemiş bekleyen irsaliyeler:
                    </span>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {bekleyenBaglantiIrsaliyeleri
                        .filter(i => !faturadakiIrsaliyeListesi.includes(i.irsaliyeNo))
                        .map(i => (
                          <button
                            key={i.id}
                            type="button"
                            onClick={() => handleTekIrsaliyeEkle(i.irsaliyeNo)}
                            className="bg-white hover:bg-amber-100 border border-amber-400 text-amber-950 font-mono text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer transition active:scale-95 shadow-2xs flex items-center gap-1"
                            title="Faturaya ekle"
                          >
                            <span>+</span>
                            <span>{i.irsaliyeNo}</span>
                            <span className="text-slate-500 font-semibold">({i.metrajM3} m³ - {i.santiyeAdi})</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DÜŞÜM BUTONU */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer"
            >
              <TrendingDown className="w-5 h-5" />
              <span>FATURAYI KAYDET & BAĞLANTIDAN DÜŞ</span>
            </button>
          </form>

          {/* SAHA ŞEFİNE GÖNDERİLEN EKSİK BİLDİRİM TAKİP LİSTESİ */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Saha Şefine İletilen Eksik İrsaliye Bildirimleri ({eksikBildirimler.length})
              </h4>
              <button
                type="button"
                onClick={() => setYeniEksikModalAcik(true)}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs cursor-pointer transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Sahadan Gelmeyen İrsaliye Bildir</span>
              </button>
            </div>

            <div className="space-y-2">
              {eksikBildirimler.map((bild) => (
                <div
                  key={bild.id}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                    bild.durum === 'ONAYLANDI'
                      ? 'bg-emerald-50 border-emerald-200'
                      : bild.durum === 'ITIRAZ_EDILDI'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-300">
                        {bild.irsaliyeNo}
                      </span>
                      <span className="bg-amber-100 text-amber-950 font-black text-[11px] px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-700" />
                        İrsaliye Tarihi: {bild.irsaliyeTarihi || bild.tarih}
                      </span>
                      <span className="bg-purple-100 text-purple-900 font-extrabold text-[11px] px-2 py-0.5 rounded border border-purple-300 flex items-center gap-1">
                        <HardHat className="w-3 h-3 text-purple-700" />
                        İletilen: {bild.hedefKullaniciAdi || 'Tüm Saha Şefleri'}
                      </span>
                      <span className="text-slate-600 font-semibold">• {bild.tedarikci} ({bild.santiyeAdi})</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        bild.durum === 'ONAYLANDI'
                          ? 'bg-emerald-600 text-white'
                          : bild.durum === 'ITIRAZ_EDILDI'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}>
                        {bild.durum === 'ONAYLANDI' ? '✅ Saha Şefi Onayladı (Araba Gelmiş)' :
                         bild.durum === 'ITIRAZ_EDILDI' ? '❌ Saha Şefi İtiraz Etti (Gelmedi)' :
                         '⏳ Saha Şefi Teyidi Bekleniyor'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1">
                      Fatura: <strong>{bild.faturaNo}</strong> | Metraj: <strong>{bild.metrajM3} m³</strong> ({bild.betonCinsi})
                    </p>

                    {bild.mesaj && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        {bild.mesaj}
                      </p>
                    )}

                    {bild.sahaNotu && (
                      <div className="mt-1 text-[11px] font-semibold text-slate-800 bg-white/80 p-1.5 rounded border border-current">
                        💬 <strong>Saha Şefi Notu:</strong> {bild.sahaNotu}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">{bild.bildirimTarihi || bild.tarih} {bild.saat}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`"${bild.irsaliyeNo}" bildirimini listeden silmek istediğinize emin misiniz?`)) {
                          deleteEksikBildirim(bild.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                      title="Bildirimi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {eksikBildirimler.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Henüz iletilen bir eksik irsaliye bildirimi bulunmamaktadır.
                </div>
              )}
            </div>
          </div>

          {/* SİSTEME İŞLENMİŞ FATURALAR ÖZET KARTI (LİSTE AYRI MODALDA AÇILIR) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Kesilmiş Faturalar ({faturalar.length} Adet)
              </h4>
              <span className="text-xs text-slate-500 font-semibold">
                Toplam Tutar: <strong className="text-slate-900">{faturalar.reduce((a, b) => a + (Number(b.toplamTutar) || 0), 0).toLocaleString('tr-TR')} ₺</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFaturaListeModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow cursor-pointer active:scale-95 transition"
            >
              <FileText className="w-4 h-4" />
              Kesilmiş Fatura Listesini Gör
            </button>
          </div>

          {faturaListeModal && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 flex items-start sm:items-center justify-center p-2 sm:p-4"
            onClick={() => setFaturaListeModal(false)}
          >
          <div
            className="bg-white rounded-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto p-4 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Kesilmiş Faturalar ({faturalar.length} Adet)
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-semibold">
                  Toplam Tutar: <strong className="text-slate-900">{faturalar.reduce((a, b) => a + (Number(b.toplamTutar) || 0), 0).toLocaleString('tr-TR')} ₺</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setFaturaListeModal(false)}
                  className="text-slate-500 hover:text-slate-900 font-black text-lg px-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Kapat"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                  <tr>
                    <th className="p-2.5">Fatura No</th>
                    <th className="p-2.5">Tarih</th>
                    <th className="p-2.5">Tedarikçi</th>
                    <th className="p-2.5">Beton Kalemleri</th>
                    <th className="p-2.5">Toplam Metraj</th>
                    <th className="p-2.5">Tevkifatlı Ödenecek</th>
                    <th className="p-2.5">İrsaliye Durumu</th>
                    <th className="p-2.5 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {faturalar.map((fat) => (
                    <tr key={fat.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-mono font-black text-slate-900">{fat.faturaNo}</td>
                      <td className="p-2.5 text-slate-600">{fat.faturaTarihi || fat.tarih}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{fat.tedarikci}</td>
                      <td className="p-2.5 max-w-xs">
                        {fat.kalemler && fat.kalemler.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {fat.kalemler.map((k, i) => (
                              <span key={i} className="inline-block bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                {k.santiyeAdi ? `${k.santiyeAdi} - ` : ''}{k.metrajM3} m³ {k.betonCinsi}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {fat.betonCinsi}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-black text-slate-900">{fat.metrajM3} m³</td>
                      <td className="p-2.5 font-mono font-black text-emerald-700">
                        {fat.toplamTutar?.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          fat.karsilastirmaDurumu === 'UYUMLU'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fat.karsilastirmaDurumu}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                       <div className="flex items-center justify-end gap-1">
                         <button
                           type="button"
                           onClick={() => handleFaturaDuzenleBaslat(fat)}
                           className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                           title="Faturayı Düzenle"
                         >
                           <Edit3 className="w-3.5 h-3.5" />
                         </button>
                         <button
                           onClick={() => {
                             if (window.confirm(`${fat.faturaNo} faturasını silmek ve sözleşme bütçesine iade etmek istediğinize emin misiniz?`)) {
                               deleteFatura(fat.id);
                             }
                           }}
                           className="text-slate-400 hover:text-rose-600 p-1"
                           title="Faturayı Sil ve Bütçeyi İade Et"
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                       </div>
                      </td>
                    </tr>
                  ))}
                  {faturalar.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-slate-400">
                        Henüz işlenmiş fatura bulunmamaktadır.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
          </div>
          )}

          {duzenlenenFatura && (
            <div
              className="fixed inset-0 z-[60] bg-slate-950/70 flex items-center justify-center p-3"
              onClick={() => setDuzenlenenFatura(null)}
            >
              <form
                onSubmit={handleFaturaDuzenleKaydet}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    Faturayı Düzenle
                  </h4>
                  <button type="button" onClick={() => setDuzenlenenFatura(null)} className="text-slate-500 hover:text-slate-900 font-black text-lg px-2 cursor-pointer">✕</button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Fatura No</label>
                  <input
                    type="text"
                    value={editFaturaNo}
                    onChange={(e) => setEditFaturaNo(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Fatura Tarihi</label>
                  <input
                    type="date"
                    value={editFaturaTarih}
                    onChange={(e) => setEditFaturaTarih(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Faturadaki İrsaliye Noları <span className="font-normal text-slate-400 normal-case">(virgül veya boşlukla ayırın)</span>
                  </label>
                  <textarea
                    rows="3"
                    value={editFaturaIrsaliyeler}
                    onChange={(e) => setEditFaturaIrsaliyeler(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold"
                  />
                  {(() => {
                    const liste = [...new Set(editFaturaIrsaliyeler.split(/[\s,;]+/).map(s => s.trim().toUpperCase()).filter(Boolean))];
                    const eksik = liste.filter(no => !kayitliIrsaliyeNolari.includes(no));
                    return (
                      <p className={`text-[11px] font-semibold mt-1 ${eksik.length ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {liste.length} irsaliye{eksik.length ? ` — sistemde kayıtlı olmayan: ${eksik.join(', ')}` : ' — hepsi sistemde kayıtlı'}
                      </p>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Bağlantıdan Düşen Tutar (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFaturaTutar}
                    onChange={(e) => setEditFaturaTutar(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-mono font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Tutarı değiştirirseniz bağlantının kalan bakiyesi farka göre otomatik düzeltilir.</p>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setDuzenlenenFatura(null)} className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">İptal</button>
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer">Kaydet</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SEKME: SAHADAN GELEN ANLIK BETON DÖKÜM KAYITLARI (KULLANICI İSTEĞİ) */}
      {/* ============================================================== */}
      {activeTab === 'SAHA_DOKUMLERI' && (
        <div className="space-y-4">
          {/* Başlık ve Filtre Paneli */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-amber-500" />
                  Saha Elemanının Girdiği Beton Dökümleri ({filtrelenmisSahaDokumleri.length} Kayıt)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Saha şeflerinizin şantiyeden anlık kaydettiği beton dökümleri, mikser sayıları, irsaliye noları ve notları buradadır.
                </p>
              </div>

              {/* Filtre Kontrolleri */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={sahaFilterSantiye}
                  onChange={(e) => setSahaFilterSantiye(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-xs font-bold rounded-xl p-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="TUMU">Tüm Şantiyeler</option>
                  {santiyeler.map(s => (
                    <option key={s.id} value={s.id}>{s.ad}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={sahaFilterTarih}
                  onChange={(e) => setSahaFilterTarih(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-xs rounded-xl p-2 text-slate-800"
                />

                {sahaFilterTarih && (
                  <button
                    onClick={() => setSahaFilterTarih('')}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-200 px-2 py-1 rounded-lg"
                  >
                    Tarihi Temizle
                  </button>
                )}
              </div>
            </div>

            {/* Arama Kutusu */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Yapı kısmı, irsaliye no, beton sınıfı veya saha şefi adı ara..."
                value={sahaFilterSearch}
                onChange={(e) => setSahaFilterSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Özet Kartları */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">Toplam Metraj</span>
                <span className="text-base font-black text-amber-900 mt-0.5 block">{toplamSahaDokumM3} m³</span>
              </div>
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5">
                <span className="text-[10px] font-bold text-blue-700 block uppercase">Gelen Mikser</span>
                <span className="text-base font-black text-blue-900 mt-0.5 block">{toplamSahaMikserSayisi} Adet</span>
              </div>
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5">
                <span className="text-[10px] font-bold text-rose-700 block uppercase">İade Edilen</span>
                <span className="text-base font-black text-rose-900 mt-0.5 block">{toplamSahaIadeM3} m³</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5">
                <span className="text-[10px] font-bold text-emerald-700 block uppercase">Döküm Sayısı</span>
                <span className="text-base font-black text-emerald-900 mt-0.5 block">{filtrelenmisSahaDokumleri.length} Döküm</span>
              </div>
            </div>
          </div>

          {/* Eksik İrsaliye Bildirimlerine Saha Şefinin Verdiği Yanıtlar */}
          {eksikBildirimler.filter(b => b.durum === 'CEVAPLANDI' || b.sahaNotu).length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <h4 className="font-extrabold text-xs text-indigo-950">
                  Saha Şefinin Eksik İrsaliye Bildirim Yanıtları ({eksikBildirimler.filter(b => b.durum === 'CEVAPLANDI' || b.sahaNotu).length})
                </h4>
              </div>
              <div className="space-y-2">
                {eksikBildirimler.filter(b => b.durum === 'CEVAPLANDI' || b.sahaNotu).map(bild => (
                  <div key={bild.id} className="bg-white border border-indigo-100 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {bild.irsaliyeNo}
                        </span>
                        <span className="text-slate-500 font-semibold">{bild.tarih}</span>
                        <span className="font-bold text-indigo-600">{bild.tedarikci}</span>
                      </div>
                      <div className="mt-1 text-slate-700 font-medium">
                        <strong className="text-indigo-900">Saha Şefi Yanıtı:</strong> {bild.sahaNotu || 'Açıklama girilmedi.'}
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      Cevaplandı
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Döküm Kartları Listesi */}
          {filtrelenmisSahaDokumleri.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-2">
              <HardHat className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-500">
                Henüz saha elemanı tarafından girilmiş beton döküm kaydı bulunmamaktadır.
              </div>
              <p className="text-[11px] text-slate-400">
                Saha şefi telefondan yeni bir beton dökümü girdiğinde burada anında canlı olarak belirecektir.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtrelenmisSahaDokumleri.map((dokum) => (
                <div
                  key={dokum.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-amber-300 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-slate-900">
                          {dokum.santiyeAdi}
                        </span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                          {dokum.betonSinifi}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          📅 {dokum.tarih} {dokum.saat ? `• ⏰ ${dokum.saat}` : ''}
                        </span>
                        {dokum.iadeVarMi && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {dokum.iadeM3 > 0 ? `${dokum.iadeM3} m³ İADE` : 'İADE VAR'}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 pt-0.5">
                        <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Yapı Kısmı: {dokum.yapiKismi}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg w-fit mt-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Giren Kullanıcı: <strong className="font-black text-blue-950">{dokum.sahaSefi || dokum.kaydeden || 'Saha Sorumlusu'}</strong></span>
                      </div>
                    </div>

                    {/* Sağ Metraj Kutusu */}
                    <div className="text-right shrink-0 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                      <span className="text-lg font-black text-slate-900 block leading-tight">
                        {dokum.toplamM3} m³
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 block">
                        {dokum.mikserSayisi} Mikser
                      </span>
                    </div>
                  </div>

                  {/* İrsaliye Numaraları ve Notlar */}
                  <div className="bg-slate-50 rounded-xl p-2.5 text-xs border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-bold text-slate-700">Sahadan Girilen İrsaliye Noları:</span>
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {dokum.irsaliyeNolari || 'Girilmedi'}
                        </span>
                      </div>

                      {dokum.irsaliyeNolari && dokum.irsaliyeNolari !== 'Girilmedi' && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(dokum.irsaliyeNolari);
                            setBasariMesaji(`İrsaliye no (${dokum.irsaliyeNolari}) panoya kopyalandı! Fatura sekmesinde yapıştırabilirsiniz.`);
                            setTimeout(() => setBasariMesaji(''), 3000);
                          }}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Kopyala</span>
                        </button>
                      )}
                    </div>

                    {dokum.notlar && (
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                        <span className="font-bold text-slate-700">Saha Notu:</span> {dokum.notlar}
                      </div>
                    )}
                  </div>

                  {/* Alt İşlemler */}
                  <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleSahaDokumDuzenleBaslat(dokum)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-300 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Düzenle</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`Bu saha döküm kaydını silmek istediğinize emin misiniz?\n(${dokum.santiyeAdi} - ${dokum.toplamM3} m³)`)) {
                          await deleteSahaDokum(dokum.id);
                          setBasariMesaji('Saha döküm kaydı başarıyla silindi.');
                          setTimeout(() => setBasariMesaji(''), 3000);
                        }
                      }}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Dökümü Sil</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. SEKME: BAĞLANTILAR & BETON CİNSİNE GÖRE BİRİM FİYATLAR */}
      {/* ============================================================== */}
      {activeTab === 'BAGLANTILAR' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Tedarikçi Bağlantıları ve Fiyat Tabloları ({baglantilar.length})
            </h3>
            <button
              onClick={() => {
                const defaultFiyatlar = {};
                betonSiniflari.forEach(s => { defaultFiyatlar[s] = 2700; });
                setYeniSinifFiyatlari(defaultFiyatlar);
                if (!yeniSozlesmeNo) {
                  setYeniSozlesmeNo(`SOZ-${new Date().getFullYear()}-${baglantilar.length + 1}`);
                }
                setYeniBaglantiModal(true);
              }}
              className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-500 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Bağlantı & Fiyat Listesi Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {baglantilar.map((bag) => {
              const harcananTutar = bag.toplamTutar - bag.kalanTutar;
              const yuzdeKullanilan = bag.toplamTutar > 0 ? Math.min(100, Math.round((harcananTutar / bag.toplamTutar) * 100)) : 0;
              const fiyatListesiAcik = acikFiyatListesiBaglantiId === bag.id;

              return (
                <div key={bag.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 font-mono">
                            {bag.sozlesmeNo}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const yeniNo = prompt('Sözleşme Numarasını Düzenleyiniz:', bag.sozlesmeNo);
                              if (yeniNo && yeniNo.trim()) {
                                updateBaglanti(bag.id, { sozlesmeNo: yeniNo.trim() });
                                setBasariMesaji(`Sözleşme No "${yeniNo.trim()}" olarak güncellendi.`);
                                setTimeout(() => setBasariMesaji(''), 3000);
                              }
                            }}
                            title="Sözleşme Numarasını Hızlı Değiştir"
                            className="ml-1.5 text-blue-500 hover:text-blue-800 hover:bg-blue-100 p-0.5 rounded transition"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Bütçe Bazlı Anlaşma
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 mt-1">{bag.tedarikci}</h4>
                      
                      {/* Geçerli Şantiyeler */}
                      <div className="mt-1 flex items-center gap-1 flex-wrap">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-600 font-semibold">
                          {bag.santiyeAdlari && bag.santiyeAdlari.length > 0 ? bag.santiyeAdlari.join(', ') : bag.santiyeAdi}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto shrink-0">
                      <button
                        onClick={() => handleBaglantiDuzenleAc(bag)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Düzenle
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`${bag.sozlesmeNo} (${bag.tedarikci}) bağlantısını silmek istediğinize emin misiniz?`)) {
                            deleteBaglanti(bag.id);
                          }
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Sil
                      </button>
                    </div>
                  </div>

                  {/* Bütçe Finansal KPI Kartları */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Sözleşme Bütçesi</span>
                      <span className="text-xs sm:text-sm font-black text-slate-800 block mt-0.5">
                        {(Number(bag.toplamTutar) || 0).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    <div className="border-x border-slate-200 px-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Harcanan Tutar</span>
                      <span className="text-xs sm:text-sm font-black text-rose-600 block mt-0.5">
                        {(Number(harcananTutar) || 0).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 block">Kalan Bakiye</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-600 block mt-0.5">
                        {(Number(bag.kalanTutar) || 0).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  {/* İlerleme Çubuğu */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Kullanım: %{yuzdeKullanilan}</span>
                      <span>Kalan: %{100 - yuzdeKullanilan} Bakiye</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          yuzdeKullanilan > 80 ? 'bg-rose-500' : yuzdeKullanilan > 50 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${yuzdeKullanilan}%` }}
                      />
                    </div>
                  </div>

                  {/* Fiyat Listesi Tablosu */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setAcikFiyatListesiBaglantiId(fiyatListesiAcik ? null : bag.id)}
                      className="w-full p-2.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/80 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-blue-600" />
                        <span>Beton Cinsine Göre Anlaşmalı Fiyatlar ({betonSiniflari.length} Sınıf)</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="text-[11px]">{fiyatListesiAcik ? 'Gizle' : 'Gör & Düzenle'}</span>
                        {fiyatListesiAcik ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {fiyatListesiAcik && (
                      <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                        {betonSiniflari.map((sinif) => {
                          const sinifFiyat = bag.fiyatListesi?.[sinif] || bag.birimFiyat || 0;
                          const key = `${bag.id}_${sinif}`;
                          const duzenleniyor = duzenlenenSinifKey === key;

                          return (
                            <div key={sinif} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                              <span className="font-extrabold text-slate-800">{sinif}</span>
                              {duzenleniyor ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={duzenlenenSinifFiyat}
                                    onChange={(e) => setDuzenlenenSinifFiyat(e.target.value)}
                                    className="w-24 bg-white border border-blue-500 p-1 text-xs font-black rounded"
                                  />
                                  <button
                                    onClick={() => {
                                      updateBaglantiSinifFiyat(bag.id, sinif, duzenlenenSinifFiyat);
                                      setDuzenlenenSinifKey(null);
                                    }}
                                    className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setDuzenlenenSinifKey(null)} className="p-1 bg-slate-200 text-slate-600 rounded">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-blue-700">{(Number(sinifFiyat) || 0).toLocaleString('tr-TR')} ₺/m³</span>
                                  <button
                                    onClick={() => { setDuzenlenenSinifKey(key); setDuzenlenenSinifFiyat(sinifFiyat); }}
                                    className="p-1 text-slate-400 hover:text-blue-600"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. SEKME: BETON CİNSLERİ YÖNETİMİ */}
      {/* ============================================================== */}
      {activeTab === 'BETON_CINSLERI' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                Sistemde Tanımlı Beton Cinsleri ({betonSiniflari.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Şantiyelerde dökülen ve santralle bağlanan tüm beton sınıflarını buradan yönetebilirsiniz.
              </p>
            </div>
            <button
              onClick={() => setBetonCinsiModal(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-2 rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Beton Cinsi Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {betonSiniflari.map((sinif) => (
              <div key={sinif} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">{sinif}</span>
                <button
                  onClick={() => {
                    if (window.confirm(`"${sinif}" beton cinsini silmek istediğinize emin misiniz?`)) {
                      deleteBetonSinifi(sinif);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. SEKME: PROJELER / ŞANTİYELER YÖNETİMİ (KULLANICI İSTEĞİ) */}
      {/* ============================================================== */}
      {activeTab === 'PROJELER' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Sistemde Kayıtlı Projeler & Şantiyeler ({santiyeler.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Şantiye ve proje isimlerini buradan ekleyin. Eklenen tüm projeler Saha Şefi seçimlerine, irsaliye girişlerine ve izleyici ekranlarına anında yansır.
              </p>
            </div>
            <button
              onClick={() => setProjeModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Proje / Şantiye Ekle</span>
            </button>
          </div>

          {/* Proje Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {santiyeler.map((st) => {
              const projeDokumleri = (sahaDokumleri || []).filter(d => 
                (d.santiyeId && d.santiyeId === st.id) ||
                (d.santiyeAdi && st.ad && d.santiyeAdi.trim().toLowerCase() === st.ad.trim().toLowerCase()) ||
                (d.santiye && st.ad && d.santiye.trim().toLowerCase() === st.ad.trim().toLowerCase())
              );
              const projeToplamM3 = projeDokumleri.reduce((a, b) => a + (Number(b.toplamM3) || 0), 0);
              const projeMikserSayisi = projeDokumleri.reduce((a, b) => a + (Number(b.mikserSayisi) || 0), 0);
              const projeBaglantilari = (baglantilar || []).filter(b => {
                const bSantiyeList = (b.santiyeAdlari && b.santiyeAdlari.length > 0)
                  ? b.santiyeAdlari
                  : (b.santiyeAdi ? b.santiyeAdi.split(',').map(s => s.trim()) : (b.santiye ? b.santiye.split(',').map(s => s.trim()) : []));
                return (b.santiyeId && b.santiyeId === st.id) ||
                  (b.santiyeIds && Array.isArray(b.santiyeIds) && b.santiyeIds.includes(st.id)) ||
                  (b.santiyeAdi && st.ad && b.santiyeAdi.trim().toLowerCase() === st.ad.trim().toLowerCase()) ||
                  (b.santiye && st.ad && b.santiye.trim().toLowerCase() === st.ad.trim().toLowerCase()) ||
                  bSantiyeList.some(ad => ad && st.ad && ad.trim().toLowerCase() === st.ad.trim().toLowerCase());
              });
              const projeBaglantiSayisi = projeBaglantilari.length;

              return (
                <div key={st.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {st.sehir || 'Türkiye'}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">
                        {st.ad}
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`"${st.ad}" projesini silmek istediğinize emin misiniz?`)) {
                          deleteSantiye(st.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition"
                      title="Projeyi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Toplam Döküm</span>
                      <span className="font-extrabold text-slate-900">{projeToplamM3} m³</span>
                      <span className="text-[10px] text-slate-400 block">{projeMikserSayisi} Mikser</span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Aktif Sözleşme</span>
                      <span className="font-extrabold text-blue-700">{projeBaglantiSayisi} Bağlantı</span>
                      <span className="text-[10px] text-slate-400 block">Tedarikçi</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. SEKME: KULLANICI YÖNETİMİ & ROL ATAMA */}
      {/* ============================================================== */}
      {activeTab === 'KULLANICILAR' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Sistem Kullanıcıları ve Yetkilendirme ({users.length})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Saha Şefi, İzleyici ve Admin kullanıcı adlarını ve şifrelerini buradan belirleyin.
              </p>
            </div>
            <button
              onClick={() => {
                setYeniUsername('');
                setYeniPassword('1234');
                setYeniRole('SAHA_SEFI');
                setYeniName('');
                setUserModal(true);
              }}
              className="flex items-center gap-1.5 bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-purple-500 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Kullanıcı Tanımla</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {users.map((u) => {
              const roleColor = 
                u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                u.role === 'SAHA_SEFI' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                'bg-emerald-100 text-emerald-800 border-emerald-200';

              const roleLabel = 
                u.role === 'ADMIN' ? 'Admin (Yönetici)' :
                u.role === 'SAHA_SEFI' ? 'Saha Şefi' :
                'İzleyici (Patron/Gözlemci)';

              return (
                <div key={u.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${roleColor}`}>
                        {roleLabel}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-2">{u.name || u.username}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">@{u.username}</p>
                    </div>

                    {u.username !== 'admin' && (
                      <button
                        onClick={() => {
                          if (window.confirm(`"${u.username}" kullanıcısını silmek istediğinize emin misiniz?`)) {
                            deleteUser(u.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Kullanıcıyı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-slate-400" /> Şifre:
                    </span>
                    <input
                      type="text"
                      value={u.password}
                      onChange={(e) => updateUser(u.id, { password: e.target.value })}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-800 w-28 text-right focus:ring-1 focus:ring-purple-500"
                      title="Şifreyi değiştirmek için yazın"
                    />
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <span className="font-bold">Erişebileceği Ekran: </span>
                    {u.role === 'SAHA_SEFI' && 'Sadece Mikser & Döküm Giriş Ekranı'}
                    {u.role === 'IZLEYICI' && 'Sadece Döküm & Kalan Bakiye İzleme'}
                    {u.role === 'ADMIN' && 'Tüm Yönetim & Fatura & İrsaliye İşlemleri'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* YENİ KULLANICI MODALI */}
      {userModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Yeni Kullanıcı Tanımla
              </h3>
              <button onClick={() => setUserModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const res = addUser({
                username: yeniUsername,
                password: yeniPassword,
                role: yeniRole,
                name: yeniName
              });
              if (res.success) {
                setBasariMesaji(`"${yeniUsername}" kullanıcısı başarıyla oluşturuldu.`);
                setUserModal(false);
                setTimeout(() => setBasariMesaji(''), 3500);
              } else {
                alert(res.message);
              }
            }} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kullanıcı Adı: * (Giriş için)
                </label>
                <input
                  type="text"
                  placeholder="Örn: ahmet.sef, mehmet, mustafa"
                  value={yeniUsername}
                  onChange={(e) => setYeniUsername(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ad Soyad / Görev Başlığı:
                </label>
                <input
                  type="text"
                  placeholder="Örn: Ahmet Şef (Boulevard Şantiyesi)"
                  value={yeniName}
                  onChange={(e) => setYeniName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-semibold text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Şifre: *
                </label>
                <input
                  type="text"
                  placeholder="Örn: 1234 veya 5566"
                  value={yeniPassword}
                  onChange={(e) => setYeniPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 font-mono font-bold text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rol / Yetki Türü: *
                </label>
                <select
                  value={yeniRole}
                  onChange={(e) => setYeniRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="SAHA_SEFI">👷 Saha Şefi (Sadece Döküm Girişi & İade)</option>
                  <option value="IZLEYICI">👁️ İzleyici (Sadece Döküm & Kalan Bakiye Takip)</option>
                  <option value="ADMIN">🛡️ Admin (Tüm Sözleşme, Fatura & İrsaliye İşlemleri)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setUserModal(false)} className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-sm">Kullanıcıyı Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YENİ PROJE / ŞANTİYE MODALI */}
      {projeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Yeni Proje / Şantiye Tanımla
              </h3>
              <button onClick={() => setProjeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1">✕</button>
            </div>
            <form onSubmit={handleYeniProjeKaydet} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proje / Şantiye Adı: *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Alya Park Evleri, Vadi Konakları"
                  value={yeniProjeAdi}
                  onChange={(e) => setYeniProjeAdi(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-sm rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Şehir / İlçe / Lokasyon:
                </label>
                <input
                  type="text"
                  placeholder="Örn: İstanbul / Beylikdüzü veya Ankara / Çayyolu"
                  value={yeniProjeSehir}
                  onChange={(e) => setYeniProjeSehir(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-semibold text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setProjeModal(false)} className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm">Projeyi Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YENİ BETON CİNSİ MODALI */}
      {betonCinsiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                Yeni Beton Cinsi Tanımla
              </h3>
              <button onClick={() => setBetonCinsiModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1">✕</button>
            </div>
            <form onSubmit={handleYeniBetonCinsiKaydet} className="space-y-3">
              <input
                type="text"
                placeholder="Örn: C30/37 Antifrizli veya C50/60"
                value={yeniBetonCinsiInput}
                onChange={(e) => setYeniBetonCinsiInput(e.target.value)}
                required
                autoFocus
                className="w-full bg-slate-50 border border-slate-300 font-black text-sm rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setBetonCinsiModal(false)} className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-sm">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YENİ BAĞLANTI MODALI */}
      {yeniBaglantiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Yeni Bağlantı & Fiyat Listesi
              </h3>
              <button onClick={() => setYeniBaglantiModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1">✕</button>
            </div>

            <form onSubmit={handleBaglantiSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tedarikçi Firma / Santral Adı: *
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Kavanlar Beton, Çimsa..."
                    value={yeniTedarikci}
                    onChange={(e) => setYeniTedarikci(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Sözleşme No: *</span>
                    <span className="text-[10px] text-blue-600 font-bold">Kendiniz Belirleyin</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: KAV-2026-01, SÖZ-104..."
                    value={yeniSozlesmeNo}
                    onChange={(e) => setYeniSozlesmeNo(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Bu Bağlantıdan Beton Alacak Projeler / Şantiyeler: *</span>
                  <span className="text-[10px] text-blue-600 font-bold">Birden fazla seçilebilir</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-xl max-h-36 overflow-y-auto">
                  {santiyeler.map((s) => {
                    const isChecked = yeniSantiyeIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-bold cursor-pointer transition border ${
                          isChecked
                            ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setYeniSantiyeIds(prev => [...prev, s.id]);
                            } else {
                              setYeniSantiyeIds(prev => prev.filter(id => id !== s.id));
                            }
                          }}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span className="truncate">{s.ad}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Toplam Anlaşma Tutarı / Sözleşme Bütçesi (TL): *
                  </label>
                  <span className="text-[10px] text-emerald-600 font-extrabold">Bütçe Bazlı Bağlantı</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    placeholder="Örn: 10000000 (10 Milyon TL)"
                    value={yeniToplamTutar}
                    onChange={(e) => setYeniToplamTutar(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pr-12 text-sm font-black text-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">TL</span>
                </div>

                {/* Hızlı Tutar Seçim Butonları & Canlı Önizleme */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {[5000000, 10000000, 20000000, 30000000].map((tutar) => (
                    <button
                      key={tutar}
                      type="button"
                      onClick={() => setYeniToplamTutar(tutar)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition ${
                        Number(yeniToplamTutar) === tutar
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {(tutar / 1000000)} Milyon ₺
                    </button>
                  ))}
                </div>

                {yeniToplamTutar > 0 && (
                  <div className="mt-1.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between">
                    <span>💵 Tanımlanan Anlaşma Bütçesi:</span>
                    <span className="font-black text-sm">{Number(yeniToplamTutar).toLocaleString('tr-TR')} ₺</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Tahmini Metraj (m³) (Opsiyonel):</span>
                  <span className="text-[10px] text-slate-400 font-normal">Fiyat listesine göre yaklaşık</span>
                </label>
                <input
                  type="number"
                  placeholder={
                    yeniSinifFiyatlari[betonSiniflari[0]] 
                      ? `Yaklaşık ~${Math.round((Number(yeniToplamTutar) || 0) / (yeniSinifFiyatlari[betonSiniflari[0]] || 2600))} m³`
                      : 'Örn: 3500'
                  }
                  value={yeniTahminiMetraj}
                  onChange={(e) => setYeniTahminiMetraj(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 Beton bağlantıları m³ ile sınırlı olmayıp tutar bazlıdır. Şantiyeler beton çektikçe tevkifatlı faturalar bu bütçeden düşer.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <span className="block text-xs font-bold text-slate-800">Beton Cinsi Birim Fiyatları (TL/m³):</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {betonSiniflari.map(sinif => (
                    <div key={sinif} className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-700">{sinif}:</span>
                      <input
                        type="number"
                        placeholder="2600"
                        value={yeniSinifFiyatlari[sinif] || ''}
                        onChange={(e) => setYeniSinifFiyatlari({ ...yeniSinifFiyatlari, [sinif]: Number(e.target.value) })}
                        className="w-32 bg-white border border-slate-300 p-1.5 rounded-lg text-xs font-bold text-right"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setYeniBaglantiModal(false)} className="px-3 py-2 text-xs font-bold text-slate-600 rounded-lg">İptal</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BAĞLANTI DÜZENLEME MODALI */}
      {duzenleBaglantiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                Bağlantı Sözleşmesini Düzenle ({editSozlesmeNo})
              </h3>
              <button onClick={() => setDuzenleBaglantiModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1">✕</button>
            </div>

            <form onSubmit={handleBaglantiDuzenleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tedarikçi Firma / Santral: *</label>
                  <input
                    type="text"
                    placeholder="Tedarikçi Santral"
                    value={editTedarikci}
                    onChange={(e) => setEditTedarikci(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Sözleşme No: *</span>
                    <span className="text-[10px] text-blue-600 font-bold">Özgürce Değiştirilebilir</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Sözleşme No"
                    value={editSozlesmeNo}
                    onChange={(e) => setEditSozlesmeNo(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Geçerli Şantiyeler */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Bu Bağlantının Geçerli Olduğu Şantiyeler / Projeler: *</span>
                  <span className="text-[10px] text-blue-600 font-bold">Birden fazla seçilebilir</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-xl max-h-36 overflow-y-auto">
                  {santiyeler.map((s) => {
                    const isChecked = editSantiyeIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-bold cursor-pointer transition border ${
                          isChecked
                            ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditSantiyeIds(prev => [...prev, s.id]);
                            } else {
                              setEditSantiyeIds(prev => prev.filter(id => id !== s.id));
                            }
                          }}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span className="truncate">{s.ad}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Toplam Bütçe ve Kalan Bakiye */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Toplam Sözleşme Bütçesi (TL): *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1000"
                      value={editToplamTutar}
                      onChange={(e) => setEditToplamTutar(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pr-10 text-xs font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">TL</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1">
                    Kalan Bakiye Tutarı (TL): *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1000"
                      value={editKalanTutar}
                      onChange={(e) => setEditKalanTutar(e.target.value)}
                      required
                      className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl p-2.5 pr-10 text-xs font-black text-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-black text-emerald-600">TL</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahmini Toplam Metraj (m³) (Opsiyonel):
                </label>
                <input
                  type="number"
                  placeholder="Örn: 3500"
                  value={editTahminiMetraj}
                  onChange={(e) => setEditTahminiMetraj(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
              </div>

              {/* Fiyat Listesi */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <span className="block text-xs font-bold text-slate-800">Beton Cinsi Birim Fiyatları (TL/m³):</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {betonSiniflari.map(sinif => (
                    <div key={sinif} className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-700">{sinif}:</span>
                      <input
                        type="number"
                        placeholder="2600"
                        value={editSinifFiyatlari[sinif] !== undefined ? editSinifFiyatlari[sinif] : ''}
                        onChange={(e) => setEditSinifFiyatlari({ ...editSinifFiyatlari, [sinif]: Number(e.target.value) })}
                        className="w-32 bg-white border border-slate-300 p-1.5 rounded-lg text-xs font-bold text-right"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Açıklama / Not:</label>
                <input
                  type="text"
                  placeholder="Örn: Temel ve kaba inşaat bağlantısı"
                  value={editAciklama}
                  onChange={(e) => setEditAciklama(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setDuzenleBaglantiModal(false)} className="px-3 py-2 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100">İptal</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm">Değişiklikleri Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Çift Güvenlikli Sıfırlama Modalı */}
      {sifirlaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-rose-200">
            {/* Modal Başlık */}
            <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-sm tracking-wide">
                  DİKKAT: Çift Güvenlikli Veri Sıfırlama
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSifirlaModalOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold p-1 leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal İçerik */}
            <div className="p-5 space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1.5">
                <p className="font-bold">⚠️ Bu işlem şunları silecektir:</p>
                <ul className="list-disc list-inside space-y-0.5 text-rose-800 font-medium">
                  <li>Tüm saha beton döküm kayıtları</li>
                  <li>Tüm irsaliye havuzu kayıtları</li>
                  <li>Tüm faturalar ve mutabakatlar</li>
                  <li>Eksik irsaliye bildirimleri</li>
                </ul>
                <p className="text-[11px] text-slate-600 pt-1 border-t border-rose-200">
                  * Şantiyeler ve bağlantı sözleşmeleri kesinlikle korunur.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                  Geri Alma (Kurtarma) Güvencesi:
                </p>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Yanlışlıkla sıfırlasanız bile silinen veriler otomatik olarak kurtarma yedeğine alınır. Sıfırlama sonrasında belirecek <strong>"Geri Al (Kurtar)"</strong> butonuna basarak tüm verileri aynen geri yükleyebilirsiniz.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Onaylamak için aşağıdaki kutucuğa büyük harflerle <span className="text-rose-600 font-black">SIFIRLA</span> yazınız:
                </label>
                <input
                  type="text"
                  value={sifirlaOnayMetni}
                  onChange={(e) => setSifirlaOnayMetni(e.target.value.toUpperCase())}
                  placeholder="SIFIRLA"
                  className="w-full bg-slate-50 border-2 border-slate-300 focus:border-rose-500 rounded-xl p-2.5 text-center text-sm font-black tracking-widest text-slate-800 focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSifirlaModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Vazgeç / İptal
                </button>
                <button
                  type="button"
                  disabled={sifirlaOnayMetni.trim() !== 'SIFIRLA'}
                  onClick={async () => {
                    await clearAllTestData();
                    setSifirlaModalOpen(false);
                    setSifirlaOnayMetni('');
                    setBasariMesaji('Tüm deneme ve döküm verileri sıfırlandı. Yanlışlıkla yaptıysanız "Geri Al" butonuna basarak kurtarabilirsiniz.');
                    setTimeout(() => setBasariMesaji(''), 6000);
                  }}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-sm ${
                    sifirlaOnayMetni.trim() === 'SIFIRLA'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-rose-600/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Onayla ve Sıfırla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SAHA DÖKÜMÜ DÜZENLEME MODALI (ADMIN) */}
      {/* ============================================================== */}
      {duzenleSahaModal && duzenlenenSahaDokum && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    Saha Döküm Kaydını Düzenle
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Kaydı Giren: <strong className="text-slate-700">{duzenlenenSahaDokum.sahaSefi || duzenlenenSahaDokum.kaydeden || 'Saha Sorumlusu'}</strong>
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setDuzenleSahaModal(false);
                  setDuzenlenenSahaDokum(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSahaDokumDuzenleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    1. Şantiye *
                  </label>
                  <select
                    value={editSahaSantiyeId}
                    onChange={(e) => setEditSahaSantiyeId(e.target.value)}
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
                    value={editSahaTarih}
                    onChange={(e) => setEditSahaTarih(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  2. İnşaatın Hangi Kısmına Döküldü? *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Radye Temel, 2. Kat Tabliye..."
                  value={editSahaYapiKismi}
                  onChange={(e) => setEditSahaYapiKismi(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  3. Beton Sınıfı *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {betonSiniflari.map((bs) => (
                    <button
                      key={bs}
                      type="button"
                      onClick={() => setEditSahaBetonSinifi(bs)}
                      className={`p-2 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                        editSahaBetonSinifi === bs
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {bs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-amber-500" />
                      4. Mikser Sayısı *
                    </span>
                    <span className="text-amber-600 font-bold">Araba</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editSahaMikserSayisi}
                    onChange={(e) => setEditSahaMikserSayisi(e.target.value)}
                    required
                    className="w-full text-center font-black text-base bg-white border border-slate-300 rounded-lg py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

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
                      value={editSahaToplamM3}
                      onChange={(e) => setEditSahaToplamM3(e.target.value)}
                      required
                      className="w-full text-center font-black text-base text-amber-600 bg-white border border-slate-300 rounded-lg py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400 pointer-events-none">m³</span>
                  </div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border transition ${
                editSahaIadeVarMi ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className={`w-3.5 h-3.5 ${editSahaIadeVarMi ? 'text-rose-600' : 'text-slate-400'}`} />
                    İade Var mı?
                  </span>
                  <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setEditSahaIadeVarMi(false)}
                      className={`px-3 py-1 text-[11px] font-black rounded transition cursor-pointer ${
                        !editSahaIadeVarMi ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      YOK
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSahaIadeVarMi(true)}
                      className={`px-3 py-1 text-[11px] font-black rounded transition cursor-pointer ${
                        editSahaIadeVarMi ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      VAR
                    </button>
                  </div>
                </div>

                {editSahaIadeVarMi && (
                  <div className="mt-2 pt-2 border-t border-rose-200 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-rose-800">İade Edilen Miktar (m³):</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Örn: 2.5"
                      value={editSahaIadeM3}
                      onChange={(e) => setEditSahaIadeM3(e.target.value)}
                      className="w-24 bg-white border border-rose-300 text-rose-900 font-black text-center text-xs rounded-lg p-1 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    İrsaliye Noları:
                  </label>
                  <input
                    type="text"
                    value={editSahaIrsaliyeNolari}
                    onChange={(e) => setEditSahaIrsaliyeNolari(e.target.value)}
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
                    value={editSahaNotlar}
                    onChange={(e) => setEditSahaNotlar(e.target.value)}
                    placeholder="Saha açıklaması"
                    className="w-full bg-slate-50 border border-slate-300 text-xs rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setDuzenleSahaModal(false);
                    setDuzenlenenSahaDokum(null);
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

      {/* ============================================================== */}
      {/* İRSALİYE DÜZENLEME MODALI (ADMIN) */}
      {/* ============================================================== */}
      {duzenleIrsaliyeModal && duzenlenenIrsaliye && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    İrsaliye Kaydını Düzenle
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    İrsaliye No: <strong className="text-amber-600 font-mono">{editIrsaliyeNo}</strong>
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setDuzenleIrsaliyeModal(false);
                  setDuzenlenenIrsaliye(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIrsaliyeDuzenleKaydet} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    İrsaliye No: *
                  </label>
                  <input
                    type="text"
                    value={editIrsaliyeNo}
                    onChange={(e) => setEditIrsaliyeNo(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    İrsaliye Tarihi: *
                  </label>
                  <input
                    type="date"
                    value={editIrsaliyeTarihi}
                    onChange={(e) => setEditIrsaliyeTarihi(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    İrsaliye Açıklaması / Not:
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: A Blok Temel Dökümü, Pompa No vb."
                    value={editIrsaliyeAciklama}
                    onChange={(e) => setEditIrsaliyeAciklama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Dökülen Metraj (m³): *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={editIrsaliyeMetrajM3}
                    onChange={(e) => setEditIrsaliyeMetrajM3(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 font-black text-amber-600 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Şantiye / Proje: *
                  </label>
                  <select
                    value={editIrsaliyeSantiyeId}
                    onChange={(e) => setEditIrsaliyeSantiyeId(e.target.value)}
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Bağlantı / Tedarikçi: *
                  </label>
                  <select
                    value={editIrsaliyeBaglantiId}
                    onChange={(e) => setEditIrsaliyeBaglantiId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
                  >
                    {baglantilar.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.tedarikci} ({b.sozlesmeNo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Beton Sınıfı: *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {betonSiniflari.map((bs) => (
                    <button
                      key={bs}
                      type="button"
                      onClick={() => setEditIrsaliyeBetonCinsi(bs)}
                      className={`p-2 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                        editIrsaliyeBetonCinsi === bs
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {bs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fatura Durumu:
                  </label>
                  <select
                    value={editIrsaliyeDurum}
                    onChange={(e) => setEditIrsaliyeDurum(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-bold rounded-lg p-2 focus:outline-none"
                  >
                    <option value="Beklemede">Beklemede (Henüz Faturalanmadı)</option>
                    <option value="Faturalandı">Faturalandı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Bağlı Fatura No:
                  </label>
                  <input
                    type="text"
                    placeholder="Varsa fatura no giriniz"
                    value={editIrsaliyeFaturaNo}
                    onChange={(e) => setEditIrsaliyeFaturaNo(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-mono text-xs rounded-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setDuzenleIrsaliyeModal(false);
                    setDuzenlenenIrsaliye(null);
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
      {/* SAHADAN GELMEYEN İRSALİYE BİLDİRİMİ GÖNDERME MODALI */}
      {yeniEksikModalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-5 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-base flex items-center gap-2">
                  <Send className="w-5 h-5 text-rose-200" />
                  Saha Şefine Eksik İrsaliye Bildir
                </h3>
                <p className="text-xs text-rose-100 font-medium mt-0.5">
                  Tarihini vererek Saha Şefine şantiyede bu irsaliyeleri aratıp buldurun.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setYeniEksikModalAcik(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManuelEksikBildirimiGonder} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Şantiye (Saha): *
                  </label>
                  <select
                    value={manuelEksikSantiyeId}
                    onChange={(e) => setManuelEksikSantiyeId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {santiyeler.map(s => (
                      <option key={s.id} value={s.id}>{s.ad}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    İrsaliye Tarihi: *
                  </label>
                  <input
                    type="date"
                    value={manuelEksikTarih}
                    onChange={(e) => setManuelEksikTarih(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  İletilecek Saha Kullanıcısı / Şefi: *
                </label>
                <select
                  value={manuelEksikKullaniciId}
                  onChange={(e) => setManuelEksikKullaniciId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="TUMU">👥 Tüm Saha Şefleri (Genel Bildirim)</option>
                  {sahaKullanicilari.map(u => (
                    <option key={u.id} value={u.id}>
                      👷 {u.name || u.username} ({u.username})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 font-medium">Seçtiğiniz saha şefinin ekranında bu bildirim anında görünecektir.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tedarikçi / Santral:
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Kavanlar Beton"
                    value={manuelEksikTedarikci}
                    onChange={(e) => setManuelEksikTedarikci(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Beton Sınıfı:
                  </label>
                  <select
                    value={manuelEksikBetonCinsi}
                    onChange={(e) => setManuelEksikBetonCinsi(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {betonSiniflari.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  İrsaliye Numaraları: *
                </label>
                <textarea
                  rows={2}
                  placeholder="Örn: IZ42026000015953, IZ42026000015959 (Birden çok ise virgülle ayırabilirsiniz)"
                  value={manuelEksikIrsaliyeNo}
                  onChange={(e) => setManuelEksikIrsaliyeNo(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none uppercase"
                />
                <span className="text-[10px] text-slate-500 font-medium">Birden fazla numara yazarsanız her biri için ayrı bildirim oluşturulur.</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Metraj (m³):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={manuelEksikMetraj}
                  onChange={(e) => setManuelEksikMetraj(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Saha Şefine Özel Mesaj / Talimat:
                </label>
                <input
                  type="text"
                  placeholder="Örn: Bu tarihteki irsaliye koçanlarını kontrol edip sisteme giriniz."
                  value={manuelEksikMesaj}
                  onChange={(e) => setManuelEksikMesaj(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setYeniEksikModalAcik(false)}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 transition active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>SAHA ŞEFİNE İLET</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
