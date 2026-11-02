// Gerçek Başlangıç Verileri ve Tanımlamalar

export const INITIAL_SANTILER = [
  { id: 'st-1791895074924', ad: 'PRİME', sehir: 'TÜYSÜZLER' },
  { id: 'st-1791895102820', ad: 'CENTRAL', sehir: 'YEŞİLOVA' },
  { id: 'st-1791895148945', ad: 'SEMBOL', sehir: 'KULLAR' },
  { id: 'st-1791895184961', ad: 'FLATS', sehir: 'KABAOĞLU' },
  { id: 'st-1791895202637', ad: 'BOULEVARD', sehir: 'KABAOĞLU' },
];

export const BETON_SINIFLARI = [
  'C16/20',
  'C20/25',
  'C25/30',
  'C30/37',
  'C35/45',
  'C40/50',
];

export const YAPI_KISIMLARI = [
  'Radye Temel',
  'Bodrum -2 Perde Duvarları',
  'Bodrum -1 Kolon & Kirişler',
  'Zemin Kat Tabliye / Döşeme',
  '1. Normal Kat Kolonları',
  '2. Normal Kat Döşemesi',
  'İstinat Duvarı',
  'Saha Betonu (Otopark / Çevre)',
];

export const INITIAL_BAGLANTILAR = [
  {
    id: 'bag-1791897571494',
    tedarikci: 'KAVANLAR BETON',
    sozlesmeNo: 'KAV-SEMBOL-01',
    baslangicTarihi: '2026-10-13',
    bitisTarihi: '2026-12-31',
    santiyeId: 'st-1791895148945',
    santiyeAdi: 'SEMBOL',
    santiyeAdlari: ['SEMBOL'],
    betonCinsi: 'C30/37',
    birimFiyat: 3500,
    fiyatListesi: {
      'C16/20': 3250,
      'C20/25': 3300,
      'C25/30': 3350,
      'C30/37': 3500,
      'C35/45': 3650,
      'C40/50': 3900
    },
    toplamMetraj: 5450,
    kalanMetraj: 5450,
    toplamTutar: 21360000,
    kalanTutar: 21360000,
    aciklama: 'Sembol Projesi Bağlantı Sözleşmesi'
  },
  {
    id: 'bag-1791898706089',
    tedarikci: 'KAVANLAR BETON',
    sozlesmeNo: 'KAV-GENEL-02',
    baslangicTarihi: '2026-10-13',
    bitisTarihi: '2026-12-31',
    santiyeId: 'st-1791895074924',
    santiyeAdi: 'PRİME, CENTRAL, FLATS, BOULEVARD',
    santiyeAdlari: ['PRİME', 'CENTRAL', 'FLATS', 'BOULEVARD'],
    betonCinsi: 'C30/37',
    birimFiyat: 3500,
    fiyatListesi: {
      'C16/20': 3250,
      'C20/25': 3300,
      'C25/30': 3350,
      'C30/37': 3500,
      'C35/45': 3650,
      'C40/50': 3900
    },
    toplamMetraj: 3030,
    kalanMetraj: 3030,
    toplamTutar: 10000000,
    kalanTutar: 10000000,
    aciklama: '4 Şantiye Ortak Bağlantı Sözleşmesi'
  }
];

// Tüm deneme / test verileri temizlendi
export const INITIAL_SAHA_DOKUMLERI = [];
export const INITIAL_FATURALAR = [];
export const INITIAL_IRSALIYELER = [];
export const INITIAL_EKSIK_BILDIRIMLER = [];
