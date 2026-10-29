const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AkademikGantiSemesterPage, NO_DATA_MESSAGE } = require('../pages/AkademikGantiSemesterPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaGantiSemester(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const gantiSemesterPage = new AkademikGantiSemesterPage(page);
  await gantiSemesterPage.gotoFromDashboard();

  return gantiSemesterPage;
}

test.describe('Ganti Semester - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGantiSemester(page);
  });

  test('halaman Ganti Semester berhasil dibuka dari menu Akademik', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);

    await expect(gantiSemesterPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(gantiSemesterPage.addButton.first()).toBeVisible();
    await expect(gantiSemesterPage.searchInput).toBeVisible();
    await gantiSemesterPage.expectNoSystemError();
  });

  test('tabel Ganti Semester menampilkan kolom utama', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);

    await expect(page.locator('#ganti-semester-table')).toContainText(/informasi|tanggal dibuat|tahun ajaran|semester awal|semester tujuan|aksi/i);
    await expect(gantiSemesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('dialog Buat Ganti Semester berhasil dibuka', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openCreateDialog();

    await expect(dialog).toContainText(/validasi ganti semester|ganti semester/i);
    const hasNextButton = await gantiSemesterPage.nextButton(dialog).isVisible().catch(() => false);

    if (hasNextButton) {
      await expect(gantiSemesterPage.nextButton(dialog)).toBeVisible();
    } else {
      await expect(dialog).toContainText(/pergi ke semester|belum ada semester/i);
    }
  });

  test('dialog Buat Ganti Semester menampilkan field keterangan', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openCreateDialog();

    const hasNoteInput = await gantiSemesterPage.noteInput(dialog).isVisible().catch(() => false);

    if (hasNoteInput) {
      await expect(gantiSemesterPage.noteInput(dialog)).toHaveAttribute('name', 'keterangan');
    } else {
      await expect(dialog).toContainText(/belum ada semester|pergi ke semester/i);
    }
  });

  test('halaman detail Ganti Semester berhasil dibuka', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const detail = await gantiSemesterPage.openFirstDetail();

    await expect(detail.pageMarker).toBeVisible({ timeout: 15000 });
  });

  test('halaman detail menampilkan tabel siswa', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const detail = await gantiSemesterPage.openFirstDetail();

    await expect(page.locator('#kenaikan-detail-table')).toContainText(/nama siswa|nis|kelas|distribusi/i);
    await expect(detail.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Ganti Semester - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGantiSemester(page);
  });

  test('batal buat ganti semester menutup dialog tanpa menyimpan', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openCreateDialog();

    await gantiSemesterPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(gantiSemesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('hapus ganti semester aktif menampilkan dialog blokir atau konfirmasi', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/tidak bisa dihapus|hapus ganti semester|semester sudah aktif|apakah anda yakin/i);
  });

  test('tutup dialog hapus ganti semester mengembalikan ke tabel', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openFirstDeleteDialog();

    await gantiSemesterPage.cancelButton(dialog).click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(gantiSemesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari ganti semester dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const keywordTidakAda = `zzzz-no-match-${Date.now()}`;

    await gantiSemesterPage.search(keywordTidakAda);

    await expect(gantiSemesterPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(gantiSemesterPage.rows).toHaveCount(0);
  });
});

test.describe('Ganti Semester - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGantiSemester(page);
  });

  test('field keterangan tersedia pada dialog Buat Ganti Semester', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openCreateDialog();

    const hasNoteInput = await gantiSemesterPage.noteInput(dialog).isVisible().catch(() => false);

    if (hasNoteInput) {
      await expect(gantiSemesterPage.noteInput(dialog)).toBeVisible();
    } else {
      await expect(dialog).toContainText(/belum ada semester|pergi ke semester/i);
    }
  });

  test('tombol Selanjutnya tersedia pada dialog Buat Ganti Semester', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openCreateDialog();

    const hasNextButton = await gantiSemesterPage.nextButton(dialog).isVisible().catch(() => false);

    if (hasNextButton) {
      await expect(gantiSemesterPage.nextButton(dialog)).toBeVisible();
    } else {
      await expect(dialog).toContainText(/pergi ke semester|belum ada semester/i);
    }
  });

  test('tombol Kembali tersedia pada dialog Buat Ganti Semester', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openCreateDialog();

    const hasBackButton = await gantiSemesterPage.backButton(dialog).isVisible().catch(() => false);

    if (hasBackButton) {
      await expect(gantiSemesterPage.backButton(dialog)).toBeVisible();
    } else {
      await expect(gantiSemesterPage.cancelButton(dialog)).toBeVisible();
    }
  });

  test('dialog Buat Ganti Semester menampilkan informasi validasi proses', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openCreateDialog();

    await expect(dialog).toContainText(/validasi ganti semester|semester|selanjutnya/i);
  });
});

