# Test Cases — Restful Booker API

## 1. Informasi Pengujian

| Informasi | Keterangan |
|---|---|
| Nama Proyek | Restful Booker API Testing |
| Tools | Postman |
| Base URL | https://restful-booker.herokuapp.com |
| Jenis Pengujian | Functional Testing, Negative Testing, Response Time Validation |

## 2. Daftar Test Cases

### A. Authentication Testing

| ID | Skenario Pengujian | Method | Expected Result |
|---|---|---|---|
| TC-API-001 | Membuat authentication token menggunakan kredensial valid | POST | 200 OK dan token berhasil dibuat |
| TC-API-002 | Login menggunakan password yang salah | POST | 200 OK dan response berisi pesan Bad credentials |

### B. Booking Functional Testing

| ID | Skenario Pengujian | Method | Expected Result |
|---|---|---|---|
| TC-API-003 | Mengambil seluruh daftar booking ID | GET | 200 OK dan response berupa array |
| TC-API-004 | Mengambil detail booking berdasarkan ID valid | GET | 200 OK dan detail booking ditampilkan |
| TC-API-005 | Membuat booking baru dengan data valid | POST | 200 OK dan booking ID berhasil dibuat |
| TC-API-006 | Memperbarui seluruh data booking menggunakan PUT | PUT | 200 OK dan seluruh data berhasil diperbarui |
| TC-API-007 | Memperbarui sebagian data booking menggunakan PATCH | PATCH | 200 OK dan field yang ditentukan berhasil diperbarui |
| TC-API-008 | Menghapus booking berdasarkan ID valid | DELETE | 201 Created dan booking berhasil dihapus |
| TC-API-009 | Memverifikasi booking yang telah dihapus | GET | 404 Not Found karena booking tidak ditemukan |

### C. Negative Testing

| ID | Skenario Pengujian | Method | Expected Result |
|---|---|---|---|
| TC-API-010 | Membuat booking tanpa menyertakan field totalprice | POST | API mengembalikan respons error; hasil aktual yang diamati adalah 500 Internal Server Error |
| TC-API-011 | Mengambil detail booking menggunakan ID yang tidak ditemukan | GET | 404 Not Found |
| TC-API-012 | Memperbarui booking tanpa autentikasi | PUT | 403 Forbidden |
| TC-API-013 | Menghapus booking tanpa autentikasi | DELETE | 403 Forbidden |

## 3. Validasi Response Time

Setiap request diuji menggunakan assertion untuk memastikan waktu respons berada di bawah 2.000 milidetik.

| ID | Kriteria Pengujian | Expected Result |
|---|---|---|
| TC-API-014 | Validasi response time seluruh request yang diuji | Response time kurang dari 2.000 ms |

## 4. Validasi Response

Validasi dilakukan menggunakan Postman Scripts, meliputi:

- HTTP status code.
- Struktur dan isi response body.
- Keberadaan field yang diperlukan.
- Kesesuaian nilai data.
- Pesan error pada skenario negatif.
- Waktu respons API.

## 5. Catatan

- Setiap test case dijalankan menggunakan Postman.
- Hasil aktual dan status PASS/FAIL dicatat dalam dokumen Test Execution Report.
- Hasil pengujian dapat berbeda karena Restful Booker merupakan layanan demo publik.
- Batas response time 2.000 ms merupakan target khusus proyek ini, bukan SLA resmi API.
