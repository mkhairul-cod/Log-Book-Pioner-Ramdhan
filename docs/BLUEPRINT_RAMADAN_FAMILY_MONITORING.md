# Blueprint Komprehensif
## Sistem Monitoring Ibadah Keluarga Ramadan (Laravel + MySQL + Blade)

Dokumen ini menjadi acuan implementasi dari tahap perancangan sampai deployment produksi.

---

## 1) Visi Produk dan Prinsip Sistem

### Visi
Menyediakan aplikasi keluarga yang sederhana, aman, dan terstruktur untuk mencatat serta memonitor ibadah selama Ramadan.

### Prinsip inti
- **Satu keluarga = satu tenant logis** (`families`).
- **Kontrol akses berbasis peran** (`ayah`, `ibu`, `anak`).
- **Server-side rendering** dengan Blade untuk stabilitas dan kemudahan maintenance.
- **Auditability**: data penting memiliki timestamp dan constraint relasional.

---

## 2) Arsitektur Sistem

### Stack
- Backend: Laravel 11+
- Database: MySQL 8+
- Frontend: Blade + Tailwind (opsional Bootstrap)
- Chart: Chart.js
- PDF Export: barryvdh/laravel-dompdf (opsional)

### Boundary module
1. **Auth & Session**
2. **Family Management**
3. **Worship Logging**
4. **Dashboard & Reporting**
5. **Scoring Engine**
6. **Reminder & Scheduling**

### Alur data ringkas
1. User login.
2. Middleware role + family scope menyeleksi hak akses.
3. User mengisi ibadah harian.
4. Sistem menyimpan log dengan validasi anti-duplikasi.
5. Dashboard membaca agregasi harian/mingguan per user dan keluarga.

---

## 3) Model Data Relasional

### Tabel `families`
- `id` (PK)
- `family_name` (varchar, indexed)
- `created_at`, `updated_at`

### Tabel `users`
- `id` (PK)
- `family_id` (FK -> `families.id`, indexed)
- `name` (varchar)
- `email` (unique)
- `password` (hashed)
- `role` enum(`ayah`,`ibu`,`anak`) indexed
- `created_at`, `updated_at`

### Tabel `worship_categories`
- `id` (PK)
- `name` (varchar, unique)
- `type` enum(`boolean`,`numeric`)
- `is_active` (boolean, default true)
- `created_at`, `updated_at`

### Tabel `worship_logs`
- `id` (PK)
- `user_id` (FK -> `users.id`, indexed)
- `worship_category_id` (FK -> `worship_categories.id`, indexed)
- `date` (date, indexed)
- `value` (decimal(8,2))
- `notes` (text nullable)
- `created_at`, `updated_at`

**Unique key penting:**
- (`user_id`, `worship_category_id`, `date`) untuk mencegah input ganda kategori yang sama di hari sama.

### Tabel `weekly_summaries`
- `id` (PK)
- `user_id` (FK -> `users.id`, indexed)
- `week_number` (tinyint unsigned)
- `year` (smallint unsigned)
- `total_score` (decimal(8,2), default 0)
- `created_at`, `updated_at`

**Unique key:**
- (`user_id`, `week_number`, `year`)

### Relasi Eloquent
- `Family hasMany User`
- `User belongsTo Family`
- `User hasMany WorshipLog`
- `WorshipCategory hasMany WorshipLog`
- `WorshipLog belongsTo User`
- `WorshipLog belongsTo WorshipCategory`
- `User hasMany WeeklySummary`

---

## 4) Struktur Folder Laravel (Disarankan)

```txt
app/
  Http/
    Controllers/
      Auth/
      DashboardController.php
      WorshipController.php
      ReportController.php
      FamilyController.php
    Middleware/
      EnsureRole.php
      EnsureSameFamilyScope.php
  Models/
    Family.php
    User.php
    WorshipCategory.php
    WorshipLog.php
    WeeklySummary.php
  Services/
    ScoreService.php
    SummaryService.php

resources/views/
  layouts/
    app.blade.php
  components/
    header.blade.php
    footer.blade.php
    sidebar.blade.php
  dashboard/
  worship/
  reports/
  auth/

routes/
  web.php
```

---

## 5) UI/UX Blueprint

