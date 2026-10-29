const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { JamPelajaranPage, NO_DATA_MESSAGE } = require('../pages/JamPelajaranPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaJamPelajaran(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const jamPelajaranPage = new JamPelajaranPage(page);
  await jamPelajaranPage.gotoFromDashboard();

  return jamPelajaranPage;
}

test.describe('Jam Pelajaran - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJamPelajaran(page);
  });

  test('halaman Data Jam Pelajaran berhasil dibuka dari menu Master Data', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);

    await expect(jamPelajaranPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(jamPelajaranPage.addButton.first()).toBeVisible();
    await expect(jamPelajaranPage.searchInput).toBeVisible();
    await jamPelajaranPage.expectNoSystemError();
  });

  test('tabel Jam Pelajaran menampilkan kolom utama', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);

    await expect(page.locator('#jampelajaran-table')).toContainText(/default|no urutan|nama|waktu|istirahat|deskripsi|aksi/i);
    await expect(jamPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Jam Pelajaran berhasil dibuka', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(modal).toContainText(/tambah jam pelajaran/i);
    await expect(jamPelajaranPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Jam Pelajaran menampilkan semua field wajib dan opsional', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(jamPelajaranPage.orderInput(modal)).toBeVisible();
    await expect(jamPelajaranPage.nameInput(modal)).toBeVisible();
    await expect(jamPelajaranPage.startButton(modal)).toBeVisible();
    await expect(jamPelajaranPage.endButton(modal)).toBeVisible();
    await expect(jamPelajaranPage.descriptionInput(modal)).toBeVisible();
    await expect(jamPelajaranPage.breakCheckbox(modal)).toBeAttached();
    await expect(jamPelajaranPage.defaultCheckbox(modal)).toBeAttached();
  });

  test('form Edit Jam Pelajaran berhasil dibuka', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jam pelajaran/i);
    await expect(jamPelajaranPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Jam Pelajaran berhasil dibuka', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const dialog = await jamPelajaranPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jam pelajaran|apakah anda yakin/i);
  });
});

test.describe('Jam Pelajaran - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJamPelajaran(page);
  });

  test('batal tambah jam pelajaran menutup modal tanpa menyimpan', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await jamPelajaranPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jamPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit jam pelajaran menutup modal tanpa menyimpan', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openFirstEditForm();

    await jamPelajaranPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jamPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus jam pelajaran menutup dialog dan data tetap tampil', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const dialog = await jamPelajaranPage.openFirstDeleteDialog();

    await jamPelajaranPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(jamPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari jam pelajaran dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const keywordTidakAda = `jam-pelajaran-tidak-ada-${Date.now()}`;

    await jamPelajaranPage.search(keywordTidakAda);

    await expect(jamPelajaranPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(jamPelajaranPage.rows).toHaveCount(0);
  });
});

test.describe('Jam Pelajaran - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJamPelajaran(page);
  });

  test('no urutan wajib tersedia pada form Tambah Jam Pelajaran', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(jamPelajaranPage.orderInput(modal)).toBeVisible();
    await expect(jamPelajaranPage.orderInput(modal)).toHaveAttribute('name', 'jam_pelajaran_ke');
  });

  test('nama jam wajib tersedia pada form Tambah Jam Pelajaran', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(jamPelajaranPage.nameInput(modal)).toBeVisible();
    await expect(jamPelajaranPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('mulai dan selesai wajib tersedia pada form Tambah Jam Pelajaran', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(jamPelajaranPage.startButton(modal)).toBeVisible();
    await expect(jamPelajaranPage.startHiddenInput(modal)).toBeAttached();
    await expect(jamPelajaranPage.endButton(modal)).toBeVisible();
    await expect(jamPelajaranPage.endHiddenInput(modal)).toBeAttached();
  });

  test('deskripsi tersedia sebagai field opsional pada form Tambah Jam Pelajaran', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(jamPelajaranPage.descriptionInput(modal)).toBeVisible();
    await expect(jamPelajaranPage.descriptionInput(modal)).toHaveAttribute('name', 'deskripsi');
  });

  test('checkbox tandai sebagai jam istirahat tersedia opsional', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(jamPelajaranPage.breakCheckbox(modal)).toBeAttached();
    await expect(jamPelajaranPage.breakCheckbox(modal)).toHaveAttribute('name', 'istirahat');
  });

  test('checkbox tandai sebagai default tersedia opsional', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(jamPelajaranPage.defaultCheckbox(modal)).toBeAttached();
    await expect(jamPelajaranPage.defaultCheckbox(modal)).toHaveAttribute('name', 'is_default');
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await jamPelajaranPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/no\. urutan|nama jam|mulai|selesai/i);
  });

  test('field wajib tersedia pada form Edit Jam Pelajaran', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openFirstEditForm();

    await expect(jamPelajaranPage.orderInput(modal)).toBeVisible();
    await expect(jamPelajaranPage.nameInput(modal)).toBeVisible();
    await expect(jamPelajaranPage.startButton(modal)).toBeVisible();
    await expect(jamPelajaranPage.endButton(modal)).toBeVisible();
  });
});

test.describe('Jam Pelajaran - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJamPelajaran(page);
  });

  test('cari data Jam Pelajaran berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const keyword = await jamPelajaranPage.getFirstSearchableKeyword();

    await jamPelajaranPage.search(keyword);

    await expect(jamPelajaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Jam Pelajaran bersifat case-insensitive', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const keyword = await jamPelajaranPage.getFirstSearchableKeyword();

    await jamPelajaranPage.search(keyword.toLowerCase());

    await expect(jamPelajaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Jam Pelajaran', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const keywordTidakAda = `jam-pelajaran-clear-${Date.now()}`;

    await jamPelajaranPage.search(keywordTidakAda);
    await expect(jamPelajaranPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await jamPelajaranPage.search('');
    await expect(jamPelajaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Jam Pelajaran - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJamPelajaran(page);
  });

  test('read data Jam Pelajaran dari tabel utama', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const keyword = await jamPelajaranPage.getFirstSearchableKeyword();

    await expect(jamPelajaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Jam Pelajaran tanpa menyimpan', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openCreateForm();

    await expect(modal).toContainText(/tambah jam pelajaran/i);
    await expect(jamPelajaranPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Jam Pelajaran membuka modal Edit Jam Pelajaran', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const modal = await jamPelajaranPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jam pelajaran/i);
    await expect(jamPelajaranPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Jam Pelajaran membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);
    const dialog = await jamPelajaranPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jam pelajaran|apakah anda yakin/i);
    await jamPelajaranPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);

    await jamPelajaranPage.lengthSelect.selectOption('25');

    await expect(jamPelajaranPage.lengthSelect).toHaveValue('25');
    await expect(jamPelajaranPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Jam Pelajaran dapat digunakan saat tersedia', async ({ page }) => {
    const jamPelajaranPage = new JamPelajaranPage(page);

    await jamPelajaranPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#jampelajaran-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await jamPelajaranPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#jampelajaran-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#jampelajaran-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#jampelajaran-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#jampelajaran-table')).toBeVisible();
    await jamPelajaranPage.expectNoSystemError();
  });
});
