# Log Book Pioner Ramadhan

Aplikasi ini adalah web app untuk catatan amalan harian Ramadhan keluarga, dan sekarang sudah ditambahkan **WPA Builder (PWA Install)** agar bisa di-install ke home screen.

## Fitur utama
- Tambah/hapus anggota (nama, peran, target harian).
- Checklist amalan harian per tanggal:
  - Sahur
  - Shalat 5 Waktu
  - Tilawah
  - Sedekah
  - Tarawih
- Filter tampilan per anggota.
- Ringkasan progres harian.
- Penyimpanan data otomatis dengan `localStorage`.
- Dukungan PWA:
  - Manifest web app
  - Service worker cache app shell
  - Tombol install app (jika browser mendukung)

## Jalankan lokal
```bash
python3 -m http.server 4173
```
Buka `http://localhost:4173`.

## Deploy
`vercel.json` tetap dipakai untuk memastikan route root menuju `index.html`.