### Header (sticky)
- Kiri: Logo + nama aplikasi
- Tengah: menu utama (`Dashboard`, `Catat Ibadah`, `Rekap`, `Target`)
- Kanan: dropdown profil (nama user, role, logout)
- Menampilkan `family_name` aktif
- Responsif: berubah menjadi hamburger menu pada layar kecil

### Sidebar (desktop)
- Dashboard
- Ibadah Harian
- Rekap Harian
- Rekap Mingguan
- Pengaturan Keluarga
- Collapsible

### Footer global
- Nama aplikasi
- Tahun berjalan (`{{ now()->year }}`)
- Kutipan motivasi Ramadan
- Link: Tentang, Kebijakan Privasi, Kontak
- Konsisten di semua halaman melalui layout utama

### Desain visual
- Palet utama: hijau lembut Ramadan
- Tipografi: Inter/Poppins
- Status warna:
  - Hijau = selesai
  - Kuning = sebagian
  - Merah = belum

---

## 6) Halaman Inti & Fungsional

### A. Dashboard
Menampilkan:
- Ringkasan ibadah hari ini (per user + total keluarga)
- Grafik progres mingguan (Chart.js)
- Tabel progres anggota keluarga
- Badge pencapaian

### B. Catat Ibadah
Form:
- Tanggal (default hari ini)
- Checklist shalat 5 waktu
- Tarawih (ya/tidak)
- Tadarus (numeric)
- Puasa (ya/tidak)
- Catatan

Validasi:
- Tidak boleh duplikat kategori+tanggal untuk user yang sama
- Anak hanya dapat input/mengubah data miliknya
- Tadarus numeric >= 0

### C. Rekap Harian
Kolom:
`Tanggal | Nama | Shalat | Tarawih | Tadarus | Puasa | Total`

Fitur:
- Filter tanggal / rentang tanggal
- Filter anggota (khusus admin)

### D. Rekap Mingguan
Fitur:
- Filter minggu + tahun
- Grafik tren
- Total skor keluarga
- Export PDF

---

## 7) Otorisasi, Validasi, dan Keamanan

### Otorisasi
- Middleware `auth`
- Middleware `role:ayah,ibu` untuk fitur admin
- Policy/Scope untuk batasi akses data lintas keluarga

### Validasi server-side
- Form Request per modul (`StoreWorshipLogRequest`, dll.)
- Rule anti-duplikasi via unique composite
- Sanitasi notes dan limit panjang input

### Hardening keamanan
- Password hashing bawaan (`bcrypt`/`argon2id`)
- CSRF token untuk seluruh form
- Rate limiting login (`throttle`)
- Session secure + httpOnly
- Enforce HTTPS di production
- Audit log untuk aksi sensitif (opsional)

---

## 8) Skema Penilaian (Opsional / Rekomendasi)

Skor default:
- Shalat 5 waktu: masing-masing 1 poin
- Tarawih: 1 poin
- Tadarus: `0.1 x halaman`
- Puasa: 5 poin

### Rumus
`total_harian = shalat + tarawih + tadarus + puasa`

`total_mingguan = SUM(total_harian selama 7 hari)`

Disarankan implementasi di `ScoreService` agar mudah diubah.

---

## 9) Rancangan Routing (Contoh)

```php
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('worship')->group(function () {
        Route::get('/', [WorshipController::class, 'index'])->name('worship.index');
        Route::post('/', [WorshipController::class, 'store'])->name('worship.store');
        Route::put('/{log}', [WorshipController::class, 'update'])->name('worship.update');
    });

    Route::prefix('reports')->group(function () {
        Route::get('/daily', [ReportController::class, 'daily'])->name('reports.daily');
        Route::get('/weekly', [ReportController::class, 'weekly'])->name('reports.weekly');
        Route::get('/weekly/export-pdf', [ReportController::class, 'exportWeeklyPdf'])->name('reports.weekly.pdf');
    });

    Route::middleware('role:ayah,ibu')->group(function () {
        Route::get('/family/settings', [FamilyController::class, 'settings'])->name('family.settings');
    });
});
```

---

## 10) Deployment Checklist

### Infrastruktur
- VPS (DigitalOcean) / shared hosting compatible Laravel
- Nginx/Apache + PHP 8.2+
- MySQL 8+

