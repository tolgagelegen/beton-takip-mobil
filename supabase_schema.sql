-- BETON TAKİP MOBİL - SUPABASE SQL KURULUM TABLOLARI
-- Supabase Panelinde SQL Editor kısmına yapıştırıp "RUN" butonuna basarak çalıştırabilirsiniz.

-- 1. ŞANTİYELER / PROJELER
CREATE TABLE IF NOT EXISTS santiyeler (
    id TEXT PRIMARY KEY,
    ad TEXT NOT NULL,
    kod TEXT,
    sehir TEXT,
    yetkili TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BETON SINIFLARI
CREATE TABLE IF NOT EXISTS beton_siniflari (
    id TEXT PRIMARY KEY,
    kod TEXT NOT NULL,
    aciklama TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BETON BAĞLANTILARI & FİYAT LİSTELERİ
CREATE TABLE IF NOT EXISTS beton_baglantilari (
    id TEXT PRIMARY KEY,
    firma TEXT NOT NULL,
    santral TEXT,
    santiye TEXT,
    toplam_m3 NUMERIC DEFAULT 0,
    kalan_m3 NUMERIC DEFAULT 0,
    toplam_butce NUMERIC DEFAULT 0,
    kalan_butce NUMERIC DEFAULT 0,
    baslangic_tarihi TEXT,
    bitis_tarihi TEXT,
    fiyat_listesi JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SAHA DÖKÜM KAYITLARI (Saha Şefi Girişleri)
CREATE TABLE IF NOT EXISTS saha_dokumleri (
    id TEXT PRIMARY KEY,
    tarih DATE NOT NULL DEFAULT CURRENT_DATE,
    saat TIME DEFAULT CURRENT_TIME,
    santiye TEXT NOT NULL,
    yapi_kismi TEXT NOT NULL,
    beton_sinifi TEXT NOT NULL,
    araba_sayisi INTEGER NOT NULL DEFAULT 1,
    dokulen_m3 NUMERIC NOT NULL DEFAULT 0,
    iade_var BOOLEAN DEFAULT FALSE,
    iade_m3 NUMERIC DEFAULT 0,
    iade_nedeni TEXT,
    aciklama TEXT,
    kaydeden TEXT DEFAULT 'Saha Şefi',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. İRSALİYE HAVUZU (Admin Girişleri)
CREATE TABLE IF NOT EXISTS irsaliyeler (
    id TEXT PRIMARY KEY,
    irsaliye_no TEXT NOT NULL UNIQUE,
    tarih DATE NOT NULL,
    firma TEXT NOT NULL,
    santiye TEXT NOT NULL,
    beton_sinifi TEXT NOT NULL,
    m3 NUMERIC NOT NULL,
    araba_plaka TEXT,
    durum TEXT DEFAULT 'beklemede', -- 'beklemede', 'faturalasti'
    fatura_no TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FATURALAR & MUTABAKAT
CREATE TABLE IF NOT EXISTS faturalar (
    id TEXT PRIMARY KEY,
    fatura_no TEXT NOT NULL UNIQUE,
    tarih DATE NOT NULL,
    firma TEXT NOT NULL,
    baglanti_id TEXT,
    toplam_tutar NUMERIC NOT NULL,
    kdv_dahil BOOLEAN DEFAULT TRUE,
    durum TEXT DEFAULT 'onaylandi',
    irsaliye_nolar JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EKSİK İRSALİYE BİLDİRİMLERİ (Admin -> Saha Şefi İletişimi)
CREATE TABLE IF NOT EXISTS eksik_bildirimler (
    id TEXT PRIMARY KEY,
    fatura_no TEXT,
    irsaliye_no TEXT NOT NULL,
    tarih DATE,
    m3 NUMERIC,
    beton_sinifi TEXT,
    firma TEXT,
    durum TEXT DEFAULT 'beklemede', -- 'beklemede', 'onaylandi', 'itiraz_edildi'
    saha_sefi_notu TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Güvenlik / Anonim Erişim (Mobil kullanıcıların doğrudan okuma ve yazma yapabilmesi için RLS politikaları)
ALTER TABLE santiyeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE beton_siniflari ENABLE ROW LEVEL SECURITY;
ALTER TABLE beton_baglantilari ENABLE ROW LEVEL SECURITY;
ALTER TABLE saha_dokumleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE irsaliyeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE eksik_bildirimler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes okuyabilir ve yazabilir - santiyeler" ON santiyeler FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkes okuyabilir ve yazabilir - beton_siniflari" ON beton_siniflari FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkes okuyabilir ve yazabilir - beton_baglantilari" ON beton_baglantilari FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkes okuyabilir ve yazabilir - saha_dokumleri" ON saha_dokumleri FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkes okuyabilir ve yazabilir - irsaliyeler" ON irsaliyeler FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkes okuyabilir ve yazabilir - faturalar" ON faturalar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Herkes okuyabilir ve yazabilir - eksik_bildirimler" ON eksik_bildirimler FOR ALL USING (true) WITH CHECK (true);

-- Realtime Dinleme Aktifleştirme (Supabase üzerinden anlık veri akışı için)
ALTER PUBLICATION supabase_realtime ADD TABLE santiyeler, beton_baglantilari, saha_dokumleri, irsaliyeler, faturalar, eksik_bildirimler;
