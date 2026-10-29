const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AkademikSemesterPage, NO_DATA_MESSAGE } = require('../pages/AkademikSemesterPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaSemester(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const semesterPage = new AkademikSemesterPage(page);
  await semesterPage.gotoFromDashboard();

  return semesterPage;
}

test.describe('Semester - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSemester(page);
  });

  test('halaman Data Semester berhasil dibuka dari menu Akademik', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);

    await expect(semesterPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(semesterPage.addButton.first()).toBeVisible();
    await expect(semesterPage.searchInput).toBeVisible();
    await semesterPage.expectNoSystemError();
  });

  test('tabel Semester menampilkan kolom utama', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);

    await expect(page.locator('#semester-table')).toContainText(/tahun ajaran|semester|urutan|mulai|selesai|status|aksi/i);
    await expect(semesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('form Tambah Semester berhasil dibuka', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(modal).toContainText(/tambah semester/i);
    await expect(semesterPage.saveButton(modal)).toBeVisible();
  });

  test('form Tambah Semester menampilkan semua field wajib', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(semesterPage.academicYearButton(modal)).toBeVisible();
    await expect(semesterPage.nameInput(modal)).toBeVisible();
    await expect(semesterPage.orderInput(modal)).toBeVisible();
    await expect(semesterPage.startDateButton(modal)).toBeVisible();
    await expect(semesterPage.endDateButton(modal)).toBeVisible();
    await expect(semesterPage.statusButton(modal)).toBeVisible();
  });

  test('form Edit Semester berhasil dibuka', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openFirstEditForm();

    await expect(modal).toContainText(/edit semester/i);
    await expect(semesterPage.saveButton(modal)).toBeVisible();
  });

  test('dialog Hapus Semester berhasil dibuka', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const dialog = await semesterPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus semester|apakah anda yakin/i);
  });

  test('dialog Ubah Status Semester berhasil dibuka', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const dialog = await semesterPage.openFirstToggleStatusDialog();

    await expect(dialog).toContainText(/ubah status semester|apakah anda yakin/i);
  });
});

test.describe('Semester - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSemester(page);
  });

  test('batal tambah semester menutup modal tanpa menyimpan', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await semesterPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(semesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal edit semester menutup modal tanpa menyimpan', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openFirstEditForm();

    await semesterPage.cancelButton(modal).click();

    await expect(modal).toBeHidden({ timeout: 15000 });
    await expect(semesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus semester menutup dialog dan data tetap tampil', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const dialog = await semesterPage.openFirstDeleteDialog();

    await semesterPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(semesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal ubah status semester menutup dialog dan data tetap tampil', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const dialog = await semesterPage.openFirstToggleStatusDialog();

    await semesterPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(semesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari semester dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const keywordTidakAda = `zzzz-no-match-${Date.now()}`;

    await semesterPage.search(keywordTidakAda);

    await expect(semesterPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(semesterPage.rows).toHaveCount(0);
  });
});

test.describe('Semester - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSemester(page);
  });

  test('tahun ajaran wajib tersedia pada form Tambah Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(semesterPage.academicYearButton(modal)).toBeVisible();
    await expect(semesterPage.academicYearButton(modal)).toHaveAttribute('name', 'id_tahun_ajaran');
  });

  test('nama semester wajib tersedia pada form Tambah Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(semesterPage.nameInput(modal)).toBeVisible();
    await expect(semesterPage.nameInput(modal)).toHaveAttribute('name', 'nama');
  });

  test('urutan wajib tersedia pada form Tambah Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(semesterPage.orderInput(modal)).toBeVisible();
    await expect(semesterPage.orderInput(modal)).toHaveAttribute('name', 'urutan');
  });

  test('tanggal mulai wajib tersedia pada form Tambah Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(semesterPage.startDateButton(modal)).toBeVisible();
    await expect(semesterPage.startDateInput(modal)).toHaveAttribute('name', 'tgl_awal');
  });

  test('tanggal selesai wajib tersedia pada form Tambah Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(semesterPage.endDateButton(modal)).toBeVisible();
    await expect(semesterPage.endDateInput(modal)).toHaveAttribute('name', 'tgl_akhir');
  });

  test('status wajib tersedia pada form Tambah Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(semesterPage.statusButton(modal)).toBeVisible();
    await expect(semesterPage.statusButton(modal)).toHaveAttribute('name', 'semester_aktif');
  });

  test('submit form tambah kosong tetap menampilkan modal validasi', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await semesterPage.saveButton(modal).click();

    await expect(modal).toBeVisible({ timeout: 15000 });
    await expect(modal).toContainText(/tahun ajaran|nama semester|urutan|tanggal mulai|tanggal selesai|status/i);
  });

  test('label wajib tampil pada form Tambah Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(modal).toContainText(/tahun ajaran\s*\*/i);
    await expect(modal).toContainText(/nama semester\s*\*/i);
    await expect(modal).toContainText(/urutan\s*\*/i);
    await expect(modal).toContainText(/tanggal mulai\s*\*/i);
    await expect(modal).toContainText(/tanggal selesai\s*\*/i);
    await expect(modal).toContainText(/status\s*\*/i);
  });

  test('field wajib tersedia pada form Edit Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openFirstEditForm();

    await expect(semesterPage.academicYearButton(modal)).toBeVisible();
    await expect(semesterPage.nameInput(modal)).toBeVisible();
    await expect(semesterPage.orderInput(modal)).toBeVisible();
    await expect(semesterPage.startDateButton(modal)).toBeVisible();
    await expect(semesterPage.endDateButton(modal)).toBeVisible();
    await expect(semesterPage.statusButton(modal)).toBeVisible();
  });

  test('field edit semester sudah berisi data dari baris yang dipilih', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openFirstEditForm();

    await expect(semesterPage.nameInput(modal)).not.toHaveValue('');
    await expect(semesterPage.orderInput(modal)).not.toHaveValue('');
    await expect(semesterPage.startDateInput(modal)).not.toHaveValue('');
    await expect(semesterPage.endDateInput(modal)).not.toHaveValue('');
  });
});

