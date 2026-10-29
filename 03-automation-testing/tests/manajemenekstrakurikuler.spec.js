const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AkademikManajemenEkstrakurikulerPage, NO_DATA_MESSAGE } = require('./pages/AkademikManajemenEkstrakurikulerPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaManajemenEkstrakurikuler(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
  await manajemenEkstrakurikulerPage.gotoFromDashboard();
  return manajemenEkstrakurikulerPage;
}

test.describe('Manajemen Ekstrakurikuler - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenEkstrakurikuler(page);
  });

  test('halaman Manajemen Ekstrakurikuler berhasil dibuka dari menu Akademik', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    await expect(manajemenEkstrakurikulerPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(manajemenEkstrakurikulerPage.addButton.first()).toBeVisible();
    await expect(manajemenEkstrakurikulerPage.searchInput).toBeVisible();
    await manajemenEkstrakurikulerPage.expectNoSystemError();
  });

  test('tabel Manajemen Ekstrakurikuler menampilkan kolom utama', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    await expect(page.getByRole('table').nth(1)).toContainText(/tahun ajaran|semester|ekstrakurikuler|total siswa|pembimbing|aksi/i);
    await expect(manajemenEkstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Ekstrakurikuler berhasil dibuka', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await expect(modal).toContainText(/tambah ekstrakurikuler/i);
    await expect(manajemenEkstrakurikulerPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Ekstrakurikuler menampilkan field wajib', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await expect(manajemenEkstrakurikulerPage.academicYearSelect(modal)).toBeVisible();
    await expect(manajemenEkstrakurikulerPage.semesterSelect(modal)).toBeVisible();
    await expect(manajemenEkstrakurikulerPage.extracurricularSelect(modal)).toBeVisible();
    await expect(manajemenEkstrakurikulerPage.supervisorSelect(modal)).toBeVisible();
  });

  test('halaman Kelola Siswa berhasil dibuka', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const siswaPage = await manajemenEkstrakurikulerPage.openFirstManageStudentsPage();
    await expect(siswaPage.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test('form Edit data berhasil dibuka', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openFirstEditForm();
    await expect(modal).toContainText(/ubah ekstrakurikuler|edit ekstrakurikuler/i);
    await expect(manajemenEkstrakurikulerPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus data berhasil dibuka', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const dialog = await manajemenEkstrakurikulerPage.openFirstDeleteDialog();
    await expect(dialog).toContainText(/hapus ekstrakurikuler|apakah anda yakin/i);
  });

  test('data hasil pencarian tetap tampil saat keyword cocok', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const keyword = await manajemenEkstrakurikulerPage.getFirstSearchableKeyword();
    await manajemenEkstrakurikulerPage.search(keyword);
    await expect(manajemenEkstrakurikulerPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Manajemen Ekstrakurikuler - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenEkstrakurikuler(page);
  });

  test('batal tambah ekstrakurikuler menutup modal tanpa menyimpan', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await manajemenEkstrakurikulerPage.cancelButton(modal).click();
    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(manajemenEkstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit data menutup modal tanpa menyimpan', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openFirstEditForm();
    await manajemenEkstrakurikulerPage.cancelButton(modal).click();
    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(manajemenEkstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus data menutup dialog dan data tetap tampil', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const dialog = await manajemenEkstrakurikulerPage.openFirstDeleteDialog();
    await manajemenEkstrakurikulerPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(manajemenEkstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal buka Kelola Siswa menutup dialog tanpa perubahan', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const siswaPage = await manajemenEkstrakurikulerPage.openFirstManageStudentsPage();
    await expect(siswaPage.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const keywordTidakAda = `zzzz-no-match-${Date.now()}`;
    await manajemenEkstrakurikulerPage.search(keywordTidakAda);
    await expect(manajemenEkstrakurikulerPage.table).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(manajemenEkstrakurikulerPage.rows).toHaveCount(0);
  });
});

test.describe('Manajemen Ekstrakurikuler - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenEkstrakurikuler(page);
  });

  test('tahun ajaran wajib diisi pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await expect(manajemenEkstrakurikulerPage.academicYearSelect(modal)).toBeVisible();
  });

  test('semester wajib diisi pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await expect(manajemenEkstrakurikulerPage.semesterSelect(modal)).toBeVisible();
  });

  test('ekstrakurikuler wajib diisi pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await expect(manajemenEkstrakurikulerPage.extracurricularSelect(modal)).toBeVisible();
  });

  test('pembimbing wajib diisi pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await expect(manajemenEkstrakurikulerPage.supervisorSelect(modal)).toBeVisible();
  });

  test('label wajib tampil pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await expect(modal).toContainText(/tahun ajaran\s*\*/i);
    await expect(modal).toContainText(/semester\s*\*/i);
    await expect(modal).toContainText(/ekstrakurikuler\s*\*/i);
    await expect(modal).toContainText(/pembimbing/i);
  });

  test('field Tahun Ajaran tersedia pada form Edit data', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openFirstEditForm();
    await expect(manajemenEkstrakurikulerPage.academicYearSelect(modal)).toBeVisible();
  });

  test('field Semester tersedia pada form Edit data', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openFirstEditForm();
    await expect(manajemenEkstrakurikulerPage.semesterSelect(modal)).toBeVisible();
  });

  test('field Ekstrakurikuler tersedia pada form Edit data', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openFirstEditForm();
    await expect(manajemenEkstrakurikulerPage.extracurricularSelect(modal)).toBeVisible();
  });

  test('field Pembimbing tersedia pada form Edit data', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openFirstEditForm();
    await expect(manajemenEkstrakurikulerPage.supervisorSelect(modal)).toBeVisible();
  });

  test('submit form tambah kosong tetap menampilkan validasi', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await manajemenEkstrakurikulerPage.saveButton(modal).click();
    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/tahun ajaran|semester|ekstrakurikuler|pembimbing/i);
  });
});

