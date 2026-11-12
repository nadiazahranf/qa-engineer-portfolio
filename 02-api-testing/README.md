# API Testing — Restful Booker

## Gambaran Umum Proyek

Proyek ini merupakan dokumentasi pengujian API pada aplikasi **Restful Booker** menggunakan Postman. Pengujian dilakukan untuk memvalidasi fungsi API, respons server, serta penanganan berbagai skenario positif dan negatif.

## Alat dan Teknologi

- **Postman** — Menjalankan pengujian API dan membuat test script.
- **JavaScript** — Menulis assertion untuk validasi respons.
- **Restful Booker API** — Aplikasi API yang menjadi objek pengujian.

## Ruang Lingkup Pengujian

Pengujian mencakup beberapa fungsi utama:

- Authentication — Membuat token autentikasi dan menguji kredensial tidak valid.
- Get Booking — Mengambil daftar booking dan detail booking.
- Create Booking — Membuat data booking baru.
- Update Booking — Memperbarui seluruh dan sebagian data booking.
- Delete Booking — Menghapus data booking dan memverifikasi penghapusannya.
- Negative Testing — Menguji kondisi seperti data tidak lengkap, ID tidak valid, dan request tanpa autentikasi.
- Response Validation — Memvalidasi status code, response body, dan waktu respons.

## Struktur Proyek

- `test-plan/` — Dokumentasi rencana dan konfigurasi pengujian API.
- `test-cases/` — Dokumentasi skenario dan kasus pengujian API.
- `postman/` — File Postman Collection dan Environment.
- `test-results/` — Rekapitulasi hasil dan analisis pengujian.
- `evidence/` — Screenshot bukti pelaksanaan pengujian.

## Pelaksanaan Pengujian

Pengujian dilakukan menggunakan Postman dengan total 13 request yang mencakup authentication, booking operations, dan negative testing.

Setiap request dilengkapi dengan test script untuk memvalidasi status code, response body, dan response time.

Validasi waktu respons menggunakan target pengujian di bawah 2.000 ms. Target tersebut merupakan batas yang ditetapkan untuk proyek ini, bukan SLA resmi dari Restful Booker.

## Temuan Pengujian

Beberapa hal yang ditemukan selama pengujian:

- Seluruh request utama berhasil dijalankan sesuai hasil yang diharapkan.
- Request Get Booking IDs sempat mengalami waktu respons 3.024 ms pada percobaan pertama, kemudian berhasil memenuhi target pada percobaan berikutnya.
- Request Create Booking dengan field `totalprice` yang tidak disertakan menghasilkan respons `500 Internal Server Error`. Hal ini dicatat sebagai temuan yang perlu dievaluasi lebih lanjut karena validasi input idealnya memberikan respons error yang lebih informatif.

## Catatan

- Pengujian dilakukan pada public demo API Restful Booker.
- Hasil pengujian dapat dipengaruhi oleh kondisi server dan jaringan.
