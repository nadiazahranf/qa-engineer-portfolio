const { expect } = require('@playwright/test');

const SISWA_URL = 'https://smard.id/master-data/siswa';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactText(text) {
  return new RegExp(`^${escapeRegExp(text)}$`, 'i');
}

class SiswaPage {
  constructor(page) {
    this.page = page;
    this.masterDataMenu = page
      .getByTestId('master-data-menu')
      .or(page.getByRole('button', { name: /^master data$/i }))
      .or(page.getByRole('link', { name: /^master data$/i }));
    this.siswaMenu = page
      .getByTestId('siswa-menu')
      .or(page.getByRole('link', { name: /^siswa$/i }))
      .or(page.locator('a[href="/master-data/siswa"], a[href*="/master-data/siswa"]').first());
    this.pageMarker = page
      .getByTestId('siswa-page')
      .or(page.getByRole('heading', { name: /^data siswa$/i }))
      .or(page.locator('#siswa-table'))
      .first();
    this.downloadTemplateLink = page
      .getByTestId('siswa-download-template-link')
      .or(page.getByRole('link', { name: /download template/i }));
    this.importButton = page
      .getByTestId('siswa-import-button')
      .or(page.locator('main button').filter({ hasText: /import excel/i }))
      .or(page.locator('form[action*="/master-data/siswa/import"]').getByRole('button', { name: /import excel/i }))
      .or(page.locator('main').getByRole('button', { name: /import excel/i }));
    this.importFileInput = page
      .getByTestId('siswa-import-file-input')
      .or(page.locator('#import-siswa-file'));
    this.addButton = page
      .getByTestId('siswa-add-button')
      .or(page.getByRole('link', { name: /tambah siswa/i }));
    this.searchInput = page
      .getByTestId('siswa-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('siswa-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('siswa-table-body')
      .or(page.locator('#siswa-table tbody'));
    this.rows = page
      .getByTestId('siswa-row')
      .or(page.locator('#siswa-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('siswa-table-info')
      .or(page.locator('#siswa-table_info, .dt-info'));
    this.nextPageButton = page
      .getByTestId('siswa-pagination-next')
      .or(page.locator('#siswa-table_wrapper').getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('siswa-pagination-previous')
      .or(page.locator('#siswa-table_wrapper').getByRole('link', { name: /previous|‹/i }));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.masterDataMenu);

    const menu = this.siswaMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(SISWA_URL);
      });
    } else {
      await this.page.goto(SISWA_URL);
    }

    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await this.expectRowsOrEmpty();
    await this.expectNoSystemError();
  }

  async clickIfVisible(locator) {
    const target = locator.first();

    if (await target.isVisible({ timeout: 3000 }).catch(() => false)) {
      await target.click({ timeout: 3000 }).catch(() => {});
    }
  }

  async openCreatePage() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const form = new SiswaFormPage(this.page, /tambah siswa/i);
    await form.expectLoaded();

    return form;
  }

  async openFirstDetailPage() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('siswa-detail-button')
      .or(this.rows.first().locator('a[href*="/master-data/siswa/"]:not([href$="/edit"])').first())
      .click();

    const form = new SiswaFormPage(this.page, /detail siswa/i);
    await form.expectLoaded();

    return form;
  }

  async openFirstEditPage() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('siswa-edit-button')
      .or(this.rows.first().locator('a[href$="/edit"]').first())
      .click();

    const form = new SiswaFormPage(this.page, /edit siswa/i);
    await form.expectLoaded();

    return form;
  }

  async openFirstDeleteDialog() {
    await this.expectHasRows();
    const row = this.rows.first();
    const deleteButton = row
      .getByTestId('siswa-delete-button')
      .or(row.locator('button').last());

    await deleteButton.click();

    const dialog = this.page
      .getByTestId('siswa-delete-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: /hapus siswa/i }))
      .last();

    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async search(keyword) {
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    await this.searchInput.fill(keyword);
  }

  async getFirstSearchableKeyword() {
    await this.expectHasRows();

    const cells = await this.rows.first().locator('td').allInnerTexts();

    return cells
      .flatMap(text => text.split(/\n+/))
      .map(text => text.trim())
      .filter(text => text && !/^(aksi|aktif|nonaktif|-|edit|hapus|detail)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('siswa-row')
      .or(this.page.locator('#siswa-table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async expectHasRows() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
  }

  async expectRowsOrEmpty() {
    await expect(this.tableBody).toBeVisible({ timeout: 15000 });
    await expect.poll(async () => {
      const text = await this.tableBody.innerText().catch(() => '');
      return /loading/i.test(text);
    }, { timeout: 15000 }).toBe(false);
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

class SiswaFormPage {
  constructor(page, title = /tambah siswa|edit siswa|detail siswa/i) {
    this.page = page;
    this.title = title;
    this.pageMarker = page
      .getByTestId('siswa-form-page')
      .or(page.getByRole('heading', { name: title }))
      .first();
    this.nameInput = page
      .getByTestId('siswa-name-input')
      .or(page.locator('#nama'));
    this.emailInput = page
      .getByTestId('siswa-email-input')
      .or(page.locator('#email'));
    this.birthPlaceInput = page
      .getByTestId('siswa-birth-place-input')
      .or(page.locator('#tempat_lahir'));
    this.birthDateButton = page
      .getByTestId('siswa-birth-date-button')
      .or(page.locator('button#tgl_lahir'));
    this.birthDateHiddenInput = page
      .getByTestId('siswa-birth-date-input')
      .or(page.locator('input[name="tgl_lahir"]'));
    this.genderButton = page
      .getByTestId('siswa-gender-select')
      .or(page.locator('button#jenis_kelamin'));
    this.religionButton = page
      .getByTestId('siswa-religion-select')
      .or(page.locator('button#agama'));
    this.provinceButton = page
      .getByTestId('siswa-province-select')
      .or(page.locator('button#Provinsi-select'));
    this.cityButton = page
      .getByTestId('siswa-city-select')
      .or(page.locator('button#Kota\\/Kabupaten-select'));
    this.statusButton = page
      .getByTestId('siswa-status-select')
      .or(page.locator('button#siswa_aktif'));
    this.addressInput = page
      .getByTestId('siswa-address-input')
      .or(page.locator('#alamat'));
    this.saveButton = page
      .getByTestId('siswa-save-button')
      .or(page.getByRole('button', { name: /simpan siswa|perbarui siswa/i }));
    this.cancelLink = page
      .getByTestId('siswa-cancel-link')
      .or(page.getByRole('link', { name: /^batal$/i }))
      .or(page.getByRole('link', { name: /kembali ke daftar siswa/i }));
    this.detailEditLink = page
      .getByTestId('siswa-detail-edit-link')
      .or(page.getByRole('link', { name: /edit data siswa/i }));
  }

  async expectLoaded() {
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator('main')).toContainText(this.title, { timeout: 15000 });
    await this.expectNoSystemError();
  }

  async expectRequiredPersonalFieldsVisible() {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.birthPlaceInput).toBeVisible();
    await expect(this.birthDateButton).toBeVisible();
    await expect(this.genderButton).toBeVisible();
    await expect(this.religionButton).toBeVisible();
    await expect(this.provinceButton).toBeVisible();
    await expect(this.cityButton).toBeVisible();
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = {
  SiswaPage,
  SiswaFormPage,
  SISWA_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
  exactText,
};
