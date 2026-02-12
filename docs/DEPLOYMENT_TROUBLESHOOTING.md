# Deployment Troubleshooting (Laravel + Vercel + VPS)

## 1. Penyebab umum error 404 di Vercel
Jika repo hanya berisi dokumen dan tidak memiliki file entrypoint (`index.html`/`index.php`) atau output build frontend, maka Vercel akan tetap deploy project tetapi route `/` menjadi `404 NOT_FOUND`.

## 2. Kondisi repository ini
- Sebelumnya: hanya blueprint dokumentasi.
- Sekarang: sudah ditambah `index.html` + `vercel.json` agar URL root hidup.

## 3. Kapan pakai Vercel?
Cocok untuk:
- static site
- frontend SPA/SSR modern
- fungsi serverless ringan

Kurang cocok untuk Laravel penuh yang butuh:
- worker jangka panjang
- scheduler cron berkelanjutan
- manajemen storage backend yang lebih stateful

## 4. Rekomendasi agar Laravel benar-benar production-ready
Gunakan VPS atau platform yang mendukung PHP worker + cron + DB secara native.

Checklist minimal:
1. Nginx + PHP-FPM + MySQL aktif.
2. `APP_ENV=production`, `APP_DEBUG=false`.
3. `php artisan key:generate`.
4. `php artisan migrate --force`.
5. `php artisan config:cache && route:cache && view:cache`.
6. Setup Supervisor untuk queue worker.
7. Setup cron `* * * * * php artisan schedule:run`.
8. SSL dan backup database otomatis.

## 5. Jika tetap ingin eksperimen Laravel di Vercel
Harus menyiapkan runtime PHP serverless + entrypoint yang sesuai, namun tetap ada batasan pada job jangka panjang dan pola I/O.

Untuk use case aplikasi keluarga dengan log harian + rekap + reminder, VPS biasanya lebih stabil dan mudah dipantau.
