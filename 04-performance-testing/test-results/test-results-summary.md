# Test Results Summary — OWASP Juice Shop

## 1. Informasi Pengujian

| Informasi | Detail |
|---|---|
| Application | OWASP Juice Shop |
| Testing Tool | Apache JMeter |
| Protocol | HTTP |
| HTTP Method | GET |
| Endpoint | `/api/Challenges` |
| Loop Count | 5 |
| Test Repetitions | 3 kali per skenario |

Pengujian dilakukan menggunakan sembilan konfigurasi Thread Group yang berbeda. Setiap konfigurasi dijalankan sebanyak tiga kali untuk memperoleh gambaran konsistensi hasil.

## 2. Ringkasan Hasil Pengujian

Tabel berikut menunjukkan hasil rata-rata dari tiga kali pengujian untuk setiap skenario.

| Threads | Ramp-up | Total Samples | Average (ms) | Median (ms) | P90 (ms) | P95 (ms) | Maximum (ms) | Error |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5 | 5s | 75 | 45.7 | 42.7 | 55.7 | 69.3 | 140 | 0% |
| 10 | 10s | 150 | 43.0 | 41.3 | 57.3 | 61.0 | 95 | 0% |
| 20 | 20s | 300 | 40.7 | 38.3 | 54.7 | 61.0 | 92 | 0% |
| 30 | 30s | 450 | 40.3 | 38.0 | 55.0 | 60.3 | 103 | 0% |
| 50 | 50s | 750 | 41.3 | 38.0 | 56.0 | 61.7 | 118 | 0% |
| 100 | 20s | 1,500 | 43.0 | 36.7 | 69.3 | 79.7 | 146 | 0% |
| 75 | 5s | 1,125 | 1,782.7 | 1,959.3 | 2,433.3 | 2,455.0 | 2,579 | 0% |
| 75 | 15s | 1,125 | 48.0 | 41.0 | 79.0 | 85.0 | 141 | 0% |
| 75 | 30s | 1,125 | 40.3 | 38.3 | 53.0 | 57.7 | 94 | 0% |

**Catatan perhitungan:**
- Total Samples merupakan jumlah sampel dari tiga kali pengujian.
- Average, Median, P90, dan P95 merupakan rata-rata dari tiga hasil run.
- Maximum merupakan nilai tertinggi dari tiga hasil run.
- Error merupakan error rate yang tercatat pada JMeter.

## 3. Detail Hasil Pengujian

### Skenario 1 — 5 Virtual Users

Konfigurasi:
- Number of Threads: 5
- Ramp-up Period: 5 detik
- Loop Count: 5
- Samples per run: 25

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 49 | 43 | 45 |
| Median (ms) | 44 | 41 | 43 |
| P90 (ms) | 58 | 58 | 51 |
| P95 (ms) | 77 | 59 | 72 |
| Maximum (ms) | 140 | 66 | 99 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 6.2 | 5.9 | 5.9 |

### Skenario 2 — 10 Virtual Users

Konfigurasi:
- Number of Threads: 10
- Ramp-up Period: 10 detik
- Loop Count: 5
- Samples per run: 50

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 43 | 43 | 43 |
| Median (ms) | 42 | 41 | 41 |
| P90 (ms) | 56 | 59 | 57 |
| P95 (ms) | 58 | 63 | 62 |
| Maximum (ms) | 95 | 73 | 66 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 5.4 | 5.4 | 5.4 |

### Skenario 3 — 20 Virtual Users

Konfigurasi:
- Number of Threads: 20
- Ramp-up Period: 20 detik
- Loop Count: 5
- Samples per run: 100

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 41 | 41 | 40 |
| Median (ms) | 37 | 40 | 38 |
| P90 (ms) | 56 | 53 | 55 |
| P95 (ms) | 68 | 58 | 57 |
| Maximum (ms) | 92 | 78 | 75 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 5.2 | 5.2 | 5.2 |

### Skenario 4 — 30 Virtual Users