### Langkah produksi
1. Set domain + DNS
2. SSL (Let’s Encrypt)
3. `.env` production (APP_ENV=production, APP_DEBUG=false)
4. Generate key + migrate + seed
5. `php artisan config:cache && route:cache && view:cache`
6. Setup queue worker + cron scheduler
7. Backup database terjadwal
8. Monitoring basic (uptime + error log)

---

## 11) Strategi Penyimpanan Data (Data Storage Plan)

Supaya sistem stabil dan aman, penyimpanan data dibagi menjadi beberapa lapis:

### A. Penyimpanan utama (transaksional)
- Gunakan **MySQL** sebagai sumber data utama untuk:
  - keluarga, user, role
  - log ibadah harian
  - rekap mingguan
- Terapkan **InnoDB** untuk dukungan FK, transaksi, dan rollback.
- Semua operasi tulis penting dibungkus transaksi database (`DB::transaction`) saat menyimpan multi-record.

### B. Struktur indeks untuk performa
Indeks minimum yang direkomendasikan:
- `users.family_id`
- `users.role`
- `worship_logs.user_id`
- `worship_logs.worship_category_id`
- `worship_logs.date`
- unique composite: `worship_logs (user_id, worship_category_id, date)`
- unique composite: `weekly_summaries (user_id, week_number, year)`

Tujuan: query dashboard, rekap harian, dan rekap mingguan tetap cepat meskipun data bertambah.

### C. Penyimpanan file/non-relasional
- Jika ada fitur **export PDF**, simpan file hasil export di:
  - local storage: `storage/app/reports`
  - atau object storage (S3-compatible) untuk production.
- Simpan hanya path file pada database bila diperlukan (jangan simpan blob PDF langsung di tabel utama).

### D. Retensi dan arsip data
- Log ibadah bersifat histori, jadi **tidak dihapus otomatis** selama Ramadan berjalan.
- Setelah periode tertentu (mis. > 1 tahun), data dapat dipindah ke tabel arsip atau bucket arsip untuk efisiensi.
- Gunakan soft delete hanya untuk entitas yang perlu pemulihan (mis. user), bukan untuk log inti jika tidak dibutuhkan.

### E. Backup & recovery
- Backup database **harian** (minimal) + backup mingguan penuh.
- Simpan backup di lokasi terpisah dari server aplikasi.
- Lakukan uji restore berkala (mis. bulanan) untuk memastikan backup valid.
- Tetapkan target recovery:
  - **RPO** (kehilangan data maksimum) mis. 24 jam
  - **RTO** (waktu pulih layanan) mis. 4 jam

### F. Keamanan data saat disimpan
- Password wajib hashed (`bcrypt`/`argon2id`), tidak pernah plaintext.
- Data sensitif pada `.env` (DB password, API key) tidak boleh masuk git.
- Aktifkan enkripsi disk/volume di level infrastruktur jika tersedia.
- Batasi akses database hanya dari host aplikasi (firewall + network policy).

### G. Multi-tenant scope (per keluarga)
- Semua query data user/log wajib terfilter `family_id` dari user login.
- Gunakan Global Scope atau Repository pattern agar scope keluarga konsisten dan tidak terlewat.

### H. Monitoring kapasitas
- Pantau ukuran tabel `worship_logs` dan growth rate per minggu.
- Tambahkan alert jika storage server melewati ambang (mis. 80%).

---

## 12) Fitur Lanjutan (Roadmap)

1. Reminder otomatis (scheduler/WhatsApp/email)
2. Progress bar Ramadan hari 1-30
3. Target keluarga per pekan
4. Badge anak (gamification)
5. Dark/Light mode
6. Share link privat keluarga (tokenized)

---

## 13) Prioritas Implementasi (Sprint)

### Sprint 1 (Fondasi)
- Auth + role + family scope
- Migrasi inti
- Input ibadah harian

### Sprint 2 (Pelaporan)
- Dashboard + chart mingguan
- Rekap harian/mingguan
- Scoring service

### Sprint 3 (Produksi)
- Export PDF
- Reminder cron
- Hardening keamanan + deployment

---

## 14) Definition of Done (DoD)

Sebuah fitur dianggap selesai jika:
- Lulus validasi role & family scope
- Tidak ada bug duplikasi log harian
- Tersedia unit/feature test minimal untuk skenario utama
- UI responsif untuk mobile dan desktop
- Tidak ada endpoint sensitif tanpa proteksi auth + CSRF
