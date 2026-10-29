const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { JenisCutiPage, NO_DATA_MESSAGE } = require('../pages/JenisCutiPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaJenisCuti(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const jenisCutiPage = new JenisCutiPage(page);
  await jenisCutiPage.gotoFromDashboard();

  return jenisCutiPage;
}

test.describe('Jenis Cuti - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisCuti(page);
  });

  test('halaman Jenis Cuti berhasil dibuka dari menu Master Data', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);

    await expect(jenisCutiPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(jenisCutiPage.addButton.first()).toBeVisible();
    await expect(jenisCutiPage.searchInput).toBeVisible();
    await jenisCutiPage.expectNoSystemError();
  });

  test('tabel Jenis Cuti menampilkan kolom utama', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);

    await expect(page.locator('#jeniscuti-table')).toContainText(/nama jenis cuti|jumlah cuti|aksi/i);
    await expect(jenisCutiPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Buat Jenis Cuti berhasil dibuka', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await expect(modal).toContainText(/tambah jenis cuti/i);
    await expect(jenisCutiPage.saveButton(modal)).toBeVisible();
  });

  test('form Buat Jenis Cuti menampilkan field nama dan jumlah cuti', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await expect(jenisCutiPage.nameInput(modal)).toBeVisible();
    await expect(jenisCutiPage.amountInput(modal)).toBeVisible();
  });

  test('form Edit Jenis Cuti berhasil dibuka', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jenis cuti/i);
    await expect(jenisCutiPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Jenis Cuti berhasil dibuka', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const dialog = await jenisCutiPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jenis cuti|apakah anda yakin/i);
  });
});

test.describe('Jenis Cuti - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisCuti(page);
  });

  test('batal buat jenis cuti menutup modal tanpa menyimpan', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await jenisCutiPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jenisCutiPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit jenis cuti menutup modal tanpa menyimpan', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openFirstEditForm();

    await jenisCutiPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jenisCutiPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus jenis cuti menutup dialog dan data tetap tampil', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const dialog = await jenisCutiPage.openFirstDeleteDialog();

    await jenisCutiPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(jenisCutiPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari jenis cuti dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const keywordTidakAda = `jenis-cuti-tidak-ada-${Date.now()}`;

    await jenisCutiPage.search(keywordTidakAda);

    await expect(jenisCutiPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(jenisCutiPage.rows).toHaveCount(0);
  });
});

test.describe('Jenis Cuti - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisCuti(page);
  });

  test('nama jenis cuti wajib tersedia pada form Buat Jenis Cuti', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await expect(jenisCutiPage.nameInput(modal)).toBeVisible();
    await expect(jenisCutiPage.nameInput(modal)).toHaveAttribute('name', 'nama_jenis_cuti');
  });

  test('jumlah cuti wajib tersedia pada form Buat Jenis Cuti', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await expect(jenisCutiPage.amountInput(modal)).toBeVisible();
    await expect(jenisCutiPage.amountInput(modal)).toHaveAttribute('name', 'jumlah_cuti');
  });

  test('submit form buat kosong tetap menampilkan modal validasi', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await jenisCutiPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/nama jenis cuti|jumlah cuti|wajib/i);
  });

  test('label wajib tampil pada form Buat Jenis Cuti', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await expect(modal).toContainText(/nama jenis cuti\s*\*/i);
    await expect(modal).toContainText(/jumlah cuti \(hari\)\s*\*/i);
  });

  test('nama jenis cuti wajib tersedia pada form Edit Jenis Cuti', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openFirstEditForm();

    await expect(jenisCutiPage.nameInput(modal)).toBeVisible();
    await expect(jenisCutiPage.nameInput(modal)).toHaveAttribute('name', 'nama_jenis_cuti');
  });

  test('jumlah cuti wajib tersedia pada form Edit Jenis Cuti', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openFirstEditForm();

    await expect(jenisCutiPage.amountInput(modal)).toBeVisible();
    await expect(jenisCutiPage.amountInput(modal)).toHaveAttribute('name', 'jumlah_cuti');
  });

  test('field edit jenis cuti sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openFirstEditForm();

    await expect(jenisCutiPage.nameInput(modal)).not.toHaveValue('');
  });

  test('jumlah cuti menggunakan input number', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await expect(jenisCutiPage.amountInput(modal)).toHaveAttribute('type', 'number');
  });
});

test.describe('Jenis Cuti - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisCuti(page);
  });

  test('cari data Jenis Cuti berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const keyword = await jenisCutiPage.getFirstSearchableKeyword();

    await jenisCutiPage.search(keyword);

    await expect(jenisCutiPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Jenis Cuti bersifat case-insensitive', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const keyword = await jenisCutiPage.getFirstSearchableKeyword();

    await jenisCutiPage.search(keyword.toLowerCase());

    await expect(jenisCutiPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Jenis Cuti', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const keywordTidakAda = `jenis-cuti-clear-${Date.now()}`;

    await jenisCutiPage.search(keywordTidakAda);
    await expect(jenisCutiPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await jenisCutiPage.search('');
    await expect(jenisCutiPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan nama jenis cuti dari baris pertama', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    await jenisCutiPage.expectHasRows();

    const nama = (await jenisCutiPage.rows.first().locator('td').nth(0).innerText()).trim();
    await jenisCutiPage.search(nama);

    await expect(jenisCutiPage.rowByText(nama).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Jenis Cuti - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisCuti(page);
  });

  test('read data Jenis Cuti dari tabel utama', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const keyword = await jenisCutiPage.getFirstSearchableKeyword();

    await expect(jenisCutiPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Buat Jenis Cuti tanpa menyimpan', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openCreateForm();

    await expect(modal).toContainText(/tambah jenis cuti/i);
    await expect(jenisCutiPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Jenis Cuti membuka modal Edit Jenis Cuti', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const modal = await jenisCutiPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jenis cuti/i);
    await expect(jenisCutiPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Jenis Cuti membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);
    const dialog = await jenisCutiPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jenis cuti|apakah anda yakin/i);
    await jenisCutiPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);

    await jenisCutiPage.lengthSelect.selectOption('25');

    await expect(jenisCutiPage.lengthSelect).toHaveValue('25');
    await expect(jenisCutiPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);

    await jenisCutiPage.lengthSelect.selectOption('50');

    await expect(jenisCutiPage.lengthSelect).toHaveValue('50');
    await expect(jenisCutiPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Jenis Cuti dapat digunakan saat tersedia', async ({ page }) => {
    const jenisCutiPage = new JenisCutiPage(page);

    await jenisCutiPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#jeniscuti-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await jenisCutiPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#jeniscuti-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#jeniscuti-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#jeniscuti-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#jeniscuti-table')).toBeVisible();
    await jenisCutiPage.expectNoSystemError();
  });
});
