# Plant Pod Tracker Backend (FastAPI)

Bu klasör, Plant Pod Tracker projesinin Python FastAPI tabanlı backend servisidir.

## Özellikler

- **Pod ve Görsel Yönetimi:** Her pod için temel bilgiler ve birden fazla görsel saklanabilir.
- **SQLite Veritabanı:** Podlar ve görseller arasında bire-çok ilişki.
- **Görsel Yükleme:** Pod oluştururken veya sonradan görsel eklenebilir.
- **RESTful API:** CRUD işlemleri ve görsel sunumu için endpointler.

## Kurulum

1. Python 3.8+ yüklü olmalı.
2. Klasöre girin:
   ```bash
   cd backend
   ```
3. Sanal ortam oluşturun ve etkinleştirin:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
4. Bağımlılıkları yükleyin:
   ```bash
   pip install -r requirements.txt
   ```
5. Veritabanını başlatın:
   ```bash
   python -m src.main init-db
   ```

## Çalıştırma

```bash
uvicorn src.main:app --reload
```

## API Endpointleri

- `POST /api/pods` : Yeni pod ekle (ilk görsel opsiyonel)
- `POST /api/pods/{pod_id}/images` : Var olan poda yeni görsel ekle
- `GET /api/pods` : Tüm podları ve görsellerini getir
- `GET /api/uploads/{filename}` : Görsel dosyasını getir
- `DELETE /api/pods/{pod_id}` : Pod sil
- `PUT /api/pods/{pod_id}` : Pod güncelle

## Veritabanı Şeması

- **Pod:** id, name, type, planting_date, description
- **Image:** id, pod_id (FK), filename, upload_time, description

## Tasarım Notları

- Görseller `backend/uploads/` klasöründe saklanır, dosya isimleri UUID ile benzersizleştirilir.
- Her görsel, ilgili pod ile `pod_id` üzerinden ilişkilidir.
- API, frontend'in tüm gereksinimlerini karşılayacak şekilde tasarlanmıştır.

## Test

```bash
pytest
```

## Varsayımlar

- Kimlik doğrulama yoktur.
- Görsellerin boyutu ve formatı için temel kontroller yapılır.

## Proje Yapısı

```
backend/
├── src/                    # Kaynak kodlar
│   └── __init__.py
├── tests/                  # Test dosyaları
│   └── __init__.py
├── requirements.txt        # Proje bağımlılıkları
└── README.md              # Backend dokümantasyonu
``` 