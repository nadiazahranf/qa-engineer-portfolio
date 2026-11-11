# Test Plan — Performance Testing OWASP Juice Shop

## 1. Informasi Proyek

| Informasi | Detail |
|---|---|
| Nama Proyek | Performance Testing — OWASP Juice Shop |
| Jenis Pengujian | Performance Testing |
| Aplikasi | OWASP Juice Shop |
| Tools Pengujian | Apache JMeter |
| Protocol | HTTP |
| Endpoint | GET /api/Challenges |
| Environment | Local Environment |
| Status | Completed |

## 2. Latar Belakang

Performance Testing dilakukan untuk mengevaluasi performa API ketika menerima request dari beberapa virtual users secara bersamaan.

Pengujian ini menggunakan OWASP Juice Shop sebagai aplikasi target dan Apache JMeter sebagai tools untuk mengirimkan request serta mengukur performa API.

Pengujian difokuskan pada waktu respons, throughput, dan error rate dengan variasi jumlah virtual users serta ramp-up period.

## 3. Tujuan Pengujian

Tujuan pengujian ini adalah:

1. Mengukur waktu respons API dalam berbagai kondisi beban.
2. Mengevaluasi performa API berdasarkan variasi jumlah virtual users.
3. Menganalisis pengaruh ramp-up period terhadap waktu respons.
4. Mengukur throughput atau jumlah request yang diproses per detik.
5. Memeriksa apakah terdapat kegagalan request selama pengujian.

## 4. Ruang Lingkup Pengujian

### 4.1 In Scope

Pengujian mencakup:

- Pengiriman HTTP GET request ke endpoint `/api/Challenges`.
- Pengujian dengan variasi 5, 10, 20, 30, 50, 75, dan 100 virtual users.
- Pengujian dengan variasi ramp-up period.
- Pengulangan setiap skenario sebanyak tiga kali.
- Pengukuran response time, throughput, dan error rate.
- Validasi HTTP response code menggunakan Response Assertion.

### 4.2 Out of Scope

Pengujian tidak mencakup:

- Pengujian fungsional seluruh fitur aplikasi.
- Pengujian keamanan atau penetration testing.
- Pengujian database secara langsung.
- Pengujian seluruh endpoint API.
- Pengujian performa pada lingkungan production.

## 5. Test Environment

| Komponen | Konfigurasi |
|---|---|
| Application | OWASP Juice Shop |
| Server | localhost |
| Port | 3000 |
| Protocol | HTTP |
| HTTP Method | GET |
| API Endpoint | /api/Challenges |
| Testing Tool | Apache JMeter |
| Test Environment | Local |
| Assertion | Response Code = 200 |

## 6. Test Scenario

Pengujian dilakukan menggunakan konfigurasi Thread Group berikut:

| No. | Number of Threads | Ramp-up Period | Loop Count |
|---|---:|---:|---:|
| 1 | 5 | 5 detik | 5 |
| 2 | 10 | 10 detik | 5 |
| 3 | 20 | 20 detik | 5 |
| 4 | 30 | 30 detik | 5 |
| 5 | 50 | 50 detik | 5 |
| 6 | 100 | 20 detik | 5 |
| 7 | 75 | 5 detik | 5 |
| 8 | 75 | 15 detik | 5 |
| 9 | 75 | 30 detik | 5 |

Setiap skenario dijalankan sebanyak tiga kali.

## 7. Test Procedure

Langkah-langkah pelaksanaan pengujian:

1. Menjalankan aplikasi OWASP Juice Shop secara lokal.
2. Membuka Apache JMeter.
3. Membuat Test Plan baru.
4. Menambahkan Thread Group dan mengatur Number of Threads, Ramp-up Period, serta Loop Count.
5. Menambahkan HTTP Request dengan konfigurasi:
   - Protocol: HTTP
   - Server Name: localhost
   - Port Number: 3000
   - Method: GET
   - Path: /api/Challenges
6. Menambahkan HTTP Header Manager jika diperlukan.
7. Menambahkan Response Assertion untuk memvalidasi response code 200.
8. Menambahkan listener Aggregate Report dan View Results Tree.
9. Menjalankan pengujian sesuai skenario yang telah ditentukan.
10. Mengulangi setiap skenario sebanyak tiga kali.
11. Mencatat dan menganalisis hasil pengujian.

## 8. Performance Metrics

Metrik yang digunakan untuk mengevaluasi hasil pengujian:

| Metrik | Deskripsi |
|---|---|
| Samples | Jumlah total request yang dikirimkan |
| Average | Rata-rata waktu respons request |
| Median | Nilai tengah waktu respons |
| 90% Line (P90) | 90% request selesai dalam waktu ini atau lebih cepat |
| 95% Line (P95) | 95% request selesai dalam waktu ini atau lebih cepat |
| Maximum | Waktu respons tertinggi |
| Error Rate | Persentase request yang mengalami kegagalan |
| Throughput | Jumlah request yang diproses per detik |

## 9. Expected Results

Hasil yang diharapkan dari pengujian:

- API dapat memberikan respons sesuai endpoint yang diminta.
- HTTP response code sesuai dengan assertion yang ditetapkan, yaitu 200.
- Tidak terdapat kegagalan request selama pengujian.
- Metrik performa dapat dikumpulkan untuk setiap skenario.
- Perbedaan performa antarvariasi virtual users dan ramp-up period dapat dianalisis.


## 10. Test Completion Criteria

Pengujian dianggap selesai apabila:

- Seluruh sembilan skenario telah dijalankan.
- Setiap skenario telah diuji sebanyak tiga kali.
- Hasil pengujian telah dicatat.
- Metrik performa telah dianalisis.
- Screenshot hasil pengujian telah didokumentasikan.

## 11. Limitations

Beberapa batasan dalam pengujian ini:

1. Pengujian hanya dilakukan pada satu endpoint API.
2. Aplikasi dijalankan pada lingkungan lokal.
3. Hasil dapat dipengaruhi oleh spesifikasi perangkat dan penggunaan resource komputer.
4. Belum terdapat SLA atau performance threshold yang ditetapkan.
5. Pengujian ini tidak mewakili kondisi beban pada server production.
