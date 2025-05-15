# Plant Pod Tracker Frontend (React + Vite)

Bu klasör, Plant Pod Tracker projesinin React tabanlı frontend uygulamasıdır.

## Özellikler

- Tüm podları ve görsellerini listeleme
- Yeni pod ekleme (ilk görsel opsiyonel)
- Her pod için yeni görsel ekleme
- 3D model entegrasyonu ve etkileşimli görselleştirme
- Modern, erişilebilir ve responsive arayüz

## Kurulum

1. Node.js 18+ yüklü olmalı.
2. Klasöre girin:
   ```bash
   cd frontend
   ```
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. Uygulamayı başlatın:
   ```bash
   npm run dev
   ```
5. Uygulama varsayılan olarak [http://localhost:5173](http://localhost:5173) adresinde çalışır.

## Yapılandırma

- API adresi `.env` dosyası ile ayarlanabilir. Varsayılan: `http://localhost:8000`

## Kullanım

- Ana sayfada tüm podlar ve görselleri listelenir.
- Yeni pod eklemek için formu doldurun.
- Her podun detayında yeni görsel ekleyebilirsiniz.
- 3D model, mouse ile etkileşimli olarak döndürülebilir.

## Notlar

- Backend servisi çalışıyor olmalıdır.
- Görseller ve 3D modeller için `public/models/` ve backend'in `uploads/` klasörleri kullanılmaktadır.
