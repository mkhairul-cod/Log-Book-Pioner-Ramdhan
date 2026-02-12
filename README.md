# Log Book Pioner Ramadhan Pro

Aplikasi web base ini sudah di-upgrade menjadi versi **lebih detail, spesifik, dan modern (UI/UX)** untuk monitoring Ramadhan keluarga.

## Fitur Lengkap
- **Dashboard modern** dengan statistik real-time harian:
  - jumlah anggota aktif
  - jumlah task aktif
  - checklist harian tercapai
  - persentase capaian
  - jumlah anggota capai target
- **Manajemen anggota detail**:
  - nama, peran, usia, target poin harian, no WA, catatan khusus
- **Logbook harian spesifik**:
  - checklist default ibadah (shalat per waktu, tilawah, tarawih, dll)
  - task custom tambahan sesuai kebutuhan keluarga
  - catatan harian per anggota
- **Analitik lanjutan**:
  - leaderboard anggota
  - total checklist per anggota
  - rata-rata progres per hari
  - streak keaktifan
- **Pengaturan data**:
  - export backup JSON
  - import restore JSON
  - reset semua data
  - snapshot data read-only
- **PWA / WPA Builder**:
  - install app ke home screen
  - dukungan service worker
  - manifest + icon
- **Tambahan UX**:
  - navigasi tab (dashboard, anggota, logbook, analitik, settings)
  - mode gelap
  - toast notification
  - pencarian + filter anggota

## Teknologi
- Single-page app berbasis **HTML + CSS + Vanilla JS**.
- Penyimpanan data lokal via `localStorage`.
- Bisa dijalankan sebagai static site (termasuk Vercel).

## Jalankan Lokal
```bash
python3 -m http.server 4173
```
Buka:
- `http://localhost:4173`

## Deploy
Konfigurasi `vercel.json` tetap dipakai agar route root menuju `index.html`.
