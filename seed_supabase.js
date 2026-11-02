import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mhevvpzgzdfmomxdyqaq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZXZ2cHpnemRmbW9teGR5cWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MTE5OTgsImV4cCI6MjEwNzM4Nzk5OH0.yE9KTzXtkLZ6frOdiH5gnoxo_DXSAVmvdr6yx2RCrQM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const INITIAL_SANTILER = [
  { id: 'SAN-01', ad: 'Bulvar Evleri Şantiyesi', kod: 'BULVAR', sehir: 'İstanbul', yetkili: 'Ahmet Şef' },
  { id: 'SAN-02', ad: 'Flora Konutları Şantiyesi', kod: 'FLORA', sehir: 'Kocaeli', yetkili: 'Mehmet Şef' },
  { id: 'SAN-03', ad: 'Merkez Plaza Projesi', kod: 'PLAZA', sehir: 'Ankara', yetkili: 'Ali Şef' }
];

const BETON_SINIFLARI = [
  { id: 'C20', kod: 'C20/25', aciklama: 'Grobeton / Dolgu Betonu' },
  { id: 'C25', kod: 'C25/30', aciklama: 'Temel & Saha Betonu' },
  { id: 'C30', kod: 'C30/37', aciklama: 'Perde & Kolon Betonu' },
  { id: 'C35', kod: 'C35/45', aciklama: 'Kiriş & Döşeme / Yüksek Mukavemet' },
  { id: 'C40', kod: 'C40/50', aciklama: 'Özel Mühendislik Yapıları' }
];

const INITIAL_BAGLANTILAR = [
  {
    id: 'BAG-2026-01',
    firma: 'Çimsa Hazır Beton A.Ş.',
    santral: 'Kartal Hazır Beton Santrali',
    santiye: 'Bulvar Evleri Şantiyesi',
    toplam_m3: 2500,
    kalan_m3: 1820,
    toplam_butce: 7500000,
    kalan_butce: 5460000,
    baslangic_tarihi: '2026-01-15',
    bitis_tarihi: '2026-06-30',
    fiyat_listesi: {
      'C20/25': 2750,
      'C25/30': 2850,
      'C30/37': 3000,
      'C35/45': 3250,
      'C40/50': 3550
    }
  },
  {
    id: 'BAG-2026-02',
    firma: 'Akçansa Çimento Sanayi',
    santral: 'Gebze Hazır Beton Santrali',
    santiye: 'Flora Konutları Şantiyesi',
    toplam_m3: 4000,
    kalan_m3: 3150,
    toplam_butce: 12400000,
    kalan_butce: 9765000,
    baslangic_tarihi: '2026-02-01',
    bitis_tarihi: '2026-08-31',
    fiyat_listesi: {
      'C20/25': 2800,
      'C25/30': 2950,
      'C30/37': 3100,
      'C35/45': 3350,
      'C40/50': 3650
    }
  }
];

const INITIAL_SAHA_DOKUMLERI = [
  {
    id: 'DOK-001',
    tarih: '2026-04-10',
    saat: '09:30',
    santiye: 'Bulvar Evleri Şantiyesi',
    yapi_kismi: 'Temel Radye',
    beton_sinifi: 'C30/37',
    araba_sayisi: 5,
    dokulen_m3: 45,
    iade_var: false,
    iade_m3: 0,
    iade_nedeni: '',
    aciklama: 'Kuzey aksı radye temel 1. etap dökümü',
    kaydeden: 'Saha Şefi Ahmet'
  },
  {
    id: 'DOK-002',
    tarih: '2026-04-10',
    saat: '14:15',
    santiye: 'Bulvar Evleri Şantiyesi',
    yapi_kismi: 'Bodrum Perde',
    beton_sinifi: 'C35/45',
    araba_sayisi: 3,
    dokulen_m3: 27,
    iade_var: true,
    iade_m3: 3,
    iade_nedeni: 'Kıvam bozukluğu (slump standardın altında)',
    aciklama: '1 mikserde 3 m3 slump düşüklüğü sebebiyle geri çevrildi',
    kaydeden: 'Saha Şefi Ahmet'
  },
  {
    id: 'DOK-003',
    tarih: '2026-04-11',
    saat: '11:00',
    santiye: 'Flora Konutları Şantiyesi',
    yapi_kismi: 'Zemin Kat Tabliye',
    beton_sinifi: 'C30/37',
    araba_sayisi: 8,
    dokulen_m3: 72,
    iade_var: false,
    iade_m3: 0,
    iade_nedeni: '',
    aciklama: 'A Blok zemin kat döşeme dökümü tamamlandı',
    kaydeden: 'Saha Şefi Mehmet'
  }
];

const INITIAL_IRSALIYELER = [
  {
    id: 'IRS-101',
    irsaliye_no: 'IRS-2026-8812',
    tarih: '2026-04-10',
    firma: 'Çimsa Hazır Beton A.Ş.',
    santiye: 'Bulvar Evleri Şantiyesi',
    beton_sinifi: 'C30/37',
    m3: 45,
    araba_plaka: '34 ER 1234',
    durum: 'faturalasti',
    fatura_no: 'FAT-2026-0041'
  },
  {
    id: 'IRS-102',
    irsaliye_no: 'IRS-2026-8815',
    tarih: '2026-04-10',
    firma: 'Çimsa Hazır Beton A.Ş.',
    santiye: 'Bulvar Evleri Şantiyesi',
    beton_sinifi: 'C35/45',
    m3: 27,
    araba_plaka: '34 KA 5678',
    durum: 'faturalasti',
    fatura_no: 'FAT-2026-0041'
  },
  {
    id: 'IRS-103',
    irsaliye_no: 'IRS-2026-9042',
    tarih: '2026-04-11',
    firma: 'Akçansa Çimento Sanayi',
    santiye: 'Flora Konutları Şantiyesi',
    beton_sinifi: 'C30/37',
    m3: 72,
    araba_plaka: '41 BT 9901',
    durum: 'beklemede',
    fatura_no: null
  }
];

const INITIAL_FATURALAR = [
  {
    id: 'FAT-001',
    fatura_no: 'FAT-2026-0041',
    tarih: '2026-04-11',
    firma: 'Çimsa Hazır Beton A.Ş.',
    baglanti_id: 'BAG-2026-01',
    toplam_tutar: 222750,
    kdv_dahil: true,
    durum: 'onaylandi',
    irsaliye_nolar: ['IRS-2026-8812', 'IRS-2026-8815']
  }
];

async function seed() {
  console.log('Veriler Supabase bulutuna yükleniyor...');
  
  await supabase.from('santiyeler').upsert(INITIAL_SANTILER);
  await supabase.from('beton_siniflari').upsert(BETON_SINIFLARI);
  await supabase.from('beton_baglantilari').upsert(INITIAL_BAGLANTILAR);
  await supabase.from('saha_dokumleri').upsert(INITIAL_SAHA_DOKUMLERI);
  await supabase.from('irsaliyeler').upsert(INITIAL_IRSALIYELER);
  await supabase.from('faturalar').upsert(INITIAL_FATURALAR);
  
  console.log('TÜM VERİLER BAŞARIYLA SUPABASE BULUTUNA YÜKLENDİ! ✅');
}

seed().catch(console.error);
