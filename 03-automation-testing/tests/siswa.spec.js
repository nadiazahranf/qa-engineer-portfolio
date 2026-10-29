const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SiswaPage, NO_DATA_MESSAGE } = require('../pages/SiswaPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaSiswa(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const siswaPage = new SiswaPage(page);
  await siswaPage.gotoFromDashboard();

  return siswaPage;
}

test.describe('Siswa - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSiswa(page);
  });

  test('halaman Data Siswa berhasil dibuka dari menu Master Data', async ({ page }) => {
    const siswaPage = new SiswaPage(page);

    await expect(siswaPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(siswaPage.addButton.first()).toBeVisible();
    await expect(siswaPage.searchInput).toBeVisible();
    await siswaPage.expectNoSystemError();
  });

  test('halaman Tambah Siswa berhasil dibuka', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openCreatePage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toBeVisible();
  });

  test('form Tambah Siswa menampilkan field wajib data pribadi', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openCreatePage();

    await form.expectRequiredPersonalFieldsVisible();
  });

  test('download template siswa berhasil', async ({ page }) => {
    const siswaPage = new SiswaPage(page);

    const downloadPromise = page.waitForEvent('download');
    await siswaPage.downloadTemplateLink.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/siswa|template|\.xlsx|\.xls/i);
  });

  test('import Excel menyediakan input file import siswa', async ({ page }) => {
    const siswaPage = new SiswaPage(page);

    await expect(siswaPage.importButton.first()).toBeVisible({ timeout: 15000 });
    await expect(siswaPage.importFileInput).toBeAttached();
  });

});

test.describe('Siswa - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSiswa(page);
  });

  test('batal tambah siswa kembali ke halaman Data Siswa tanpa menyimpan', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openCreatePage();

    await form.cancelLink.click();

    await expect(page).toHaveURL(/\/master-data\/siswa$/, { timeout: 15000 });
    await expect(siswaPage.pageMarker).toBeVisible({ timeout: 15000 });
  });

  test('batal edit siswa kembali ke halaman Data Siswa tanpa menyimpan', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openFirstEditPage();

    await form.cancelLink.first().click();

    await expect(page).toHaveURL(/\/master-data\/siswa$/, { timeout: 15000 });
    await expect(siswaPage.pageMarker).toBeVisible({ timeout: 15000 });
  });

  test('batal hapus siswa menutup dialog dan data tetap tampil', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const dialog = await siswaPage.openFirstDeleteDialog();

    await dialog
      .getByTestId('siswa-cancel-delete-button')
      .or(dialog.getByRole('button', { name: /batal/i }))
      .last()
      .click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(siswaPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

});

test.describe('Siswa - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSiswa(page);
  });

  test('nama lengkap wajib diisi pada form Tambah Siswa', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openCreatePage();

    await form.saveButton.click();

    await expect(page).toHaveURL(/\/master-data\/siswa\/create/, { timeout: 15000 });
    await expect.poll(() => form.nameInput.evaluate(input => input.validity.valueMissing)).toBe(true);
  });

  test('alamat email wajib diisi pada form Tambah Siswa', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openCreatePage();

    await form.nameInput.fill(`QA Siswa ${Date.now()}`);
    await form.emailInput.fill('');
    await form.saveButton.click();

    await expect(page).toHaveURL(/\/master-data\/siswa\/create/, { timeout: 15000 });
    await expect.poll(() => form.emailInput.evaluate(input => input.validity.valueMissing)).toBe(true);
  });

  test('alamat email dengan format tidak valid ditolak browser', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openCreatePage();

    await form.nameInput.fill(`QA Siswa ${Date.now()}`);
    await form.emailInput.fill('email-tidak-valid');
    await form.saveButton.click();

    await expect(page).toHaveURL(/\/master-data\/siswa\/create/, { timeout: 15000 });
    await expect.poll(() => form.emailInput.evaluate(input => input.validity.typeMismatch)).toBe(true);
  });

  test('tempat lahir dan tanggal lahir tersedia pada form Tambah Siswa', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openCreatePage();

    await expect(form.birthPlaceInput).toBeVisible();
    await expect(form.birthPlaceInput).toHaveAttribute('name', 'tempat_lahir');
    await expect(form.birthDateButton).toBeVisible();
    await expect(form.birthDateHiddenInput).toBeAttached();
  });

  test('jenis kelamin agama provinsi dan kota kabupaten tersedia pada form Tambah Siswa', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openCreatePage();

    await expect(form.genderButton).toContainText(/pilih jenis kelamin|laki-laki|perempuan/i);
    await expect(form.religionButton).toContainText(/pilih agama|islam|kristen|katolik|hindu|budha/i);
    await expect(form.provinceButton).toContainText(/pilih provinsi|jawa|aceh|bali/i);
    await expect(form.cityButton).toContainText(/pilih kota|kota|kabupaten/i);
  });
});

test.describe('Siswa - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSiswa(page);
  });

  test('cari data siswa berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const keyword = await siswaPage.getFirstSearchableKeyword();

    await siswaPage.search(keyword);

    await expect(siswaPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data siswa bersifat case-insensitive', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const keyword = await siswaPage.getFirstSearchableKeyword();

    await siswaPage.search(keyword.toLowerCase());

    await expect(siswaPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar siswa', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const keywordTidakAda = `siswa-clear-${Date.now()}`;

    await siswaPage.search(keywordTidakAda);
    await expect(siswaPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await siswaPage.search('');
    await expect(siswaPage.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Siswa - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaSiswa(page);
  });

  test('read detail siswa menampilkan informasi data pribadi', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const detailPage = await siswaPage.openFirstDetailPage();

    await expect(detailPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(page.locator('main')).toContainText(/nama lengkap|alamat email|status siswa/i);
  });

  test('edit data siswa membuka halaman Edit Siswa', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const form = await siswaPage.openFirstEditPage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toContainText(/perbarui siswa/i);
    await expect(form.nameInput).toBeVisible();
  });

  test('hapus siswa membuka dialog konfirmasi hapus', async ({ page }) => {
    const siswaPage = new SiswaPage(page);
    const dialog = await siswaPage.openFirstDeleteDialog();

    await expect(dialog).toContainText(/hapus siswa|apakah anda yakin/i);
  });

  test('ubah jumlah data yang ditampilkan dan pagination tabel siswa', async ({ page }) => {
    const siswaPage = new SiswaPage(page);

    await siswaPage.lengthSelect.selectOption('25');

    await expect(siswaPage.lengthSelect).toHaveValue('25');
    await expect(siswaPage.info).toBeVisible({ timeout: 15000 });

    await siswaPage.lengthSelect.selectOption('10');

    const nextButton = siswaPage.nextPageButton.first();
    const nextClass = await nextButton.getAttribute('class').catch(() => '');

    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)
      && !/disabled/i.test(nextClass || '')) {
      const beforeText = await siswaPage.tableBody.innerText();
      await nextButton.click();

      await expect.poll(async () => siswaPage.tableBody.innerText(), { timeout: 15000 }).not.toBe(beforeText);
      await expect(siswaPage.previousPageButton.first()).toBeVisible();
    } else {
      await expect(siswaPage.info).toBeVisible();
    }

    await siswaPage.expectNoSystemError();
  });
});
