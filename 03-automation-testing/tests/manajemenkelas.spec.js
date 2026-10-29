const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AkademikManajemenKelasPage, NO_DATA_MESSAGE } = require('../pages/AkademikManajemenKelasPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaManajemenKelas(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const manajemenKelasPage = new AkademikManajemenKelasPage(page);
  await manajemenKelasPage.gotoFromDashboard();

  return manajemenKelasPage;
}

test.describe('Manajemen Kelas - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenKelas(page);
  });

  test('halaman Manajemen Kelas berhasil dibuka dari menu Akademik', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);

    await expect(manajemenKelasPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(manajemenKelasPage.addButton.first()).toBeVisible();
    await expect(manajemenKelasPage.searchInput).toBeVisible();
    await manajemenKelasPage.expectNoSystemError();
  });

  test('tabel Manajemen Kelas menampilkan kolom utama', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);

    await expect(page.locator('#kelassemester-table')).toContainText(/tahun ajaran|semester|nama kelas|jumlah siswa|wali kelas|status|aksi/i);
    await expect(manajemenKelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Kelas berhasil dibuka', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(modal).toContainText(/tambah kelas/i);
    await expect(manajemenKelasPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Kelas menampilkan semua field wajib', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(manajemenKelasPage.yearButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.semesterButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.classButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.homeroomButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.statusButton(modal)).toBeVisible();
  });

  test('filter Tahun Ajaran dapat diubah', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const option = await manajemenKelasPage.selectFirstNonEmptyOption(manajemenKelasPage.yearFilter);

    await expect(manajemenKelasPage.yearFilter).toHaveValue(option.value);
    await expect(manajemenKelasPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('filter Semester dapat diubah saat opsi tersedia', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);

    await manajemenKelasPage.selectFirstNonEmptyOption(manajemenKelasPage.yearFilter);
    const options = await manajemenKelasPage.semesterFilter.locator('option').evaluateAll(options =>
      options.map(option => ({ value: option.value, text: option.textContent.trim() })).filter(option => option.value));

    if (options.length === 0) {
      await expect(manajemenKelasPage.semesterFilter).toBeVisible();
      return;
    }

    await manajemenKelasPage.semesterFilter.selectOption(options[0].value);
    await expect(manajemenKelasPage.semesterFilter).toHaveValue(options[0].value);
  });

  test('halaman Kelola Siswa Kelas berhasil dibuka', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const detail = await manajemenKelasPage.openFirstManageStudents();

    await expect(detail.pageMarker).toBeVisible({ timeout: 15000 });
  });

  test('form Edit Kelas berhasil dibuka', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openFirstEditForm();

    await expect(modal).toContainText(/edit kelas/i);
    await expect(manajemenKelasPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Kelas berhasil dibuka', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const dialog = await manajemenKelasPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus kelas|apakah anda yakin|tidak bisa dihapus/i);
  });
});

test.describe('Manajemen Kelas - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenKelas(page);
  });

  test('batal tambah kelas menutup modal tanpa menyimpan', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await manajemenKelasPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(manajemenKelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit kelas menutup modal tanpa menyimpan', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openFirstEditForm();

    await manajemenKelasPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(manajemenKelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus kelas menutup dialog dan data tetap tampil', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const dialog = await manajemenKelasPage.openFirstDeleteDialog();

    await manajemenKelasPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(manajemenKelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari manajemen kelas dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const keywordTidakAda = `zzzz-no-match-${Date.now()}`;

    await manajemenKelasPage.search(keywordTidakAda);

    await expect(manajemenKelasPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(manajemenKelasPage.rows).toHaveCount(0);
  });

  test('batal tambah siswa di halaman Kelola Siswa Kelas menutup modal', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const detail = await manajemenKelasPage.openFirstManageStudents();
    const dialog = await detail.openAddStudentDialog();

    await detail.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(detail.tableBody).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Manajemen Kelas - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenKelas(page);
  });

  test('tahun ajaran wajib tersedia pada form Tambah Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(manajemenKelasPage.yearButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.yearButton(modal)).toHaveAttribute('name', 'id_tahun_ajaran');
  });

  test('semester wajib tersedia pada form Tambah Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(manajemenKelasPage.semesterButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.semesterButton(modal)).toHaveAttribute('name', 'id_semester');
  });

  test('kelas wajib tersedia pada form Tambah Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(manajemenKelasPage.classButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.classButton(modal)).toHaveAttribute('name', 'id_kelas');
  });

  test('wali kelas wajib tersedia pada form Tambah Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(manajemenKelasPage.homeroomButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.homeroomButton(modal)).toHaveAttribute('name', 'id_wali_kelas');
  });

  test('status wajib tersedia pada form Tambah Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(manajemenKelasPage.statusButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.statusButton(modal)).toHaveAttribute('name', 'kelas_aktif');
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await manajemenKelasPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/tahun ajaran|semester|kelas|wali kelas|status/i);
  });

  test('label wajib tampil pada form Tambah Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(modal).toContainText(/tahun ajaran\s*\*/i);
    await expect(modal).toContainText(/semester\s*\*/i);
    await expect(modal).toContainText(/kelas\s*\*/i);
    await expect(modal).toContainText(/wali kelas\s*\*/i);
    await expect(modal).toContainText(/status\s*\*/i);
  });

  test('field wajib tersedia pada form Edit Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openFirstEditForm();

    await expect(manajemenKelasPage.yearButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.semesterButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.classButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.homeroomButton(modal)).toBeVisible();
    await expect(manajemenKelasPage.statusButton(modal)).toBeVisible();
  });
});

