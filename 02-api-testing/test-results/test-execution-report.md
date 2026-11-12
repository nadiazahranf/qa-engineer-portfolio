# Test Execution Report — Restful Booker API

## 1. Informasi Pengujian

| Informasi | Keterangan |
|---|---|
| Nama Proyek | Restful Booker API Testing |
| API | Restful Booker |
| Base URL | https://restful-booker.herokuapp.com |
| Tools | Postman |
| Jenis Pengujian | Functional Testing, Negative Testing, Response Time Validation |
| Batas Response Time | 2.000 ms |
| Status Pengujian | Selesai |

## 2. Hasil Functional Testing dan Negative Testing

| ID | Skenario Pengujian | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-API-001 | Membuat authentication token dengan kredensial valid | 200 OK dan token dibuat | 200 OK, token berhasil dibuat | PASS |
| TC-API-002 | Login menggunakan password salah | 200 OK dan pesan Bad credentials | 200 OK, pesan Bad credentials | PASS |
| TC-API-003 | Mengambil daftar booking ID | 200 OK | 200 OK | PASS |
| TC-API-004 | Mengambil detail booking | 200 OK | 200 OK | PASS |
| TC-API-005 | Membuat booking baru | 200 OK dan booking ID dibuat | 200 OK, booking berhasil dibuat | PASS |
| TC-API-006 | Memperbarui seluruh data booking menggunakan PUT | 200 OK | 200 OK, data berhasil diperbarui | PASS |
| TC-API-007 | Memperbarui sebagian data booking menggunakan PATCH | 200 OK | 200 OK, data berhasil diperbarui | PASS |
| TC-API-008 | Menghapus booking | 201 Created | 201 Created | PASS |
| TC-API-009 | Memverifikasi booking yang telah dihapus | 404 Not Found | 404 Not Found | PASS |
| TC-API-010 | Membuat booking tanpa field totalprice | Respons error | 500 Internal Server Error | PASS* |
| TC-API-011 | Mengambil booking menggunakan ID tidak valid | 404 Not Found | 404 Not Found | PASS |
| TC-API-012 | Memperbarui booking tanpa autentikasi | 403 Forbidden | 403 Forbidden | PASS |
| TC-API-013 | Menghapus booking tanpa autentikasi | 403 Forbidden | 403 Forbidden | PASS |

*PASS pada TC-API-010 berarti hasil aktual sesuai dengan respons error yang ditemukan dan assertion status code berhasil. Namun, respons 500 tetap menjadi temuan yang perlu dievaluasi, bukan berarti perilaku API tersebut sudah ideal.*

## 3. Hasil Response Time Validation

Batas waktu respons yang digunakan adalah kurang dari 2.000 ms.

| Request | Hasil Validasi |
|---|---|
| Get Booking IDs | FAIL pada percobaan pertama, PASS pada percobaan kedua |
| Get Booking Details | PASS |
| Create Booking | PASS |
| Update Booking (PUT) | PASS |
| Partial Update Booking (PATCH) | PASS |
| Delete Booking | PASS |
| Verify Deleted Booking | PASS |
| Invalid Authentication | PASS |
| Create Booking - Missing Required Field | PASS |
| Get Booking - Invalid ID | PASS |
| Update Booking - No Authentication | PASS |
| Delete Booking - No Authentication | PASS |

**Temuan response time:**

- Get Booking IDs pada percobaan pertama menghasilkan response time sebesar 3.024 ms.
- Hasil tersebut melebihi batas 2.000 ms sehingga validasi gagal.
- Pada percobaan kedua, response time berhasil berada di bawah 2.000 ms.
- Request lainnya memenuhi batas waktu respons pada saat pengujian dilakukan.

## 4. Temuan Pengujian

### Finding 01 — Missing Required Field

**Skenario:** Membuat booking tanpa menyertakan field `totalprice`.

**Hasil Aktual:** 500 Internal Server Error.

**Analisis:** API mengembalikan server error ketika menerima data booking yang tidak lengkap. Kondisi ini perlu dievaluasi karena validasi input idealnya memberikan respons yang lebih informatif.

**Rekomendasi:** Menambahkan validasi terhadap field wajib dan mengembalikan respons client error yang sesuai, misalnya 400 Bad Request.

### Finding 02 — Response Time Exceeds Threshold

**Skenario:** Get Booking IDs.

**Hasil Aktual:** 3.024 ms pada percobaan pertama.

**Analisis:** Waktu respons melebihi batas 2.000 ms yang ditetapkan dalam proyek ini. Pada percobaan kedua, hasilnya berada di bawah batas tersebut.

**Rekomendasi:** Melakukan pengujian ulang dan pemantauan lebih lanjut untuk mengetahui konsistensi waktu respons API.

## 5. Kesimpulan

Berdasarkan pengujian yang telah dilakukan:

- Seluruh 13 skenario functional dan negative testing telah dieksekusi.
- Operasi CRUD berhasil dijalankan sesuai hasil yang diamati.
- Mekanisme autentikasi dan otorisasi berhasil diuji.
- Ditemukan respons 500 Internal Server Error pada skenario input yang tidak lengkap.
- Terdapat satu percobaan response time yang melebihi batas 2.000 ms.
- Hasil response time pada percobaan berikutnya memenuhi batas yang ditentukan.

Pengujian ini memberikan gambaran mengenai fungsionalitas, penanganan input tidak valid, mekanisme autentikasi, dan waktu respons Restful Booker API.

## 6. Catatan Keterbatasan

- Pengujian dilakukan pada API demo publik.
- Waktu respons dipengaruhi oleh kondisi jaringan dan ketersediaan server.
- Pengujian response time dilakukan berdasarkan request individual, bukan pengujian beban.
