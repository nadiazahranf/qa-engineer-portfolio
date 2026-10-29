const { expect } = require('@playwright/test');

const EKSTRAKURIKULER_URL = 'https://smard.id/master-data/ekstrakurikuler';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class EkstrakurikulerPage {
  constructor(page) {
    this.page = page;
    this.masterDataMenu = page
      .getByTestId('master-data-menu')
      .or(page.getByRole('button', { name: /^master data$/i }))
      .or(page.getByRole('link', { name: /^master data$/i }));
    this.ekstrakurikulerMenu = page
      .getByTestId('ekstrakurikuler-menu')
      .or(page.getByRole('link', { name: /^ekstrakurikuler$/i }))
      .or(page.locator('a[href="/master-data/ekstrakurikuler"], a[href*="/master-data/ekstrakurikuler"]').first());
    this.pageMarker = page
      .getByTestId('ekstrakurikuler-page')
      .or(page.getByRole('heading', { name: /^data ekstrakurikuler$/i }))
      .or(page.locator('#ekstrakurikuler-table'))
      .first();
    this.addButton = page
      .getByTestId('ekstrakurikuler-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah ekstrakurikuler/i }));
    this.searchInput = page
      .getByTestId('ekstrakurikuler-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('ekstrakurikuler-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('ekstrakurikuler-table-body')
      .or(page.locator('#ekstrakurikuler-table tbody'));
    this.rows = page
      .getByTestId('ekstrakurikuler-row')
      .or(page.locator('#ekstrakurikuler-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.masterDataMenu);

    const menu = this.ekstrakurikulerMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(EKSTRAKURIKULER_URL);
      });
    } else {
      await this.page.goto(EKSTRAKURIKULER_URL);
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

  form(title = /tambah ekstrakurikuler|edit ekstrakurikuler/i) {
    return this.page
      .getByTestId('ekstrakurikuler-form-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: title }))
      .last();
  }

  deleteDialog() {
    return this.page
      .getByTestId('ekstrakurikuler-delete-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: /hapus ekstrakurikuler/i }))
      .last();
  }

  codeInput(modal) {
    return modal
      .getByTestId('ekstrakurikuler-code-input')
      .or(modal.locator('input[name="kode"]'));
  }

  nameInput(modal) {
    return modal
      .getByTestId('ekstrakurikuler-name-input')
      .or(modal.locator('input[name="nama"]'));
  }

  descriptionInput(modal) {
    return modal
      .getByTestId('ekstrakurikuler-description-input')
      .or(modal.locator('input[name="deskripsi"], textarea[name="deskripsi"]'));
  }

  saveButton(modal) {
    return modal
      .getByTestId('ekstrakurikuler-save-button')
      .or(modal.getByRole('button', { name: /^simpan$/i }));
  }

  cancelButton(modal) {
    return modal
      .getByTestId('ekstrakurikuler-cancel-button')
      .or(modal.getByRole('button', { name: /^batal$/i }));
  }

  async openCreateForm() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const modal = this.form(/tambah ekstrakurikuler/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstEditForm() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('ekstrakurikuler-edit-button')
      .or(this.rows.first().getByRole('button', { name: /edit data/i }))
      .or(this.rows.first().locator('button').first())
      .click();

    const modal = this.form(/edit ekstrakurikuler/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstDeleteDialog() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('ekstrakurikuler-delete-button')
      .or(this.rows.first().getByRole('button', { name: /hapus data/i }))
      .or(this.rows.first().locator('button').last())
      .click();

    const dialog = this.deleteDialog();
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
      .filter(text => text && !/^(aksi|\d+|edit data|hapus data|-|deskripsi)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('ekstrakurikuler-row')
      .or(this.page.locator('#ekstrakurikuler-table tbody tr'))
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

module.exports = {
  EkstrakurikulerPage,
  EKSTRAKURIKULER_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
