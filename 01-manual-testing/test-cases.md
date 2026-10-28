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

### TC-PK-001 — Login dengan kredensial valid

- **Preconditions:** Akun Pihak Kantin sudah terdaftar dan dapat digunakan.
- **Test Steps:**
  1. Buka halaman login.
  2. Masukkan username dan password yang valid.
  3. Klik tombol Login.
  4. Amati halaman yang ditampilkan setelah login.
- **Test Data:** Akun pengujian Pihak Kantin yang valid.
- **Expected Result:** Pengguna berhasil login dan diarahkan ke halaman utama Pihak Kantin.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-PK-002 — Login dengan password salah

- **Preconditions:** Akun Pihak Kantin sudah terdaftar.
- **Test Steps:**
  1. Buka halaman login.
  2. Masukkan username yang valid.
  3. Masukkan password yang salah.
  4. Klik tombol Login.
  5. Amati respons sistem.
- **Test Data:** Username valid dan password tidak valid.
- **Expected Result:** Sistem menolak login dan menampilkan pesan kesalahan.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-PK-003 — Menambahkan menu makan baru

- **Preconditions:** Pengguna sudah login sebagai Pihak Kantin dan memiliki akses ke fitur pengelolaan menu makan.
- **Test Steps:**
  1. Buka halaman pengelolaan menu makan.
  2. Pilih fitur untuk menambahkan menu baru.
  3. Isi informasi menu sesuai kolom yang tersedia.
  4. Klik tombol Simpan atau tombol sejenis.
  5. Periksa apakah menu baru muncul pada halaman menu makan.
- **Test Data:** Informasi menu makan menggunakan data pengujian yang tidak sensitif.
- **Expected Result:** Menu makan berhasil disimpan dan langsung ditampilkan pada halaman menu tanpa perlu login ulang.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-PK-004 — Menambahkan menu makan dengan data tidak lengkap

- **Preconditions:** Pengguna sudah login sebagai Pihak Kantin dan memiliki akses ke fitur pengelolaan menu makan.
- **Test Steps:**
  1. Buka halaman pengelolaan menu makan.
  2. Pilih fitur untuk menambahkan menu baru.
  3. Isi formulir menu, tetapi kosongkan salah satu kolom wajib.
  4. Klik tombol Simpan atau tombol sejenis.
  5. Amati respons sistem.
- **Test Data:** Data menu makan dengan salah satu kolom wajib tidak diisi.
- **Expected Result:** Sistem menolak penyimpanan menu yang tidak lengkap dan menampilkan informasi validasi sesuai aturan sistem.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-PK-005 — Memverifikasi pengajuan makan

- **Preconditions:** Pengguna sudah login sebagai Pihak Kantin dan tersedia pengajuan makan yang perlu diverifikasi.
- **Test Steps:**
  1. Buka halaman daftar pengajuan makan.
  2. Pilih salah satu pengajuan yang perlu diverifikasi.
  3. Periksa informasi pengajuan.
  4. Lakukan tindakan verifikasi sesuai fitur yang tersedia.
  5. Periksa perubahan status pengajuan.
- **Test Data:** Data pengajuan makan fiktif untuk keperluan pengujian.
- **Expected Result:** Pengajuan berhasil diproses sesuai aturan sistem dan statusnya diperbarui dengan benar.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-PK-006 — Menyelesaikan pesanan makan

- **Preconditions:** Pengguna sudah login sebagai Pihak Kantin dan tersedia pesanan makan yang dapat diproses.
- **Test Steps:**
  1. Buka halaman daftar pesanan makan.
  2. Pilih pesanan yang akan diproses.
  3. Periksa informasi pesanan.
  4. Klik tombol untuk menyelesaikan pesanan jika tersedia.
  5. Periksa status pesanan setelah tindakan dilakukan.
- **Test Data:** Data pesanan makan fiktif untuk keperluan pengujian.
- **Expected Result:** Pesanan berhasil ditandai selesai dan statusnya diperbarui sesuai aturan sistem.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-PK-007 — Menyelesaikan pesanan yang belum memenuhi persyaratan

- **Preconditions:** Pengguna sudah login sebagai Pihak Kantin dan tersedia pesanan yang belum memenuhi persyaratan untuk diselesaikan.
- **Test Steps:**
  1. Buka halaman daftar pesanan makan.
  2. Pilih pesanan yang belum memenuhi persyaratan untuk diselesaikan.
  3. Coba lakukan tindakan penyelesaian pesanan.
  4. Amati respons sistem dan perubahan status pesanan.
