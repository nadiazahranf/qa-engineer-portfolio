const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AkademikTahunAjaranPage, NO_DATA_MESSAGE } = require('../pages/AkademikTahunAjaranPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaTahunAjaran(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const tahunAjaranPage = new AkademikTahunAjaranPage(page);
  await tahunAjaranPage.gotoFromDashboard();

  return tahunAjaranPage;
}

test.describe('Tahun Ajaran - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaTahunAjaran(page);
  });

  test('halaman Data Tahun Ajaran berhasil dibuka dari menu Akademik', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);

    await expect(tahunAjaranPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(tahunAjaranPage.addButton.first()).toBeVisible();
    await expect(tahunAjaranPage.searchInput).toBeVisible();
    await tahunAjaranPage.expectNoSystemError();
  });

  test('tabel Tahun Ajaran menampilkan kolom utama', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);

    await expect(page.locator('#tahunajaran-table')).toContainText(/nama tahun ajaran|mulai|selesai|status|aksi/i);
    await expect(tahunAjaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Tahun Ajaran berhasil dibuka', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await expect(modal).toContainText(/tambah tahun ajaran/i);
    await expect(tahunAjaranPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Tahun Ajaran menampilkan semua field wajib', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await expect(tahunAjaranPage.nameInput(modal)).toBeVisible();
    await expect(tahunAjaranPage.startDateButton(modal)).toBeVisible();
    await expect(tahunAjaranPage.endDateButton(modal)).toBeVisible();
    await expect(tahunAjaranPage.statusButton(modal)).toBeVisible();
  });

  test('form Edit Tahun Ajaran berhasil dibuka', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openFirstEditForm();

    await expect(modal).toContainText(/edit tahun ajaran/i);
    await expect(tahunAjaranPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Tahun Ajaran berhasil dibuka', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const dialog = await tahunAjaranPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus tahun ajaran|apakah anda yakin/i);
  });
});

test.describe('Tahun Ajaran - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaTahunAjaran(page);
  });

  test('batal tambah tahun ajaran menutup modal tanpa menyimpan', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await tahunAjaranPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(tahunAjaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit tahun ajaran menutup modal tanpa menyimpan', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openFirstEditForm();

    await tahunAjaranPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(tahunAjaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus tahun ajaran menutup dialog dan data tetap tampil', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const dialog = await tahunAjaranPage.openFirstDeleteDialog();

    await tahunAjaranPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(tahunAjaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari tahun ajaran dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const keywordTidakAda = `zzzz-no-match-${Date.now()}`;

    await tahunAjaranPage.search(keywordTidakAda);

    await expect(tahunAjaranPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(tahunAjaranPage.rows).toHaveCount(0);
  });
});

test.describe('Tahun Ajaran - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaTahunAjaran(page);
  });

  test('nama tahun ajaran wajib tersedia pada form Tambah Tahun Ajaran', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await expect(tahunAjaranPage.nameInput(modal)).toBeVisible();
    await expect(tahunAjaranPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('tanggal mulai wajib tersedia pada form Tambah Tahun Ajaran', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await expect(tahunAjaranPage.startDateButton(modal)).toBeVisible();
    await expect(tahunAjaranPage.startDateInput(modal)).toHaveAttribute('name', 'tgl_mulai');
  });

  test('tanggal selesai wajib tersedia pada form Tambah Tahun Ajaran', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await expect(tahunAjaranPage.endDateButton(modal)).toBeVisible();
    await expect(tahunAjaranPage.endDateInput(modal)).toHaveAttribute('name', 'tgl_akhir');
  });

  test('status wajib tersedia pada form Tambah Tahun Ajaran', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await expect(tahunAjaranPage.statusButton(modal)).toBeVisible();
    await expect(tahunAjaranPage.statusButton(modal)).toHaveAttribute('name', 'tahun_ajaran_aktif');
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await tahunAjaranPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/nama tahun ajaran|tanggal mulai|tanggal selesai|status/i);
  });

  test('label wajib tampil pada form Tambah Tahun Ajaran', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await expect(modal).toContainText(/nama tahun ajaran\s*\*/i);
    await expect(modal).toContainText(/tanggal mulai\s*\*/i);
    await expect(modal).toContainText(/tanggal selesai\s*\*/i);
    await expect(modal).toContainText(/status\s*\*/i);
  });

  test('field wajib tersedia pada form Edit Tahun Ajaran', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openFirstEditForm();

    await expect(tahunAjaranPage.nameInput(modal)).toBeVisible();
    await expect(tahunAjaranPage.startDateButton(modal)).toBeVisible();
    await expect(tahunAjaranPage.endDateButton(modal)).toBeVisible();
    await expect(tahunAjaranPage.statusButton(modal)).toBeVisible();
  });

  test('field edit tahun ajaran sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openFirstEditForm();

    await expect(tahunAjaranPage.nameInput(modal)).not.toHaveValue('');
    await expect(tahunAjaranPage.startDateInput(modal)).not.toHaveValue('');
    await expect(tahunAjaranPage.endDateInput(modal)).not.toHaveValue('');
  });
});