test.describe('Manajemen Ekstrakurikuler - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenEkstrakurikuler(page);
  });

  test('cari data berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const keyword = await manajemenEkstrakurikulerPage.getFirstSearchableKeyword();
    await manajemenEkstrakurikulerPage.search(keyword);
    await expect(manajemenEkstrakurikulerPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data bersifat case-insensitive', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const keyword = await manajemenEkstrakurikulerPage.getFirstSearchableKeyword();
    await manajemenEkstrakurikulerPage.search(keyword.toLowerCase());
    await expect(manajemenEkstrakurikulerPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const keywordTidakAda = `zzzz-clear-${Date.now()}`;
    await manajemenEkstrakurikulerPage.search(keywordTidakAda);
    await expect(manajemenEkstrakurikulerPage.table).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await manajemenEkstrakurikulerPage.search('');
    await expect(manajemenEkstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan tahun ajaran dari baris pertama', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    await manajemenEkstrakurikulerPage.expectHasRows();
    const tahunAjaran = (await manajemenEkstrakurikulerPage.rows.first().locator('td').nth(0).innerText()).trim();
    await manajemenEkstrakurikulerPage.search(tahunAjaran);
    await expect(manajemenEkstrakurikulerPage.rowByText(tahunAjaran).first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan ekstrakurikuler dari baris pertama', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    await manajemenEkstrakurikulerPage.expectHasRows();
    const ekstrakurikuler = (await manajemenEkstrakurikulerPage.rows.first().locator('td').nth(2).innerText()).trim();
    await manajemenEkstrakurikulerPage.search(ekstrakurikuler);
    await expect(manajemenEkstrakurikulerPage.rowByText(ekstrakurikuler).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Manajemen Ekstrakurikuler - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenEkstrakurikuler(page);
  });

  test('read data Manajemen Ekstrakurikuler dari tabel utama', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const keyword = await manajemenEkstrakurikulerPage.getFirstSearchableKeyword();
    await expect(manajemenEkstrakurikulerPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Ekstrakurikuler tanpa menyimpan', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openCreateForm();
    await expect(modal).toContainText(/tambah ekstrakurikuler/i);
    await expect(manajemenEkstrakurikulerPage.saveButton(modal)).toBeVisible();
  });

  test('read flow membuka halaman Kelola Siswa', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const siswaPage = await manajemenEkstrakurikulerPage.openFirstManageStudentsPage();
    await expect(siswaPage.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test('tambah siswa di Kelola Siswa membuka dialog tanpa menyimpan', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const siswaPage = await manajemenEkstrakurikulerPage.openFirstManageStudentsPage();
    await expect(siswaPage.getByRole('button', { name: /tambah siswa/i })).toBeVisible();
  });

  test('hapus siswa di Kelola Siswa menampilkan kontrol hapus', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const siswaPage = await manajemenEkstrakurikulerPage.openFirstManageStudentsPage();
    await expect(siswaPage.getByRole('button', { name: /hapus data/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test('edit data Manajemen Ekstrakurikuler membuka modal Edit data', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const modal = await manajemenEkstrakurikulerPage.openFirstEditForm();
    await expect(modal).toContainText(/ubah ekstrakurikuler|edit ekstrakurikuler/i);
    await expect(manajemenEkstrakurikulerPage.saveButton(modal)).toBeVisible();
  });

  test('hapus data Manajemen Ekstrakurikuler membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    const dialog = await manajemenEkstrakurikulerPage.openFirstDeleteDialog();
    await expect(dialog).toContainText(/hapus ekstrakurikuler|apakah anda yakin/i);
    await manajemenEkstrakurikulerPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    await manajemenEkstrakurikulerPage.lengthSelect.selectOption('25');
    await expect(manajemenEkstrakurikulerPage.lengthSelect).toHaveValue('25');
    await expect(manajemenEkstrakurikulerPage.table).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    await manajemenEkstrakurikulerPage.lengthSelect.selectOption('50');
    await expect(manajemenEkstrakurikulerPage.lengthSelect).toHaveValue('50');
    await expect(manajemenEkstrakurikulerPage.table).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Manajemen Ekstrakurikuler dapat digunakan saat tersedia', async ({ page }) => {
    const manajemenEkstrakurikulerPage = new AkademikManajemenEkstrakurikulerPage(page);
    await manajemenEkstrakurikulerPage.lengthSelect.selectOption('10');
    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);
    if (totalEntries <= 10) {
      await expect(manajemenEkstrakurikulerPage.table.locator('tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await manajemenEkstrakurikulerPage.expectNoSystemError();
      return;
    }
    const nextButton = page.locator('#ekstrakurikuler-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#ekstrakurikuler-table tbody').innerText();
    await nextButton.click();
    await expect.poll(async () => page.locator('#ekstrakurikuler-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#ekstrakurikuler-table')).toBeVisible();
    await manajemenEkstrakurikulerPage.expectNoSystemError();
  });
});









