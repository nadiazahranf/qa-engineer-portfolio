const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { JenisPendapatanPage, NO_DATA_MESSAGE } = require('../pages/JenisPendapatanPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaJenisPendapatan(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const jenisPendapatanPage = new JenisPendapatanPage(page);
  await jenisPendapatanPage.gotoFromDashboard();

  return jenisPendapatanPage;
}

test.describe('Jenis Pendapatan - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPendapatan(page);
  });

  test('halaman Data Jenis Pendapatan berhasil dibuka dari menu Master Data', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);

    await expect(jenisPendapatanPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(jenisPendapatanPage.addButton.first()).toBeVisible();
    await expect(jenisPendapatanPage.searchInput).toBeVisible();
    await jenisPendapatanPage.expectNoSystemError();
  });

  test('tabel Jenis Pendapatan menampilkan kolom utama', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);

    await expect(page.locator('#jenispendapatan-table')).toContainText(/nama|kode|nominal|tetap|status|aksi/i);
    await expect(jenisPendapatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Jenis Pendapatan berhasil dibuka', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(modal).toContainText(/tambah jenis pendapatan/i);
    await expect(jenisPendapatanPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Jenis Pendapatan menampilkan field utama', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(jenisPendapatanPage.nameInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.codeInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.nominalInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.fixedCheckbox(modal)).toBeAttached();
    await expect(jenisPendapatanPage.statusRadios(modal).first()).toBeAttached();
  });

  test('form Edit Jenis Pendapatan berhasil dibuka', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jenis pendapatan/i);
    await expect(jenisPendapatanPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Jenis Pendapatan berhasil dibuka', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const dialog = await jenisPendapatanPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jenis pendapatan|apakah anda yakin/i);
  });
});

test.describe('Jenis Pendapatan - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPendapatan(page);
  });

  test('batal tambah jenis pendapatan menutup modal tanpa menyimpan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await jenisPendapatanPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jenisPendapatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit jenis pendapatan menutup modal tanpa menyimpan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openFirstEditForm();

    await jenisPendapatanPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jenisPendapatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus jenis pendapatan menutup dialog dan data tetap tampil', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const dialog = await jenisPendapatanPage.openFirstDeleteDialog();

    await jenisPendapatanPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(jenisPendapatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari jenis pendapatan dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const keywordTidakAda = `jenis-pendapatan-tidak-ada-${Date.now()}`;

    await jenisPendapatanPage.search(keywordTidakAda);

    await expect(jenisPendapatanPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(jenisPendapatanPage.rows).toHaveCount(0);
  });
});

test.describe('Jenis Pendapatan - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPendapatan(page);
  });

  test('nama pendapatan wajib tersedia pada form Tambah Jenis Pendapatan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(jenisPendapatanPage.nameInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.nameInput(modal)).toHaveAttribute('name', 'nama_komponen');
  });

  test('kode pendapatan wajib tersedia pada form Tambah Jenis Pendapatan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(jenisPendapatanPage.codeInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.codeInput(modal)).toHaveAttribute('name', 'kode_komponen');
  });

  test('nominal pendapatan wajib tersedia pada form Tambah Jenis Pendapatan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(jenisPendapatanPage.nominalInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.nominalInput(modal)).toHaveAttribute('name', 'nominal_komponen');
  });

  test('status wajib tersedia pada form Tambah Jenis Pendapatan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(jenisPendapatanPage.statusRadios(modal)).toHaveCount(2);
    await expect(jenisPendapatanPage.statusRadios(modal).first()).toHaveAttribute('name', 'status');
  });

  test('komponen tetap tersedia sebagai field opsional', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(jenisPendapatanPage.fixedCheckbox(modal)).toBeAttached();
    await expect(jenisPendapatanPage.fixedCheckbox(modal)).toHaveAttribute('name', 'komponen_tetap');
  });

  test('opsi status aktif dan non aktif tersedia', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(jenisPendapatanPage.statusRadio(modal, 'aktif')).toBeAttached();
    await expect(jenisPendapatanPage.statusRadio(modal, 'nonaktif')).toBeAttached();
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await jenisPendapatanPage.nameInput(modal).fill('');
    await jenisPendapatanPage.codeInput(modal).fill('');
    await jenisPendapatanPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/nama pendapatan|kode pendapatan|nominal pendapatan|status|wajib/i);
  });

  test('label wajib tampil pada form Tambah Jenis Pendapatan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(modal).toContainText(/nama pendapatan\s*\*/i);
    await expect(modal).toContainText(/kode pendapatan\s*\*/i);
    await expect(modal).toContainText(/nominal pendapatan\s*\*/i);
    await expect(modal).toContainText(/status\s*\*/i);
  });

  test('field wajib tersedia pada form Edit Jenis Pendapatan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openFirstEditForm();

    await expect(jenisPendapatanPage.nameInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.codeInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.nominalInput(modal)).toBeVisible();
    await expect(jenisPendapatanPage.statusRadios(modal)).toHaveCount(2);
  });

  test('field edit jenis pendapatan sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openFirstEditForm();

    await expect(jenisPendapatanPage.nameInput(modal)).not.toHaveValue('');
    await expect(jenisPendapatanPage.codeInput(modal)).not.toHaveValue('');
    await expect(jenisPendapatanPage.nominalInput(modal)).not.toHaveValue('');
  });
});

