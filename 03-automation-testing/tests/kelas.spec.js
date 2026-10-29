const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { KelasPage, NO_DATA_MESSAGE } = require('../pages/KelasPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaKelas(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const kelasPage = new KelasPage(page);
  await kelasPage.gotoFromDashboard();

  return kelasPage;
}

test.describe('Kelas - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaKelas(page);
  });

  test('halaman Data Kelas berhasil dibuka dari menu Master Data', async ({ page }) => {
    const kelasPage = new KelasPage(page);

    await expect(kelasPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(kelasPage.addButton.first()).toBeVisible();
    await expect(kelasPage.searchInput).toBeVisible();
    await kelasPage.expectNoSystemError();
  });

  test('tabel Kelas menampilkan kolom utama', async ({ page }) => {
    const kelasPage = new KelasPage(page);

    await expect(page.locator('#kelas-table')).toContainText(/nama|tingkat|deskripsi|aksi/i);
    await expect(kelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Kelas berhasil dibuka', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openCreateForm();

    await expect(modal).toContainText(/tambah kelas/i);
    await expect(kelasPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Kelas menampilkan field wajib dan deskripsi', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openCreateForm();

    await expect(kelasPage.nameInput(modal)).toBeVisible();
    await expect(kelasPage.levelButton(modal)).toBeVisible();
    await expect(kelasPage.descriptionInput(modal)).toBeVisible();
  });

  test('form Edit Kelas berhasil dibuka', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openFirstEditForm();

    await expect(modal).toContainText(/edit kelas/i);
    await expect(kelasPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Kelas berhasil dibuka', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const dialog = await kelasPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus kelas|apakah anda yakin/i);
  });
});

test.describe('Kelas - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaKelas(page);
  });

  test('batal tambah kelas menutup modal tanpa menyimpan', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openCreateForm();

    await kelasPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(kelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit kelas menutup modal tanpa menyimpan', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openFirstEditForm();

    await kelasPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(kelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus kelas menutup dialog dan data tetap tampil', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const dialog = await kelasPage.openFirstDeleteDialog();

    await kelasPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(kelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari kelas dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const keywordTidakAda = `kelas-tidak-ada-${Date.now()}`;

    await kelasPage.search(keywordTidakAda);

    await expect(kelasPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(kelasPage.rows).toHaveCount(0);
  });
});

test.describe('Kelas - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaKelas(page);
  });

  test('nama kelas wajib tersedia pada form Tambah Kelas', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openCreateForm();

    await expect(kelasPage.nameInput(modal)).toBeVisible();
    await expect(kelasPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('tingkat wajib tersedia pada form Tambah Kelas', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openCreateForm();

    await expect(kelasPage.levelButton(modal)).toBeVisible();
    await expect(kelasPage.levelButton(modal)).toContainText(/pilih tingkat|[1-6]/i);
  });

  test('deskripsi tersedia sebagai field opsional pada form Tambah Kelas', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openCreateForm();

    await expect(kelasPage.descriptionInput(modal)).toBeVisible();
    await expect(kelasPage.descriptionInput(modal)).toHaveAttribute('name', 'deskripsi');
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openCreateForm();

    await kelasPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/nama kelas|tingkat|wajib/i);
  });

  test('nama kelas wajib tersedia pada form Edit Kelas', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openFirstEditForm();

    await expect(kelasPage.nameInput(modal)).toBeVisible();
    await expect(kelasPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('tingkat wajib tersedia pada form Edit Kelas', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openFirstEditForm();

    await expect(kelasPage.levelButton(modal)).toBeVisible();
    await expect(kelasPage.levelButton(modal)).toContainText(/[1-6]|pilih tingkat/i);
  });

  test('deskripsi tersedia pada form Edit Kelas', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openFirstEditForm();

    await expect(kelasPage.descriptionInput(modal)).toBeVisible();
    await expect(kelasPage.descriptionInput(modal)).toHaveAttribute('name', 'deskripsi');
  });
});

test.describe('Kelas - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaKelas(page);
  });

  test('cari data Kelas berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const keyword = await kelasPage.getFirstSearchableKeyword();

    await kelasPage.search(keyword);

    await expect(kelasPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Kelas bersifat case-insensitive', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const keyword = await kelasPage.getFirstSearchableKeyword();

    await kelasPage.search(keyword.toLowerCase());

    await expect(kelasPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Kelas', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const keywordTidakAda = `kelas-clear-${Date.now()}`;

    await kelasPage.search(keywordTidakAda);
    await expect(kelasPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await kelasPage.search('');
    await expect(kelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Kelas - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaKelas(page);
  });

  test('read data Kelas dari tabel utama', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const keyword = await kelasPage.getFirstSearchableKeyword();

    await expect(kelasPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Kelas tanpa menyimpan', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openCreateForm();

    await expect(modal).toContainText(/tambah kelas/i);
    await expect(kelasPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Kelas membuka modal Edit Kelas', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const modal = await kelasPage.openFirstEditForm();

    await expect(modal).toContainText(/edit kelas/i);
    await expect(kelasPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Kelas membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const kelasPage = new KelasPage(page);
    const dialog = await kelasPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus kelas|apakah anda yakin/i);
    await kelasPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const kelasPage = new KelasPage(page);

    await kelasPage.lengthSelect.selectOption('25');

    await expect(kelasPage.lengthSelect).toHaveValue('25');
    await expect(kelasPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Kelas dapat digunakan saat tersedia', async ({ page }) => {
    const kelasPage = new KelasPage(page);

    await kelasPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#kelas-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await kelasPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#kelas-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#kelas-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#kelas-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#kelas-table')).toBeVisible();
    await kelasPage.expectNoSystemError();
  });
});
