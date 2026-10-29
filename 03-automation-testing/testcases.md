# 📄 Test Cases Documentation - School Management System

Dokumen ini berisi daftar skenario pengujian otomatis (*automated test cases*) yang dirancang untuk menguji fungsionalitas aplikasi Manajemen Sekolah menggunakan **Playwright**.

---

## 📋 Ringkasan Cakupan Modul

| Modul | Total Test Cases | Positive | Negative | Validation | Search | CRUD & Pagination |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Guru** (`guru.spec.js`) | 21 | 7 | 3 | 8 | 3 | 6 |
| **Jam Pelajaran** (`jampelajaran.spec.js`) | 20 | 6 | 4 | 8 | 3 | 6 |
| **Ekstrakurikuler** (`ekstrakurikuler.spec.js`) | 21 | 6 | 4 | 9 | 4 | 7 |
| **Jenis Cuti** (`jeniscuti.spec.js`) | 20 | 6 | 4 | 8 | 4 | 7 |
| **Jenis Jabatan** (`jenisjabatan.spec.js`) | 20 | 6 | 4 | 9 | 4 | 7 |
| **Jenis Pendapatan** (`jenispendapatan.spec.js`) | 21 | 6 | 4 | 10 | 4 | 7 |
| **Jenis Potongan** (`jenispotongan.spec.js`) | 21 | 6 | 4 | 10 | 4 | 7 |
| **Kelas** (`kelas.spec.js`) | 19 | 6 | 4 | 7 | 3 | 6 |
| **Mata Pelajaran** (`matapelajaran.spec.js`) | 20 | 6 | 4 | 7 | 4 | 7 |
| **Orang Tua** (`orangtua.spec.js`) | 15 | 5 | 3 | 5 | 3 | 4 |
| **Modul Akademik & Sistem** *(Ganti Semester, Jadwal, Siswa, Staff, dll)* | 32 | 12 | 6 | 8 | 6 | 8 |
| **TOTAL** | **236** | **72** | **43** | **89** | **42** | **74** |

---

## 📑 Rincian Test Cases Per Modul

### 1. Modul Data Guru (`guru.spec.js`)

| ID Test Case | Skrip Test / Skenario | Tipe Pengujian | Ekspektasi Hasil |
| :--- | :--- | :--- | :--- |
| `TC-GURU-001` | Halaman Data Guru berhasil dibuka dari menu Master Data | Positive | Marker halaman, input search, dan tombol tambah data tampil tanpa error. |
| `TC-GURU-002` | Tabel Guru menampilkan kolom utama | Positive | Tabel `#guru-table` memuat kolom nama, NIP, pelajaran, no HP, status, dan aksi. |
| `TC-GURU-003` | Halaman Tambah Guru berhasil dibuka | Positive | Form tambah guru terbuka dengan tombol simpan yang terlihat. |
| `TC-GURU-004` | Form Tambah Guru menampilkan field wajib | Positive | Field wajib (nama, NIK, email, gender, agama, dll) dapat diakses. |
| `TC-GURU-005` | Download template guru berhasil | Positive | File spreadsheet (.xlsx/.xls) berhasil diunduh dengan nama file yang sesuai. |
| `TC-GURU-006` | Import template guru menyediakan input file | Positive | Tombol import dan elemen `<input type="file">` terpasang pada DOM. |
| `TC-GURU-007` | Halaman Kelola Role Guru berhasil dibuka | Positive | Checkbox daftar role guru tampil secara interaktif. |
| `TC-GURU-008` | Hapus guru dibatalkan melalui confirm dialog | Negative | Pop-up konfirmasi muncul, setelah dibatalkan data tetap tampil di tabel. |
| `TC-GURU-009` | Batal kelola role guru kembali ke halaman Data Guru | Negative | Klik batal mengembalikan URL ke `/master-data/guru` tanpa menyimpan perubahan. |
| `TC-GURU-010` | Cari guru dengan keyword tidak ada | Negative | Tabel menampilkan pesan *No Data Available* (`NO_DATA_MESSAGE`) dan jumlah baris = 0. |
| `TC-GURU-011` | Mata pelajaran wajib tersedia pada form Tambah Guru | Validation | Tombol dropdown/select mata pelajaran tampil dan memuat opsi mata pelajaran. |
| `TC-GURU-012` | Status wajib tersedia pada form Tambah Guru | Validation | Opsi status aktif/non-aktif tersedia pada form. |
| `TC-GURU-013` | NIP wajib tampil pada tabel Guru | Validation | Kolom NIP ada pada header tabel dan td elemen ter-render pada baris data. |
| `TC-GURU-014` | Nama lengkap dan NIK wajib tersedia | Validation | Input `nama` dan `nik` memiliki atribut atribut name yang tepat pada form. |
| `TC-GURU-015` | Tanggal lahir wajib tersedia | Validation | Picker tanggal lahir dan elemen hidden input terpasang. |
| `TC-GURU-016` | Jenis kelamin wajib tersedia | Validation | Radio button opsi Laki-laki dan Perempuan berjumlah 2 item. |
| `TC-GURU-017` | Agama wajib tersedia | Validation | Dropdown agama memuat opsi Islam, Kristen, Katolik, Hindu, Budha, dll. |
| `TC-GURU-018` | Email wajib tersedia dan bertipe email | Validation | Input email terlihat dan memiliki atribut `type="email"`. |
| `TC-GURU-019` | Cari data Guru berdasarkan keyword | Search | Pencarian menghasilkan baris tabel yang mengandung kata kunci pencarian. |
| `TC-GURU-020` | Search data Guru bersifat case-insensitive | Search | Pencarian dengan huruf kecil memberikan hasil yang sama dengan kapital/mixed case. |
| `TC-GURU-021` | Clear search mengembalikan daftar Guru | Search | Mengosongkan input search mengembalikan daftar baris data semula. |

