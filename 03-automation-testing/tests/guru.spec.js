const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { GuruPage, NO_DATA_MESSAGE } = require('../pages/GuruPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaGuru(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const guruPage = new GuruPage(page);
  await guruPage.gotoFromDashboard();

  return guruPage;
}

test.describe('Guru - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGuru(page);
  });

  test('halaman Data Guru berhasil dibuka dari menu Master Data', async ({ page }) => {
    const guruPage = new GuruPage(page);

    await expect(guruPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(guruPage.searchInput).toBeVisible();
    await expect(guruPage.addButton.first()).toBeVisible();
    await guruPage.expectNoSystemError();
  });

  test('tabel Guru menampilkan kolom utama', async ({ page }) => {
    const guruPage = new GuruPage(page);

    await expect(page.locator('#guru-table')).toContainText(/nama guru|nip|pelajaran|no handphone|status|aksi/i);
    await expect(guruPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('halaman Tambah Guru berhasil dibuka', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toBeVisible();
  });

  test('form Tambah Guru menampilkan field wajib', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await form.expectRequiredFieldsVisible();
  });

  test('download template guru berhasil', async ({ page }) => {
    const guruPage = new GuruPage(page);

    const downloadPromise = page.waitForEvent('download');
    await guruPage.downloadTemplateLink.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/guru|template|\.xlsx|\.xls/i);
  });

  test('import template guru menyediakan input file', async ({ page }) => {
    const guruPage = new GuruPage(page);

    await expect(guruPage.importButton.first()).toBeVisible({ timeout: 15000 });
    await expect(guruPage.importFileInput).toBeAttached();
  });

  test('halaman Kelola Role Guru berhasil dibuka', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const rolePage = await guruPage.openFirstRolePage();

    await expect(rolePage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(rolePage.roleCheckboxes.first()).toBeVisible();
  });
});

test.describe('Guru - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGuru(page);
  });

  test('hapus guru dibatalkan melalui confirm dialog dan data tetap tampil', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const message = await guruPage.triggerFirstDeleteAndDismiss();

    expect(message).toMatch(/hapus guru/i);
    await expect(guruPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('batal kelola role guru kembali ke halaman Data Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const rolePage = await guruPage.openFirstRolePage();

    await rolePage.cancelLink.click();

    await expect(page).toHaveURL(/\/master-data\/guru$/, { timeout: 15000 });
    await expect(guruPage.pageMarker).toBeVisible({ timeout: 15000 });
  });

  test('cari guru dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const keywordTidakAda = `guru-tidak-ada-${Date.now()}`;

    await guruPage.search(keywordTidakAda);

    await expect(guruPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(guruPage.rows).toHaveCount(0);
  });
});

test.describe('Guru - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGuru(page);
  });

  test('mata pelajaran wajib tersedia pada form Tambah Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await expect(form.subjectButton).toBeVisible();
    await expect(form.subjectButton).toContainText(/pilih mata pelajaran|matematika/i);
  });

  test('status wajib tersedia pada form Tambah Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await expect(form.statusButton).toBeVisible();
    await expect(form.statusButton).toContainText(/aktif|nonaktif/i);
  });

  test('NIP wajib tampil pada tabel Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);

    await expect(page.locator('#guru-table')).toContainText(/nip/i);
    await expect(guruPage.rows.first().locator('td').nth(1)).toBeVisible();
  });

  test('nama lengkap dan NIK wajib tersedia pada form Tambah Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await expect(form.nameInput).toBeVisible();
    await expect(form.nameInput).toHaveAttribute('name', 'nama');
    await expect(form.nikInput).toBeVisible();
    await expect(form.nikInput).toHaveAttribute('name', 'nik');
  });

  test('tanggal lahir wajib tersedia pada form Tambah Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await expect(form.birthDateButton).toBeVisible();
    await expect(form.birthDateHiddenInput).toBeAttached();
  });

  test('jenis kelamin wajib tersedia pada form Tambah Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await expect(form.genderRadios).toHaveCount(2);
    await expect(page.locator('main')).toContainText(/laki-laki|perempuan/i);
  });

  test('agama wajib tersedia pada form Tambah Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await expect(form.religionButton).toBeVisible();
    await expect(form.religionButton).toContainText(/pilih agama|islam|kristen|katolik|hindu|budha/i);
  });

  test('email wajib tersedia dan bertipe email pada form Tambah Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openCreatePage();

    await expect(form.emailInput).toBeVisible();
    await expect(form.emailInput).toHaveAttribute('type', 'email');
  });
});

test.describe('Guru - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGuru(page);
  });

  test('cari data Guru berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const keyword = await guruPage.getFirstSearchableKeyword();

    await guruPage.search(keyword);

    await expect(guruPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Guru bersifat case-insensitive', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const keyword = await guruPage.getFirstSearchableKeyword();

    await guruPage.search(keyword.toLowerCase());

    await expect(guruPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const keywordTidakAda = `guru-clear-${Date.now()}`;

    await guruPage.search(keywordTidakAda);
    await expect(guruPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await guruPage.search('');
    await expect(guruPage.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Guru - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaGuru(page);
  });

  test('read data Guru dari tabel utama', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const keyword = await guruPage.getFirstSearchableKeyword();

    await expect(guruPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('edit data Guru membuka halaman Edit Guru', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const form = await guruPage.openFirstEditPage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toBeVisible();
  });

  test('kelola role Guru menampilkan daftar role dan tombol simpan', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const rolePage = await guruPage.openFirstRolePage();

    await expect(rolePage.roleCheckboxes.first()).toBeVisible();
    await expect(rolePage.saveButton).toBeVisible();
  });

  test('hapus Guru menampilkan confirm dialog dan dapat dibatalkan', async ({ page }) => {
    const guruPage = new GuruPage(page);
    const message = await guruPage.triggerFirstDeleteAndDismiss();

    expect(message).toMatch(/hapus guru/i);
    await expect(guruPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const guruPage = new GuruPage(page);

    await guruPage.lengthSelect.selectOption('25');

    await expect(guruPage.lengthSelect).toHaveValue('25');
    await expect(guruPage.info).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Guru dapat digunakan saat tersedia', async ({ page }) => {
    const guruPage = new GuruPage(page);

    await guruPage.lengthSelect.selectOption('10');

    const nextButton = guruPage.nextPageButton.first();
    const nextClass = await nextButton.getAttribute('class').catch(() => '');

    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)
      && !/disabled/i.test(nextClass || '')) {
      const beforeText = await guruPage.tableBody.innerText();
      await nextButton.click();

      await expect.poll(async () => guruPage.tableBody.innerText(), { timeout: 15000 }).not.toBe(beforeText);
      await expect(guruPage.previousPageButton.first()).toBeVisible();
    } else {
      await expect(guruPage.info).toBeVisible();
    }

    await guruPage.expectNoSystemError();
  });
});
