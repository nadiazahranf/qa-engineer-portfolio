const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { StaffPage, NO_DATA_MESSAGE } = require('../pages/StaffPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaStaff(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const staffPage = new StaffPage(page);
  await staffPage.gotoFromDashboard();

  return staffPage;
}

test.describe('Staff - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaStaff(page);
  });

  test('halaman Data Staff berhasil dibuka dari menu Master Data', async ({ page }) => {
    const staffPage = new StaffPage(page);

    await expect(staffPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(staffPage.searchInput).toBeVisible();
    await expect(staffPage.addButton.first()).toBeVisible();
    await staffPage.expectNoSystemError();
  });

  test('tabel Staff menampilkan kolom utama', async ({ page }) => {
    const staffPage = new StaffPage(page);

    await expect(page.locator('#staff-table')).toContainText(/nama staff|nip|jabatan|no handphone|status|aksi/i);
    await expect(staffPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('halaman Tambah Staff berhasil dibuka', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toBeVisible();
  });

  test('form Tambah Staff menampilkan field wajib', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await form.expectRequiredFieldsVisible();
  });

  test('halaman Edit Staff berhasil dibuka', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openFirstEditPage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toBeVisible();
  });

  test('tombol kembali pada form Tambah Staff kembali ke halaman Data Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await form.backLink.click();

    await expect(page).toHaveURL(/\/master-data\/staff$/, { timeout: 15000 });
    await expect(staffPage.pageMarker).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Staff - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaStaff(page);
  });

  test('hapus staff dibatalkan melalui confirm dialog dan data tetap tampil', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const message = await staffPage.triggerFirstDeleteAndDismiss();

    expect(message).toMatch(/hapus staff/i);
    await expect(staffPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari staff dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const keywordTidakAda = `staff-tidak-ada-${Date.now()}`;

    await staffPage.search(keywordTidakAda);

    await expect(staffPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(staffPage.rows).toHaveCount(0);
  });

  test('clear search setelah keyword tidak ada mengembalikan daftar Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const keywordTidakAda = `staff-clear-negative-${Date.now()}`;

    await staffPage.search(keywordTidakAda);
    await expect(staffPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await staffPage.search('');
    await expect(staffPage.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Staff - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaStaff(page);
  });

  test('role staff wajib tersedia pada form Tambah Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.roleButton).toBeVisible();
    await expect(form.roleButton).toContainText(/pilih role staff|tata usaha|admin/i);
  });

  test('status staff wajib tersedia pada form Tambah Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.statusButton).toBeVisible();
    await expect(form.statusButton).toContainText(/aktif|nonaktif/i);
  });

  test('NIP wajib tampil pada tabel Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);

    await expect(page.locator('#staff-table')).toContainText(/nip/i);
    await expect(staffPage.rows.first().locator('td').nth(1)).toBeVisible();
  });

  test('nama lengkap dan NIK wajib tersedia pada form Tambah Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.nameInput).toBeVisible();
    await expect(form.nameInput).toHaveAttribute('name', 'nama');
    await expect(form.nikInput).toBeVisible();
    await expect(form.nikInput).toHaveAttribute('name', 'nik');
  });

  test('tanggal lahir wajib tersedia pada form Tambah Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.birthDateButton).toBeVisible();
    await expect(form.birthDateHiddenInput).toBeAttached();
  });

  test('jenis kelamin wajib tersedia pada form Tambah Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.genderRadios).toHaveCount(2);
    await expect(page.locator('main')).toContainText(/laki-laki|perempuan/i);
  });

  test('agama wajib tersedia pada form Tambah Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.religionButton).toBeVisible();
    await expect(form.religionButton).toContainText(/pilih agama|islam|kristen|katolik|hindu|budha/i);
  });

  test('email wajib tersedia dan bertipe email pada form Tambah Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.emailInput).toBeVisible();
    await expect(form.emailInput).toHaveAttribute('type', 'email');
  });

  test('nomor telepon wajib tersedia pada form Tambah Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.phoneInput).toBeVisible();
    await expect(form.phoneInput).toHaveAttribute('name', 'no_hp');
  });
});

test.describe('Staff - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaStaff(page);
  });

  test('cari data Staff berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const keyword = await staffPage.getFirstSearchableKeyword();

    await staffPage.search(keyword);

    await expect(staffPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Staff bersifat case-insensitive', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const keyword = await staffPage.getFirstSearchableKeyword();

    await staffPage.search(keyword.toLowerCase());

    await expect(staffPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data Staff dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const keywordTidakAda = `staff-search-tidak-ada-${Date.now()}`;

    await staffPage.search(keywordTidakAda);

    await expect(staffPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(staffPage.rows).toHaveCount(0);
  });

  test('clear search mengembalikan daftar Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const keywordTidakAda = `staff-clear-${Date.now()}`;

    await staffPage.search(keywordTidakAda);
    await expect(staffPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await staffPage.search('');
    await expect(staffPage.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Staff - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaStaff(page);
  });

  test('read data Staff dari tabel utama', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const keyword = await staffPage.getFirstSearchableKeyword();

    await expect(staffPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Staff tanpa menyimpan', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openCreatePage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toBeVisible();
  });

  test('edit data Staff membuka halaman Edit Staff', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const form = await staffPage.openFirstEditPage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toBeVisible();
  });

  test('hapus Staff menampilkan confirm dialog dan dapat dibatalkan', async ({ page }) => {
    const staffPage = new StaffPage(page);
    const message = await staffPage.triggerFirstDeleteAndDismiss();

    expect(message).toMatch(/hapus staff/i);
    await expect(staffPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const staffPage = new StaffPage(page);

    await staffPage.lengthSelect.selectOption('25');

    await expect(staffPage.lengthSelect).toHaveValue('25');
    await expect(staffPage.info).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Staff dapat digunakan saat tersedia', async ({ page }) => {
    const staffPage = new StaffPage(page);

    await staffPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#staff-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await expect(page.locator('body')).toContainText(/Showing|entries|Data Staff/i);
      await staffPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#staff-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const nextClass = await nextButton.getAttribute('class', { timeout: 3000 }).catch(() => '');

    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)
      && !/disabled/i.test(nextClass || '')) {
      const beforeText = await page.locator('#staff-table tbody').innerText();
      await nextButton.click();

      await expect.poll(async () => page.locator('#staff-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
      await expect(page.locator('#staff-table')).toBeVisible();
    } else {
      await expect(page.locator('#staff-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await expect(page.locator('body')).toContainText(/Showing|entries|Data Staff/i);
    }

    await staffPage.expectNoSystemError();
  });
});
