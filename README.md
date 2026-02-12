# Log Book Pioner Ramadhan (Langsung Bisa Dipakai)

Ini adalah aplikasi web siap jalan untuk monitoring ibadah keluarga Ramadan.

## ✅ Yang WAJIB ada di repository (jangan dihapus)
- `index.html` → halaman utama aplikasi
- `app.js` → logika aplikasi (login, role, input, rekap)
- `styles.css` → tampilan aplikasi
- `vercel.json` → konfigurasi deploy Vercel
- `README.md` → panduan penggunaan

## 🧹 Yang BOLEH dihapus (jika ingin repo ringkas)
- Folder `docs/` (dokumen blueprint/troubleshooting)
- File contoh/dummy lain yang tidak dipakai runtime

## Fitur aplikasi
- Buat keluarga + akun Ayah (admin utama)
- Login user keluarga
- Tambah anggota (Ibu/Anak) oleh admin
- Input ibadah harian:
  - Shalat 5 waktu
  - Tarawih
  - Tadarus
  - Puasa
  - Catatan
- Anti duplikasi log tanggal per user
- Role control:
  - Ayah/Ibu bisa lihat semua data keluarga
  - Anak hanya bisa input dan lihat data sendiri
- Rekap harian
- Rekap mingguan + skor otomatis

## Simpan data
Saat ini data disimpan di `localStorage` browser agar bisa langsung dipakai tanpa setup server/database.

## Jalankan lokal
```bash
python3 -m http.server 8000
```
Buka: `http://localhost:8000`

## Deploy ke GitHub + Vercel (langsung jadi)
1. Commit & push branch kerja ke GitHub.
2. Pastikan branch yang berisi `index.html`, `app.js`, `styles.css` sudah merge ke `main`.
3. Import repo ke Vercel.
4. Framework: **Other**.
5. Build command: kosong.
6. Output directory: kosong.
7. Deploy.

Jika domain Vercel masih menampilkan versi lama, lakukan:
- Redeploy terbaru dari branch `main`
- Clear build cache lalu deploy ulang

---

## Upgrade ke Laravel + MySQL (opsional tahap berikutnya)
Kalau ingin multi-device sungguhan (data tersinkron antar HP/laptop), tahap selanjutnya migrasi backend ke Laravel + MySQL.