test.describe('Manajemen Kelas - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenKelas(page);
  });

  test('cari data Manajemen Kelas berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const keyword = await manajemenKelasPage.getFirstSearchableKeyword();

    await manajemenKelasPage.search(keyword);

    await expect(manajemenKelasPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Manajemen Kelas bersifat case-insensitive', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const keyword = await manajemenKelasPage.getFirstSearchableKeyword();

    await manajemenKelasPage.search(keyword.toLowerCase());

    await expect(manajemenKelasPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Manajemen Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const keywordTidakAda = `zzzz-clear-${Date.now()}`;

    await manajemenKelasPage.search(keywordTidakAda);
    await expect(manajemenKelasPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await manajemenKelasPage.search('');
    await expect(manajemenKelasPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari siswa di halaman Kelola Siswa Kelas berdasarkan keyword', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const detail = await manajemenKelasPage.openFirstManageStudents();
    const keyword = await detail.getFirstSearchableKeyword();

    await detail.search(keyword);

    await expect(detail.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search siswa mengembalikan daftar siswa', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const detail = await manajemenKelasPage.openFirstManageStudents();
    const keywordTidakAda = `zzzz-siswa-${Date.now()}`;

    await detail.search(keywordTidakAda);
    await expect(detail.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await detail.search('');
    await expect(detail.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Manajemen Kelas - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaManajemenKelas(page);
  });

  test('read data Manajemen Kelas dari tabel utama', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const keyword = await manajemenKelasPage.getFirstSearchableKeyword();

    await expect(manajemenKelasPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Kelas tanpa menyimpan', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openCreateForm();

    await expect(modal).toContainText(/tambah kelas/i);
    await expect(manajemenKelasPage.saveButton(modal)).toBeVisible();
  });

  test('read flow membuka halaman Kelola Siswa Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const detail = await manajemenKelasPage.openFirstManageStudents();

    await expect(detail.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#kelas-siswa-table')).toContainText(/nama siswa|nis|no handphone|aksi/i);
  });

  test('tambah siswa flow membuka dialog tanpa menyimpan', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const detail = await manajemenKelasPage.openFirstManageStudents();
    const dialog = await detail.openAddStudentDialog();

    await expect(dialog).toContainText(/tambah siswa ke kelas|pilih siswa/i);
    await expect(detail.modalSearchInput(dialog)).toBeVisible();
  });

  test('edit data Manajemen Kelas membuka modal Edit Kelas', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const modal = await manajemenKelasPage.openFirstEditForm();

    await expect(modal).toContainText(/edit kelas/i);
    await expect(manajemenKelasPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Manajemen Kelas membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const dialog = await manajemenKelasPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus kelas|apakah anda yakin|tidak bisa dihapus/i);
    await manajemenKelasPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);

    await manajemenKelasPage.lengthSelect.selectOption('25');

    await expect(manajemenKelasPage.lengthSelect).toHaveValue('25');
    await expect(manajemenKelasPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);

    await manajemenKelasPage.lengthSelect.selectOption('50');

    await expect(manajemenKelasPage.lengthSelect).toHaveValue('50');
    await expect(manajemenKelasPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data siswa yang ditampilkan menjadi 25', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const detail = await manajemenKelasPage.openFirstManageStudents();

    await detail.lengthSelect.selectOption('25');

    await expect(detail.lengthSelect).toHaveValue('25');
    await expect(detail.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Manajemen Kelas dapat digunakan saat tersedia', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);

    await manajemenKelasPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#kelassemester-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await manajemenKelasPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#kelassemester-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#kelassemester-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#kelassemester-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#kelassemester-table')).toBeVisible();
    await manajemenKelasPage.expectNoSystemError();
  });

  test('pagination tabel siswa dapat digunakan saat tersedia', async ({ page }) => {
    const manajemenKelasPage = new AkademikManajemenKelasPage(page);
    const detail = await manajemenKelasPage.openFirstManageStudents();

    await detail.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#kelas-siswa-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await detail.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#kelas-siswa-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#kelas-siswa-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#kelas-siswa-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#kelas-siswa-table')).toBeVisible();
    await detail.expectNoSystemError();
  });
});