---

### 2. Modul Jam Pelajaran (`jampelajaran.spec.js`)

| ID Test Case | Skrip Test / Skenario | Tipe Pengujian | Ekspektasi Hasil |
| :--- | :--- | :--- | :--- |
| `TC-JAM-001` | Halaman Data Jam Pelajaran berhasil dibuka | Positive | Halaman memuat marker, tombol tambah, dan input search tanpa system error. |
| `TC-JAM-002` | Tabel Jam Pelajaran menampilkan kolom utama | Positive | Tabel `#jampelajaran-table` memuat kolom urutan, nama, waktu, istirahat, dll. |
| `TC-JAM-003` | Form Tambah Jam Pelajaran berhasil dibuka | Positive | Modal/form tambah terbuka dengan judul dan tombol simpan. |
| `TC-JAM-004` | Modal Tambah Jam Pelajaran memuat field wajib/opsional | Positive | Field urutan, nama jam, jam mulai, jam selesai, dan checkbox default terpasang. |
| `TC-JAM-005` | Form Edit Jam Pelajaran berhasil dibuka | Positive | Modal edit terbuka dengan judul *Edit Jam Pelajaran*. |
| `TC-JAM-006` | Dialog Hapus Jam Pelajaran berhasil dibuka | Positive | Pop-up konfirmasi hapus menampilkan teks konfirmasi yang sesuai. |
| `TC-JAM-007` | Batal tambah jam pelajaran menutup modal | Negative | Modal tertutup tanpa menyimpan dan data tabel tetap utuh. |
| `TC-JAM-008` | Batal edit jam pelajaran menutup modal | Negative | Perubahan dibatalkan dan modal tersembunyi. |
| `TC-JAM-009` | Batal hapus jam pelajaran menutup dialog | Negative | Dialog ditutup dan data baris target tidak terhapus. |
| `TC-JAM-010` | Cari jam pelajaran keyword acak | Negative | Menampilkan pesan data kosong (`NO_DATA_MESSAGE`). |
| `TC-JAM-011` | No urutan wajib tersedia | Validation | Input urutan bertipe number dan memiliki nama `jam_pelajaran_ke`. |
| `TC-JAM-012` | Nama jam wajib tersedia | Validation | Input nama jam bertipe text dan memiliki atribut `name="nama"`. |
| `TC-JAM-013` | Mulai dan selesai wajib tersedia | Validation | Tombol/picker jam mulai dan jam selesai terikat pada form. |
| `TC-JAM-014` | Deskripsi bersifat opsional | Validation | Field deskripsi tersedia dengan atribut `name="deskripsi"`. |
| `TC-JAM-015` | Checkbox jam istirahat tersedia opsional | Validation | Checkbox `istirahat` terpasang di DOM. |
| `TC-JAM-016` | Checkbox status default tersedia opsional | Validation | Checkbox `is_default` terpasang di DOM. |
| `TC-JAM-017` | Submit form kosong memicu pesan validasi | Validation | Form tidak terproses dan pesan peringatan field wajib muncul. |
| `TC-JAM-018` | Cari data Jam Pelajaran berdasarkan keyword | Search | Data baris yang cocok dengan keyword berhasil ditampilkan. |
| `TC-JAM-019` | Search bersifat case-insensitive | Search | Kata kunci huruf kecil cocok dengan data huruf besar. |
| `TC-JAM-020` | Test pagination & ubah limit ke 25/50 data | CRUD | Jumlah tampilan baris per halaman dapat diubah via select option. |

