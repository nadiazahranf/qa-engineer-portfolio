const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { OrangTuaPage, NO_DATA_MESSAGE } = require('../pages/OrangTuaPage');

const EMAIL = 'adminsd1im@gmail.com';
const PASSWORD = 'adminsd1im@gmail.com';

test.setTimeout(120000);

async function bukaOrangTua(page) {
  await new LoginPage(page).login(EMAIL, PASSWORD);
  const orangTuaPage = new OrangTuaPage(page);
  await orangTuaPage.gotoFromDashboard();

  return orangTuaPage;
}

test.describe('Orang Tua - Positive Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaOrangTua(page);
  });

  test('halaman Data OrangTua berhasil dibuka dari menu Master Data', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);

    await expect(orangTuaPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(orangTuaPage.searchInput).toBeVisible();
    await orangTuaPage.expectNoSystemError();
  });

  test('tabel Orang Tua menampilkan kolom utama', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);

    await expect(page.locator('#orangtua-table')).toContainText(/nama siswa|kelas|nama ayah|nama ibu|no\. handphone|aksi/i);
    await expect(orangTuaPage.rows.first()).toBeVisible({ timeout: 15000 });
  });

  test('halaman detail Orang Tua berhasil dibuka', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const detailPage = await orangTuaPage.openFirstDetailPage();

    await expect(detailPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(page.locator('main')).toContainText(/data siswa|data ayah|data ibu/i);
  });

  test('halaman edit Orang Tua berhasil dibuka', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const form = await orangTuaPage.openFirstEditPage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(page.locator('main')).toContainText(/data ayah|data ibu|data wali/i);
  });

  test('form edit Orang Tua menampilkan tombol Simpan dan Batal', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const form = await orangTuaPage.openFirstEditPage();

    await expect(form.saveButton).toBeVisible();
    await expect(form.cancelLink).toBeVisible();
  });
});

test.describe('Orang Tua - Negative Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaOrangTua(page);
  });

  test('batal edit Orang Tua kembali ke halaman detail tanpa menyimpan', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const form = await orangTuaPage.openFirstEditPage();

    await form.cancelLink.click();

    await expect(page).toHaveURL(/\/master-data\/orang_tua\/[^/]+$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /detail data orang tua/i })).toBeVisible();
  });

  test('tombol kembali detail Orang Tua kembali ke daftar', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const detailPage = await orangTuaPage.openFirstDetailPage();

    await detailPage.backLink.click();

    await expect(page).toHaveURL(/\/master-data\/orang_tua$/, { timeout: 15000 });
    await expect(orangTuaPage.pageMarker).toBeVisible({ timeout: 15000 });
  });

  test('cari Orang Tua dengan keyword tidak ada menampilkan pesan kosong', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const keywordTidakAda = `orang-tua-tidak-ada-${Date.now()}`;

    await orangTuaPage.search(keywordTidakAda);

    await expect(orangTuaPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });
    await expect(orangTuaPage.rows).toHaveCount(0);
  });
});

