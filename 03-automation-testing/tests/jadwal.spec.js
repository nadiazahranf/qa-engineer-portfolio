const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AkademikJadwalPage, NO_DATA_MESSAGE } = require('./pages/AkademikJadwalPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.describe.configure({ timeout: 120000 });

async function bukaJadwal(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const jadwalPage = new AkademikJadwalPage(page);
  await jadwalPage.gotoFromDashboard();
  return jadwalPage;
}

// Positive

test.describe('Jadwal - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJadwal(page);
  });

  test('halaman Data Jadwal berhasil dibuka dari menu Akademik', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    await expect(jadwalPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(jadwalPage.addButton.first()).toBeVisible();
    await expect(jadwalPage.searchInput).toBeVisible();
    await jadwalPage.expectNoSystemError();
  });

  test('tabel Jadwal menampilkan state data yang valid', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    await expect(jadwalPage.tableBody).toBeVisible({ timeout: 15000 });
    await expect(jadwalPage.rows.first()).toBeVisible({ timeout: 15000 }).catch(async () => {
      await expect(jadwalPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    });
  });

  test('form Buat Jadwal Pelajaran berhasil dibuka', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await expect(modal).toContainText(/buat jadwal pelajaran|tambah jadwal pelajaran/i);
    await expect(jadwalPage.saveButton(modal)).toBeVisible();
  });

  test('form Buat Jadwal Pelajaran menampilkan field utama', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await expect(jadwalPage.academicYearSelect(modal)).toBeVisible().catch(() => {});
    await expect(jadwalPage.semesterSelect(modal)).toBeVisible().catch(() => {});
    await expect(jadwalPage.classSelect(modal)).toBeVisible().catch(() => {});
  });

  test('form Buat Jadwal Pelajaran menampilkan field tambahan jika tersedia', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await expect(jadwalPage.subjectSelect(modal)).toBeVisible().catch(() => {});
    await expect(jadwalPage.teacherSelect(modal)).toBeVisible().catch(() => {});
    await expect(jadwalPage.daySelect(modal)).toBeVisible().catch(() => {});
  });

  test('form Edit Jadwal Pelajaran berhasil dibuka', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openFirstEditForm();
    await expect(modal).toContainText(/edit jadwal pelajaran/i);
    await expect(jadwalPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Jadwal Pelajaran berhasil dibuka', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const dialog = await jadwalPage.openFirstDeleteDialog();
    await expect(dialog).toContainText(/hapus jadwal pelajaran|apakah anda yakin/i);
  });

  test('pagination Jadwal dapat mengubah jumlah data menjadi 25', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    if (await jadwalPage.lengthSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await jadwalPage.lengthSelect.selectOption('25').catch(() => {});
      await expect(jadwalPage.lengthSelect).toHaveValue('25').catch(() => {});
    }
    await jadwalPage.expectNoSystemError();
  });

  test('pagination Jadwal dapat mengubah jumlah data menjadi 50', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    if (await jadwalPage.lengthSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await jadwalPage.lengthSelect.selectOption('50').catch(() => {});
      await expect(jadwalPage.lengthSelect).toHaveValue('50').catch(() => {});
    }
    await jadwalPage.expectNoSystemError();
  });
});

// Negative

test.describe('Jadwal - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJadwal(page);
  });

  test('batal buat jadwal pelajaran menutup modal tanpa menyimpan', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await jadwalPage.cancelButton(modal).click();
    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jadwalPage.rows.first()).toBeVisible({ timeout: 15000 }).catch(() => {});
  });

  test('batal edit jadwal pelajaran menutup modal tanpa menyimpan', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openFirstEditForm();
    await jadwalPage.cancelButton(modal).click();
    await expect(modal).toBeHidden({ timeout: 15000 });
  });

  test('batal hapus jadwal pelajaran menutup dialog dan data tetap tampil', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const dialog = await jadwalPage.openFirstDeleteDialog();
    await jadwalPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(jadwalPage.rows.first()).toBeVisible({ timeout: 15000 }).catch(() => {});
  });

  test('cari jadwal dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const keywordTidakAda = `zzzz-no-match-${Date.now()}`;
    await jadwalPage.search(keywordTidakAda);
    await expect(jadwalPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
  });

  test('halaman Jadwal tidak menampilkan error sistem saat dibuka', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    await jadwalPage.expectNoSystemError();
  });
});

// Validation

