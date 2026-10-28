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

### TC-AD-001 — Login dengan kredensial valid

- **Preconditions:** Data Admin Divisi telah disiapkan dan akun sudah dapat digunakan.
- **Test Steps:**
  1. Buka halaman login.
  2. Masukkan username dan password yang valid.
  3. Klik tombol Login.
- **Test Data:** Akun pengujian Admin Divisi yang valid.
- **Expected Result:** Pengguna berhasil login dan diarahkan ke halaman utama Admin Divisi.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-AD-002 — Login dengan password salah

- **Preconditions:** Akun Admin Divisi sudah terdaftar dan dapat digunakan.
- **Test Steps:**
  1. Buka halaman login.
  2. Masukkan username yang valid.
  3. Masukkan password yang salah.
  4. Klik tombol Login.
- **Test Data:** Username valid dan password tidak valid.
- **Expected Result:** Sistem menolak login dan menampilkan pesan kesalahan.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-AD-003 — Input data karyawan dengan data valid

- **Preconditions:** Admin Divisi sudah login dan memiliki akses ke fitur input data karyawan.
- **Test Steps:**
  1. Buka halaman input data karyawan.
  2. Isi formulir dengan data karyawan yang valid.
  3. Klik tombol Simpan atau tombol sejenis.
  4. Periksa hasil penyimpanan data.
- **Test Data:** Data karyawan fiktif untuk pengujian.
- **Expected Result:** Data karyawan berhasil disimpan dan ditampilkan sesuai ketentuan sistem.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-AD-004 — Input data karyawan dengan kolom wajib kosong

- **Preconditions:** Admin Divisi sudah login dan memiliki akses ke fitur input data karyawan.
- **Test Steps:**
  1. Buka halaman input data karyawan.
  2. Isi formulir dengan data yang valid, tetapi biarkan salah satu kolom wajib kosong.
  3. Klik tombol Simpan atau tombol sejenis.
  4. Amati respons sistem.
- **Test Data:** Data karyawan fiktif dengan salah satu kolom wajib tidak diisi.
- **Expected Result:** Sistem menolak penyimpanan data yang tidak lengkap dan memberikan informasi validasi pada kolom yang wajib diisi.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-AD-005 — Pengajuan makan untuk divisi

- **Preconditions:** Admin Divisi sudah login dan memiliki akses ke fitur pengajuan makan.
- **Test Steps:**
  1. Buka halaman pengajuan makan divisi.
  2. Isi formulir pengajuan sesuai ketentuan sistem.
  3. Periksa kembali data yang dimasukkan.
  4. Klik tombol Simpan atau Kirim.
  5. Periksa hasil pengajuan.
- **Test Data:** Data pengajuan makan menggunakan data fiktif.
- **Expected Result:** Pengajuan makan berhasil dikirim dan tercatat sesuai ketentuan sistem.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-AD-006 — Logout dari akun Admin Divisi

- **Preconditions:** Admin Divisi sudah login ke sistem.
- **Test Steps:**
  1. Klik menu atau tombol Logout.
  2. Amati halaman yang ditampilkan setelah logout.
  3. Jika memungkinkan, coba akses kembali halaman yang memerlukan autentikasi melalui navigasi browser.
- **Test Data:** Akun Admin Divisi yang sudah login.
- **Expected Result:** Pengguna berhasil logout dan diarahkan ke halaman login. Halaman yang memerlukan autentikasi tidak dapat diakses kembali tanpa login.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-AD-007 — Pengajuan makan dengan data tidak lengkap

- **Preconditions:** Admin Divisi sudah login dan memiliki akses ke fitur pengajuan makan.
- **Test Steps:**
  1. Buka halaman pengajuan makan divisi.
  2. Isi formulir pengajuan dengan data yang valid, tetapi kosongkan salah satu kolom wajib.
  3. Klik tombol Simpan atau Kirim.
  4. Amati respons sistem.
- **Test Data:** Data pengajuan makan menggunakan data fiktif dengan salah satu kolom wajib tidak diisi.
- **Expected Result:** Sistem menolak pengajuan yang tidak lengkap dan menampilkan informasi validasi sesuai aturan sistem.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

## 4. Test Cases — Pihak Kantin

Test case untuk fitur login, verifikasi data pengajuan, penyelesaian pesanan, dan logout.

## 5. Test Cases — Karyawan

Test case untuk fitur registrasi, login, check-in, melihat menu makan, melihat riwayat, memberikan rating, dan logout.

## 6. Catatan

Dokumentasi ini disusun ulang secara mandiri berdasarkan pengalaman pengujian manual. Dokumen internal dan informasi sensitif perusahaan tidak disertakan.
