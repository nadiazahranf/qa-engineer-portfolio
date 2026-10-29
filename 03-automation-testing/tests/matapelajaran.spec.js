const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { MataPelajaranPage, NO_DATA_MESSAGE } = require('../pages/MataPelajaranPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaMataPelajaran(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const mataPelajaranPage = new MataPelajaranPage(page);
  await mataPelajaranPage.gotoFromDashboard();

  return mataPelajaranPage;
}

test.describe('Mata Pelajaran - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaMataPelajaran(page);
  });

  test('halaman Data Mata Pelajaran berhasil dibuka dari menu Master Data', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);

    await expect(mataPelajaranPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(mataPelajaranPage.addButton.first()).toBeVisible();
    await expect(mataPelajaranPage.searchInput).toBeVisible();
    await mataPelajaranPage.expectNoSystemError();
  });

  test('tabel Mata Pelajaran menampilkan kolom utama', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);

    await expect(page.locator('#matapelajaran-table')).toContainText(/kode|nama pelajaran|total guru|aksi/i);
    await expect(mataPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Mata Pelajaran berhasil dibuka', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openCreateForm();

    await expect(modal).toContainText(/tambah mata pelajaran/i);
    await expect(mataPelajaranPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Mata Pelajaran menampilkan field kode dan nama', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openCreateForm();

    await expect(mataPelajaranPage.codeInput(modal)).toBeVisible();
    await expect(mataPelajaranPage.nameInput(modal)).toBeVisible();
  });

  test('form Edit Mata Pelajaran berhasil dibuka', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openFirstEditForm();

    await expect(modal).toContainText(/edit mata pelajaran/i);
    await expect(mataPelajaranPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Mata Pelajaran berhasil dibuka', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const dialog = await mataPelajaranPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus mata pelajaran|apakah anda yakin/i);
  });
});

test.describe('Mata Pelajaran - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaMataPelajaran(page);
  });

  test('batal tambah mata pelajaran menutup modal tanpa menyimpan', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openCreateForm();

    await mataPelajaranPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(mataPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit mata pelajaran menutup modal tanpa menyimpan', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openFirstEditForm();

    await mataPelajaranPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(mataPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus mata pelajaran menutup dialog dan data tetap tampil', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const dialog = await mataPelajaranPage.openFirstDeleteDialog();

    await mataPelajaranPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(mataPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari mata pelajaran dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const keywordTidakAda = `mata-pelajaran-tidak-ada-${Date.now()}`;

    await mataPelajaranPage.search(keywordTidakAda);

    await expect(mataPelajaranPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(mataPelajaranPage.rows).toHaveCount(0);
  });
});

test.describe('Mata Pelajaran - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaMataPelajaran(page);
  });

  test('kode mata pelajaran wajib tersedia pada form Tambah Mata Pelajaran', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openCreateForm();

    await expect(mataPelajaranPage.codeInput(modal)).toBeVisible();
    await expect(mataPelajaranPage.codeInput(modal)).toHaveAttribute('name', 'kode');
  });

  test('nama mata pelajaran wajib tersedia pada form Tambah Mata Pelajaran', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openCreateForm();

    await expect(mataPelajaranPage.nameInput(modal)).toBeVisible();
    await expect(mataPelajaranPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openCreateForm();

    await mataPelajaranPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/kode mata pelajaran|nama mata pelajaran|wajib/i);
  });

  test('label wajib tampil pada form Tambah Mata Pelajaran', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openCreateForm();

    await expect(modal).toContainText(/kode mata pelajaran\s*\*/i);
    await expect(modal).toContainText(/nama mata pelajaran\s*\*/i);
  });

  test('kode mata pelajaran wajib tersedia pada form Edit Mata Pelajaran', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openFirstEditForm();

    await expect(mataPelajaranPage.codeInput(modal)).toBeVisible();
    await expect(mataPelajaranPage.codeInput(modal)).toHaveAttribute('name', 'kode');
  });

  test('nama mata pelajaran wajib tersedia pada form Edit Mata Pelajaran', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openFirstEditForm();

    await expect(mataPelajaranPage.nameInput(modal)).toBeVisible();
    await expect(mataPelajaranPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('field edit mata pelajaran sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openFirstEditForm();

    await expect(mataPelajaranPage.codeInput(modal)).not.toHaveValue('');
    await expect(mataPelajaranPage.nameInput(modal)).not.toHaveValue('');
  });
});

test.describe('Mata Pelajaran - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaMataPelajaran(page);
  });

  test('cari data Mata Pelajaran berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const keyword = await mataPelajaranPage.getFirstSearchableKeyword();

    await mataPelajaranPage.search(keyword);

    await expect(mataPelajaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Mata Pelajaran bersifat case-insensitive', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const keyword = await mataPelajaranPage.getFirstSearchableKeyword();

    await mataPelajaranPage.search(keyword.toLowerCase());

    await expect(mataPelajaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Mata Pelajaran', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const keywordTidakAda = `mata-pelajaran-clear-${Date.now()}`;

    await mataPelajaranPage.search(keywordTidakAda);
    await expect(mataPelajaranPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await mataPelajaranPage.search('');
    await expect(mataPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan kode mata pelajaran dari baris pertama', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    await mataPelajaranPage.expectHasRows();

    const kode = (await mataPelajaranPage.rows.first().locator('td').nth(0).innerText()).trim();
    await mataPelajaranPage.search(kode);

    await expect(mataPelajaranPage.rowByText(kode).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Mata Pelajaran - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaMataPelajaran(page);
  });

  test('read data Mata Pelajaran dari tabel utama', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const keyword = await mataPelajaranPage.getFirstSearchableKeyword();

    await expect(mataPelajaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Mata Pelajaran tanpa menyimpan', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openCreateForm();

    await expect(modal).toContainText(/tambah mata pelajaran/i);
    await expect(mataPelajaranPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Mata Pelajaran membuka modal Edit Mata Pelajaran', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const modal = await mataPelajaranPage.openFirstEditForm();

    await expect(modal).toContainText(/edit mata pelajaran/i);
    await expect(mataPelajaranPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Mata Pelajaran membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);
    const dialog = await mataPelajaranPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus mata pelajaran|apakah anda yakin/i);
    await mataPelajaranPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);

    await mataPelajaranPage.lengthSelect.selectOption('25');

    await expect(mataPelajaranPage.lengthSelect).toHaveValue('25');
    await expect(mataPelajaranPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);

    await mataPelajaranPage.lengthSelect.selectOption('50');

    await expect(mataPelajaranPage.lengthSelect).toHaveValue('50');
    await expect(mataPelajaranPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Mata Pelajaran dapat digunakan saat tersedia', async ({ page }) => {
    const mataPelajaranPage = new MataPelajaranPage(page);

    await mataPelajaranPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#matapelajaran-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await mataPelajaranPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#matapelajaran-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#matapelajaran-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#matapelajaran-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#matapelajaran-table')).toBeVisible();
    await mataPelajaranPage.expectNoSystemError();
  });
});
