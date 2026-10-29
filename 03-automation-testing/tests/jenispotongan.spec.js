const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { JenisPotonganPage, NO_DATA_MESSAGE } = require('../pages/JenisPotonganPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaJenisPotongan(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const jenisPotonganPage = new JenisPotonganPage(page);
  await jenisPotonganPage.gotoFromDashboard();

  return jenisPotonganPage;
}

test.describe('Jenis Potongan - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPotongan(page);
  });

  test('halaman Data Jenis Potongan berhasil dibuka dari menu Master Data', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);

    await expect(jenisPotonganPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(jenisPotonganPage.addButton.first()).toBeVisible();
    await expect(jenisPotonganPage.searchInput).toBeVisible();
    await jenisPotonganPage.expectNoSystemError();
  });

  test('tabel Jenis Potongan menampilkan kolom utama', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);

    await expect(page.locator('#jenispotongan-table')).toContainText(/nama|kode|nominal|tetap|status|aksi/i);
    await expect(jenisPotonganPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Jenis Potongan berhasil dibuka', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(modal).toContainText(/tambah jenis potongan/i);
    await expect(jenisPotonganPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Jenis Potongan menampilkan field utama', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(jenisPotonganPage.nameInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.codeInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.nominalInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.fixedCheckbox(modal)).toBeAttached();
    await expect(jenisPotonganPage.statusRadios(modal).first()).toBeAttached();
  });

  test('form Edit Jenis Potongan berhasil dibuka', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jenis potongan/i);
    await expect(jenisPotonganPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Jenis Potongan berhasil dibuka', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const dialog = await jenisPotonganPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jenis potongan|apakah anda yakin/i);
  });
});

test.describe('Jenis Potongan - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPotongan(page);
  });

  test('batal tambah jenis potongan menutup modal tanpa menyimpan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await jenisPotonganPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jenisPotonganPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit jenis potongan menutup modal tanpa menyimpan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openFirstEditForm();

    await jenisPotonganPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jenisPotonganPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus jenis potongan menutup dialog dan data tetap tampil', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const dialog = await jenisPotonganPage.openFirstDeleteDialog();

    await jenisPotonganPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(jenisPotonganPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari jenis potongan dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const keywordTidakAda = `zzzz-no-match-${Date.now()}`;

    await jenisPotonganPage.search(keywordTidakAda);

    await expect(jenisPotonganPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(jenisPotonganPage.rows).toHaveCount(0);
  });
});

test.describe('Jenis Potongan - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPotongan(page);
  });

  test('nama potongan wajib tersedia pada form Tambah Jenis Potongan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(jenisPotonganPage.nameInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.nameInput(modal)).toHaveAttribute('name', 'nama_komponen');
  });

  test('kode potongan wajib tersedia pada form Tambah Jenis Potongan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(jenisPotonganPage.codeInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.codeInput(modal)).toHaveAttribute('name', 'kode_komponen');
  });

  test('nominal potongan wajib tersedia pada form Tambah Jenis Potongan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(jenisPotonganPage.nominalInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.nominalInput(modal)).toHaveAttribute('name', 'nominal_komponen');
  });

  test('status wajib tersedia pada form Tambah Jenis Potongan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(jenisPotonganPage.statusRadios(modal)).toHaveCount(2);
    await expect(jenisPotonganPage.statusRadios(modal).first()).toHaveAttribute('name', 'status');
  });

  test('komponen tetap tersedia sebagai field opsional', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(jenisPotonganPage.fixedCheckbox(modal)).toBeAttached();
    await expect(jenisPotonganPage.fixedCheckbox(modal)).toHaveAttribute('name', 'komponen_tetap');
  });

  test('opsi status aktif dan non aktif tersedia', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(jenisPotonganPage.statusRadio(modal, 'aktif')).toBeAttached();
    await expect(jenisPotonganPage.statusRadio(modal, 'nonaktif')).toBeAttached();
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await jenisPotonganPage.nameInput(modal).fill('');
    await jenisPotonganPage.codeInput(modal).fill('');
    await jenisPotonganPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/nama potongan|kode potongan|nominal potongan|status|wajib/i);
  });

  test('label wajib tampil pada form Tambah Jenis Potongan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(modal).toContainText(/nama potongan\s*\*/i);
    await expect(modal).toContainText(/kode potongan\s*\*/i);
    await expect(modal).toContainText(/nominal potongan\s*\*/i);
    await expect(modal).toContainText(/status\s*\*/i);
  });

  test('field wajib tersedia pada form Edit Jenis Potongan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openFirstEditForm();

    await expect(jenisPotonganPage.nameInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.codeInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.nominalInput(modal)).toBeVisible();
    await expect(jenisPotonganPage.statusRadios(modal)).toHaveCount(2);
  });

  test('field edit jenis potongan sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openFirstEditForm();

    await expect(jenisPotonganPage.nameInput(modal)).not.toHaveValue('');
    await expect(jenisPotonganPage.codeInput(modal)).not.toHaveValue('');
    await expect(jenisPotonganPage.nominalInput(modal)).not.toHaveValue('');
  });
});

test.describe('Jenis Potongan - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPotongan(page);
  });

  test('cari data Jenis Potongan berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const keyword = await jenisPotonganPage.getFirstSearchableKeyword();

    await jenisPotonganPage.search(keyword);

    await expect(jenisPotonganPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Jenis Potongan bersifat case-insensitive', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const keyword = await jenisPotonganPage.getFirstSearchableKeyword();

    await jenisPotonganPage.search(keyword.toLowerCase());

    await expect(jenisPotonganPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Jenis Potongan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const keywordTidakAda = `zzzz-clear-${Date.now()}`;

    await jenisPotonganPage.search(keywordTidakAda);
    await expect(jenisPotonganPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await jenisPotonganPage.search('');
    await expect(jenisPotonganPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan kode potongan dari baris pertama', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    await jenisPotonganPage.expectHasRows();

    const kode = (await jenisPotonganPage.rows.first().locator('td').nth(1).innerText()).trim();
    await jenisPotonganPage.search(kode);

    await expect(jenisPotonganPage.rowByText(kode).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Jenis Potongan - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPotongan(page);
  });

  test('read data Jenis Potongan dari tabel utama', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const keyword = await jenisPotonganPage.getFirstSearchableKeyword();

    await expect(jenisPotonganPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Jenis Potongan tanpa menyimpan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openCreateForm();

    await expect(modal).toContainText(/tambah jenis potongan/i);
    await expect(jenisPotonganPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Jenis Potongan membuka modal Edit Jenis Potongan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const modal = await jenisPotonganPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jenis potongan/i);
    await expect(jenisPotonganPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Jenis Potongan membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);
    const dialog = await jenisPotonganPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jenis potongan|apakah anda yakin/i);
    await jenisPotonganPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);

    await jenisPotonganPage.lengthSelect.selectOption('25');

    await expect(jenisPotonganPage.lengthSelect).toHaveValue('25');
    await expect(jenisPotonganPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);

    await jenisPotonganPage.lengthSelect.selectOption('50');

    await expect(jenisPotonganPage.lengthSelect).toHaveValue('50');
    await expect(jenisPotonganPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Jenis Potongan dapat digunakan saat tersedia', async ({ page }) => {
    const jenisPotonganPage = new JenisPotonganPage(page);

    await jenisPotonganPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#jenispotongan-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await jenisPotonganPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#jenispotongan-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#jenispotongan-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#jenispotongan-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#jenispotongan-table')).toBeVisible();
    await jenisPotonganPage.expectNoSystemError();
  });
});