test.describe('Ganti Semester - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGantiSemester(page);
  });

  test('cari data Ganti Semester berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const keyword = await gantiSemesterPage.getFirstSearchableKeyword();

    await gantiSemesterPage.search(keyword);

    await expect(gantiSemesterPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Ganti Semester bersifat case-insensitive', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const keyword = await gantiSemesterPage.getFirstSearchableKeyword();

    await gantiSemesterPage.search(keyword.toLowerCase());

    await expect(gantiSemesterPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Ganti Semester', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const keywordTidakAda = `zzzz-clear-${Date.now()}`;

    await gantiSemesterPage.search(keywordTidakAda);
    await expect(gantiSemesterPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await gantiSemesterPage.search('');
    await expect(gantiSemesterPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('cari siswa di halaman detail Ganti Semester berdasarkan keyword', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const detail = await gantiSemesterPage.openFirstDetail();
    const keyword = await detail.getFirstSearchableKeyword();

    await detail.search(keyword);

    await expect(detail.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search detail mengembalikan daftar siswa', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const detail = await gantiSemesterPage.openFirstDetail();
    const keywordTidakAda = `zzzz-detail-${Date.now()}`;

    await detail.search(keywordTidakAda);
    await expect(detail.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await detail.search('');
    await expect(detail.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Ganti Semester - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGantiSemester(page);
  });

  test('read data Ganti Semester dari tabel utama', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const keyword = await gantiSemesterPage.getFirstSearchableKeyword();

    await expect(gantiSemesterPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('create flow membuka dialog Buat Ganti Semester tanpa menyimpan', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openCreateDialog();

    await expect(dialog).toContainText(/validasi ganti semester|ganti semester/i);
  });

  test('read detail Ganti Semester dari tabel siswa', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const detail = await gantiSemesterPage.openFirstDetail();
    const keyword = await detail.getFirstSearchableKeyword();

    await expect(detail.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('delete flow membuka dialog hapus dan dapat dibatalkan atau ditutup', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const dialog = await gantiSemesterPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/tidak bisa dihapus|hapus ganti semester|semester sudah aktif|apakah anda yakin/i);
    await gantiSemesterPage.cancelButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);

    await gantiSemesterPage.lengthSelect.selectOption('25');

    await expect(gantiSemesterPage.lengthSelect).toHaveValue('25');
    await expect(gantiSemesterPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 50', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);

    await gantiSemesterPage.lengthSelect.selectOption('50');

    await expect(gantiSemesterPage.lengthSelect).toHaveValue('50');
    await expect(gantiSemesterPage.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data detail yang ditampilkan menjadi 25', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const detail = await gantiSemesterPage.openFirstDetail();

    await detail.lengthSelect.selectOption('25');

    await expect(detail.lengthSelect).toHaveValue('25');
    await expect(detail.tableBody).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Ganti Semester dapat digunakan saat tersedia', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);

    await gantiSemesterPage.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#ganti-semester-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await gantiSemesterPage.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#ganti-semester-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#ganti-semester-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#ganti-semester-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#ganti-semester-table')).toBeVisible();
    await gantiSemesterPage.expectNoSystemError();
  });

  test('pagination tabel detail dapat digunakan saat tersedia', async ({ page }) => {
    const gantiSemesterPage = new AkademikGantiSemesterPage(page);
    const detail = await gantiSemesterPage.openFirstDetail();

    await detail.lengthSelect.selectOption('10');

    const pageText = await page.locator('body').innerText();
    const totalEntries = Number(pageText.match(/of\s+(\d+)\s+entries/i)?.[1] || 0);

    if (totalEntries <= 10) {
      await expect(page.locator('#kenaikan-detail-table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).first()).toBeVisible({ timeout: 15000 });
      await detail.expectNoSystemError();
      return;
    }

    const nextButton = page.locator('#kenaikan-detail-table_wrapper a[aria-label="Next"], nav[aria-label="pagination"] a[aria-label="Next"]').first();
    const beforeText = await page.locator('#kenaikan-detail-table tbody').innerText();
    await nextButton.click();

    await expect.poll(async () => page.locator('#kenaikan-detail-table tbody').innerText(), { timeout: 15000 }).not.toBe(beforeText);
    await expect(page.locator('#kenaikan-detail-table')).toBeVisible();
    await detail.expectNoSystemError();
  });
});