---

### 3. Modul Ekstrakurikuler (`ekstrakurikuler.spec.js`)

| ID Test Case | Skrip Test / Skenario | Tipe Pengujian | Ekspektasi Hasil |
| :--- | :--- | :--- | :--- |
| `TC-EKS-001` | Halaman Data Ekstrakurikuler berhasil dibuka | Positive | Tampilan utama memuat tabel `#ekstrakurikuler-table`. |
| `TC-EKS-002` | Form Tambah Ekstrakurikuler terbuka | Positive | Modal tambah menampilkan field kode, nama, dan deskripsi. |
| `TC-EKS-003` | Form Edit Ekstrakurikuler terbuka | Positive | Modal edit terisi otomatis dengan data eksisting baris terpilih. |
| `TC-EKS-004` | Submit form tambah kosong memicu validasi | Validation | Modal bertahan dan menampilkan pesan peringatan validasi bintang `*`. |
| `TC-EKS-005` | Cari berdasarkan kode ekstrakurikuler | Search | Mengembalikan tepat baris data dengan kode unik yang dicari. |
| `TC-EKS-006` | Navigasi pagination baris data | CRUD | Tombol *Next/Previous* berfungsi mengubah halaman tabel jika data > 10. |

---

### 4. Modul Finansial: Pendapatan & Potongan (`jenispendapatan.spec.js` & `jenispotongan.spec.js`)

| ID Test Case | Skrip Test / Skenario | Tipe Pengujian | Ekspektasi Hasil |
| :--- | :--- | :--- | :--- |
| `TC-FIN-001` | Halaman Jenis Pendapatan/Potongan dibuka | Positive | Tabel memuat kolom nama, kode, nominal, komponen tetap, status, & aksi. |
| `TC-FIN-002` | Form Tambah Komponen Keuangan terbuka | Positive | Field input `nama_komponen`, `kode_komponen`, & `nominal_komponen` terlihat. |
| `TC-FIN-003` | Validasi input nominal keuangan | Validation | Input nominal menggunakan field validasi angka/tipe terformat. |
| `TC-FIN-004` | Pengaturan Komponen Tetap (Fixed Component) | Validation | Checkbox `komponen_tetap` terpasang sebagai pilihan opsional. |
| `TC-FIN-005` | Pengaturan Status Aktif/Non-aktif | Validation | Radio button status memuat pilihan `aktif` dan `nonaktif`. |

---

### 5. Modul Orang Tua & Siswa (`orangtua.spec.js` & `siswa.spec.js`)

| ID Test Case | Skrip Test / Skenario | Tipe Pengujian | Ekspektasi Hasil |
| :--- | :--- | :--- | :--- |
| `TC-ORTU-001` | Halaman Data Orang Tua terbuka | Positive | Tabel `#orangtua-table` menampilkan relasi nama siswa, kelas, ayah, dan ibu. |
| `TC-ORTU-002` | Detail data Orang Tua menampilkan informasi komprehensif | Positive | Halaman detail menyajikan section data siswa, data ayah, dan data ibu. |
| `TC-ORTU-003` | Batal edit Orang Tua kembali ke halaman detail | Negative | Tombol Batal mengarahkan kembali ke route `/master-data/orang_tua/:id`. |
| `TC-ORTU-004` | Tombol kembali pada detail mengarah ke daftar utama | Negative | Mengembalikan navigasi ke daftar tabel utama `/master-data/orang_tua`. |
| `TC-ORTU-005` | Form edit memuat selector wilayah (Provinsi & Kota) | Validation | Selector dropdown provinsi dan kota/kabupaten berinteraksi normal. |
