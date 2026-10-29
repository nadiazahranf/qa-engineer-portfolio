# Bug Reports — Manual Testing

## BR-PK-001 — Menu Baru Tidak Langsung Ditampilkan Setelah Ditambahkan

| Field | Detail |
|---|---|
| Bug ID | BR-PK-001 |
| Related Test Case | TC-PK-003 |
| Module | Manajemen Menu Makanan |
| Role | Pihak Kantin |
| Severity | Minor |
| Priority | Medium |
| Initial Status | Fail |
| Retest Status | Pass |

### Description
Menu makanan yang berhasil ditambahkan oleh Pihak Kantin tidak langsung muncul pada tampilan sistem. Pengguna perlu login kembali agar menu yang baru ditambahkan dapat terlihat.

### Preconditions
- Pengguna sudah login sebagai Pihak Kantin.
- Pengguna berada pada halaman pengelolaan menu makanan.

### Steps to Reproduce
1. Login sebagai Pihak Kantin.
2. Buka halaman pengelolaan menu makanan.
3. Tambahkan menu makanan baru dengan data yang valid.
4. Periksa apakah menu baru langsung muncul pada tampilan sistem.

### Expected Result
Menu makanan yang berhasil ditambahkan langsung muncul pada tampilan sistem tanpa mengharuskan pengguna login kembali.

### Actual Result
Menu makanan berhasil ditambahkan, tetapi tidak langsung muncul pada tampilan sistem. Pengguna perlu login kembali agar menu tersebut terlihat.

### Retest Result
Setelah perbaikan, menu makanan yang baru ditambahkan langsung muncul pada tampilan sistem tanpa perlu login kembali.

### Final Status
Pass — hasil pengujian ulang sesuai dengan Expected Result.

### Notes
Laporan ini disusun berdasarkan pengalaman pengujian dan ditulis ulang untuk keperluan portofolio. Detail internal perusahaan dan data sensitif tidak dicantumkan.