test.describe('Semester - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSemester(page);
  });

  test('cari data Semester berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const keyword = await semesterPage.getFirstSearchableKeyword();

    await semesterPage.search(keyword);

    await expect(semesterPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Semester bersifat case-insensitive', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const keyword = await semesterPage.getFirstSearchableKeyword();

    await semesterPage.search(keyword.toLowerCase());

    await expect(semesterPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const keywordTidakAda = `zzzz-clear-${Date.now()}`;

    await semesterPage.search(keywordTidakAda);
    await expect(semesterPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await semesterPage.search('');
    await expect(semesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari data berdasarkan nama semester dari baris pertama', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    await semesterPage.expectHasRows();

    const nama = (await semesterPage.rows.first().locator('td').nth(1).innerText()).trim();
    await semesterPage.search(nama);

    await expect(semesterPage.rowByText(nama).first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Semester - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSemester(page);
  });

  test('read data Semester dari tabel utama', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const keyword = await semesterPage.getFirstSearchableKeyword();

    await expect(semesterPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka form Tambah Semester tanpa menyimpan', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openCreateForm();

    await expect(modal).toContainText(/tambah semester/i);
    await expect(semesterPage.saveButton(modal)).toBeVisible();
  });

  test('edit data Semester membuka modal Edit Semester', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const modal = await semesterPage.openFirstEditForm();

    await expect(modal).toContainText(/edit semester/i);
    await expect(semesterPage.saveButton(modal)).toBeVisible();
  });

  test('hapus Semester membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const dialog = await semesterPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus semester|apakah anda yakin/i);
    await semesterPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah status Semester membuka dialog konfirmasi dan dapat dibatalkan', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);
    const dialog = await semesterPage.openFirstToggleStatusDialog();

    await expect(dialog).toContainText(/ubah status semester|apakah anda yakin/i);
    await semesterPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);

    await semesterPage.lengthSelect.selectOption('25');

    await expect(semesterPage.lengthSelect).toHaveValue('25');
    await expect(semesterPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);

    await semesterPage.lengthSelect.selectOption('50');

    await expect(semesterPage.lengthSelect).toHaveValue('50');
    await expect(semesterPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Semester dapat digunakan saat tersedia', async ({ page }) => {
    const semesterPage = new AkademikSemesterPage(page);

    await semesterPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#semester-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await semesterPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#semester-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#semester-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#semester-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#semester-table')).toBeVisible();
    await semesterPage.expectNoSystemError();
  });
});
