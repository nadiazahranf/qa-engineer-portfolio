const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { EkstrakurikulerPage, NO_DATA_MESSAGE } = require('../pages/EkstrakurikulerPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaEkstrakurikuler(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const ekstrakurikulerPage = new EkstrakurikulerPage(page);
  await ekstrakurikulerPage.gotoFromDashboard();

  return ekstrakurikulerPage;
}

test.describe('Ekstrakurikuler - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaEkstrakurikuler(page);
  });

  test('halaman Data Ekstrakurikuler berhasil dibuka dari menu Master Data', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);

    await expect(ekstrakurikulerPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(ekstrakurikulerPage.addButton.first()).toBeVisible();
    await expect(ekstrakurikulerPage.searchInput).toBeVisible();
    await ekstrakurikulerPage.expectNoSystemError();
  });

  test('tabel Ekstrakurikuler menampilkan kolom utama', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);

    await expect(page.locator('#ekstrakurikuler-table')).toContainText(/kode|nama|deskripsi|aksi/i);
    await expect(ekstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Ekstrakurikuler berhasil dibuka', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await expect(modal).toContainText(/tambah ekstrakurikuler/i);
    await expect(ekstrakurikulerPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Ekstrakurikuler menampilkan field kode nama dan deskripsi', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await expect(ekstrakurikulerPage.codeInput(modal)).toBeVisible();
    await expect(ekstrakurikulerPage.nameInput(modal)).toBeVisible();
    await expect(ekstrakurikulerPage.descriptionInput(modal)).toBeVisible();
  });

  test('form Edit Ekstrakurikuler berhasil dibuka', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openFirstEditForm();

    await expect(modal).toContainText(/edit ekstrakurikuler/i);
    await expect(ekstrakurikulerPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Ekstrakurikuler berhasil dibuka', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const dialog = await ekstrakurikulerPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus ekstrakurikuler|apakah anda yakin/i);
  });
});

test.describe('Ekstrakurikuler - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaEkstrakurikuler(page);
  });

  test('batal tambah ekstrakurikuler menutup modal tanpa menyimpan', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await ekstrakurikulerPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(ekstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit ekstrakurikuler menutup modal tanpa menyimpan', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openFirstEditForm();

    await ekstrakurikulerPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(ekstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus ekstrakurikuler menutup dialog dan data tetap tampil', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const dialog = await ekstrakurikulerPage.openFirstDeleteDialog();

    await ekstrakurikulerPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(ekstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari ekstrakurikuler dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const keywordTidakAda = `ekstrakurikuler-tidak-ada-${Date.now()}`;

    await ekstrakurikulerPage.search(keywordTidakAda);

    await expect(ekstrakurikulerPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(ekstrakurikulerPage.rows).toHaveCount(0);
  });
});

test.describe('Ekstrakurikuler - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaEkstrakurikuler(page);
  });

  test('kode wajib tersedia pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await expect(ekstrakurikulerPage.codeInput(modal)).toBeVisible();
    await expect(ekstrakurikulerPage.codeInput(modal)).toHaveAttribute('name', 'kode');
  });

  test('nama wajib tersedia pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await expect(ekstrakurikulerPage.nameInput(modal)).toBeVisible();
    await expect(ekstrakurikulerPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('deskripsi tersedia sebagai field opsional pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await expect(ekstrakurikulerPage.descriptionInput(modal)).toBeVisible();
    await expect(ekstrakurikulerPage.descriptionInput(modal)).toHaveAttribute('name', 'deskripsi');
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await ekstrakurikulerPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/kode|nama|wajib/i);
  });

  test('label wajib tampil pada form Tambah Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await expect(modal).toContainText(/kode\s*\*/i);
    await expect(modal).toContainText(/nama\s*\*/i);
  });

  test('kode wajib tersedia pada form Edit Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openFirstEditForm();

    await expect(ekstrakurikulerPage.codeInput(modal)).toBeVisible();
    await expect(ekstrakurikulerPage.codeInput(modal)).toHaveAttribute('name', 'kode');
  });

  test('nama wajib tersedia pada form Edit Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openFirstEditForm();

    await expect(ekstrakurikulerPage.nameInput(modal)).toBeVisible();
    await expect(ekstrakurikulerPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('deskripsi tersedia pada form Edit Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openFirstEditForm();

    await expect(ekstrakurikulerPage.descriptionInput(modal)).toBeVisible();
    await expect(ekstrakurikulerPage.descriptionInput(modal)).toHaveAttribute('name', 'deskripsi');
  });

  test('field edit ekstrakurikuler sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openFirstEditForm();

    await expect(ekstrakurikulerPage.codeInput(modal)).not.toHaveValue('');
    await expect(ekstrakurikulerPage.nameInput(modal)).not.toHaveValue('');
  });
});

test.describe('Ekstrakurikuler - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaEkstrakurikuler(page);
  });

  test('cari data Ekstrakurikuler berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const keyword = await ekstrakurikulerPage.getFirstSearchableKeyword();

    await ekstrakurikulerPage.search(keyword);

    await expect(ekstrakurikulerPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Ekstrakurikuler bersifat case-insensitive', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const keyword = await ekstrakurikulerPage.getFirstSearchableKeyword();

    await ekstrakurikulerPage.search(keyword.toLowerCase());

    await expect(ekstrakurikulerPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const keywordTidakAda = `ekstrakurikuler-clear-${Date.now()}`;

    await ekstrakurikulerPage.search(keywordTidakAda);
    await expect(ekstrakurikulerPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await ekstrakurikulerPage.search('');
    await expect(ekstrakurikulerPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan kode ekstrakurikuler dari baris pertama', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    await ekstrakurikulerPage.expectHasRows();

    const kode = (await ekstrakurikulerPage.rows.first().locator('td').nth(0).innerText()).trim();
    await ekstrakurikulerPage.search(kode);

    await expect(ekstrakurikulerPage.rowByText(kode).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Ekstrakurikuler - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaEkstrakurikuler(page);
  });

  test('read data Ekstrakurikuler dari tabel utama', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const keyword = await ekstrakurikulerPage.getFirstSearchableKeyword();

    await expect(ekstrakurikulerPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Ekstrakurikuler tanpa menyimpan', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openCreateForm();

    await expect(modal).toContainText(/tambah ekstrakurikuler/i);
    await expect(ekstrakurikulerPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Ekstrakurikuler membuka modal Edit Ekstrakurikuler', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const modal = await ekstrakurikulerPage.openFirstEditForm();

    await expect(modal).toContainText(/edit ekstrakurikuler/i);
    await expect(ekstrakurikulerPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Ekstrakurikuler membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);
    const dialog = await ekstrakurikulerPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus ekstrakurikuler|apakah anda yakin/i);
    await ekstrakurikulerPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);

    await ekstrakurikulerPage.lengthSelect.selectOption('25');

    await expect(ekstrakurikulerPage.lengthSelect).toHaveValue('25');
    await expect(ekstrakurikulerPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);

    await ekstrakurikulerPage.lengthSelect.selectOption('50');

    await expect(ekstrakurikulerPage.lengthSelect).toHaveValue('50');
    await expect(ekstrakurikulerPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Ekstrakurikuler dapat digunakan saat tersedia', async ({ page }) => {
    const ekstrakurikulerPage = new EkstrakurikulerPage(page);

    await ekstrakurikulerPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#ekstrakurikuler-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await ekstrakurikulerPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#ekstrakurikuler-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#ekstrakurikuler-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#ekstrakurikuler-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#ekstrakurikuler-table')).toBeVisible();
    await ekstrakurikulerPage.expectNoSystemError();
  });
});