- **Test Data:** Pesanan pengujian dengan kondisi yang belum memenuhi persyaratan penyelesaian.
- **Expected Result:** Sistem mencegah penyelesaian pesanan yang belum memenuhi persyaratan sesuai aturan sistem.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-PK-008 — Memverifikasi pengajuan dengan data tidak lengkap

- **Preconditions:** Pengguna sudah login sebagai Pihak Kantin dan tersedia pengajuan makan dengan informasi yang tidak lengkap.
- **Test Steps:**
  1. Buka halaman daftar pengajuan makan.
  2. Pilih pengajuan dengan informasi yang tidak lengkap.
  3. Periksa informasi pengajuan.
  4. Coba lakukan tindakan verifikasi.
  5. Amati respons sistem dan perubahan status pengajuan.
- **Test Data:** Data pengajuan pengujian dengan informasi yang tidak lengkap.
- **Expected Result:** Sistem menangani pengajuan sesuai aturan validasi dan tidak meloloskan pengajuan yang tidak memenuhi persyaratan.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

## 5. Test Cases — Karyawan

### TC-KRY-001 — Login dengan kredensial valid

- **Preconditions:** Akun karyawan sudah terdaftar dan dapat digunakan.
- **Test Steps:**
  1. Buka halaman login.
  2. Masukkan username dan password yang valid.
  3. Klik tombol Login.
  4. Amati halaman yang ditampilkan setelah login.
- **Test Data:** Akun pengujian karyawan yang valid.
- **Expected Result:** Pengguna berhasil login dan diarahkan ke halaman utama karyawan.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-002 — Login dengan password salah

- **Preconditions:** Akun karyawan sudah terdaftar.
- **Test Steps:**
  1. Buka halaman login.
  2. Masukkan username yang valid.
  3. Masukkan password yang salah.
  4. Klik tombol Login.
  5. Amati respons sistem.
- **Test Data:** Username valid dan password tidak valid.
- **Expected Result:** Sistem menolak login dan menampilkan pesan kesalahan.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-003 — Registrasi akun karyawan dengan data valid

- **Preconditions:** Pengguna belum memiliki akun dan halaman registrasi dapat diakses.
- **Test Steps:**
  1. Buka halaman registrasi karyawan.
  2. Isi seluruh kolom wajib dengan data yang valid.
  3. Klik tombol Daftar atau tombol sejenis.
  4. Amati respons sistem.
- **Test Data:** Data identitas fiktif untuk pengujian.
- **Expected Result:** Sistem memproses registrasi sesuai aturan dan memberikan informasi bahwa proses berhasil.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-004 — Registrasi dengan kolom wajib kosong

- **Preconditions:** Pengguna belum memiliki akun dan halaman registrasi dapat diakses.
- **Test Steps:**
  1. Buka halaman registrasi karyawan.
  2. Isi formulir registrasi, tetapi kosongkan salah satu kolom wajib.
  3. Klik tombol Daftar atau tombol sejenis.
  4. Amati respons sistem.
- **Test Data:** Data registrasi fiktif dengan salah satu kolom wajib tidak diisi.
- **Expected Result:** Sistem menolak registrasi yang tidak lengkap dan menampilkan informasi validasi sesuai aturan sistem.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-005 — Check-in karyawan

- **Preconditions:** Karyawan sudah login dan fitur check-in dapat diakses.
- **Test Steps:**
  1. Buka halaman check-in.
  2. Lakukan proses check-in sesuai mekanisme yang tersedia.
  3. Amati respons sistem.
  4. Periksa apakah status check-in tercatat.
- **Test Data:** Akun pengujian karyawan yang valid.
- **Expected Result:** Sistem memproses check-in dan menampilkan status sesuai kondisi serta aturan yang berlaku.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-006 — Check-in tanpa login

- **Preconditions:** Pengguna belum login dan belum memiliki sesi autentikasi aktif.
- **Test Steps:**
  1. Buka halaman check-in melalui URL atau navigasi yang tersedia.
  2. Coba lakukan proses check-in tanpa login.
  3. Amati respons sistem.
- **Test Data:** Pengguna tanpa sesi login.
- **Expected Result:** Sistem menolak akses ke fitur check-in dan meminta pengguna login terlebih dahulu.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

  ### TC-KRY-007 — Melihat daftar menu makan

