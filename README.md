# Log Book Pioner Ramadhan

Aplikasi ini sekarang sudah menjadi **web app langsung pakai** (tanpa blueprint-only).

## Fitur yang tersedia
- Tambah anggota keluarga (nama, peran, target kebaikan per hari).
- Checklist amalan harian Ramadhan:
  - Sahur
  - Shalat 5 Waktu
  - Tilawah
  - Sedekah
  - Tarawih
- Pilih tanggal untuk pencatatan harian.
- Filter tampilan per anggota.
- Ringkasan progres harian (persentase, total checklist, anggota capai target).
- Data tersimpan otomatis di browser menggunakan `localStorage`.

## Cara menjalankan
Karena ini web statis, cukup buka `index.html` atau deploy ke Vercel.

### Jalankan lokal cepat
```bash
python3 -m http.server 4173
```
Lalu buka: `http://localhost:4173`

## Deploy ke Vercel
Konfigurasi `vercel.json` sudah tersedia agar route root tetap mengarah ke `index.html`.
