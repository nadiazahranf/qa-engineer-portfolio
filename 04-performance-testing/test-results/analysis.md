# Performance Testing Analysis — OWASP Juice Shop

## 1. Overview

Analisis ini dibuat berdasarkan hasil performance testing menggunakan Apache JMeter terhadap endpoint:

`GET http://localhost:3000/api/Challenges`

Pengujian dilakukan dengan sembilan skenario yang menggunakan variasi jumlah virtual users dan ramp-up period. Setiap skenario dijalankan sebanyak tiga kali dengan loop count sebanyak lima.

Metrik yang dianalisis meliputi:

- Average Response Time
- Median Response Time
- 90th Percentile (P90)
- 95th Percentile (P95)
- Maximum Response Time
- Throughput
- Error Rate

## 2. Analysis by Virtual Users

### 2.1 Pengujian 5–50 Virtual Users

Pada skenario 5 hingga 50 virtual users, hasil pengujian menunjukkan response time yang relatif stabil.

| Virtual Users | Average (ms) | P95 (ms) | Maximum (ms) |
|---:|---:|---:|---:|
| 5 | 45.7 | 69.3 | 140 |
| 10 | 43.0 | 61.0 | 95 |
| 20 | 40.7 | 61.0 | 92 |
| 30 | 40.3 | 60.3 | 103 |
| 50 | 41.3 | 61.7 | 118 |

**Analysis:**

- Average response time berada pada kisaran 40–46 ms.
- P95 berada pada kisaran 60–69 ms.
- Tidak terdapat error yang tercatat selama pengujian.

Hasil ini menunjukkan bahwa pada konfigurasi tersebut, endpoint memberikan waktu respons yang relatif konsisten.

### 2.2 Pengujian 100 Virtual Users

Pada skenario 100 virtual users dengan ramp-up period 20 detik, diperoleh:

| Metric | Result |
|---|---:|
| Average | 43 ms |
| Median | 36.7 ms |
| P90 | 69.3 ms |
| P95 | 79.7 ms |
| Maximum | 146 ms |
| Throughput | 25.0 req/sec |
| Error Rate | 0% |

**Analysis:**

Meskipun jumlah virtual users meningkat menjadi 100, average response time tetap berada pada kisaran yang relatif dekat dengan skenario sebelumnya.

P95 sebesar 79.7 ms menunjukkan bahwa rata-rata hasil P95 dari ketiga run masih relatif rendah.

Throughput meningkat menjadi sekitar 25 requests per second. Namun, hasil ini tidak dapat langsung diartikan sebagai kapasitas maksimum API karena pengujian menggunakan ramp-up period tertentu dan hanya satu endpoint.

## 3. Analysis by Ramp-up Period

Salah satu fokus pengujian adalah menganalisis pengaruh ramp-up period terhadap performa API.

Untuk analisis ini, digunakan tiga skenario dengan jumlah virtual users yang sama, yaitu 75 users.

| Virtual Users | Ramp-up | Average (ms) | P90 (ms) | P95 (ms) | Throughput |
|---:|---:|---:|---:|---:|---:|
| 75 | 5 detik | 1,782.7 | 2,433.3 | 2,455.0 | 27.0 req/sec |
| 75 | 15 detik | 48.0 | 79.0 | 85.0 | 25.0 req/sec |
| 75 | 30 detik | 40.3 | 53.0 | 57.7 | 12.6 req/sec |

### 3.1 Ramp-up 5 Detik

Pada konfigurasi ini, 75 virtual users dijadwalkan mulai dalam waktu lima detik.

Hasil pengujian menunjukkan:

- Average response time sebesar 1,782.7 ms.
- P95 sebesar 2,455 ms.
- Maximum response time sebesar 2,579 ms.
- Error rate sebesar 0%.

Response time mengalami peningkatan yang signifikan dibandingkan skenario 75 users lainnya.

Hal ini mengindikasikan bahwa peningkatan beban dalam waktu singkat berpotensi menyebabkan antrean request atau peningkatan waktu pemrosesan pada aplikasi.

### 3.2 Ramp-up 15 Detik

Pada konfigurasi ini, 75 virtual users dijadwalkan mulai dalam waktu 15 detik.

Hasil pengujian menunjukkan:

- Average response time sebesar 48 ms.
- P95 sebesar 85 ms.
- Maximum response time sebesar 141 ms.
- Error rate sebesar 0%.

Response time jauh lebih rendah dibandingkan konfigurasi ramp-up 5 detik.

### 3.3 Ramp-up 30 Detik

Pada konfigurasi ini, 75 virtual users dijadwalkan mulai dalam waktu 30 detik.

