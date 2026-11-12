# Rencana Pengujian API — Restful Booker

## 1. Gambaran Umum Proyek

Proyek ini berfokus pada pengujian API REST yang disediakan oleh Restful Booker.

Pengujian dilakukan menggunakan Postman untuk memverifikasi fungsionalitas API, validasi respons, autentikasi, skenario negatif, dan waktu respons.

**API yang Diuji:** Restful Booker  
**Base URL:** https://restful-booker.herokuapp.com  
**Tools Pengujian:** Postman  
**Jenis Pengujian:** API Functional Testing dan Response Time Validation

## 2. Tujuan Pengujian

Tujuan dari pengujian ini adalah:

- Memastikan setiap endpoint API berfungsi sesuai dengan yang diharapkan.
- Memvalidasi HTTP status code dan response body.
- Menguji mekanisme autentikasi dan otorisasi.
- Menguji operasi CRUD pada data booking.
- Memastikan API menangani request yang tidak valid dengan tepat.
- Memvalidasi waktu respons API berdasarkan batas waktu yang ditentukan.

## 3. Ruang Lingkup Pengujian

### Pengujian yang Termasuk

**Autentikasi**
- Membuat authentication token.
- Menguji autentikasi menggunakan kredensial yang tidak valid.

**Operasi Booking**
- Mengambil daftar booking ID.
- Mengambil detail booking.
- Membuat booking baru.
- Memperbarui seluruh data booking menggunakan PUT.
- Memperbarui sebagian data booking menggunakan PATCH.
- Menghapus booking.
- Memverifikasi penghapusan booking.

**Negative Testing**
- Autentikasi menggunakan kredensial yang tidak valid.
- Membuat booking dengan field wajib yang tidak lengkap.
- Mengambil booking menggunakan ID yang tidak valid.
- Memperbarui booking tanpa autentikasi.
- Menghapus booking tanpa autentikasi.

**Validasi Respons**
- Validasi HTTP status code.
- Validasi response body.
- Validasi field yang wajib tersedia.
- Validasi waktu respons API.

### Pengujian yang Tidak Termasuk

- Pengujian antarmuka pengguna (UI Testing).
- Pengujian database.
- Pengujian penetrasi keamanan.
- Load Testing dan Stress Testing.
- Pengujian integrasi dengan layanan eksternal.

## 4. Lingkungan Pengujian

| Komponen | Keterangan |
|---|---|
| API | Restful Booker |
| Base URL | https://restful-booker.herokuapp.com |
| Tools | Postman |
| Protokol | HTTP/HTTPS |
| Format Data | JSON |
| Environment | Restful Booker Environment |

## 5. Pendekatan Pengujian

Pengujian dilakukan secara manual menggunakan Postman dengan tahapan:

1. Mengirim request API menggunakan HTTP method yang sesuai.
2. Memvalidasi status code dari setiap respons.
3. Memvalidasi response body dan data yang dihasilkan.
4. Menguji mekanisme autentikasi dan otorisasi.
5. Menjalankan skenario negative testing.
6. Memvalidasi waktu respons menggunakan Postman test scripts.

## 6. Kriteria Awal Pengujian

Pengujian dapat dimulai apabila:

- Restful Booker API dapat diakses.
- Postman telah terpasang dan dikonfigurasi.
- Collection dan environment variables telah disiapkan.

## 7. Kriteria Akhir Pengujian

Pengujian dinyatakan selesai apabila:

- Seluruh skenario pengujian yang direncanakan telah dijalankan.
- Hasil pengujian telah didokumentasikan.
- Temuan dan respons API yang tidak sesuai telah dicatat.

## 8. Batas Waktu Respons

Pengujian menggunakan batas waktu respons sebesar **2.000 milidetik (2 detik)**.

Request dinyatakan memenuhi validasi waktu respons apabila waktu respons kurang dari 2.000 milidetik.

Batas waktu ini merupakan target khusus dalam proyek pengujian dan bukan SLA resmi dari Restful Booker.

## 9. Risiko dan Keterbatasan

- Restful Booker merupakan API demo publik sehingga ketersediaan server dan waktu respons dapat berubah.
- Data booking berada pada lingkungan demo yang digunakan bersama.
- Waktu respons dapat dipengaruhi oleh kondisi jaringan dan performa server.
- Hasil pengujian merupakan hasil pengamatan pada saat pengujian dilakukan dan dapat berbeda pada pengujian berikutnya.

## 10. Hasil yang Dihasilkan

- Postman Collection.
- Postman Environment.
- Dokumen Test Cases.
- Test Execution Report.
- Bukti pengujian berupa screenshot.
