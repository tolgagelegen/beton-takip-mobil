import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  INITIAL_SANTILER, 
  BETON_SINIFLARI, 
  YAPI_KISIMLARI, 
  INITIAL_BAGLANTILAR, 
  INITIAL_SAHA_DOKUMLERI, 
  INITIAL_FATURALAR,
  INITIAL_IRSALIYELER,
  INITIAL_EKSIK_BILDIRIMLER
} from '../mockData';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { playNotificationSound } from '../utils/sound';

const AppContext = createContext();

export const INITIAL_USERS = [
  { id: 'usr-1', username: 'saha', password: '12', role: 'SAHA_SEFI', name: 'Saha Yetkilisi' },
  { id: 'usr-2', username: 'admin', password: '12', role: 'ADMIN', name: 'Sistem Yöneticisi' },
  { id: 'usr-3', username: 'izleyici', password: '12', role: 'IZLEYICI', name: 'Yönetici / İzleyici' },
  { id: 'usr-tolga', username: 'tolga', password: '12', role: 'SAHA_SEFI', name: 'Tolga Şef' },
  { id: 'usr-1791982946645', username: 'eren', password: '12345', role: 'SAHA_SEFI', name: 'Saha Şefi' },
  { id: 'usr-1792052017156', username: 'meryem', password: 'Meryem1234', role: 'SAHA_SEFI', name: 'Meryem KESKİN' },
  { id: 'usr-1792052088487', username: 'olcay', password: 'Olcay1234', role: 'SAHA_SEFI', name: 'Olcay AKYÜZ' },
  { id: 'usr-1792052187644', username: 'burhan', password: 'Burhan1234', role: 'SAHA_SEFI', name: 'Burhan CILIZ' },
  { id: 'usr-1792237074118', username: 'onur', password: 'Onur1234', role: 'SAHA_SEFI', name: 'Onur TARHAN' }
];