- **Preconditions:** Karyawan sudah login dan halaman menu makan dapat diakses.
- **Test Steps:**
  1. Buka halaman menu makan.
  2. Amati daftar menu yang ditampilkan.
  3. Periksa informasi menu yang tersedia.
- **Test Data:** Akun pengujian karyawan yang valid.
- **Expected Result:** Sistem menampilkan daftar menu makan sesuai data yang tersedia.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

  ### TC-KRY-008 — Mengakses menu makan tanpa login

- **Preconditions:** Pengguna belum login dan tidak memiliki sesi autentikasi aktif.
- **Test Steps:**
  1. Buka halaman menu makan melalui URL atau navigasi yang tersedia.
  2. Amati apakah daftar menu dapat diakses.
- **Test Data:** Pengguna tanpa sesi login.
- **Expected Result:** Sistem menerapkan aturan akses yang berlaku dan tidak menampilkan informasi yang seharusnya hanya dapat diakses oleh pengguna yang sudah login.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-009 — Melihat riwayat makan

- **Preconditions:** Karyawan sudah login dan memiliki akses ke fitur riwayat makan.
- **Test Steps:**
  1. Buka halaman riwayat makan.
  2. Amati daftar riwayat yang ditampilkan.
  3. Periksa informasi riwayat yang tersedia.
- **Test Data:** Akun pengujian karyawan dengan data riwayat yang sesuai.
- **Expected Result:** Sistem menampilkan riwayat makan sesuai data yang tercatat untuk akun karyawan tersebut.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-010 — Memastikan riwayat makan tidak menampilkan data karyawan lain

- **Preconditions:** Karyawan sudah login dan tersedia data riwayat dari lebih dari satu akun pengujian.
- **Test Steps:**
  1. Login menggunakan akun karyawan A.
  2. Buka halaman riwayat makan.
  3. Periksa apakah data yang ditampilkan hanya milik akun karyawan A.
  4. Jika tersedia, bandingkan dengan data milik akun karyawan B menggunakan akun pengujian yang terpisah.
- **Test Data:** Data riwayat dari dua akun karyawan fiktif.
- **Expected Result:** Sistem hanya menampilkan riwayat yang sesuai dengan akun karyawan yang sedang login.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-011 — Memberikan rating menu makan

- **Preconditions:** Karyawan sudah login dan fitur rating menu makan tersedia.
- **Test Steps:**
  1. Buka halaman menu makan atau halaman yang menyediakan fitur rating.
  2. Pilih menu yang ingin diberi rating.
  3. Berikan rating sesuai pilihan yang tersedia.
  4. Kirim atau simpan rating.
  5. Amati respons sistem.
- **Test Data:** Akun pengujian karyawan dan menu makan yang tersedia.
- **Expected Result:** Sistem menyimpan rating dan menampilkan konfirmasi atau perubahan sesuai perilaku yang dirancang.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-012 — Mengirim rating tanpa memilih nilai

- **Preconditions:** Karyawan sudah login dan fitur rating menu makan tersedia.
- **Test Steps:**
  1. Buka halaman yang menyediakan fitur rating menu makan.
  2. Pilih menu yang ingin diberi rating.
  3. Jangan memilih nilai rating.
  4. Klik tombol Kirim atau Simpan.
  5. Amati respons sistem.
- **Test Data:** Akun pengujian karyawan dan menu makan yang tersedia tanpa nilai rating yang dipilih.
- **Expected Result:** Sistem menolak pengiriman rating jika nilai merupakan kolom wajib dan menampilkan informasi validasi.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

### TC-KRY-013 — Logout dari akun Karyawan

- **Preconditions:** Karyawan sudah login ke sistem.
- **Test Steps:**
  1. Klik menu atau tombol Logout.
  2. Amati halaman yang ditampilkan setelah logout.
  3. Jika memungkinkan, coba akses kembali halaman yang memerlukan autentikasi melalui navigasi browser.
- **Test Data:** Akun pengujian karyawan yang sudah login.
- **Expected Result:** Pengguna berhasil logout dan diarahkan ke halaman login. Halaman yang memerlukan autentikasi tidak dapat diakses kembali tanpa login.
- **Actual Result:** Belum dicatat dalam dokumentasi portofolio.
- **Status:** Belum ditentukan.

## 6. Catatan

Dokumentasi ini disusun ulang secara mandiri berdasarkan pengalaman pengujian manual. Dokumen internal dan informasi sensitif perusahaan tidak disertakan.
