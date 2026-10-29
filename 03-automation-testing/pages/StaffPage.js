const { expect } = require('@playwright/test');

const STAFF_URL = 'https://smard.id/master-data/staff';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class StaffPage {
  constructor(page) {
    this.page = page;
    this.masterDataMenu = page
      .getByTestId('master-data-menu')
      .or(page.getByRole('button', { name: /^master data$/i }))
      .or(page.getByRole('link', { name: /^master data$/i }));
    this.staffMenu = page
      .getByTestId('staff-menu')
      .or(page.getByRole('link', { name: /^staff$/i }))
      .or(page.locator('a[href="/master-data/staff"], a[href*="/master-data/staff"]').first());
    this.pageMarker = page
      .getByTestId('staff-page')
      .or(page.getByRole('heading', { name: /^data staff$/i }))
      .or(page.locator('#staff-table'))
      .first();
    this.addButton = page
      .getByTestId('staff-add-button')
      .or(page.locator('main a[href$="/master-data/staff/create"], main a[href*="/master-data/staff/create"]').first())
      .or(page.getByRole('link', { name: /tambah staff/i }));
    this.searchInput = page
      .getByTestId('staff-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('staff-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('staff-table-body')
      .or(page.locator('#staff-table tbody'));
    this.rows = page
      .getByTestId('staff-row')
      .or(page.locator('#staff-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('staff-table-info')
      .or(page.locator('#staff-table_info, .dt-info'));
    this.nextPageButton = page
      .getByTestId('staff-pagination-next')
      .or(page.locator('#staff-table_wrapper').getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('staff-pagination-previous')
      .or(page.locator('#staff-table_wrapper').getByRole('link', { name: /previous|‹/i }));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.masterDataMenu);

    const menu = this.staffMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(STAFF_URL);
      });
    } else {
      await this.page.goto(STAFF_URL);
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
    const addButton = this.addButton.first();

    if (await addButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addButton.click();
    } else {
      await this.page.goto(`${STAFF_URL}/create`);
    }

    const form = new StaffFormPage(this.page, /tambah staff/i);
    await form.expectLoaded();

    return form;
  }

  async openFirstEditPage() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('staff-edit-button')
      .or(this.rows.first().getByRole('link', { name: /edit data/i }))
      .or(this.rows.first().locator('a[href$="/edit"]').first())
      .click();

    const form = new StaffFormPage(this.page, /edit staff/i);
    await form.expectLoaded();

    return form;
  }

  async triggerFirstDeleteAndDismiss() {
    await this.expectHasRows();

    const deleteButton = this.rows
      .first()
      .getByTestId('staff-delete-button')
      .or(this.rows.first().getByRole('button', { name: /hapus data/i }))
      .or(this.rows.first().locator('button[type="submit"]').last());

    let message = '';
    this.page.once('dialog', async dialog => {
      message = dialog.message();
      await dialog.dismiss();
    });

    await deleteButton.evaluate(button => button.click());
    await expect.poll(() => message, { timeout: 5000 }).not.toBe('');

    return message;
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
      .filter(text => text && !/^(aksi|aktif|nonaktif|-|edit data|hapus data)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('staff-row')
      .or(this.page.locator('#staff-table tbody tr'))
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

class StaffFormPage {
  constructor(page, title = /tambah staff|edit staff/i) {
    this.page = page;
    this.title = title;
    this.pageMarker = page
      .getByTestId('staff-form-page')
      .or(page.getByRole('heading', { name: title }))
      .first();
    this.backLink = page
      .getByTestId('staff-back-link')
      .or(page.locator('main a[aria-label="Kembali"], main a[href$="/master-data/staff"]').first());
    this.roleButton = page
      .getByTestId('staff-role-select')
      .or(page.locator('button#roles'));
    this.statusButton = page
      .getByTestId('staff-status-select')
      .or(page.locator('button#status-guru'));
    this.nameInput = page
      .getByTestId('staff-name-input')
      .or(page.locator('#nama'));
    this.nikInput = page
      .getByTestId('staff-nik-input')
      .or(page.locator('#nik'));
    this.birthDateButton = page
      .getByTestId('staff-birth-date-button')
      .or(page.locator('button#tgl_lahir'));
    this.birthDateHiddenInput = page
      .getByTestId('staff-birth-date-input')
      .or(page.locator('input[name="tgl_lahir"]'));
    this.genderRadios = page
      .getByTestId('staff-gender-radio')
      .or(page.locator('input[name="jenis_kelamin"]'));
    this.religionButton = page
      .getByTestId('staff-religion-select')
      .or(page.locator('button#agama'));
    this.emailInput = page
      .getByTestId('staff-email-input')
      .or(page.locator('#email'));
    this.phoneInput = page
      .getByTestId('staff-phone-input')
      .or(page.locator('#no_hp'));
    this.provinceButton = page
      .getByTestId('staff-province-select')
      .or(page.locator('button#Provinsi-select'));
    this.cityButton = page
      .getByTestId('staff-city-select')
      .or(page.locator('button#Kota\\/Kabupaten-select'));
    this.addressInput = page
      .getByTestId('staff-address-input')
      .or(page.locator('#alamat'));
    this.saveButton = page
      .getByTestId('staff-save-button')
      .or(page.getByRole('button', { name: /simpan staff/i }));
  }

  async expectLoaded() {
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator('main')).toContainText(this.title, { timeout: 15000 });
    await this.expectNoSystemError();
  }

  async expectRequiredFieldsVisible() {
    await expect(this.roleButton).toBeVisible();
    await expect(this.statusButton).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.nikInput).toBeVisible();
    await expect(this.birthDateButton).toBeVisible();
    await expect(this.genderRadios.first()).toBeVisible();
    await expect(this.religionButton).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = {
  StaffPage,
  StaffFormPage,
  STAFF_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