test.describe('Jenis Pendapatan - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPendapatan(page);
  });

  test('cari data Jenis Pendapatan berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const keyword = await jenisPendapatanPage.getFirstSearchableKeyword();

    await jenisPendapatanPage.search(keyword);

    await expect(jenisPendapatanPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Jenis Pendapatan bersifat case-insensitive', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const keyword = await jenisPendapatanPage.getFirstSearchableKeyword();

    await jenisPendapatanPage.search(keyword.toLowerCase());

    await expect(jenisPendapatanPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Jenis Pendapatan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const keywordTidakAda = `jenis-pendapatan-clear-${Date.now()}`;

    await jenisPendapatanPage.search(keywordTidakAda);
    await expect(jenisPendapatanPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await jenisPendapatanPage.search('');
    await expect(jenisPendapatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan kode pendapatan dari baris pertama', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    await jenisPendapatanPage.expectHasRows();

    const kode = (await jenisPendapatanPage.rows.first().locator('td').nth(1).innerText()).trim();
    await jenisPendapatanPage.search(kode);

    await expect(jenisPendapatanPage.rowByText(kode).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Jenis Pendapatan - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisPendapatan(page);
  });

  test('read data Jenis Pendapatan dari tabel utama', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const keyword = await jenisPendapatanPage.getFirstSearchableKeyword();

    await expect(jenisPendapatanPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Jenis Pendapatan tanpa menyimpan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openCreateForm();

    await expect(modal).toContainText(/tambah jenis pendapatan/i);
    await expect(jenisPendapatanPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Jenis Pendapatan membuka modal Edit Jenis Pendapatan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const modal = await jenisPendapatanPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jenis pendapatan/i);
    await expect(jenisPendapatanPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Jenis Pendapatan membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);
    const dialog = await jenisPendapatanPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jenis pendapatan|apakah anda yakin/i);
    await jenisPendapatanPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);

    await jenisPendapatanPage.lengthSelect.selectOption('25');

    await expect(jenisPendapatanPage.lengthSelect).toHaveValue('25');
    await expect(jenisPendapatanPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);

    await jenisPendapatanPage.lengthSelect.selectOption('50');

    await expect(jenisPendapatanPage.lengthSelect).toHaveValue('50');
    await expect(jenisPendapatanPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Jenis Pendapatan dapat digunakan saat tersedia', async ({ page }) => {
    const jenisPendapatanPage = new JenisPendapatanPage(page);

    await jenisPendapatanPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#jenispendapatan-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await jenisPendapatanPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#jenispendapatan-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#jenispendapatan-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#jenispendapatan-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#jenispendapatan-table')).toBeVisible();
    await jenisPendapatanPage.expectNoSystemError();
  });
});