test.describe('Tahun Ajaran - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaTahunAjaran(page);
  });

  test('cari data Tahun Ajaran berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const keyword = await tahunAjaranPage.getFirstSearchableKeyword();

    await tahunAjaranPage.search(keyword);

    await expect(tahunAjaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Tahun Ajaran bersifat case-insensitive', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const keyword = await tahunAjaranPage.getFirstSearchableKeyword();

    await tahunAjaranPage.search(keyword.toLowerCase());

    await expect(tahunAjaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Tahun Ajaran', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const keywordTidakAda = `zzzz-clear-${Date.now()}`;

    await tahunAjaranPage.search(keywordTidakAda);
    await expect(tahunAjaranPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await tahunAjaranPage.search('');
    await expect(tahunAjaranPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan nama tahun ajaran dari baris pertama', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    await tahunAjaranPage.expectHasRows();

    const nama = (await tahunAjaranPage.rows.first().locator('td').nth(0).innerText()).trim();
    await tahunAjaranPage.search(nama);

    await expect(tahunAjaranPage.rowByText(nama).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Tahun Ajaran - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaTahunAjaran(page);
  });

  test('read data Tahun Ajaran dari tabel utama', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const keyword = await tahunAjaranPage.getFirstSearchableKeyword();

    await expect(tahunAjaranPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Tahun Ajaran tanpa menyimpan', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openCreateForm();

    await expect(modal).toContainText(/tambah tahun ajaran/i);
    await expect(tahunAjaranPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Tahun Ajaran membuka modal Edit Tahun Ajaran', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const modal = await tahunAjaranPage.openFirstEditForm();

    await expect(modal).toContainText(/edit tahun ajaran/i);
    await expect(tahunAjaranPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Tahun Ajaran membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);
    const dialog = await tahunAjaranPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus tahun ajaran|apakah anda yakin/i);
    await tahunAjaranPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);

    await tahunAjaranPage.lengthSelect.selectOption('25');

    await expect(tahunAjaranPage.lengthSelect).toHaveValue('25');
    await expect(tahunAjaranPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);

    await tahunAjaranPage.lengthSelect.selectOption('50');

    await expect(tahunAjaranPage.lengthSelect).toHaveValue('50');
    await expect(tahunAjaranPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Tahun Ajaran dapat digunakan saat tersedia', async ({ page }) => {
    const tahunAjaranPage = new AkademikTahunAjaranPage(page);

    await tahunAjaranPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#tahunajaran-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await tahunAjaranPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#tahunajaran-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#tahunajaran-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#tahunajaran-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#tahunajaran-table')).toBeVisible();
    await tahunAjaranPage.expectNoSystemError();
  });
});
