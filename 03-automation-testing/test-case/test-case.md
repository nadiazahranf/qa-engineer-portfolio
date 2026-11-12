# Test Cases Documentation — School Management System

## 1. Gambaran Umum

Dokumen ini berisi dokumentasi skenario pengujian otomatis (*automated test cases*) untuk memvalidasi fungsionalitas aplikasi School Management System menggunakan Playwright dan JavaScript.

Test cases disusun berdasarkan fitur dan modul aplikasi, mencakup pengujian positif, negatif, validasi input, pencarian data, serta pengelolaan data melalui operasi CRUD dan pagination.

Dokumentasi ini disiapkan untuk keperluan portofolio dan tidak menyertakan kode sumber maupun informasi rahasia perusahaan.

## 2. Ringkasan Cakupan Pengujian

### 2.1 Rekapitulasi Test Cases per Modul

| No. | Modul | File Automation | Total Test Cases |
|---|---|---|---:|
| 1 | Guru | `guru.spec.js` | 21 |
| 2 | Jam Pelajaran | `jampelajaran.spec.js` | 20 |
| 3 | Ekstrakurikuler | `ekstrakurikuler.spec.js` | 21 |
| 4 | Jenis Cuti | `jeniscuti.spec.js` | 20 |
| 5 | Jenis Jabatan | `jenisjabatan.spec.js` | 20 |
| 6 | Jenis Pendapatan | `jenispendapatan.spec.js` | 21 |
| 7 | Jenis Potongan | `jenispotongan.spec.js` | 21 |
| 8 | Kelas | `kelas.spec.js` | 19 |
| 9 | Mata Pelajaran | `matapelajaran.spec.js` | 20 |
| 10 | Orang Tua | `orangtua.spec.js` | 15 |
| 11 | Modul Akademik & Sistem | Beberapa file spec | 32 |
| | **Total berdasarkan penjumlahan modul** | | **230** |

### 2.2 Kategori Pengujian

| Kategori | Jumlah |
|---|---:|
| Positive Testing | 72 |
| Negative Testing | 43 |
| Validation Testing | 89 |
| Search Testing | 42 |
| CRUD & Pagination | 74 |

## 3. Rincian Test Cases per Modul

### 3.1 Modul Data Guru (`guru.spec.js`)

| ID | Skenario Pengujian | Tipe | Expected Result |
|---|---|---|---|
| TC-GURU-001 | Membuka halaman Data Guru melalui menu Master Data | Positive | Penanda halaman, input pencarian, dan tombol tambah data tampil tanpa error. |
| TC-GURU-002 | Memvalidasi kolom utama tabel Guru | Positive | Tabel `#guru-table` menampilkan kolom nama, NIP, pelajaran, nomor HP, status, dan aksi. |
| TC-GURU-003 | Membuka halaman Tambah Guru | Positive | Form tambah guru terbuka dan tombol simpan terlihat. |
| TC-GURU-004 | Memvalidasi field pada form Tambah Guru | Positive | Field yang diperlukan seperti nama, NIK, email, jenis kelamin, dan agama dapat diakses. |
| TC-GURU-005 | Mengunduh template Guru | Positive | File spreadsheet berhasil diunduh dengan nama file yang sesuai. |
| TC-GURU-006 | Memvalidasi fitur import template Guru | Positive | Tombol import dan elemen `input[type="file"]` tersedia pada DOM. |
| TC-GURU-007 | Membuka halaman Kelola Role Guru | Positive | Checkbox daftar role guru tampil dan dapat diinteraksikan. |
| TC-GURU-008 | Membatalkan penghapusan data Guru | Negative | Dialog konfirmasi muncul dan data tetap tersedia setelah penghapusan dibatalkan. |
| TC-GURU-009 | Membatalkan pengelolaan role Guru | Negative | Pengguna kembali ke halaman Data Guru tanpa menyimpan perubahan. |
| TC-GURU-010 | Mencari data Guru menggunakan keyword yang tidak tersedia | Negative | Tabel menampilkan pesan `NO_DATA_MESSAGE` dan tidak memiliki baris data. |
| TC-GURU-011 | Memvalidasi ketersediaan mata pelajaran pada form Guru | Validation | Dropdown mata pelajaran tampil dan menyediakan opsi yang tersedia. |
| TC-GURU-012 | Memvalidasi pilihan status Guru | Validation | Opsi status aktif dan nonaktif tersedia pada form. |
| TC-GURU-013 | Memvalidasi kolom NIP pada tabel Guru | Validation | Kolom NIP tersedia pada header tabel dan elemen sel data dirender. |
| TC-GURU-014 | Memvalidasi field nama lengkap dan NIK | Validation | Input nama dan NIK memiliki atribut `name` yang sesuai. |
| TC-GURU-015 | Memvalidasi field tanggal lahir | Validation | Date picker dan elemen hidden input tersedia. |
| TC-GURU-016 | Memvalidasi pilihan jenis kelamin | Validation | Tersedia dua pilihan radio button: Laki-laki dan Perempuan. |
| TC-GURU-017 | Memvalidasi pilihan agama | Validation | Dropdown agama menyediakan opsi yang tersedia. |
| TC-GURU-018 | Memvalidasi field email | Validation | Input email terlihat dan memiliki atribut `type="email"`. |
| TC-GURU-019 | Mencari data Guru berdasarkan keyword | Search | Tabel menampilkan data yang sesuai dengan keyword pencarian. |
| TC-GURU-020 | Memvalidasi pencarian Guru tanpa membedakan huruf besar dan kecil | Search | Pencarian dengan huruf kecil, kapital, atau kombinasi menghasilkan kecocokan yang sama. |
| TC-GURU-021 | Menghapus keyword pencarian Guru | Search | Daftar Guru ditampilkan kembali setelah input pencarian dikosongkan. |

