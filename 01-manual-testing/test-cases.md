# Test Cases — Simulasi Sistem Pengajuan Makan

## 1. Informasi Proyek

| Informasi | Detail |
|---|---|
| Nama proyek | Simulasi Sistem Pengajuan Makan |
| Jenis pengujian | Manual Testing |
| Pendekatan | Black-box Testing |
| Tujuan | Memastikan formulir pengajuan dapat menerima data yang valid dan menolak data yang tidak sesuai |

## 2. Test Scenarios

Pengujian berfokus pada pengisian formulir pengajuan makan, validasi data wajib, dan respons sistem setelah formulir dikirim.

## 3. Test Cases

| Test Case ID | Test Scenario | Test Steps | Test Data | Expected Result |
|---|---|---|---|---|
| TC-001 | Mengirim formulir dengan data valid | 1. Buka halaman pengajuan. 2. Isi seluruh kolom wajib. 3. Klik tombol Kirim. | Nama: Andi; Tanggal: 2026-10-29; Jumlah: 1 | Sistem menerima pengajuan dan menampilkan pesan keberhasilan. |
| TC-002 | Mengirim formulir tanpa mengisi nama | 1. Buka halaman pengajuan. 2. Kosongkan kolom nama. 3. Isi kolom wajib lainnya. 4. Klik tombol Kirim. | Nama: kosong; Tanggal: 2026-10-29; Jumlah: 1 | Sistem menolak pengajuan dan memberi tahu bahwa nama wajib diisi. |
| TC-003 | Mengirim formulir tanpa memilih tanggal | 1. Buka halaman pengajuan. 2. Isi nama. 3. Kosongkan tanggal. 4. Isi kolom wajib lainnya. 5. Klik tombol Kirim. | Nama: Andi; Tanggal: kosong; Jumlah: 1 | Sistem menolak pengajuan dan memberi tahu bahwa tanggal wajib dipilih. |
| TC-004 | Mengisi jumlah pengajuan dengan angka nol | 1. Buka halaman pengajuan. 2. Isi seluruh kolom wajib. 3. Masukkan angka 0 pada kolom jumlah. 4. Klik tombol Kirim. | Nama: Andi; Tanggal: 2026-10-29; Jumlah: 0 | Sistem menolak jumlah yang tidak valid dan menampilkan pesan validasi. |

## 4. Catatan

Test case ini disusun secara mandiri untuk portofolio berdasarkan pembelajaran dan pengalaman pengujian manual. Dokumentasi ini bukan dokumen resmi perusahaan dan tidak merepresentasikan hasil pengujian aktual pada sistem internal.