Hasil pengujian menunjukkan:

- Average response time sebesar 40.3 ms.
- P95 sebesar 57.7 ms.
- Maximum response time sebesar 94 ms.
- Error rate sebesar 0%.

Skenario ini menghasilkan average response time dan P95 paling rendah di antara ketiga konfigurasi 75 users.

### 3.4 Comparison Conclusion

Berdasarkan ketiga konfigurasi tersebut, response time pada 75 virtual users jauh lebih tinggi ketika ramp-up period hanya lima detik.

Ketika ramp-up period diperpanjang menjadi 15 dan 30 detik, response time kembali berada pada kisaran yang relatif rendah.

Temuan ini mengindikasikan bahwa kecepatan peningkatan virtual users merupakan faktor yang berpengaruh terhadap waktu respons API.

Namun, pengujian ini belum dapat memastikan penyebab teknis lonjakan response time. Pemeriksaan penggunaan CPU, RAM, dan kondisi aplikasi diperlukan untuk investigasi lebih lanjut.

## 4. Throughput Analysis

Throughput menunjukkan jumlah request yang berhasil diproses per detik selama pengujian.

Beberapa hasil yang diperoleh:

| Scenario | Throughput |
|---|---:|
| 5 users, 5s ramp-up | 6.0 req/sec |
| 50 users, 50s ramp-up | 5.1 req/sec |
| 75 users, 5s ramp-up | 27.0 req/sec |
| 75 users, 15s ramp-up | 25.0 req/sec |
| 75 users, 30s ramp-up | 12.6 req/sec |
| 100 users, 20s ramp-up | 25.0 req/sec |

Throughput tidak selalu meningkat sebanding dengan jumlah virtual users.

Pada konfigurasi 75 users, throughput juga berbeda berdasarkan ramp-up period. Hal ini menunjukkan bahwa pola pengiriman request dan durasi pengujian memengaruhi nilai throughput yang tercatat.

Throughput tidak boleh digunakan sendirian untuk menentukan apakah performa aplikasi baik atau buruk. Metrik ini perlu dianalisis bersama response time dan error rate.

## 5. Error Rate Analysis

Seluruh sembilan skenario mencatat error rate sebesar 0%.

Hal ini berarti tidak terdapat request yang tercatat gagal oleh JMeter selama pengujian.

Namun, error rate 0% tidak menjamin aplikasi bebas dari bug atau mampu menangani beban tanpa batas.

Validasi response assertion juga hanya memastikan bahwa response code sesuai dengan nilai yang ditetapkan, yaitu HTTP 200. Hal tersebut belum menjamin seluruh isi response benar secara fungsional.

## 6. Key Findings

Berdasarkan keseluruhan hasil pengujian, ditemukan beberapa hal utama:

1. Skenario 5–50 virtual users menunjukkan response time yang relatif stabil.
2. Skenario 100 virtual users dengan ramp-up 20 detik menghasilkan average response time sebesar 43 ms.
3. Skenario 75 virtual users dengan ramp-up 5 detik mengalami peningkatan response time yang signifikan.
4. Perpanjangan ramp-up period pada 75 virtual users menghasilkan response time yang jauh lebih rendah.
5. Seluruh skenario mencatat error rate sebesar 0%.

## 7. Overall Conclusion

Berdasarkan hasil performance testing pada endpoint `GET /api/Challenges`, aplikasi menunjukkan response time yang relatif stabil pada sebagian besar skenario pengujian.

Peningkatan response time paling signifikan ditemukan pada skenario 75 virtual users dengan ramp-up period lima detik. Ketika ramp-up period ditingkatkan menjadi 15 dan 30 detik, response time kembali menurun secara signifikan.

Hasil tersebut menunjukkan bahwa pola kedatangan request merupakan salah satu faktor penting dalam evaluasi performa API.

Seluruh skenario mencatat error rate sebesar 0%. Meskipun demikian, belum dapat ditentukan apakah performa aplikasi memenuhi target tertentu karena belum terdapat SLA atau performance threshold yang ditetapkan.

## 8. Limitations Investigation

Beberapa keterbatasan pengujian ini:

1. Pengujian hanya dilakukan pada satu endpoint API.
2. Aplikasi dijalankan pada lingkungan lokal.
3. Penggunaan CPU dan RAM belum dicatat sebagai bagian dari pengujian.
4. Tidak terdapat SLA atau performance threshold sebagai acuan kelulusan.
5. Hasil dapat dipengaruhi oleh kondisi perangkat, proses lain yang berjalan, dan kondisi aplikasi.
