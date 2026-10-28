# Test Cases — SIKMA

## 1. Informasi Proyek

| Informasi | Detail |
|---|---|
| Nama sistem | SIKMA (Sistem Informasi Konter Makan) |
| Jenis pengujian | Manual Testing |
| Pendekatan | Black-box Testing |
| Cakupan | Admin Pusat, Admin Divisi, Pihak Kantin, Karyawan |
| Aktivitas | Test case design, functional testing, bug reporting, dan retesting |

## 2. Test Cases — Admin Pusat

### TC-HCPO-001 — Login dengan kredensial valid

- **Preconditions:** Pengguna memiliki akun Admin Pusat yang valid.
- **Test Steps:**
  1. Buka halaman login.
  2. Masukkan username dan password yang valid.
  3. Klik tombol Login.
- **Test Data:** Akun pengujian yang valid.
- **Expected Result:** Pengguna berhasil login dan diarahkan ke halaman utama Admin Pusat.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-HCPO-002 — Login dengan password salah

- **Preconditions:** Pengguna memiliki akun Admin Pusat yang terdaftar.
- **Test Steps:**
  1. Buka halaman login.
  2. Masukkan username yang valid dan password yang salah.
  3. Klik tombol Login.
- **Test Data:** Username valid dan password tidak valid.
- **Expected Result:** Sistem menolak login dan menampilkan pesan kesalahan.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-HCPO-003 — Menyetujui pengajuan makan yang valid

- **Preconditions:** Pengguna sudah login sebagai Admin Pusat dan tersedia pengajuan makan yang menunggu persetujuan.
- **Test Steps:**
  1. Buka halaman pengajuan makan.
  2. Pilih pengajuan yang akan diperiksa.
  3. Periksa informasi pengajuan.
  4. Klik tombol persetujuan.
  5. Konfirmasi tindakan jika sistem memintanya.
- **Test Data:** Pengajuan makan dengan informasi yang valid.
- **Expected Result:** Pengajuan berhasil disetujui dan statusnya diperbarui sesuai alur sistem.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-HCPO-004 — Memeriksa pengajuan makan dengan data tidak valid

- **Preconditions:** Pengguna sudah login sebagai Admin Pusat dan tersedia pengajuan dengan informasi yang tidak valid atau tidak lengkap.
- **Test Steps:**
  1. Buka halaman pengajuan makan.
  2. Pilih pengajuan yang akan diperiksa.
  3. Periksa informasi pengajuan.
  4. Coba lakukan persetujuan.
- **Test Data:** Pengajuan dengan informasi tidak valid atau tidak lengkap.
- **Expected Result:** Sistem menangani pengajuan sesuai aturan validasi dan tidak menyetujui pengajuan yang tidak memenuhi persyaratan.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-HCPO-005 — Logout dari akun Admin Pusat

- **Preconditions:** Pengguna sudah login sebagai Admin Pusat.
- **Test Steps:**
  1. Klik menu atau tombol Logout.
  2. Amati halaman yang ditampilkan setelah logout.
  3. Jika memungkinkan, coba akses kembali halaman yang memerlukan autentikasi melalui navigasi browser.
- **Test Data:** Akun Admin Pusat yang sudah login.
- **Expected Result:** Pengguna keluar dari sesi login dan diarahkan ke halaman login. Halaman yang memerlukan autentikasi tidak dapat diakses kembali tanpa login.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

## 3. Test Cases — Admin Divisi

Test case untuk fitur login, input data karyawan, pengajuan makan divisi, dan logout.

## 4. Test Cases — Pihak Kantin

Test case untuk fitur login, verifikasi data pengajuan, penyelesaian pesanan, dan logout.

## 5. Test Cases — Karyawan

Test case untuk fitur registrasi, login, check-in, melihat menu makan, melihat riwayat, memberikan rating, dan logout.

## 6. Catatan

Dokumentasi ini disusun ulang secara mandiri berdasarkan pengalaman pengujian manual. Dokumen internal dan informasi sensitif perusahaan tidak disertakan.
