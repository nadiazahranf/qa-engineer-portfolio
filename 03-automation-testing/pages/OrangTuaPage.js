const { expect } = require('@playwright/test');

const ORANG_TUA_URL = 'https://smard.id/master-data/orang_tua';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class OrangTuaPage {
  constructor(page) {
    this.page = page;
    this.masterDataMenu = page
      .getByTestId('master-data-menu')
      .or(page.getByRole('button', { name: /^master data$/i }))
      .or(page.getByRole('link', { name: /^master data$/i }));
    this.orangTuaMenu = page
      .getByTestId('orang-tua-menu')
      .or(page.getByRole('link', { name: /^orang tua$/i }))
      .or(page.locator('a[href="/master-data/orang_tua"], a[href*="/master-data/orang_tua"]').first());
    this.pageMarker = page
      .getByTestId('orang-tua-page')
      .or(page.getByRole('heading', { name: /^data orangtua$/i }))
      .or(page.locator('#orangtua-table'))
      .first();
    this.searchInput = page
      .getByTestId('orang-tua-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('orang-tua-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('orang-tua-table-body')
      .or(page.locator('#orangtua-table tbody'));
    this.rows = page
      .getByTestId('orang-tua-row')
      .or(page.locator('#orangtua-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('orang-tua-table-info')
      .or(page.locator('#orangtua-table_info, .dt-info'));
    this.nextPageButton = page
      .getByTestId('orang-tua-pagination-next')
      .or(page.locator('#orangtua-table_wrapper').getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('orang-tua-pagination-previous')
      .or(page.locator('#orangtua-table_wrapper').getByRole('link', { name: /previous|‹/i }));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.masterDataMenu);

    const menu = this.orangTuaMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(ORANG_TUA_URL);
      });
    } else {
      await this.page.goto(ORANG_TUA_URL);
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

  async openFirstDetailPage() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('orang-tua-detail-button')
      .or(this.rows.first().getByRole('link', { name: /lihat detail/i }))
      .or(this.rows.first().locator('a[href*="/master-data/orang_tua/"]:not([href$="/edit"])').first())
      .click();

    const detail = new OrangTuaDetailPage(this.page);
    await detail.expectLoaded();

    return detail;
  }

  async openFirstEditPage() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('orang-tua-edit-button')
      .or(this.rows.first().getByRole('link', { name: /edit data/i }))
      .or(this.rows.first().locator('a[href$="/edit"]').first())
      .click();

    const form = new OrangTuaFormPage(this.page);
    await form.expectLoaded();

    return form;
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
      .filter(text => text && !/^(aksi|-|lihat detail|edit data)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('orang-tua-row')
      .or(this.page.locator('#orangtua-table tbody tr'))
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

class OrangTuaDetailPage {
  constructor(page) {
    this.page = page;
    this.pageMarker = page
      .getByTestId('orang-tua-detail-page')
      .or(page.getByRole('heading', { name: /^detail data orang tua$/i }))
      .first();
    this.editLink = page
      .getByTestId('orang-tua-detail-edit-link')
      .or(page.locator('main').getByRole('button', { name: /edit data/i }))
      .or(page.locator('main').getByRole('link', { name: /edit data/i }))
      .first();
    this.backLink = page
      .getByTestId('orang-tua-detail-back-link')
      .or(page.locator('main').getByRole('button', { name: /kembali/i }))
      .or(page.locator('main').getByRole('link', { name: /kembali/i }))
      .first();
  }

  async expectLoaded() {
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator('main')).toContainText(/data siswa|data ayah|data ibu/i);
    await this.expectNoSystemError();
  }

  async openEditPage() {
    await expect(this.editLink).toBeVisible({ timeout: 15000 });
    await this.editLink.click();

    const form = new OrangTuaFormPage(this.page);
    await form.expectLoaded();

    return form;
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

class OrangTuaFormPage {
  constructor(page) {
    this.page = page;
    this.pageMarker = page
      .getByTestId('orang-tua-form-page')
      .or(page.getByRole('heading', { name: /^edit data orang tua$/i }))
      .first();
    this.saveButton = page
      .getByTestId('orang-tua-save-button')
      .or(page.getByRole('button', { name: /^simpan$/i }));
    this.cancelLink = page
      .getByTestId('orang-tua-cancel-link')
      .or(page.locator('main').getByRole('link', { name: /^batal$/i }))
      .first();
    this.viewLink = page
      .getByTestId('orang-tua-view-link')
      .or(page.getByRole('link', { name: /^lihat$/i }));
  }

  fields(prefix = 'ayah') {
    return {
      nameInput: this.page
        .getByTestId(`orang-tua-${prefix}-name-input`)
        .or(this.page.locator(`input[name="${prefix}[nama]"]`)),
      nikInput: this.page
        .getByTestId(`orang-tua-${prefix}-nik-input`)
        .or(this.page.locator(`input[name="${prefix}[nik]"]`)),
      jobInput: this.page
        .getByTestId(`orang-tua-${prefix}-job-input`)
        .or(this.page.locator(`input[name="${prefix}[pekerjaan]"]`)),
      phoneInput: this.page
        .getByTestId(`orang-tua-${prefix}-phone-input`)
        .or(this.page.locator(`input[name="${prefix}[no_hp]"]`)),
      emailInput: this.page
        .getByTestId(`orang-tua-${prefix}-email-input`)
        .or(this.page.locator(`input[name="${prefix}[email]"]`)),
      provinceSelect: this.page
        .getByTestId(`orang-tua-${prefix}-province-select`)
        .or(this.page.locator(`select[name="${prefix}[id_provinsi]"]`)),
      citySelect: this.page
        .getByTestId(`orang-tua-${prefix}-city-select`)
        .or(this.page.locator(`select[name="${prefix}[id_kota]"]`)),
      addressInput: this.page
        .getByTestId(`orang-tua-${prefix}-address-input`)
        .or(this.page.locator(`textarea[name="${prefix}[alamat]"]`)),
    };
  }

  async expectLoaded() {
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator('main')).toContainText(/data siswa|data ayah|data ibu/i);
    await this.expectNoSystemError();
  }

  async expectRequiredFieldsVisible(prefix = 'ayah') {
    const fields = this.fields(prefix);

    await expect(fields.nameInput).toBeVisible();
    await expect(fields.nikInput).toBeVisible();
    await expect(fields.jobInput).toBeVisible();
    await expect(fields.phoneInput).toBeVisible();
    await expect(fields.emailInput).toBeVisible();
    await expect(fields.provinceSelect).toBeVisible();
    await expect(fields.citySelect).toBeVisible();
    await expect(fields.addressInput).toBeVisible();
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = {
  OrangTuaPage,
  OrangTuaDetailPage,
  OrangTuaFormPage,
  ORANG_TUA_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