### 3.2 Modul Jam Pelajaran (`jampelajaran.spec.js`)

| ID | Skenario Pengujian | Tipe | Expected Result |
|---|---|---|---|
| TC-JAM-001 | Membuka halaman Data Jam Pelajaran | Positive | Halaman menampilkan penanda halaman, tombol tambah, dan input pencarian tanpa system error. |
| TC-JAM-002 | Memvalidasi kolom utama tabel Jam Pelajaran | Positive | Tabel `#jampelajaran-table` menampilkan kolom urutan, nama, waktu, istirahat, dan informasi terkait. |
| TC-JAM-003 | Membuka form Tambah Jam Pelajaran | Positive | Modal atau form tambah terbuka dengan judul dan tombol simpan. |
| TC-JAM-004 | Memvalidasi field pada modal Tambah Jam Pelajaran | Positive | Field urutan, nama jam, jam mulai, jam selesai, dan checkbox default tersedia. |
| TC-JAM-005 | Membuka form Edit Jam Pelajaran | Positive | Modal edit terbuka dengan judul Edit Jam Pelajaran. |
| TC-JAM-006 | Membuka dialog Hapus Jam Pelajaran | Positive | Dialog konfirmasi menampilkan informasi konfirmasi penghapusan. |
| TC-JAM-007 | Membatalkan proses tambah Jam Pelajaran | Negative | Modal tertutup tanpa menyimpan data. |
| TC-JAM-008 | Membatalkan proses edit Jam Pelajaran | Negative | Perubahan dibatalkan dan modal edit tertutup. |
| TC-JAM-009 | Membatalkan penghapusan Jam Pelajaran | Negative | Dialog tertutup dan data target tidak terhapus. |
| TC-JAM-010 | Mencari Jam Pelajaran menggunakan keyword tidak valid | Negative | Tabel menampilkan pesan `NO_DATA_MESSAGE`. |
| TC-JAM-011 | Memvalidasi field nomor urutan | Validation | Input urutan bertipe number dan memiliki atribut `name="jam_pelajaran_ke"`. |
| TC-JAM-012 | Memvalidasi field nama Jam Pelajaran | Validation | Input nama bertipe text dan memiliki atribut `name="nama"`. |
| TC-JAM-013 | Memvalidasi field waktu mulai dan selesai | Validation | Picker atau tombol waktu mulai dan selesai tersedia pada form. |
| TC-JAM-014 | Memvalidasi field deskripsi | Validation | Field deskripsi tersedia sebagai input opsional. |
| TC-JAM-015 | Memvalidasi checkbox jam istirahat | Validation | Checkbox istirahat tersedia pada DOM. |
| TC-JAM-016 | Memvalidasi checkbox status default | Validation | Checkbox `is_default` tersedia pada DOM. |
| TC-JAM-017 | Mengirim form kosong | Validation | Form tidak berhasil diproses dan pesan validasi field wajib ditampilkan. |
| TC-JAM-018 | Mencari data Jam Pelajaran berdasarkan keyword | Search | Baris data yang sesuai dengan keyword ditampilkan. |
| TC-JAM-019 | Memvalidasi pencarian tanpa membedakan huruf besar dan kecil | Search | Keyword dengan variasi kapitalisasi tetap menghasilkan kecocokan data. |
| TC-JAM-020 | Memvalidasi pagination dan perubahan jumlah data per halaman | CRUD & Pagination | Pilihan jumlah baris per halaman dapat diubah melalui select option. |

### 3.3 Modul Ekstrakurikuler (`ekstrakurikuler.spec.js`)

