# Log Book Pioner Ramadhan Pro

Aplikasi ini sekarang sudah dibuat lebih lengkap: **detail fitur, UI/UX modern, animasi halus, dan siap dipakai di localhost**.

## Fitur Utama
- Dashboard monitoring harian dengan statistik real-time.
- Manajemen anggota detail (nama, peran, usia, target, WhatsApp, catatan khusus).
- Logbook harian per anggota dengan:
  - checklist ibadah default
  - task custom
  - catatan harian
- Analitik lanjutan:
  - total checklist
  - rata-rata per hari
  - leaderboard
  - streak aktivitas
  - saran otomatis berbasis performa harian
- Pengaturan data:
  - export JSON
  - import JSON
  - reset semua data
  - snapshot data read-only
- PWA/WPA Builder:
  - install app
  - service worker
  - manifest + icon

## Upgrade UI/UX yang ditambahkan
- Layout modern dengan sidebar navigasi multi-panel.
- Tema terang/gelap native (tanpa invert hack).
- Animasi modern:
  - fade-in panel
  - floating background blobs
  - transisi progress bar
  - hover micro-interaction pada tombol
  - toast notification

## Menjalankan di Localhost
Jalankan dari root project:

```bash
python3 -m http.server 4173
```

Lalu buka:
- `http://localhost:4173`

## Deploy
`vercel.json` tetap dapat dipakai agar route root menuju `index.html`.