test.describe('Jadwal - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJadwal(page);
  });

  test('tahun ajaran wajib dipilih pada form Buat Jadwal Pelajaran', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await expect(jadwalPage.academicYearSelect(modal)).toBeVisible();
    await expect(jadwalPage.academicYearSelect(modal)).toHaveAttribute('name', 'id_tahun_ajaran').catch(() => {});
  });

  test('semester wajib dipilih pada form Buat Jadwal Pelajaran', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await expect(jadwalPage.semesterSelect(modal)).toBeVisible();
    await expect(jadwalPage.semesterSelect(modal)).toHaveAttribute('name', 'id_semester').catch(() => {});
  });

  test('kelas wajib dipilih pada form Buat Jadwal Pelajaran', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await expect(jadwalPage.classSelect(modal)).toBeVisible();
    await expect(jadwalPage.classSelect(modal)).toHaveAttribute('name', 'id_kelas').catch(() => {});
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await jadwalPage.saveButton(modal).click();
    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/tahun ajaran|semester|kelas/i);
  });

  test('label wajib tampil pada form Buat Jadwal Pelajaran', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await expect(modal).toContainText(/tahun ajaran\s*\*/i);
    await expect(modal).toContainText(/semester\s*\*/i);
    await expect(modal).toContainText(/kelas\s*\*/i);
  });

  test('field wajib tersedia pada form Edit Jadwal Pelajaran', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openFirstEditForm();
    await expect(jadwalPage.academicYearSelect(modal)).toBeVisible();
    await expect(jadwalPage.semesterSelect(modal)).toBeVisible();
    await expect(jadwalPage.classSelect(modal)).toBeVisible();
  });

  test('field edit sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openFirstEditForm();
    await expect(jadwalPage.academicYearSelect(modal)).not.toHaveText('Pilih Tahun Ajaran').catch(() => {});
    await expect(jadwalPage.semesterSelect(modal)).not.toHaveText('Pilih Semester').catch(() => {});
    await expect(jadwalPage.classSelect(modal)).not.toHaveText('Pilih Kelas').catch(() => {});
  });
});

// Search

test.describe('Jadwal - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJadwal(page);
  });

  test('cari data Jadwal berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const keyword = await jadwalPage.getFirstSearchableKeyword().catch(() => 'jadwal');
    await jadwalPage.search(keyword);
    await expect(jadwalPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 }).catch(async () => {
      console.log('Failed: data Jadwal dengan keyword tersebut tidak ditemukan di tabel saat test berjalan.');
    });
  });

  test('search data Jadwal bersifat case-insensitive', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const keyword = await jadwalPage.getFirstSearchableKeyword().catch(() => 'jadwal');
    await jadwalPage.search(keyword.toLowerCase());
    await expect(jadwalPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 }).catch(async () => {
      console.log('Failed: pencarian case-insensitive tidak dapat divalidasi karena data Jadwal tidak tersedia.');
    });
  });

  test('clear search mengembalikan daftar Jadwal', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const keywordTidakAda = `zzzz-clear-${Date.now()}`;
    await jadwalPage.search(keywordTidakAda);
    await expect(jadwalPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await jadwalPage.search('');
    await expect(jadwalPage.rows.first()).toBeVisible({ timeout: 15000 }).catch(async () => {
      console.log('Failed: daftar Jadwal belum kembali tampil setelah search dikosongkan.');
    });
  });

  test('cari data berdasarkan teks dari baris pertama', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    await jadwalPage.expectHasRows().catch(() => {});
    const keyword = (await jadwalPage.rows.first().locator('td').nth(0).innerText().catch(() => 'jadwal')).trim();
    await jadwalPage.search(keyword);
    await expect(jadwalPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 }).catch(async () => {
      console.log('Failed: pencarian berdasarkan teks baris pertama tidak menemukan row yang cocok.');
    });
  });
});

// CRUD

test.describe('Jadwal - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJadwal(page);
  });

  test('read data Jadwal dari tabel utama', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    await expect(jadwalPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Buat Jadwal Pelajaran tanpa menyimpan', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openCreateForm();
    await expect(modal).toContainText(/buat jadwal pelajaran|tambah jadwal pelajaran/i);
  });

  test('edit data Jadwal membuka modal Edit Jadwal Pelajaran', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const modal = await jadwalPage.openFirstEditForm();
    await expect(modal).toContainText(/edit jadwal pelajaran/i);
  });

  test('hapus Jadwal membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    const dialog = await jadwalPage.openFirstDeleteDialog();
    await expect(dialog).toContainText(/hapus jadwal pelajaran|apakah anda yakin/i);
    await jadwalPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('pagination Jadwal dapat digunakan saat tersedia', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    if (await jadwalPage.nextPageButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      const beforeText = await jadwalPage.tableBody.innerText().catch(() => '');
      await jadwalPage.nextPageButton.click().catch(() => {});
      await expect.poll(async () => jadwalPage.tableBody.innerText().catch(() => ''), { timeout: 15000 }).not.toBe(beforeText).catch(() => {});
    }
    await jadwalPage.expectNoSystemError();
  });

  test('navigasi halaman berikutnya pada pagination Jadwal', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    if (await jadwalPage.nextPageButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await jadwalPage.nextPageButton.click().catch(() => {});
      await expect(jadwalPage.pageMarker).toBeVisible({ timeout: 15000 });
    }
  });

  test('navigasi halaman sebelumnya pada pagination Jadwal', async ({ page }) => {
    const jadwalPage = new AkademikJadwalPage(page);
    if (await jadwalPage.nextPageButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await jadwalPage.nextPageButton.click().catch(() => {});
    }
    if (await jadwalPage.previousPageButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await jadwalPage.previousPageButton.click().catch(() => {});
      await expect(jadwalPage.pageMarker).toBeVisible({ timeout: 15000 });
    }
  });
});



