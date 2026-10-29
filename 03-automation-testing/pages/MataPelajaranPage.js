const { expect } = require('@playwright/test');

const MATA_PELAJARAN_URL = 'https://smard.id/master-data/mata_pelajaran';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class MataPelajaranPage {
  constructor(page) {
    this.page = page;
    this.masterDataMenu = page
      .getByTestId('master-data-menu')
      .or(page.getByRole('button', { name: /^master data$/i }))
      .or(page.getByRole('link', { name: /^master data$/i }));
    this.mataPelajaranMenu = page
      .getByTestId('mata-pelajaran-menu')
      .or(page.getByRole('link', { name: /^mata pelajaran$/i }))
      .or(page.locator('a[href="/master-data/mata_pelajaran"], a[href*="/master-data/mata_pelajaran"]').first());
    this.pageMarker = page
      .getByTestId('mata-pelajaran-page')
      .or(page.getByRole('heading', { name: /^data mata pelajaran$/i }))
      .or(page.locator('#matapelajaran-table'))
      .first();
    this.addButton = page
      .getByTestId('mata-pelajaran-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah mata pelajaran/i }));
    this.searchInput = page
      .getByTestId('mata-pelajaran-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('mata-pelajaran-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('mata-pelajaran-table-body')
      .or(page.locator('#matapelajaran-table tbody'));
    this.rows = page
      .getByTestId('mata-pelajaran-row')
      .or(page.locator('#matapelajaran-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.masterDataMenu);

    const menu = this.mataPelajaranMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(MATA_PELAJARAN_URL);
      });
    } else {
      await this.page.goto(MATA_PELAJARAN_URL);
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

  form(title = /tambah mata pelajaran|edit mata pelajaran/i) {
    return this.page
      .getByTestId('mata-pelajaran-form-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: title }))
      .last();
  }

  deleteDialog() {
    return this.page
      .getByTestId('mata-pelajaran-delete-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: /hapus mata pelajaran/i }))
      .last();
  }

  codeInput(modal) {
    return modal
      .getByTestId('mata-pelajaran-code-input')
      .or(modal.locator('input[name="kode"]'));
  }

  nameInput(modal) {
    return modal
      .getByTestId('mata-pelajaran-name-input')
      .or(modal.locator('input[name="nama"]'));
  }

  saveButton(modal) {
    return modal
      .getByTestId('mata-pelajaran-save-button')
      .or(modal.getByRole('button', { name: /^simpan$/i }));
  }

  cancelButton(modal) {
    return modal
      .getByTestId('mata-pelajaran-cancel-button')
      .or(modal.getByRole('button', { name: /^batal$/i }));
  }

  async openCreateForm() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const modal = this.form(/tambah mata pelajaran/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstEditForm() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('mata-pelajaran-edit-button')
      .or(this.rows.first().getByRole('button', { name: /edit data/i }))
      .or(this.rows.first().locator('button').first())
      .click();

    const modal = this.form(/edit mata pelajaran/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstDeleteDialog() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('mata-pelajaran-delete-button')
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
      .filter(text => text && !/^(aksi|\d+|edit data|hapus data|-|total guru)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('mata-pelajaran-row')
      .or(this.page.locator('#matapelajaran-table tbody tr'))
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
  MataPelajaranPage,
  MATA_PELAJARAN_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