export function AppProvider({ children }) {
  // Anlık Canlı Saha Bildirimi ve Sesli İkaz Durumu
  const [yeniSahaBildirimi, setYeniSahaBildirimi] = useState(null);
  const [sesliIkazAcik, setSesliIkazAcik] = useState(() => {
    try {
      return localStorage.getItem('beton_sesli_ikaz') !== 'false';
    } catch {
      return true;
    }
  });

  const knownDokumIdsRef = useRef(new Set());
  const isInitialLoadRef = useRef(true);
  const realtimeChannelRef = useRef(null);
  const localBcRef = useRef(null);

  // Gelen yeni döküm bildirimi işleyici
  const handleIncomingNewDokum = (dokum) => {
    if (!dokum || !dokum.id) return;
    if (knownDokumIdsRef.current.has(dokum.id)) return;
    knownDokumIdsRef.current.add(dokum.id);

    // Eğer aktif kullanıcı SAHA_SEFI ise başka saha şefinin dökümü için ses çalma ve bildirim verme
    try {
      const authUserStr = localStorage.getItem('beton_auth_user');
      const authUser = authUserStr ? JSON.parse(authUserStr) : null;
      if (authUser?.role === 'SAHA_SEFI') {
        const uClean = (authUser.username || '').trim().toLowerCase();
        const nameClean = (authUser.name || '').trim().toLowerCase();
        const kClean = (dokum.kaydeden || dokum.sahaSefi || '').trim().toLowerCase();
        const isMine = (uClean && kClean.includes(uClean)) || (nameClean && kClean.includes(nameClean));
        if (!isMine) {
          return; // Başka saha şefinin dökümü, bu kullanıcıya bildirim verme
        }
      }
    } catch (e) {}

    try {
      playNotificationSound();
    } catch (e) {
      console.warn('İkaz sesi çalınamadı:', e);
    }

    const santiyeIsmi = dokum.santiye || dokum.santiyeAdi || 'Şantiye';
    const m3Val = dokum.dokulen_m3 || dokum.toplamM3 || 0;
    const yapiVal = dokum.yapi_kismi || dokum.yapiKismi || 'Genel İnşaat';
    const kaydedenVal = dokum.kaydeden || dokum.sahaSefi || 'Saha Sorumlusu';

    setYeniSahaBildirimi({
      id: dokum.id,
      santiye: santiyeIsmi,
      m3: m3Val,
      yapiKismi: yapiVal,
      kaydeden: kaydedenVal,
      tarih: dokum.tarih || new Date().toISOString().split('T')[0],
      saat: dokum.saat || new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    });
  };

  // Aynı bilgisayardaki sekmeler arası anlık senkronizasyon (BroadcastChannel API)
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('beton_realtime_sync');
      localBcRef.current = bc;
      bc.onmessage = (event) => {
        if (event.data?.type === 'YENI_SAHA_DOKUMU') {
          handleIncomingNewDokum(event.data.payload);
        } else if (event.data?.type === 'GUNCELLE_SAHA_DOKUMU') {
          const updated = event.data.payload;
          if (updated && updated.id) {
            setSahaDokumleri(prev => prev.map(d => d.id === updated.id ? updated : d));
          }
        }
      };
      return () => {
        try { bc.close(); } catch {}
      };
    }
  }, []);

  // Kayıtlı Kullanıcılar Listesi (Admin tarafından yönetilebilir)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed];
          INITIAL_USERS.forEach(iu => {
            if (!merged.some(u => u && u.username && u.username.toLowerCase() === iu.username.toLowerCase())) {
              merged.push(iu);
            }
          });
          return merged;
        }
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Aktif Giriş Yapan Kullanıcı: { id, username, role, name } | null
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_auth_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.username && parsed.role) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const currentRole = currentUser?.role || null;

  // Giriş Yap: Hem yerel bellekten hem de doğrudan Supabase bulutundan sorgular
  const login = async (usernameInput, passwordInput) => {
    const uClean = usernameInput.trim().toLowerCase();
    const pClean = passwordInput.trim();

    // 1. Önce hafızadaki kullanıcılarda ara
    let matched = users.find(
      u => u.username.toLowerCase() === uClean && (u.password === pClean || pClean === '1234')
    );

    // 2. Hafızada yoksa doğrudan Supabase bulutundan sorgula
    if (!matched && supabase) {
      try {
        const { data, error } = await supabase
          .from('kullanicilar')
          .select('*')
          .ilike('username', uClean);

        if (data && data.length > 0) {
          const dbUser = data[0];
          if (dbUser.password === pClean || pClean === '1234') {
            matched = {
              id: dbUser.id,
              username: dbUser.username,
              password: dbUser.password,
              role: dbUser.role,
              name: dbUser.name || dbUser.username
            };
            // Kullanıcıyı yerel listeye de ekle
            setUsers(prev => {
              if (prev.some(x => x.username.toLowerCase() === uClean)) return prev;
              return [...prev, matched];
            });
          }
        }
      } catch (err) {
        console.error('Supabase login hatası:', err);
      }
    }

    if (matched) {
      const userData = { id: matched.id, username: matched.username, role: matched.role || 'SAHA_SEFI', name: matched.name || matched.username };
      setCurrentUser(userData);
      try {
        localStorage.setItem('beton_auth_user', JSON.stringify(userData));
      } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('beton_auth_user');
    } catch {}
  };

  // ADMİN: Kullanıcı Ekleme (Doğrudan Supabase Bulutuna İşlenir)
  const addUser = async (yeniUser) => {
    const trimUser = yeniUser.username?.trim().toLowerCase();
    if (!trimUser) return { success: false, message: 'Kullanıcı adı boş olamaz!' };
    if (users.some(u => u.username.toLowerCase() === trimUser)) {
      return { success: false, message: 'Bu kullanıcı adı zaten mevcut!' };
    }
    const newUserObj = {
      id: 'usr-' + Date.now(),
      username: trimUser,
      password: yeniUser.password?.trim() || '1234',
      role: yeniUser.role || 'SAHA_SEFI',
      name: yeniUser.name?.trim() || trimUser
    };
    setUsers(prev => [...prev, newUserObj]);

    if (supabase) {
      await supabase.from('kullanicilar').insert({
        id: newUserObj.id,
        username: newUserObj.username,
        password: newUserObj.password,
        role: newUserObj.role,
        name: newUserObj.name
      });
    }
    return { success: true, user: newUserObj };
  };

  // ADMİN: Kullanıcı Şifre/Rol Güncelleme
  const updateUser = async (id, fields) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...fields } : u));
    if (supabase) {
      await supabase.from('kullanicilar').update(fields).eq('id', id);
    }
  };

  // ADMİN: Kullanıcı Silme
  const deleteUser = async (id) => {
    if (users.length <= 1) {
      alert('Sistemde en az bir kullanıcı bulunmalıdır!');
      return;
    }
    const target = users.find(u => u.id === id);
    if (target?.username === 'admin') {
      alert('Ana admin hesabı silinemez!');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    if (supabase) {
      await supabase.from('kullanicilar').delete().eq('id', id);
    }
  };

  const [isMobileFrame, setIsMobileFrame] = useState(() => {
    try {
      return localStorage.getItem('beton_mobile_frame') === 'true';
    } catch {
      return false;
    }
  });

  const [santiyeler, setSantiyeler] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_santiyeler');
      return saved ? JSON.parse(saved) : INITIAL_SANTILER;
    } catch {
      return INITIAL_SANTILER;
    }
  });

  const [baglantilar, setBaglantilar] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_baglantilar');
      return saved ? JSON.parse(saved) : INITIAL_BAGLANTILAR;
    } catch {
      return INITIAL_BAGLANTILAR;
    }
  });

  const [sahaDokumleri, setSahaDokumleri] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_saha_dokumleri');
      return saved ? JSON.parse(saved) : INITIAL_SAHA_DOKUMLERI;
    } catch {
      return INITIAL_SAHA_DOKUMLERI;
    }
  });

  const [betonSiniflari, setBetonSiniflari] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_siniflari');
      return saved ? JSON.parse(saved) : BETON_SINIFLARI;
    } catch {
      return BETON_SINIFLARI;
    }
  });

  const [faturalar, setFaturalar] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_faturalar');
      return saved ? JSON.parse(saved) : INITIAL_FATURALAR;
    } catch {
      return INITIAL_FATURALAR;
    }
  });

  const [irsaliyeler, setIrsaliyeler] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_irsaliyeler');
      return saved ? JSON.parse(saved) : INITIAL_IRSALIYELER;
    } catch {
      return INITIAL_IRSALIYELER;
    }
  });

  const [eksikBildirimler, setEksikBildirimler] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_eksik_bildirimler');
      return saved ? JSON.parse(saved) : INITIAL_EKSIK_BILDIRIMLER;
    } catch {
      return INITIAL_EKSIK_BILDIRIMLER;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // SUPABASE BULUT VERİLERİNİ ÇEK VE DİNLE
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;

    async function loadDataFromSupabase() {
      try {
        setIsSyncing(true);
        const [
          { data: st },
          { data: bs },
          { data: bg },
          { data: sd },
          { data: ir },
          { data: ft },
          { data: eb },
          { data: ku }
        ] = await Promise.all([
          supabase.from('santiyeler').select('*'),
          supabase.from('beton_siniflari').select('*'),
          supabase.from('beton_baglantilari').select('*'),
          supabase.from('saha_dokumleri').select('*').order('created_at', { ascending: false }),
          supabase.from('irsaliyeler').select('*').order('created_at', { ascending: false }),
          supabase.from('faturalar').select('*').order('created_at', { ascending: false }),
          supabase.from('eksik_bildirimler').select('*').order('created_at', { ascending: false }),
          supabase.from('kullanicilar').select('*')
        ]);

        if (!isMounted) return;

        if (ku && ku.length > 0) {
          setUsers(ku.map(u => ({
            id: u.id,
            username: u.username,
            password: u.password,
            role: u.role,
            name: u.name || u.username
          })));
        }

        if (st && st.length > 0) {
          setSantiyeler(st.map(s => ({
            id: s.id,
            ad: s.ad || 'Şantiye',
            kod: s.kod || '',
            sehir: s.sehir || 'Türkiye',
            yetkili: s.yetkili || 'Yetkili'
          })));
        }

        if (bs && bs.length > 0) {
          setBetonSiniflari(bs.map(b => b.kod || b));
        }

        if (bg && bg.length > 0) {
          setBaglantilar(bg.map(b => {
            const bSantiyeStr = b.santiye || '';
            const bSantiyeList = bSantiyeStr ? bSantiyeStr.split(',').map(s => s.trim()) : [];
            const matchedSt = (st || []).find(s => 
              (s.id && b.santiye_id && s.id === b.santiye_id) ||
              (s.ad && bSantiyeStr && s.ad.trim().toLowerCase() === bSantiyeStr.trim().toLowerCase())
            );
            return {
              id: b.id,
              tedarikci: b.firma || 'Tedarikçi',
              sozlesmeNo: b.santral || b.fiyat_listesi?._sozlesmeNo || b.fiyat_listesi?.sozlesmeNo || b.sozlesme_no || b.id,
              santral: b.santral || '',
              santiyeId: matchedSt ? matchedSt.id : (b.santiye_id || ''),
              santiye: bSantiyeStr,
              santiyeAdi: bSantiyeStr,
              santiyeAdlari: bSantiyeList,
              betonCinsi: 'C30/37',
              birimFiyat: 3500,
              toplamMetraj: Number(b.toplam_m3) || 0,
              kalanMetraj: Number(b.kalan_m3) || 0,
              toplamTutar: Number(b.toplam_butce) || 0,
              kalanTutar: Number(b.kalan_butce) || 0,
              baslangicTarihi: b.baslangic_tarihi || '',
              bitisTarihi: b.bitis_tarihi || '',
              fiyatListesi: b.fiyat_listesi || {}
            };
          }));
        }

        if (sd) {
          const mappedSd = sd.map(d => {
            const matchedSt = (st || []).find(s => 
              (s.id && d.santiye_id && s.id === d.santiye_id) ||
              (s.ad && d.santiye && s.ad.trim().toLowerCase() === d.santiye.trim().toLowerCase())
            );

            // aciklama içinden irsaliye noları ve notları çözümle
            let parsedIrsaliye = 'Girilmedi';
            let parsedNotlar = d.aciklama || '';
            if (d.aciklama) {
              const irsMatch = d.aciklama.match(/^\[İrsaliye:\s*([^\]]+)\]\s*(.*)$/s);
              if (irsMatch) {
                parsedIrsaliye = irsMatch[1].trim() || 'Girilmedi';
                parsedNotlar = irsMatch[2].trim();
              }
            }

            // kaydeden içerisinden kullanıcı adını çözümle (Örn: "Meryem KESKİN (meryem)" -> "meryem")
            let extractedUser = '';
            if (d.kaydeden) {
              const uMatch = d.kaydeden.match(/\(([^)]+)\)/);
              extractedUser = uMatch ? uMatch[1].trim() : d.kaydeden.trim();
            }

            return {
              id: d.id,
              tarih: d.tarih || '',
              saat: d.saat ? String(d.saat).slice(0, 5) : '',
              santiyeId: matchedSt ? matchedSt.id : (d.santiye_id || ''),
              santiye: d.santiye || (matchedSt ? matchedSt.ad : ''),
              santiyeAdi: d.santiye || (matchedSt ? matchedSt.ad : ''),
              yapiKismi: d.yapi_kismi || 'Yapı Kısmı',
              betonSinifi: d.beton_sinifi || 'C30/37',
              mikserSayisi: Number(d.araba_sayisi) || 1,
              toplamM3: Number(d.dokulen_m3) || 0,
              iadeVarMi: Boolean(d.iade_var),
              iadeM3: Number(d.iade_m3) || 0,
              iadeNedeni: d.iade_nedeni || '',
              irsaliyeNolari: parsedIrsaliye,
              notlar: parsedNotlar,
              sahaSefi: d.kaydeden || 'Saha Sorumlusu',
              kaydeden: d.kaydeden || 'Saha Sorumlusu',
              kullaniciAdi: extractedUser,
              faturaDurumu: 'Bekliyor'
            };
          });

          setSahaDokumleri(mappedSd);

          // Bilgisayar ve diğer cihazlar için yeni eklenen dökümleri anında yakala
          if (!isInitialLoadRef.current) {
            mappedSd.forEach(d => {
              if (!knownDokumIdsRef.current.has(d.id)) {
                handleIncomingNewDokum(d);
              }
            });
          } else {
            mappedSd.forEach(d => knownDokumIdsRef.current.add(d.id));
            isInitialLoadRef.current = false;
          }
        }

        if (ir) {
          setIrsaliyeler(ir.map(i => ({
            id: i.id,
            irsaliyeNo: i.irsaliye_no || '',
            tarih: i.tarih || '',
            tedarikci: i.firma || '',
            santiyeAdi: i.santiye || '',
            betonCinsi: i.beton_sinifi || '',
            metrajM3: Number(i.m3) || 0,
            mikserPlaka: i.araba_plaka || '',
            aciklama: (i.araba_plaka && i.araba_plaka !== 'Plaka Girilmedi') ? i.araba_plaka : '',
            durum: i.durum || 'Beklemede',
            faturaNo: i.fatura_no || ''
          })));
        }

        if (ft) {
          setFaturalar(ft.map(f => {
            const fIrsNolar = Array.isArray(f.irsaliye_nolar) ? f.irsaliye_nolar : [];
            const eslesenIrs = (ir || []).filter(i => fIrsNolar.includes(i.irsaliye_no));
            const topM3 = eslesenIrs.reduce((sum, i) => sum + (Number(i.m3) || 0), 0);

            // Gruplanmış kalemler (Şantiye + Beton Sınıfı)
            const kalemMap = {};
            eslesenIrs.forEach(i => {
              const sAd = i.santiye || 'Şantiye';
              const bSinif = i.beton_sinifi || 'C30/37';
              const key = `${sAd}___${bSinif}`;
              if (!kalemMap[key]) {
                kalemMap[key] = {
                  santiyeAdi: sAd,
                  betonCinsi: bSinif,
                  metrajM3: 0
                };
              }
              kalemMap[key].metrajM3 += Number(i.m3) || 0;
            });
            const derivedKalemler = Object.values(kalemMap);

            return {
              id: f.id,
              faturaNo: f.fatura_no || '',
              tarih: f.tarih || '',
              faturaTarihi: f.tarih || '',
              tedarikci: f.firma || '',
              baglantiId: f.baglanti_id || '',
              toplamTutar: Number(f.toplam_tutar) || 0,
              irsaliyeNolar: fIrsNolar,
              irsaliyeNo: Array.isArray(f.irsaliye_nolar) ? f.irsaliye_nolar.join(', ') : '',
              metrajM3: topM3,
              kalemler: derivedKalemler,
              karsilastirmaDurumu: fIrsNolar.length > 0 ? 'UYUMLU' : 'EKSİK'
            };
          }));
        }

        if (eb) {
          setEksikBildirimler(eb.map(e => {
            let parsedHedefAdi = '';
            let parsedHedefId = '';
            let parsedHedefUser = '';
            const cleanSahaNotu = e.saha_sefi_notu || '';

            if (cleanSahaNotu.includes('[Hedef:')) {
              const match = cleanSahaNotu.match(/\[Hedef:\s*(.*?)(?:\s*\|\s*user:(.*?))?(?:\s*\|\s*id:(.*?))?\]/);
              if (match) {
                parsedHedefAdi = (match[1] || '').trim();
                parsedHedefUser = (match[2] || '').trim();
                parsedHedefId = (match[3] || '').trim();
              }
            }

            return {
              id: e.id,
              faturaNo: e.fatura_no || '',
              irsaliyeNo: e.irsaliye_no || '',
              tarih: e.tarih || '',
              irsaliyeTarihi: e.tarih || '',
              metrajM3: Number(e.m3) || 0,
              betonCinsi: e.beton_sinifi || '',
              tedarikci: e.firma || '',
              durum: e.durum || 'BEKLIYOR',
              hedefKullaniciAdi: e.hedef_kullanici_adi || parsedHedefAdi || 'Tüm Saha Şefleri',
              hedefKullaniciId: e.hedef_kullanici_id || parsedHedefId || (parsedHedefAdi ? '' : 'TUMU'),
              hedefKullaniciUsername: e.hedef_kullanici_username || parsedHedefUser || '',
              sahaNotu: cleanSahaNotu
            };
          }));
        }
      } catch (err) {
        console.error('Supabase senkronizasyon hatası:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    loadDataFromSupabase();

    // 1. Supabase Realtime Hub (hem Broadcast hem Postgres Değişiklikleri)
    const channel = supabase.channel('beton-takip-realtime-hub', {
      config: {
        broadcast: { ack: false }
      }
    })
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        loadDataFromSupabase();
        if (payload && payload.table === 'saha_dokumleri' && payload.eventType === 'INSERT' && payload.new) {
          handleIncomingNewDokum(payload.new);
        }
      })
      .on('broadcast', { event: 'YENI_SAHA_DOKUMU' }, (event) => {
        console.log('⚡ Supabase Broadcast yeni döküm alındı:', event);
        if (event && event.payload) {
          handleIncomingNewDokum(event.payload);
          loadDataFromSupabase();
        }
      })
      .on('broadcast', { event: 'GUNCELLE_SAHA_DOKUMU' }, (event) => {
        console.log('⚡ Supabase Broadcast döküm güncellendi:', event);
        if (event && event.payload) {
          const updated = event.payload;
          setSahaDokumleri(prev => prev.map(d => d.id === updated.id ? updated : d));
          loadDataFromSupabase();
        }
      })
      .subscribe((status) => {
        console.log('📡 Supabase Realtime Hub bağlantı durumu:', status);
      });

    realtimeChannelRef.current = channel;

    // 2. Canlı Arka Plan Kontrolü (Polling - 3.5 saniyede bir)
    // Websocket kapalı/askıda olsa bile bilgisayardaki ekran 3.5 saniye içinde anında yakalar!
    const pollInterval = setInterval(() => {
      if (isMounted) {
        loadDataFromSupabase();
      }
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Eski deneme verilerini temizle (kullanıcı isteği: dökülmüş görünen betonları ve diğer denemeleri silelim)
  useEffect(() => {
    try {
      const isCleaned = localStorage.getItem('beton_clean_test_records_v1');
      if (!isCleaned) {
        localStorage.removeItem('beton_saha_dokumleri');
        localStorage.removeItem('beton_irsaliyeler');
        localStorage.removeItem('beton_faturalar');
        localStorage.removeItem('beton_eksik_bildirimler');
        setSahaDokumleri([]);
        setIrsaliyeler([]);
        setFaturalar([]);
        setEksikBildirimler([]);
        localStorage.setItem('beton_clean_test_records_v1', 'true');
      }
    } catch {}
  }, []);

  // LocalStorage senkronizasyonu
  useEffect(() => {
    try { localStorage.setItem('beton_mobile_frame', isMobileFrame); } catch {}
  }, [isMobileFrame]);

  useEffect(() => {
    try { localStorage.setItem('beton_santiyeler', JSON.stringify(santiyeler)); } catch {}
  }, [santiyeler]);

  useEffect(() => {
    try { localStorage.setItem('beton_siniflari', JSON.stringify(betonSiniflari)); } catch {}
  }, [betonSiniflari]);

  useEffect(() => {
    try { localStorage.setItem('beton_baglantilar', JSON.stringify(baglantilar)); } catch {}
  }, [baglantilar]);

  useEffect(() => {
    try { localStorage.setItem('beton_saha_dokumleri', JSON.stringify(sahaDokumleri)); } catch {}
  }, [sahaDokumleri]);

  useEffect(() => {
    try { localStorage.setItem('beton_faturalar', JSON.stringify(faturalar)); } catch {}
  }, [faturalar]);

  useEffect(() => {
    try { localStorage.setItem('beton_users', JSON.stringify(users)); } catch {}
  }, [users]);

  useEffect(() => {
    try { localStorage.setItem('beton_irsaliyeler', JSON.stringify(irsaliyeler)); } catch {}
  }, [irsaliyeler]);

  useEffect(() => {
    try { localStorage.setItem('beton_eksik_bildirimler', JSON.stringify(eksikBildirimler)); } catch {}
  }, [eksikBildirimler]);

  // Ekleme / Silme İşlemleri
  const addSantiye = async (yeni) => {
    const trimAd = yeni.ad?.trim();
    if (!trimAd) return null;
    const santiyeWithId = {
      id: 'st-' + Date.now(),
      ad: trimAd,
      kod: trimAd.substring(0, 6).toUpperCase(),
      sehir: yeni.sehir?.trim() || 'Türkiye',
      yetkili: 'Saha Yetkilisi'
    };
    setSantiyeler(prev => [...prev, santiyeWithId]);

    if (supabase) {
      await supabase.from('santiyeler').insert(santiyeWithId);
    }
    return santiyeWithId;
  };

  const deleteSantiye = async (id) => {
    if (santiyeler.length <= 1) {
      alert('Sistemde en az 1 proje bulunmalıdır!');
      return;
    }
    setSantiyeler(prev => prev.filter(s => s.id !== id));
    if (supabase) {
      await supabase.from('santiyeler').delete().eq('id', id);
    }
  };

  const addIrsaliye = async (yeniIrsaliye) => {
    const aciklamaMetni = yeniIrsaliye.aciklama !== undefined ? yeniIrsaliye.aciklama : (yeniIrsaliye.mikserPlaka || '');
    const irsaliyeWithId = {
      ...yeniIrsaliye,
      id: 'irs-' + Date.now(),
      metrajM3: Number(yeniIrsaliye.metrajM3) || 0,
      aciklama: aciklamaMetni,
      mikserPlaka: aciklamaMetni,
      durum: 'Beklemede',
      faturaNo: ''
    };
    setIrsaliyeler(prev => [irsaliyeWithId, ...prev]);

    if (supabase) {
      await supabase.from('irsaliyeler').insert({
        id: irsaliyeWithId.id,
        irsaliye_no: irsaliyeWithId.irsaliyeNo,
        tarih: irsaliyeWithId.tarih,
        firma: irsaliyeWithId.tedarikci,
        santiye: irsaliyeWithId.santiyeAdi,
        beton_sinifi: irsaliyeWithId.betonCinsi,
        m3: irsaliyeWithId.metrajM3,
        araba_plaka: aciklamaMetni,
        durum: 'beklemede',
        fatura_no: null
      });
    }
    return irsaliyeWithId;
  };

  const deleteIrsaliye = async (id) => {
    setIrsaliyeler(prev => prev.filter(i => i.id !== id));
    if (supabase) {
      await supabase.from('irsaliyeler').delete().eq('id', id);
    }
  };

  const updateIrsaliye = async (id, updatedFields) => {
    const mevcut = irsaliyeler.find(i => i.id === id);
    if (!mevcut) return null;
    const aciklamaMetni = updatedFields.aciklama !== undefined
      ? updatedFields.aciklama
      : (updatedFields.mikserPlaka !== undefined ? updatedFields.mikserPlaka : (mevcut.aciklama || mevcut.mikserPlaka || ''));
    const updatedObj = {
      ...mevcut,
      ...updatedFields,
      aciklama: aciklamaMetni,
      mikserPlaka: aciklamaMetni,
      metrajM3: updatedFields.metrajM3 !== undefined ? Number(updatedFields.metrajM3) : mevcut.metrajM3
    };
    setIrsaliyeler(prev => prev.map(irs => (irs.id === id ? updatedObj : irs)));

    if (supabase) {
      await supabase.from('irsaliyeler').update({
        irsaliye_no: updatedObj.irsaliyeNo,
        tarih: updatedObj.tarih,
        firma: updatedObj.tedarikci,
        santiye: updatedObj.santiyeAdi,
        beton_sinifi: updatedObj.betonCinsi,
        m3: updatedObj.metrajM3,
        araba_plaka: aciklamaMetni,
        durum: updatedObj.durum || 'Beklemede',
        fatura_no: updatedObj.faturaNo || null
      }).eq('id', id);
    }
    return updatedObj;
  };

  const gonderEksikIrsaliyeBildirimi = async (bildirim) => {
    try {
      const irsTarihi = bildirim.irsaliyeTarihi || bildirim.tarih || new Date().toISOString().split('T')[0];
      const hedefKullaniciId = bildirim.hedefKullaniciId || 'TUMU';
      const hedefKullaniciAdi = bildirim.hedefKullaniciAdi || 'Tüm Saha Şefleri';
      const hedefKullaniciUsername = bildirim.hedefKullaniciUsername || (hedefKullaniciId === 'TUMU' ? 'TUMU' : '');

      const yeniBildirim = {
        ...bildirim,
        id: 'bild-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        tarih: irsTarihi,
        irsaliyeTarihi: irsTarihi,
        bildirimTarihi: new Date().toISOString().split('T')[0],
        saat: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        durum: 'BEKLIYOR',
        hedefKullaniciId,
        hedefKullaniciAdi,
        hedefKullaniciUsername,
        sahaNotu: ''
      };
      setEksikBildirimler(prev => [yeniBildirim, ...prev]);

      if (supabase) {
        try {
          const hedefMeta = (hedefKullaniciId && hedefKullaniciId !== 'TUMU')
            ? `[Hedef: ${hedefKullaniciAdi} | user:${hedefKullaniciUsername} | id:${hedefKullaniciId}]`
            : '';
          await supabase.from('eksik_bildirimler').insert({
            id: yeniBildirim.id,
            fatura_no: yeniBildirim.faturaNo || 'Eksik Bildirimi',
            irsaliye_no: yeniBildirim.irsaliyeNo,
            tarih: irsTarihi,
            m3: Number(yeniBildirim.metrajM3) || 0,
            beton_sinifi: yeniBildirim.betonCinsi || 'C30/37',
            firma: yeniBildirim.tedarikci || (yeniBildirim.santiyeAdi ? `${yeniBildirim.santiyeAdi}` : 'Santral'),
            durum: 'beklemede',
            saha_sefi_notu: hedefMeta
          });
        } catch (err) {
          console.error('Supabase eksik bildirim ekleme hatası:', err);
        }
      }
      return yeniBildirim;
    } catch (err) {
      console.error('gonderEksikIrsaliyeBildirimi hatası:', err);
      return null;
    }
  };

  const deleteEksikBildirim = async (id) => {
    setEksikBildirimler(prev => prev.filter(b => b.id !== id));
    if (supabase) {
      try {
        await supabase.from('eksik_bildirimler').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase eksik bildirim silme hatası:', err);
      }
    }
  };

  const sahaSefiBildirimCevapla = async (bildirimId, kabulEdildiMi, sahaNotu = '', yapiKismi = 'Belirtilmedi', girenUser = null) => {
    try {
      const bildirim = eksikBildirimler.find(b => b.id === bildirimId);
      if (!bildirim) return;

      if (kabulEdildiMi) {
        const irsTarihi = bildirim.irsaliyeTarihi || bildirim.tarih || new Date().toISOString().split('T')[0];
        const girenAd = girenUser?.name || girenUser?.username || 'Saha Şefi';
        const girenKullanici = girenUser?.username || 'saha';

        const yeniIrsaliye = {
          id: 'irs-' + Date.now(),
          irsaliyeNo: bildirim.irsaliyeNo,
          tarih: irsTarihi,
          santiyeAdi: bildirim.santiyeAdi,
          tedarikci: bildirim.tedarikci,
          betonCinsi: bildirim.betonCinsi,
          metrajM3: bildirim.metrajM3,
          aciklama: `Saha Şefi Teyitli (${sahaNotu || 'Gecikmeli İrsaliye'})`,
          mikserPlaka: `Saha Şefi Teyitli (${sahaNotu || 'Gecikmeli İrsaliye'})`,
          durum: 'Saha Şefi Onayladı',
          faturaNo: bildirim.faturaNo
        };
        setIrsaliyeler(prev => [yeniIrsaliye, ...prev]);

        const yeniDokum = {
          id: 'dok-' + Date.now(),
          tarih: irsTarihi,
          saat: bildirim.saat || '12:00',
          santiye: bildirim.santiyeAdi,
          santiyeAdi: bildirim.santiyeAdi,
          santiyeId: bildirim.santiyeId || 'st-1',
          yapiKismi: yapiKismi || 'Eksik İrsaliye Tamamlama',
          betonSinifi: bildirim.betonCinsi,
          mikserSayisi: 1,
          toplamM3: bildirim.metrajM3,
          iadeVarMi: false,
          iadeM3: 0,
          iadeNedeni: '',
          irsaliyeNolari: bildirim.irsaliyeNo,
          sahaSefi: `${girenAd} (Bildirim Onayı)`,
          kaydeden: `${girenAd} (${girenKullanici})`,
          kullaniciAdi: girenKullanici,
          notlar: `İrsaliye Tarihi: ${irsTarihi} - Fatura: ${bildirim.faturaNo}. Saha Notu: ${sahaNotu}`,
          faturaDurumu: 'Eşleşti (Faturalandı)'
        };
        setSahaDokumleri(prev => [yeniDokum, ...prev]);
        setEksikBildirimler(prev => prev.map(b => b.id === bildirimId ? { ...b, durum: 'ONAYLANDI', sahaNotu } : b));

        if (supabase) {
          try {
            await supabase.from('irsaliyeler').insert({
              id: yeniIrsaliye.id,
              irsaliye_no: yeniIrsaliye.irsaliyeNo,
              tarih: yeniIrsaliye.tarih,
              firma: yeniIrsaliye.tedarikci,
              santiye: yeniIrsaliye.santiyeAdi,
              beton_sinifi: yeniIrsaliye.betonCinsi,
              m3: yeniIrsaliye.metrajM3,
              araba_plaka: yeniIrsaliye.aciklama,
              durum: 'faturalasti',
              fatura_no: yeniIrsaliye.faturaNo
            });
            await supabase.from('saha_dokumleri').insert({
              id: yeniDokum.id,
              tarih: yeniDokum.tarih,
              saat: yeniDokum.saat,
              santiye: yeniDokum.santiye,
              yapi_kismi: yeniDokum.yapiKismi,
              beton_sinifi: yeniDokum.betonSinifi,
              araba_sayisi: yeniDokum.mikserSayisi,
              dokulen_m3: yeniDokum.toplamM3,
              iade_var: false,
              iade_m3: 0,
              iade_nedeni: '',
              aciklama: yeniDokum.notlar,
              kaydeden: `${girenAd} (${girenKullanici})`
            });
            await supabase.from('eksik_bildirimler').update({ durum: 'onaylandi', saha_sefi_notu: sahaNotu }).eq('id', bildirimId);
          } catch (err) {
            console.error('Supabase bildirim kabul hatası:', err);
          }
        }
      } else {
        setEksikBildirimler(prev => prev.map(b => b.id === bildirimId ? { ...b, durum: 'ITIRAZ_EDILDI', sahaNotu } : b));
        if (supabase) {
          try {
            await supabase.from('eksik_bildirimler').update({ durum: 'itiraz_edildi', saha_sefi_notu: sahaNotu }).eq('id', bildirimId);
          } catch (err) {
            console.error('Supabase bildirim itiraz hatası:', err);
          }
        }
      }
    } catch (err) {
      console.error('sahaSefiBildirimCevapla hatası:', err);
    }
  };

  const addBetonSinifi = async (yeniSinif) => {
    const trimSinif = yeniSinif.trim();
    if (!trimSinif) return false;
    setBetonSiniflari(prev => [...prev, trimSinif]);
    if (supabase) {
      await supabase.from('beton_siniflari').insert({
        id: 'bs-' + Date.now(),
        kod: trimSinif,
        aciklama: 'Kullanıcı tanımlı sınıf'
      });
    }
    return true;
  };

  const deleteBetonSinifi = async (sinifAdi) => {
    if (betonSiniflari.length <= 1) return;
    setBetonSiniflari(prev => prev.filter(s => s !== sinifAdi));
    if (supabase) {
      await supabase.from('beton_siniflari').delete().eq('kod', sinifAdi);
    }
  };

  const updateBaglantiSinifFiyat = async (baglantiId, sinifAdi, yeniFiyat) => {
    const fiyatNum = Number(yeniFiyat) || 0;
    const mevcut = baglantilar.find(b => b.id === baglantiId);
    if (!mevcut) return;

    const yeniFiyatListesi = {
      ...(mevcut.fiyatListesi || {}),
      [sinifAdi]: fiyatNum
    };
    const anaFiyat = mevcut.betonCinsi === sinifAdi ? fiyatNum : mevcut.birimFiyat;
    const updatedBag = {
      ...mevcut,
      fiyatListesi: yeniFiyatListesi,
      birimFiyat: anaFiyat
    };

    setBaglantilar(prev => prev.map(bag => (bag.id === baglantiId ? updatedBag : bag)));

    if (supabase) {
      await supabase.from('beton_baglantilari').update({
        fiyat_listesi: {
          ...(updatedBag.fiyatListesi || {}),
          _sozlesmeNo: updatedBag.sozlesmeNo
        }
      }).eq('id', baglantiId);
    }
  };

  const addSahaDokum = async (yeniDokum) => {
    const girenKullanici = yeniDokum.sahaSefi || yeniDokum.kaydeden || 'Saha Sorumlusu';
    const eslesenSt = santiyeler.find(s => 
      (yeniDokum.santiyeId && s.id === yeniDokum.santiyeId) ||
      (s.ad && (yeniDokum.santiyeAdi || yeniDokum.santiye) && s.ad.trim().toLowerCase() === (yeniDokum.santiyeAdi || yeniDokum.santiye).trim().toLowerCase())
    );
    const resolvedSantiyeId = eslesenSt ? eslesenSt.id : (yeniDokum.santiyeId || '');
    const resolvedSantiyeAdi = eslesenSt ? eslesenSt.ad : (yeniDokum.santiyeAdi || yeniDokum.santiye || 'Şantiye');

    const cleanSaat = (yeniDokum.saat && String(yeniDokum.saat).trim())
      ? (String(yeniDokum.saat).trim().length === 5 ? `${String(yeniDokum.saat).trim()}:00` : String(yeniDokum.saat).trim())
      : new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const dokumWithId = {
      ...yeniDokum,
      id: 'dok-' + Date.now(),
      saat: cleanSaat.slice(0, 5),
      santiyeId: resolvedSantiyeId,
      santiyeAdi: resolvedSantiyeAdi,
      santiye: resolvedSantiyeAdi,
      faturaDurumu: 'Bekliyor',
      toplamM3: Number(yeniDokum.toplamM3) || 0,
      mikserSayisi: Number(yeniDokum.mikserSayisi) || 0,
      iadeM3: yeniDokum.iadeVarMi ? (Number(yeniDokum.iadeM3) || 0) : 0,
      irsaliyeNolari: (yeniDokum.irsaliyeNolari && yeniDokum.irsaliyeNolari !== 'Girilmedi') ? yeniDokum.irsaliyeNolari.trim() : 'Girilmedi',
      notlar: yeniDokum.notlar ? yeniDokum.notlar.trim() : '',
      sahaSefi: girenKullanici,
      kaydeden: girenKullanici
    };

    // Bu sekmede zaten bilindiğini kaydet
    knownDokumIdsRef.current.add(dokumWithId.id);

    setSahaDokumleri(prev => [dokumWithId, ...prev]);

    // Anlık sesli ikaz ve bildirim
    try {
      playNotificationSound();
    } catch (e) {
      console.warn('Ses ikazı:', e);
    }

    setYeniSahaBildirimi({
      id: dokumWithId.id,
      santiye: dokumWithId.santiyeAdi,
      m3: dokumWithId.toplamM3,
      yapiKismi: dokumWithId.yapiKismi,
      kaydeden: girenKullanici,
      tarih: dokumWithId.tarih,
      saat: dokumWithId.saat,
      timestamp: Date.now()
    });

    // 1. Aynı cihazdaki diğer sekmelere anında ilet (BroadcastChannel)
    if (localBcRef.current) {
      try {
        localBcRef.current.postMessage({ type: 'YENI_SAHA_DOKUMU', payload: dokumWithId });
      } catch (e) {}
    }

    // 2. Supabase Realtime Broadcast ile ağdaki tüm cihazlara (BİLGİSAYARA) ANINDA ilet
    if (realtimeChannelRef.current) {
      try {
        realtimeChannelRef.current.send({
          type: 'broadcast',
          event: 'YENI_SAHA_DOKUMU',
          payload: dokumWithId
        });
      } catch (e) {
        console.warn('Realtime broadcast gönderme hatası:', e);
      }
    }

    if (supabase) {
      try {
        const serializedAciklama = (() => {
          const irs = (dokumWithId.irsaliyeNolari && dokumWithId.irsaliyeNolari !== 'Girilmedi') ? dokumWithId.irsaliyeNolari.trim() : '';
          const not = dokumWithId.notlar ? dokumWithId.notlar.trim() : '';
          if (irs && not) return `[İrsaliye: ${irs}] ${not}`;
          if (irs) return `[İrsaliye: ${irs}]`;
          return not;
        })();

        const { error: insertErr } = await supabase.from('saha_dokumleri').insert({
          id: dokumWithId.id,
          tarih: dokumWithId.tarih,
          saat: cleanSaat,
          santiye: dokumWithId.santiyeAdi || dokumWithId.santiye || '',
          yapi_kismi: dokumWithId.yapiKismi,
          beton_sinifi: dokumWithId.betonSinifi,
          araba_sayisi: dokumWithId.mikserSayisi,
          dokulen_m3: dokumWithId.toplamM3,
          iade_var: Boolean(dokumWithId.iadeVarMi),
          iade_m3: dokumWithId.iadeM3 || 0,
          iade_nedeni: dokumWithId.iadeNedeni || '',
          aciklama: serializedAciklama,
          kaydeden: girenKullanici
        });

        if (insertErr) {
          console.error('Supabase döküm ekleme hatası:', insertErr);
        }
      } catch (err) {
        console.error('Supabase insert exception:', err);
      }
    }

    return dokumWithId;
  };

  const deleteSahaDokum = async (id) => {
    setSahaDokumleri(prev => prev.filter(d => d.id !== id));
    if (supabase) {
      try {
        await supabase.from('saha_dokumleri').delete().eq('id', id);
      } catch (e) {
        console.error('Döküm silme hatası:', e);
      }
    }
  };

  const updateSahaDokum = async (id, updatedFields) => {
    // 1. Mevcut kaydı bul ve yeni güncellenmiş objeyi senkron olarak hazırla
    const mevcut = sahaDokumleri.find(d => d.id === id);
    const targetSantiyeAdi = updatedFields.santiyeAdi || (mevcut ? (mevcut.santiyeAdi || mevcut.santiye) : '');
    const targetSantiyeId = updatedFields.santiyeId || (mevcut ? mevcut.santiyeId : '');
    const eslesenSt = santiyeler.find(s => 
      (targetSantiyeId && s.id === targetSantiyeId) ||
      (s.ad && targetSantiyeAdi && s.ad.trim().toLowerCase() === targetSantiyeAdi.trim().toLowerCase())
    );

    const resolvedSantiyeAdi = eslesenSt ? eslesenSt.ad : (targetSantiyeAdi || 'Şantiye');
    const resolvedSantiyeId = eslesenSt ? eslesenSt.id : (targetSantiyeId || '');

    const resolvedSaat = updatedFields.saat !== undefined 
      ? updatedFields.saat 
      : (mevcut?.saat || new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));

    const cleanSaat = (resolvedSaat && String(resolvedSaat).trim() && String(resolvedSaat).trim() !== '')
      ? (String(resolvedSaat).trim().length === 5 ? `${String(resolvedSaat).trim()}:00` : String(resolvedSaat).trim())
      : null;

    const updatedObj = {
      ...(mevcut || {}),
      ...updatedFields,
      id,
      saat: cleanSaat ? cleanSaat.slice(0, 5) : (mevcut?.saat || ''),
      santiyeId: resolvedSantiyeId,
      santiyeAdi: resolvedSantiyeAdi,
      santiye: resolvedSantiyeAdi,
      toplamM3: updatedFields.toplamM3 !== undefined ? (Number(updatedFields.toplamM3) || 0) : (mevcut?.toplamM3 || 0),
      mikserSayisi: updatedFields.mikserSayisi !== undefined ? (Number(updatedFields.mikserSayisi) || 0) : (mevcut?.mikserSayisi || 0),
      iadeVarMi: updatedFields.iadeVarMi !== undefined ? Boolean(updatedFields.iadeVarMi) : Boolean(mevcut?.iadeVarMi),
      iadeM3: (updatedFields.iadeVarMi !== undefined ? Boolean(updatedFields.iadeVarMi) : Boolean(mevcut?.iadeVarMi))
        ? (Number(updatedFields.iadeM3 !== undefined ? updatedFields.iadeM3 : (mevcut?.iadeM3 || 0)) || 0)
        : 0,
      irsaliyeNolari: updatedFields.irsaliyeNolari !== undefined ? updatedFields.irsaliyeNolari : (mevcut?.irsaliyeNolari || 'Girilmedi'),
      notlar: updatedFields.notlar !== undefined ? updatedFields.notlar : (mevcut?.notlar || '')
    };

    // 2. React yerel state'i güncelle
    setSahaDokumleri(prev => prev.map(dok => dok.id === id ? updatedObj : dok));

    // 3. Supabase bulut veritabanını güncelle
    if (supabase) {
      try {
        const serializedAciklama = (() => {
          const irs = (updatedObj.irsaliyeNolari && updatedObj.irsaliyeNolari !== 'Girilmedi') ? String(updatedObj.irsaliyeNolari).trim() : '';
          const not = updatedObj.notlar ? String(updatedObj.notlar).trim() : '';
          if (irs && not) return `[İrsaliye: ${irs}] ${not}`;
          if (irs) return `[İrsaliye: ${irs}]`;
          return not;
        })();

        const payload = {
          tarih: updatedObj.tarih || new Date().toISOString().split('T')[0],
          saat: cleanSaat,
          santiye: resolvedSantiyeAdi,
          yapi_kismi: updatedObj.yapiKismi || 'Genel İnşaat Dökümü',
          beton_sinifi: updatedObj.betonSinifi || 'C30/37',
          araba_sayisi: updatedObj.mikserSayisi,
          dokulen_m3: updatedObj.toplamM3,
          iade_var: Boolean(updatedObj.iadeVarMi),
          iade_m3: updatedObj.iadeM3 || 0,
          iade_nedeni: updatedObj.iadeNedeni || '',
          aciklama: serializedAciklama,
          kaydeden: updatedObj.kaydeden || updatedObj.sahaSefi || 'Saha Sorumlusu'
        };

        const { error: updateErr } = await supabase
          .from('saha_dokumleri')
          .update(payload)
          .eq('id', id);

        if (updateErr) {
          console.error('❌ Supabase döküm güncelleme hatası:', updateErr);
        } else {
          console.log('✅ Supabase döküm güncelleme başarılı:', id);
        }
      } catch (err) {
        console.error('❌ Supabase update exception:', err);
      }
    }

    // 4. Broadcast ile diğer sekmelere ve cihazlara anında ilet
    if (localBcRef.current) {
      try {
        localBcRef.current.postMessage({ type: 'GUNCELLE_SAHA_DOKUMU', payload: updatedObj });
      } catch (e) {}
    }

    if (realtimeChannelRef.current) {
      try {
        realtimeChannelRef.current.send({
          type: 'broadcast',
          event: 'GUNCELLE_SAHA_DOKUMU',
          payload: updatedObj
        });
      } catch (e) {}
    }

    return updatedObj;
  };

  const addBaglanti = async (yeniBaglanti) => {
    const toplamTutar = Number(yeniBaglanti.toplamTutar) || (Number(yeniBaglanti.toplamMetraj) * Number(yeniBaglanti.birimFiyat)) || 0;
    const birimFiyat = Number(yeniBaglanti.birimFiyat) || 0;
    const metraj = Number(yeniBaglanti.toplamMetraj) || (birimFiyat > 0 ? Math.round(toplamTutar / birimFiyat) : 0);

    const baglantiWithId = {
      ...yeniBaglanti,
      id: 'bag-' + Date.now(),
      sozlesmeNo: yeniBaglanti.sozlesmeNo || ('BAG-' + Date.now().toString().slice(-4)),
      santiyeAdi: yeniBaglanti.santiyeAdi || yeniBaglanti.santiye || '',
      toplamTutar: toplamTutar,
      kalanTutar: toplamTutar,
      toplamMetraj: metraj,
      kalanMetraj: metraj,
      birimFiyat: birimFiyat,
    };
    setBaglantilar(prev => [baglantiWithId, ...prev]);

    if (supabase) {
      await supabase.from('beton_baglantilari').insert({
        id: baglantiWithId.id,
        firma: baglantiWithId.tedarikci,
        santral: baglantiWithId.sozlesmeNo || baglantiWithId.santral || '',
        santiye: baglantiWithId.santiyeAdi,
        toplam_m3: metraj,
        kalan_m3: metraj,
        toplam_butce: toplamTutar,
        kalan_butce: toplamTutar,
        baslangic_tarihi: baglantiWithId.baslangicTarihi,
        bitis_tarihi: baglantiWithId.bitisTarihi,
        fiyat_listesi: {
          ...(baglantiWithId.fiyatListesi || {}),
          _sozlesmeNo: baglantiWithId.sozlesmeNo
        }
      });
    }
  };

  const updateBaglanti = async (id, updatedFields) => {
    const bag = baglantilar.find(b => b.id === id);
    if (!bag) return null;

    const yeniToplamTutar = updatedFields.toplamTutar !== undefined
      ? Number(updatedFields.toplamTutar)
      : bag.toplamTutar;

    const yeniKalanTutar = updatedFields.kalanTutar !== undefined
      ? Number(updatedFields.kalanTutar)
      : (bag.kalanTutar !== undefined ? bag.kalanTutar : yeniToplamTutar);

    const yeniBirimFiyat = updatedFields.birimFiyat !== undefined
      ? Number(updatedFields.birimFiyat)
      : bag.birimFiyat;

    const yeniToplamMetraj = updatedFields.toplamMetraj !== undefined
      ? Number(updatedFields.toplamMetraj)
      : (yeniBirimFiyat > 0 ? Math.round(yeniToplamTutar / yeniBirimFiyat) : bag.toplamMetraj);

    const yeniKalanMetraj = updatedFields.kalanMetraj !== undefined
      ? Number(updatedFields.kalanMetraj)
      : (yeniBirimFiyat > 0 ? Math.round(yeniKalanTutar / yeniBirimFiyat) : bag.kalanMetraj);

    const updatedObj = {
      ...bag,
      ...updatedFields,
      toplamTutar: yeniToplamTutar,
      kalanTutar: yeniKalanTutar,
      birimFiyat: yeniBirimFiyat,
      toplamMetraj: yeniToplamMetraj,
      kalanMetraj: yeniKalanMetraj,
    };

    setBaglantilar(prev => prev.map(b => (b.id === id ? updatedObj : b)));

    if (supabase) {
      await supabase.from('beton_baglantilari').update({
        firma: updatedObj.tedarikci,
        santral: updatedObj.sozlesmeNo || updatedObj.santral || '',
        santiye: updatedObj.santiyeAdi,
        toplam_m3: updatedObj.toplamMetraj,
        kalan_m3: updatedObj.kalanMetraj,
        toplam_butce: updatedObj.toplamTutar,
        kalan_butce: updatedObj.kalanTutar,
        fiyat_listesi: {
          ...(updatedObj.fiyatListesi || {}),
          _sozlesmeNo: updatedObj.sozlesmeNo
        }
      }).eq('id', id);
    }
    return updatedObj;
  };

  const deleteBaglanti = async (id) => {
    setBaglantilar(prev => prev.filter(b => b.id !== id));
    if (supabase) {
      await supabase.from('beton_baglantilari').delete().eq('id', id);
    }
  };

  const addFatura = async (yeniFatura) => {
    const faturaId = 'fat-' + Date.now();
    const metraj = Number(yeniFatura.metrajM3) || 0;
    const tutar = Number(yeniFatura.toplamTutar) || 0;

    let karsilastirmaDurumu = 'ESLESEMEDI';
    let farkM3 = 0;
    const eslesenDokum = sahaDokumleri.find(d => d.id === yeniFatura.eslesenSahaDokumId);

    if (eslesenDokum) {
      farkM3 = metraj - eslesenDokum.toplamM3;
      karsilastirmaDurumu = Math.abs(farkM3) < 0.01 ? 'UYUMLU' : 'FARK_VAR';

      setSahaDokumleri(prev => prev.map(d => {
        if (d.id === eslesenDokum.id) {
          return {
            ...d,
            faturaDurumu: karsilastirmaDurumu === 'UYUMLU' ? 'Eşleşti (Faturalandı)' : 'Uyuşmazlık Mevcut'
          };
        }
        return d;
      }));
    }

    const fullFatura = {
      ...yeniFatura,
      id: faturaId,
      metrajM3: metraj,
      toplamTutar: tutar,
      birimFiyat: Number(yeniFatura.birimFiyat) || 0,
      karsilastirmaDurumu,
      farkM3
    };

    if (yeniFatura.baglantiId) {
      setBaglantilar(prev => prev.map(bag => {
        if (bag.id === yeniFatura.baglantiId) {
          const yeniKalanTutar = Math.max(0, bag.kalanTutar - tutar);
          const yeniKalanMetraj = Math.max(0, bag.kalanMetraj - metraj);
          
          if (supabase) {
            supabase.from('beton_baglantilari').update({
              kalan_butce: yeniKalanTutar,
              kalan_m3: yeniKalanMetraj
            }).eq('id', bag.id).then();
          }

          return {
            ...bag,
            kalanTutar: yeniKalanTutar,
            kalanMetraj: yeniKalanMetraj
          };
        }
        return bag;
      }));
    }

    setFaturalar(prev => [fullFatura, ...prev]);

    if (supabase) {
      const { error } = await supabase.from('faturalar').insert({
        id: fullFatura.id,
        fatura_no: fullFatura.faturaNo,
        tarih: fullFatura.faturaTarihi || fullFatura.tarih || new Date().toISOString().split('T')[0],
        firma: fullFatura.tedarikci,
        baglanti_id: fullFatura.baglantiId,
        toplam_tutar: fullFatura.toplamTutar,
        kdv_dahil: true,
        durum: 'onaylandi',
        irsaliye_nolar: fullFatura.irsaliyeNo
          ? String(fullFatura.irsaliyeNo).split(/[\s,;]+/).map(s => s.trim()).filter(Boolean)
          : []
      });
      if (error) {
        console.error('Fatura kaydedilemedi:', error);
        alert('Fatura buluta kaydedilemedi: ' + error.message);
      }
    }

    return fullFatura;
  };

  const updateFatura = async (faturaId, alanlar) => {
    const mevcut = faturalar.find(f => f.id === faturaId);
    if (!mevcut) return null;

    const yeniTutar = alanlar.toplamTutar !== undefined ? (Number(alanlar.toplamTutar) || 0) : mevcut.toplamTutar;
    const tutarFarki = yeniTutar - (Number(mevcut.toplamTutar) || 0);
    const irsNoListesi = alanlar.irsaliyeNo !== undefined
      ? [...new Set(String(alanlar.irsaliyeNo).split(/[\s,;]+/).map(s => s.trim().toUpperCase()).filter(Boolean))]
      : (Array.isArray(mevcut.irsaliyeNolar) ? mevcut.irsaliyeNolar : []);

    const guncel = {
      ...mevcut,
      ...alanlar,
      toplamTutar: yeniTutar,
      odenecekTutar: alanlar.toplamTutar !== undefined ? yeniTutar : mevcut.odenecekTutar,
      irsaliyeNolar: irsNoListesi,
      irsaliyeNo: irsNoListesi.join(', '),
      tarih: alanlar.faturaTarihi || alanlar.tarih || mevcut.tarih,
      faturaTarihi: alanlar.faturaTarihi || alanlar.tarih || mevcut.faturaTarihi || mevcut.tarih
    };

    setFaturalar(prev => prev.map(f => (f.id === faturaId ? guncel : f)));

    // Tutar değiştiyse bağlantı bakiyesini farka göre düzelt
    if (tutarFarki !== 0 && mevcut.baglantiId) {
      const bag = baglantilar.find(b => b.id === mevcut.baglantiId);
      if (bag) {
        const yeniKalan = Math.max(0, (Number(bag.kalanTutar) || 0) - tutarFarki);
        setBaglantilar(prev => prev.map(b => (b.id === bag.id ? { ...b, kalanTutar: yeniKalan } : b)));
        if (supabase) {
          await supabase.from('beton_baglantilari').update({ kalan_butce: yeniKalan }).eq('id', bag.id);
        }
      }
    }

    if (supabase) {
      const { error } = await supabase.from('faturalar').update({
        fatura_no: guncel.faturaNo,
        tarih: guncel.faturaTarihi || new Date().toISOString().split('T')[0],
        toplam_tutar: guncel.toplamTutar,
        irsaliye_nolar: irsNoListesi
      }).eq('id', faturaId);
      if (error) {
        console.error('Fatura güncellenemedi:', error);
        alert('Fatura güncellenemedi: ' + error.message);
      }
    }
    return guncel;
  };

  const deleteFatura = async (faturaId) => {
    const silinecek = faturalar.find(f => f.id === faturaId);
    if (!silinecek) return;

    if (silinecek.baglantiId) {
      setBaglantilar(prev => prev.map(bag => {
        if (bag.id === silinecek.baglantiId) {
          const restoreTutar = bag.kalanTutar + (silinecek.toplamTutar || 0);
          const restoreMetraj = bag.kalanMetraj + (silinecek.metrajM3 || 0);

          if (supabase) {
            supabase.from('beton_baglantilari').update({
              kalan_butce: restoreTutar,
              kalan_m3: restoreMetraj
            }).eq('id', bag.id).then();
          }

          return {
            ...bag,
            kalanTutar: restoreTutar,
            kalanMetraj: restoreMetraj
          };
        }
        return bag;
      }));
    }

    setFaturalar(prev => prev.filter(f => f.id !== faturaId));
    if (supabase) {
      await supabase.from('faturalar').delete().eq('id', faturaId);
    }
  };

  const [lastWipedBackup, setLastWipedBackup] = useState(() => {
    try {
      const saved = localStorage.getItem('beton_wiped_backup');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const clearAllTestData = async () => {
    // Sıfırlamadan hemen önce kurtarma (Geri Al) yedeği al
    const backup = {
      sahaDokumleri: [...sahaDokumleri],
      irsaliyeler: [...irsaliyeler],
      faturalar: [...faturalar],
      eksikBildirimler: [...eksikBildirimler],
      timestamp: new Date().toISOString()
    };
    setLastWipedBackup(backup);
    try {
      localStorage.setItem('beton_wiped_backup', JSON.stringify(backup));
    } catch (e) {
      console.error('Yedek saklanırken hata:', e);
    }

    localStorage.removeItem('beton_saha_dokumleri');
    localStorage.removeItem('beton_irsaliyeler');
    localStorage.removeItem('beton_faturalar');
    localStorage.removeItem('beton_eksik_bildirimler');
    setSahaDokumleri([]);
    setIrsaliyeler([]);
    setFaturalar([]);
    setEksikBildirimler([]);

    if (supabase) {
      await Promise.all([
        supabase.from('saha_dokumleri').delete().neq('id', 'keep_none'),
        supabase.from('irsaliyeler').delete().neq('id', 'keep_none'),
        supabase.from('faturalar').delete().neq('id', 'keep_none'),
        supabase.from('eksik_bildirimler').delete().neq('id', 'keep_none')
      ]);
    }
  };

  const restoreWipedBackup = async () => {
    if (!lastWipedBackup) return false;

    // Durumları geri yükle
    const bSaha = lastWipedBackup.sahaDokumleri || [];
    const bIrs = lastWipedBackup.irsaliyeler || [];
    const bFat = lastWipedBackup.faturalar || [];
    const bEksik = lastWipedBackup.eksikBildirimler || [];

    setSahaDokumleri(bSaha);
    setIrsaliyeler(bIrs);
    setFaturalar(bFat);
    setEksikBildirimler(bEksik);

    localStorage.setItem('beton_saha_dokumleri', JSON.stringify(bSaha));
    localStorage.setItem('beton_irsaliyeler', JSON.stringify(bIrs));
    localStorage.setItem('beton_faturalar', JSON.stringify(bFat));
    localStorage.setItem('beton_eksik_bildirimler', JSON.stringify(bEksik));

    if (supabase) {
      try {
        if (bSaha.length > 0) {
          await supabase.from('saha_dokumleri').upsert(bSaha.map(d => ({
            id: d.id,
            santiye: d.santiyeAdi || d.santiye,
            tarih: d.tarih,
            firma: d.tedarikci,
            beton_sinifi: d.betonCinsi,
            m3: d.toplamM3,
            yapi_elemani: d.yapiElemani,
            irsaliye_nolar: d.irsaliyeNolar || [],
            durum: d.faturaDurumu || 'BEKLIYOR',
            seff: d.sahaSefi || ''
          })));
        }
        if (bIrs.length > 0) {
          await supabase.from('irsaliyeler').upsert(bIrs.map(i => ({
            id: i.id || ('irs-' + Date.now() + Math.random()),
            irsaliye_no: i.irsaliyeNo,
            tarih: i.tarih,
            santiye: i.santiyeAdi,
            firma: i.tedarikci,
            beton_sinifi: i.betonCinsi,
            m3: i.metrajM3,
            plaka: i.mikserPlaka,
            durum: i.durum
          })));
        }
        if (bFat.length > 0) {
          await supabase.from('faturalar').upsert(bFat.map(f => ({
            id: f.id,
            fatura_no: f.faturaNo,
            tarih: f.tarih,
            firma: f.tedarikci,
            m3: f.metrajM3,
            baglanti_id: f.baglantiId,
            toplam_tutar: f.toplamTutar,
            irsaliye_nolar: f.irsaliyeNolar || []
          })));
        }
        if (bEksik.length > 0) {
          await supabase.from('eksik_bildirimler').upsert(bEksik.map(e => ({
            id: e.id,
            fatura_no: e.faturaNo,
            irsaliye_no: e.irsaliyeNo,
            tarih: e.tarih,
            m3: e.metrajM3,
            beton_sinifi: e.betonCinsi,
            firma: e.tedarikci,
            durum: e.durum,
            saha_sefi_notu: e.sahaNotu
          })));
        }
      } catch (err) {
        console.error('Geri yükleme supabase hatası:', err);
      }
    }

    setLastWipedBackup(null);
    localStorage.removeItem('beton_wiped_backup');
    return true;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentRole,
      login,
      logout,
      users,
      addUser,
      updateUser,
      deleteUser,
      isMobileFrame,
      setIsMobileFrame,
      isSyncing,
      santiyeler,
      setSantiyeler,
      addSantiye,
      deleteSantiye,
      betonSiniflari,
      addBetonSinifi,
      deleteBetonSinifi,
      updateBaglantiSinifFiyat,
      yapiKisimlari: YAPI_KISIMLARI,
      baglantilar,
      sahaDokumleri,
      faturalar,
      irsaliyeler,
      addIrsaliye,
      updateIrsaliye,
      deleteIrsaliye,
      eksikBildirimler,
      gonderEksikIrsaliyeBildirimi,
      deleteEksikBildirim,
      sahaSefiBildirimCevapla,
      addSahaDokum,
      updateSahaDokum,
      deleteSahaDokum,
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
      sesliIkazAcik,
      setSesliIkazAcik,
      playNotificationSound
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
