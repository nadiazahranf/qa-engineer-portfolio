# Performance Testing — OWASP Juice Shop

## Gambaran Proyek

Proyek ini merupakan pengujian performa API menggunakan **Apache JMeter** pada aplikasi **OWASP Juice Shop**. Pengujian dilakukan untuk mengevaluasi waktu respons API dan throughput berdasarkan variasi jumlah virtual users serta ramp-up period.

## Tujuan Pengujian

- Mengukur waktu respons API dalam berbagai kondisi beban.
- Menganalisis pengaruh jumlah virtual users terhadap performa API.
- Menganalisis pengaruh ramp-up period terhadap waktu respons.
- Mengukur throughput dan error rate.
- Mengidentifikasi potensi penurunan performa ketika terjadi peningkatan beban secara cepat.

## Lingkungan Pengujian

| Komponen | Detail |
|---|---|
| Aplikasi | OWASP Juice Shop |
| Tools | Apache JMeter |
| Protocol | HTTP |
| Server | localhost |
| Port | 3000 |
| HTTP Method | GET |
| Endpoint | `/api/Challenges` |
| Loop Count | 5 |
| Pengulangan Pengujian | 3 kali per skenario |

## Skenario Pengujian

Pengujian dilakukan menggunakan variasi jumlah virtual users dan ramp-up period sebagai berikut:

| Skenario | Virtual Users | Ramp-up Period | Loop Count |
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

Setiap skenario dijalankan sebanyak tiga kali untuk memperoleh gambaran konsistensi hasil pengujian.

## Hasil dan Temuan Utama

Berdasarkan hasil pengujian, diperoleh beberapa temuan:

1. Skenario dengan 5–50 virtual users menunjukkan waktu respons yang relatif stabil, dengan average response time sekitar 40–46 ms.
2. Skenario 100 virtual users dengan ramp-up 20 detik menghasilkan average response time sebesar 43 ms dan throughput sekitar 25 requests/second.
3. Skenario 75 virtual users dengan ramp-up 5 detik mengalami peningkatan waktu respons yang signifikan, dengan average response time sebesar 1.782,7 ms dan P95 sebesar 2.455 ms.
4. Pada 75 virtual users dengan ramp-up 15 detik, average response time turun menjadi 48 ms.
5. Pada 75 virtual users dengan ramp-up 30 detik, average response time turun menjadi 40,3 ms.
6. Seluruh skenario mencatat error rate sebesar 0%.

### Kesimpulan Sementara

Hasil pengujian mengindikasikan bahwa peningkatan jumlah virtual users dalam waktu yang sangat singkat dapat memengaruhi waktu respons API.

Pada skenario 75 virtual users, ramp-up period 5 detik menghasilkan waktu respons yang jauh lebih tinggi dibandingkan ramp-up 15 dan 30 detik. Hal ini menunjukkan bahwa pola kedatangan request merupakan salah satu faktor yang perlu diperhatikan dalam pengujian performa.

## Struktur Proyek

- `test-plan/` — Dokumentasi rencana dan konfigurasi pengujian.
- `test-results/` — Rekapitulasi hasil dan analisis pengujian.
- `jmeter/` — File konfigurasi pengujian Apache JMeter.
- `evidence/` — Screenshot bukti pelaksanaan pengujian.

## Dokumentasi

- [Test Plan](test-plan/test-plan.md)
- [Ringkasan Hasil Pengujian](test-results/test-results-summary.md)
- [Analisis Hasil Pengujian](test-results/test-results-summary.md)
- [File JMeter](jmeter/)
- [Bukti Pengujian](evidence/)

## Batasan Pengujian

- Pengujian dilakukan pada lingkungan lokal menggunakan OWASP Juice Shop.
- Pengujian hanya mencakup satu endpoint API, yaitu `/api/Challenges`.
- Hasil pengujian dapat dipengaruhi oleh spesifikasi perangkat, penggunaan CPU dan RAM, jaringan lokal, serta kondisi aplikasi.
- Belum ditetapkan SLA atau performance threshold sebagai acuan kelulusan pengujian.
- Hasil pengujian tidak dapat langsung digunakan untuk menyimpulkan performa aplikasi pada lingkungan produksi.

## Tools yang Digunakan

- Apache JMeter
- OWASP Juice Shop
- GitHub
- Markdown
