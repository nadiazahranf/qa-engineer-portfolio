const { expect } = require('@playwright/test');

const KELAS_URL = 'https://smard.id/master-data/kelas';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class KelasPage {
  constructor(page) {
    this.page = page;
    this.masterDataMenu = page
      .getByTestId('master-data-menu')
      .or(page.getByRole('button', { name: /^master data$/i }))
      .or(page.getByRole('link', { name: /^master data$/i }));
    this.kelasMenu = page
      .getByTestId('kelas-menu')
      .or(page.getByRole('link', { name: /^kelas$/i }))
      .or(page.locator('a[href="/master-data/kelas"], a[href*="/master-data/kelas"]').first());
    this.pageMarker = page
      .getByTestId('kelas-page')
      .or(page.getByRole('heading', { name: /^data kelas$/i }))
      .or(page.locator('#kelas-table'))
      .first();
    this.addButton = page
      .getByTestId('kelas-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah kelas/i }));
    this.searchInput = page
      .getByTestId('kelas-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('kelas-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('kelas-table-body')
      .or(page.locator('#kelas-table tbody'));
    this.rows = page
      .getByTestId('kelas-row')
      .or(page.locator('#kelas-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('kelas-table-info')
      .or(page.locator('#kelas-table_info, .dt-info'));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.masterDataMenu);

    const menu = this.kelasMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(KELAS_URL);
      });
    } else {
      await this.page.goto(KELAS_URL);
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

  form(title = /tambah kelas|edit kelas/i) {
    return this.page
      .getByTestId('kelas-form-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: title }))
      .last();
  }

  deleteDialog() {
    return this.page
      .getByTestId('kelas-delete-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: /hapus kelas/i }))
      .last();
  }

  nameInput(modal) {
    return modal
      .getByTestId('kelas-name-input')
      .or(modal.locator('input[name="nama"]'));
  }

  levelButton(modal) {
    return modal
      .getByTestId('kelas-level-select')
      .or(modal.locator('button[name="tingkat"]'));
  }

  descriptionInput(modal) {
    return modal
      .getByTestId('kelas-description-input')
      .or(modal.locator('textarea[name="deskripsi"], input[name="deskripsi"]'));
  }

  saveButton(modal) {
    return modal
      .getByTestId('kelas-save-button')
      .or(modal.getByRole('button', { name: /^simpan$/i }));
  }

  cancelButton(modal) {
    return modal
      .getByTestId('kelas-cancel-button')
      .or(modal.getByRole('button', { name: /^batal$/i }));
  }

  async openCreateForm() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const modal = this.form(/tambah kelas/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstEditForm() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('kelas-edit-button')
      .or(this.rows.first().getByRole('button', { name: /edit data/i }))
      .or(this.rows.first().locator('button').first())
      .click();

    const modal = this.form(/edit kelas/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstDeleteDialog() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('kelas-delete-button')
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
      .getByTestId('kelas-row')
      .or(this.page.locator('#kelas-table tbody tr'))
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
  KelasPage,
  KELAS_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
