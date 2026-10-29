const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { JenisJabatanPage, NO_DATA_MESSAGE } = require('../pages/JenisJabatanPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaJenisJabatan(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const jenisJabatanPage = new JenisJabatanPage(page);
  await jenisJabatanPage.gotoFromDashboard();

  return jenisJabatanPage;
}

test.describe('Jenis Jabatan - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisJabatan(page);
  });

  test('halaman Daftar Jabatan berhasil dibuka dari menu Master Data', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);

    await expect(jenisJabatanPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(jenisJabatanPage.addButton.first()).toBeVisible();
    await expect(jenisJabatanPage.searchInput).toBeVisible();
    await jenisJabatanPage.expectNoSystemError();
  });

  test('tabel Jenis Jabatan menampilkan kolom utama', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);

    await expect(page.locator('#jenisjabatan-table')).toContainText(/nama jabatan|status|aksi/i);
    await expect(jenisJabatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Buat Jabatan Baru berhasil dibuka', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await expect(modal).toContainText(/tambah jabatan baru/i);
    await expect(jenisJabatanPage.saveButton(modal)).toBeVisible();
  });

  test('form Buat Jabatan Baru menampilkan field nama dan status', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await expect(jenisJabatanPage.nameInput(modal)).toBeVisible();
    await expect(jenisJabatanPage.statusRadios(modal).first()).toBeAttached();
  });

  test('form Edit Jabatan berhasil dibuka', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jabatan/i);
    await expect(jenisJabatanPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Jabatan berhasil dibuka', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const dialog = await jenisJabatanPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jabatan|apakah anda yakin/i);
  });
});

test.describe('Jenis Jabatan - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisJabatan(page);
  });

  test('batal buat jabatan baru menutup modal tanpa menyimpan', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await jenisJabatanPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jenisJabatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit jabatan menutup modal tanpa menyimpan', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openFirstEditForm();

    await jenisJabatanPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(jenisJabatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus jabatan menutup dialog dan data tetap tampil', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const dialog = await jenisJabatanPage.openFirstDeleteDialog();

    await jenisJabatanPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(jenisJabatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari jenis jabatan dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const keywordTidakAda = `jenis-jabatan-tidak-ada-${Date.now()}`;

    await jenisJabatanPage.search(keywordTidakAda);

    await expect(jenisJabatanPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(jenisJabatanPage.rows).toHaveCount(0);
  });
});

test.describe('Jenis Jabatan - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisJabatan(page);
  });

  test('nama jabatan wajib tersedia pada form Buat Jabatan Baru', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await expect(jenisJabatanPage.nameInput(modal)).toBeVisible();
    await expect(jenisJabatanPage.nameInput(modal)).toHaveAttribute('name', 'nama_jabatan');
  });

  test('status jabatan wajib tersedia pada form Buat Jabatan Baru', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await expect(jenisJabatanPage.statusRadios(modal)).toHaveCount(2);
    await expect(jenisJabatanPage.statusRadios(modal).first()).toHaveAttribute('name', 'status');
  });

  test('opsi status aktif tersedia pada form Buat Jabatan Baru', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await expect(jenisJabatanPage.statusRadio(modal, 'aktif')).toBeAttached();
    await expect(modal).toContainText(/aktif/i);
  });

  test('opsi status non aktif tersedia pada form Buat Jabatan Baru', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await expect(jenisJabatanPage.statusRadio(modal, 'nonaktif')).toBeAttached();
    await expect(modal).toContainText(/non aktif/i);
  });

  test('submit form buat kosong tetap menampilkan modal validasi', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await jenisJabatanPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/nama jabatan|status jabatan|wajib/i);
  });

  test('label wajib tampil pada form Buat Jabatan Baru', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await expect(modal).toContainText(/nama jabatan\s*\*/i);
    await expect(modal).toContainText(/status jabatan\s*\*/i);
  });

  test('nama jabatan wajib tersedia pada form Edit Jabatan', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openFirstEditForm();

    await expect(jenisJabatanPage.nameInput(modal)).toBeVisible();
    await expect(jenisJabatanPage.nameInput(modal)).toHaveAttribute('name', 'nama_jabatan');
  });

  test('status jabatan wajib tersedia pada form Edit Jabatan', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openFirstEditForm();

    await expect(jenisJabatanPage.statusRadios(modal)).toHaveCount(2);
    await expect(jenisJabatanPage.statusRadios(modal).first()).toHaveAttribute('name', 'status');
  });

  test('field edit jabatan sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openFirstEditForm();

    await expect(jenisJabatanPage.nameInput(modal)).not.toHaveValue('');
  });
});

test.describe('Jenis Jabatan - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisJabatan(page);
  });

  test('cari data Jenis Jabatan berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const keyword = await jenisJabatanPage.getFirstSearchableKeyword();

    await jenisJabatanPage.search(keyword);

    await expect(jenisJabatanPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Jenis Jabatan bersifat case-insensitive', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const keyword = await jenisJabatanPage.getFirstSearchableKeyword();

    await jenisJabatanPage.search(keyword.toLowerCase());

    await expect(jenisJabatanPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Jenis Jabatan', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const keywordTidakAda = `jenis-jabatan-clear-${Date.now()}`;

    await jenisJabatanPage.search(keywordTidakAda);
    await expect(jenisJabatanPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await jenisJabatanPage.search('');
    await expect(jenisJabatanPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan nama jabatan dari baris pertama', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    await jenisJabatanPage.expectHasRows();

    const nama = (await jenisJabatanPage.rows.first().locator('td').nth(0).innerText()).trim();
    await jenisJabatanPage.search(nama);

    await expect(jenisJabatanPage.rowByText(nama).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Jenis Jabatan - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaJenisJabatan(page);
  });

  test('read data Jenis Jabatan dari tabel utama', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const keyword = await jenisJabatanPage.getFirstSearchableKeyword();

    await expect(jenisJabatanPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Buat Jabatan Baru tanpa menyimpan', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openCreateForm();

    await expect(modal).toContainText(/tambah jabatan baru/i);
    await expect(jenisJabatanPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Jenis Jabatan membuka modal Edit Jabatan', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const modal = await jenisJabatanPage.openFirstEditForm();

    await expect(modal).toContainText(/edit jabatan/i);
    await expect(jenisJabatanPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Jenis Jabatan membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);
    const dialog = await jenisJabatanPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus jabatan|apakah anda yakin/i);
    await jenisJabatanPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);

    await jenisJabatanPage.lengthSelect.selectOption('25');

    await expect(jenisJabatanPage.lengthSelect).toHaveValue('25');
    await expect(jenisJabatanPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);

    await jenisJabatanPage.lengthSelect.selectOption('50');

    await expect(jenisJabatanPage.lengthSelect).toHaveValue('50');
    await expect(jenisJabatanPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Jenis Jabatan dapat digunakan saat tersedia', async ({ page }) => {
    const jenisJabatanPage = new JenisJabatanPage(page);

    await jenisJabatanPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#jenisjabatan-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await jenisJabatanPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#jenisjabatan-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#jenisjabatan-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#jenisjabatan-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#jenisjabatan-table')).toBeVisible();
    await jenisJabatanPage.expectNoSystemError();
  });
});
