const { expect } = require('@playwright/test');

const GURU_URL = 'https://smard.id/master-data/guru';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class GuruPage {
  constructor(page) {
    this.page = page;
    this.masterDataMenu = page
      .getByTestId('master-data-menu')
      .or(page.getByRole('button', { name: /^master data$/i }))
      .or(page.getByRole('link', { name: /^master data$/i }));
    this.guruMenu = page
      .getByTestId('guru-menu')
      .or(page.getByRole('link', { name: /^guru$/i }))
      .or(page.locator('a[href="/master-data/guru"], a[href*="/master-data/guru"]').first());
    this.pageMarker = page
      .getByTestId('guru-page')
      .or(page.getByRole('heading', { name: /^data guru$/i }))
      .or(page.locator('#guru-table'))
      .first();
    this.downloadTemplateLink = page
      .getByTestId('guru-download-template-link')
      .or(page.locator('main a[href*="/master-data/guru/template"]').first());
    this.importButton = page
      .getByTestId('guru-import-button')
      .or(page.locator('main button').filter({ hasText: /import excel/i }))
      .or(page.locator('main').getByRole('button', { name: /import excel/i }));
    this.importFileInput = page
      .getByTestId('guru-import-file-input')
      .or(page.locator('#import-guru-file'));
    this.addButton = page
      .getByTestId('guru-add-button')
      .or(page.locator('main a[href$="/master-data/guru/create"], main a[href*="/master-data/guru/create"]').first())
      .or(page.getByRole('link', { name: /tambah guru/i }));
    this.searchInput = page
      .getByTestId('guru-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('guru-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('guru-table-body')
      .or(page.locator('#guru-table tbody'));
    this.rows = page
      .getByTestId('guru-row')
      .or(page.locator('#guru-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('guru-table-info')
      .or(page.locator('#guru-table_info, .dt-info'));
    this.nextPageButton = page
      .getByTestId('guru-pagination-next')
      .or(page.locator('#guru-table_wrapper').getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('guru-pagination-previous')
      .or(page.locator('#guru-table_wrapper').getByRole('link', { name: /previous|‹/i }));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.masterDataMenu);

    const menu = this.guruMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(GURU_URL);
      });
    } else {
      await this.page.goto(GURU_URL);
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
      await this.page.goto(`${GURU_URL}/create`);
    }

    const form = new GuruFormPage(this.page, /tambah guru/i);
    await form.expectLoaded();

    return form;
  }

  async openFirstEditPage() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('guru-edit-button')
      .or(this.rows.first().getByRole('link', { name: /edit data/i }))
      .or(this.rows.first().locator('a[href$="/edit"]').first())
      .click();

    const form = new GuruFormPage(this.page, /edit guru/i);
    await form.expectLoaded();

    return form;
  }

  async openFirstRolePage() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('guru-role-button')
      .or(this.rows.first().getByRole('link', { name: /kelola role/i }))
      .or(this.rows.first().locator('a[href$="/roles"]').first())
      .click();

    const rolePage = new GuruRolePage(this.page);
    await rolePage.expectLoaded();

    return rolePage;
  }

  async triggerFirstDeleteAndDismiss() {
    await this.expectHasRows();

    const deleteButton = this.rows
      .first()
      .getByTestId('guru-delete-button')
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
      .filter(text => text && !/^(aksi|aktif|nonaktif|-|edit data|kelola role|hapus data)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('guru-row')
      .or(this.page.locator('#guru-table tbody tr'))
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

class GuruFormPage {
  constructor(page, title = /tambah guru|edit guru/i) {
    this.page = page;
    this.title = title;
    this.pageMarker = page
      .getByTestId('guru-form-page')
      .or(page.getByRole('heading', { name: title }))
      .first();
    this.subjectButton = page
      .getByTestId('guru-subject-select')
      .or(page.locator('button#guru-mata-pelajaran'));
    this.statusButton = page
      .getByTestId('guru-status-select')
      .or(page.locator('button#status-guru'));
    this.nameInput = page
      .getByTestId('guru-name-input')
      .or(page.locator('#nama'));
    this.nikInput = page
      .getByTestId('guru-nik-input')
      .or(page.locator('#nik'));
    this.birthDateButton = page
      .getByTestId('guru-birth-date-button')
      .or(page.locator('button#tgl_lahir'));
    this.birthDateHiddenInput = page
      .getByTestId('guru-birth-date-input')
      .or(page.locator('input[name="tgl_lahir"]'));
    this.genderRadios = page
      .getByTestId('guru-gender-radio')
      .or(page.locator('input[name="jenis_kelamin"]'));
    this.religionButton = page
      .getByTestId('guru-religion-select')
      .or(page.locator('button#agama'));
    this.emailInput = page
      .getByTestId('guru-email-input')
      .or(page.locator('#email'));
    this.phoneInput = page
      .getByTestId('guru-phone-input')
      .or(page.locator('#no_hp'));
    this.provinceButton = page
      .getByTestId('guru-province-select')
      .or(page.locator('button#Provinsi-select'));
    this.cityButton = page
      .getByTestId('guru-city-select')
      .or(page.locator('button#Kota\\/Kabupaten-select'));
    this.addressInput = page
      .getByTestId('guru-address-input')
      .or(page.locator('#alamat'));
    this.saveButton = page
      .getByTestId('guru-save-button')
      .or(page.getByRole('button', { name: /simpan guru/i }));
  }

  async expectLoaded() {
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator('main')).toContainText(this.title, { timeout: 15000 });
    await this.expectNoSystemError();
  }

  async expectRequiredFieldsVisible() {
    await expect(this.subjectButton).toBeVisible();
    await expect(this.statusButton).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.nikInput).toBeVisible();
    await expect(this.birthDateButton).toBeVisible();
    await expect(this.genderRadios.first()).toBeVisible();
    await expect(this.religionButton).toBeVisible();
    await expect(this.emailInput).toBeVisible();
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

class GuruRolePage {
  constructor(page) {
    this.page = page;
    this.pageMarker = page
      .getByTestId('guru-role-page')
      .or(page.getByRole('heading', { name: /^kelola role guru$/i }))
      .first();
    this.roleCheckboxes = page
      .getByTestId('guru-role-checkbox')
      .or(page.locator('input[name="roles[]"][type="checkbox"]'));
    this.saveButton = page
      .getByTestId('guru-role-save-button')
      .or(page.getByRole('button', { name: /simpan role/i }));
    this.cancelLink = page
      .getByTestId('guru-role-cancel-link')
      .or(page.locator('main').getByRole('button', { name: /^batal$/i }))
      .or(page.locator('main a[href$="/master-data/guru"], main a[href*="/master-data/guru"]').filter({ hasText: /^batal$/i }))
      .or(page.getByRole('link', { name: /^batal$/i }))
      .first();
  }

  async expectLoaded() {
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator('main')).toContainText(/role|admin|guru/i);
    await this.expectNoSystemError();
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = {
  GuruPage,
  GuruFormPage,
  GuruRolePage,
  GURU_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
