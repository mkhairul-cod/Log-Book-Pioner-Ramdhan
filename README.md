# Log Book Pioner Ramadhan

Repo ini sekarang berisi **blueprint + starter deployment** agar tidak gagal 404 saat deploy.

## Kenapa deploy sebelumnya gagal?
Deploy ke Vercel gagal karena repository sebelumnya hanya berisi dokumen (`docs/...md`) tanpa entrypoint aplikasi (`index.html`, `index.php`, atau build output frontend). Akibatnya domain aktif tetapi route `/` menghasilkan `404 NOT_FOUND`.

## Perbaikan yang sudah ditambahkan
- Halaman landing `index.html` sebagai entrypoint valid untuk Vercel.
- Konfigurasi `vercel.json` untuk memastikan route `/` selalu mengarah ke `index.html`.
- Dokumen troubleshooting deployment Laravel + catatan platform yang direkomendasikan.

## Deploy cepat (agar langsung hidup)
1. Push repository ini ke GitHub.
2. Import project ke Vercel.
3. Framework preset: **Other**.
4. Build command: kosongkan.
5. Output directory: kosongkan.
6. Deploy.

Setelah itu, URL Vercel tidak akan 404 lagi karena root sudah punya halaman utama.

## Jika ingin backend Laravel penuh
Untuk aplikasi Laravel + MySQL + scheduler/queue, platform yang lebih stabil:
- VPS (Nginx + PHP-FPM + MySQL)
- Render/Railway/Fly.io (dengan worker + cron)

Lihat detail di `docs/DEPLOYMENT_TROUBLESHOOTING.md` dan `docs/BLUEPRINT_RAMADAN_FAMILY_MONITORING.md`.