test.describe('Orang Tua - Validation Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaOrangTua(page);
  });

  test('nama lengkap dan NIK wajib tersedia pada form edit Orang Tua', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const form = await orangTuaPage.openFirstEditPage();
    const fields = form.fields('ayah');

    await expect(fields.nameInput).toBeVisible();
    await expect(fields.nameInput).toHaveAttribute('placeholder', /nama lengkap/i);
    await expect(fields.nikInput).toBeVisible();
    await expect(fields.nikInput).toHaveAttribute('placeholder', /nik/i);
  });

  test('pekerjaan dan nomor HP wajib tersedia pada form edit Orang Tua', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const form = await orangTuaPage.openFirstEditPage();
    const fields = form.fields('ayah');

    await expect(fields.jobInput).toBeVisible();
    await expect(fields.jobInput).toHaveAttribute('placeholder', /pekerjaan/i);
    await expect(fields.phoneInput).toBeVisible();
    await expect(fields.phoneInput).toHaveAttribute('placeholder', /08/i);
  });

  test('email wajib tersedia dan bertipe email pada form edit Orang Tua', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const form = await orangTuaPage.openFirstEditPage();
    const fields = form.fields('ayah');

    await expect(fields.emailInput).toBeVisible();
    await expect(fields.emailInput).toHaveAttribute('type', 'email');
  });

  test('provinsi dan kota kabupaten wajib tersedia pada form edit Orang Tua', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const form = await orangTuaPage.openFirstEditPage();
    const fields = form.fields('ayah');

    await expect(fields.provinceSelect).toBeVisible();
    await expect(fields.citySelect).toBeVisible();
  });

  test('alamat lengkap wajib tersedia pada form edit Orang Tua', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const form = await orangTuaPage.openFirstEditPage();
    const fields = form.fields('ayah');

    await expect(fields.addressInput).toBeVisible();
    await expect(fields.addressInput).toHaveAttribute('placeholder', /alamat/i);
  });
});

test.describe('Orang Tua - Search Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaOrangTua(page);
  });

  test('cari data Orang Tua berdasarkan keyword menampilkan row sesuai', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const keyword = await orangTuaPage.getFirstSearchableKeyword();

    await orangTuaPage.search(keyword);

    await expect(orangTuaPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('search data Orang Tua bersifat case-insensitive', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const keyword = await orangTuaPage.getFirstSearchableKeyword();

    await orangTuaPage.search(keyword.toLowerCase());

    await expect(orangTuaPage.rowByText(keyword).first()).toBeVisible({ timeout: 15000 });
  });

  test('clear search mengembalikan daftar Orang Tua', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const keywordTidakAda = `orang-tua-clear-${Date.now()}`;

    await orangTuaPage.search(keywordTidakAda);
    await expect(orangTuaPage.tableBody).toContainText(NO_DATA_MESSAGE, { timeout: 15000 });

    await orangTuaPage.search('');
    await expect(orangTuaPage.rows.first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Orang Tua - CRUD Test Case', () => {
  test.beforeEach(async ({ page }) => {
    await bukaOrangTua(page);
  });

  test('read detail data Orang Tua menampilkan data siswa ayah dan ibu', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const detailPage = await orangTuaPage.openFirstDetailPage();

    await expect(detailPage.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(page.locator('main')).toContainText(/nama siswa|data ayah|data ibu/i);
  });

  test('edit data Orang Tua dari halaman detail membuka form edit', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);
    const detailPage = await orangTuaPage.openFirstDetailPage();
    const form = await detailPage.openEditPage();

    await expect(form.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(form.saveButton).toBeVisible();
  });

  test('ubah jumlah data yang ditampilkan menjadi 25', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);

    await orangTuaPage.lengthSelect.selectOption('25');

    await expect(orangTuaPage.lengthSelect).toHaveValue('25');
    await expect(orangTuaPage.info).toBeVisible({ timeout: 15000 });
  });

  test('pagination tabel Orang Tua dapat digunakan saat tersedia', async ({ page }) => {
    const orangTuaPage = new OrangTuaPage(page);

    await orangTuaPage.lengthSelect.selectOption('10');

    const nextButton = orangTuaPage.nextPageButton.first();
    const nextClass = await nextButton.getAttribute('class').catch(() => '');

    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)
      && !/disabled/i.test(nextClass || '')) {
      const beforeText = await orangTuaPage.tableBody.innerText();
      await nextButton.click();

      await expect.poll(async () => orangTuaPage.tableBody.innerText(), { timeout: 15000 }).not.toBe(beforeText);
      await expect(orangTuaPage.previousPageButton.first()).toBeVisible();
    } else {
      await expect(orangTuaPage.info).toBeVisible();
    }

    await orangTuaPage.expectNoSystemError();
  });
});