Konfigurasi:
- Number of Threads: 30
- Ramp-up Period: 30 detik
- Loop Count: 5
- Samples per run: 150

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 42 | 39 | 40 |
| Median (ms) | 39 | 36 | 39 |
| P90 (ms) | 56 | 55 | 54 |
| P95 (ms) | 64 | 58 | 59 |
| Maximum (ms) | 103 | 78 | 84 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 5.1 | 5.1 | 5.1 |

### Skenario 5 — 50 Virtual Users

Konfigurasi:
- Number of Threads: 50
- Ramp-up Period: 50 detik
- Loop Count: 5
- Samples per run: 250

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 42 | 40 | 42 |
| Median (ms) | 37 | 37 | 40 |
| P90 (ms) | 57 | 55 | 56 |
| P95 (ms) | 63 | 59 | 63 |
| Maximum (ms) | 118 | 77 | 87 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 5.1 | 5.1 | 5.1 |

### Skenario 6 — 100 Virtual Users

Konfigurasi:
- Number of Threads: 100
- Ramp-up Period: 20 detik
- Loop Count: 5
- Samples per run: 500

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 43 | 45 | 41 |
| Median (ms) | 37 | 37 | 36 |
| P90 (ms) | 72 | 73 | 63 |
| P95 (ms) | 79 | 87 | 73 |
| Maximum (ms) | 107 | 146 | 106 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 25.0 | 25.1 | 25.0 |

### Skenario 7 — 75 Virtual Users

Konfigurasi:
- Number of Threads: 75
- Ramp-up Period: 5 detik
- Loop Count: 5
- Samples per run: 375

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 1,677 | 1,821 | 1,850 |
| Median (ms) | 1,815 | 1,998 | 2,065 |
| P90 (ms) | 2,332 | 2,468 | 2,500 |
| P95 (ms) | 2,358 | 2,481 | 2,526 |
| Maximum (ms) | 2,402 | 2,555 | 2,579 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 27.6 | 26.8 | 26.6 |

### Skenario 8 — 75 Virtual Users

Konfigurasi:
- Number of Threads: 75
- Ramp-up Period: 15 detik
- Loop Count: 5
- Samples per run: 375

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 53 | 46 | 45 |
| Median (ms) | 45 | 39 | 39 |
| P90 (ms) | 86 | 77 | 74 |
| P95 (ms) | 93 | 82 | 80 |
| Maximum (ms) | 141 | 101 | 102 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 25.0 | 25.0 | 24.9 |

### Skenario 9 — 75 Virtual Users

Konfigurasi:
- Number of Threads: 75
- Ramp-up Period: 30 detik
- Loop Count: 5
- Samples per run: 375

| Metric | Run 1 | Run 2 | Run 3 |
|---|---:|---:|---:|
| Average (ms) | 41 | 40 | 40 |
| Median (ms) | 39 | 38 | 38 |
| P90 (ms) | 54 | 52 | 53 |
| P95 (ms) | 59 | 56 | 58 |
| Maximum (ms) | 94 | 77 | 78 |
| Error Rate | 0% | 0% | 0% |
| Throughput (req/sec) | 12.6 | 12.6 | 12.6 |

## 4. Overall Summary

- Total skenario: 9
- Pengulangan setiap skenario: 3 kali
- Total keseluruhan sampel: 5,850
- Error rate tercatat: 0% pada seluruh skenario
- Endpoint yang diuji: GET `/api/Challenges`

## 5. Catatan

Hasil Average, Median, P90, dan P95 pada tabel ringkasan merupakan rata-rata statistik dari masing-masing run, bukan hasil perhitungan ulang dari seluruh sampel mentah.

Throughput pada tabel ringkasan juga merupakan rata-rata dari tiga hasil run.

Untuk analisis lebih lanjut, perhatikan bahwa setiap skenario memiliki durasi ramp-up berbeda sehingga throughput tidak dapat dibandingkan hanya berdasarkan jumlah virtual users.