| ID | Skenario Pengujian | Tipe | Expected Result |
|---|---|---|---|
| TC-EKS-001 | Membuka halaman Data Ekstrakurikuler | Positive | Halaman menampilkan tabel `#ekstrakurikuler-table`. |
| TC-EKS-002 | Membuka form Tambah Ekstrakurikuler | Positive | Modal tambah menampilkan field kode, nama, dan deskripsi. |
| TC-EKS-003 | Membuka form Edit Ekstrakurikuler | Positive | Modal edit menampilkan data dari baris yang dipilih. |
| TC-EKS-004 | Mengirim form tambah dalam keadaan kosong | Validation | Modal tetap terbuka dan pesan validasi field wajib ditampilkan. |
| TC-EKS-005 | Mencari data berdasarkan kode Ekstrakurikuler | Search | Sistem menampilkan baris data yang sesuai dengan kode pencarian. |
| TC-EKS-006 | Memvalidasi navigasi pagination | CRUD & Pagination | Tombol Next dan Previous dapat mengubah halaman ketika jumlah data melebihi batas per halaman. |

### 3.4 Modul Finansial — Jenis Pendapatan dan Potongan

File automation: `jenispendapatan.spec.js` dan `jenispotongan.spec.js`.

| ID | Skenario Pengujian | Tipe | Expected Result |
|---|---|---|---|
| TC-FIN-001 | Membuka halaman Jenis Pendapatan atau Jenis Potongan | Positive | Tabel menampilkan kolom nama, kode, nominal, komponen tetap, status, dan aksi. |
| TC-FIN-002 | Membuka form Tambah Komponen Keuangan | Positive | Field nama komponen, kode komponen, dan nominal komponen tersedia. |
| TC-FIN-003 | Memvalidasi input nominal keuangan | Validation | Input nominal menggunakan field dengan validasi angka atau format nominal. |
| TC-FIN-004 | Memvalidasi pengaturan komponen tetap | Validation | Checkbox komponen tetap tersedia sebagai pilihan opsional. |
| TC-FIN-005 | Memvalidasi status komponen keuangan | Validation | Radio button menyediakan pilihan aktif dan nonaktif. |

### 3.5 Modul Orang Tua dan Siswa

File automation: `orangtua.spec.js` dan `siswa.spec.js`.

| ID | Skenario Pengujian | Tipe | Expected Result |
|---|---|---|---|
| TC-ORTU-001 | Membuka halaman Data Orang Tua | Positive | Tabel `#orangtua-table` menampilkan relasi nama siswa, kelas, ayah, dan ibu. |
| TC-ORTU-002 | Memvalidasi halaman detail Orang Tua | Positive | Halaman detail menampilkan bagian data siswa, data ayah, dan data ibu. |
| TC-ORTU-003 | Membatalkan proses edit data Orang Tua | Negative | Pengguna kembali ke halaman detail tanpa menyimpan perubahan. |
| TC-ORTU-004 | Menggunakan tombol kembali pada halaman detail | Negative | Pengguna kembali ke halaman daftar Data Orang Tua. |
| TC-ORTU-005 | Memvalidasi selector wilayah pada form edit Orang Tua | Validation | Dropdown provinsi dan kota/kabupaten tersedia dan dapat diinteraksikan. |

### 3.6 Modul Lainnya

Selain modul yang dirinci di atas, automation testing juga mencakup modul:

- Jenis Cuti (`jeniscuti.spec.js`)
- Jenis Jabatan (`jenisjabatan.spec.js`)
- Kelas (`kelas.spec.js`)
- Mata Pelajaran (`matapelajaran.spec.js`)
- Modul Akademik dan Sistem, seperti Ganti Semester, Jadwal, Siswa, dan Staff.

Rincian skenario masing-masing modul mengikuti test scripts dan dokumentasi pengujian yang tersedia.

## 4. Kriteria Hasil Pengujian

Setiap test case memiliki hasil eksekusi berdasarkan perbandingan antara *actual result* dan *expected result*.

| Status | Keterangan |
|---|---|
| PASS | Hasil aktual sesuai dengan expected result. |
| FAIL | Hasil aktual tidak sesuai dengan expected result. |
| SKIPPED | Test case tidak dijalankan atau dilewati. |
| NOT EXECUTED | Test case belum dieksekusi. |


## 5. Catatan

- Dokumentasi disusun untuk keperluan portofolio.
- Nama file dan ID test case digunakan untuk membantu pemetaan antara skenario dan automation scripts.
- Tidak seluruh rincian test case ditampilkan dalam dokumen ini.
- Informasi internal, data pengguna, kredensial, dan kode sumber perusahaan tidak disertakan dalam dokumentasi publik.
