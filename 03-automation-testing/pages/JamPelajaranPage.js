const { expect } = require('@playwright/test');

const JAM_PELAJARAN_URL = 'https://smard.id/master-data/jam_pelajaran';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class JamPelajaranPage {
  constructor(page) {
    this.page = page;
    this.masterDataMenu = page
      .getByTestId('master-data-menu')
      .or(page.getByRole('button', { name: /^master data$/i }))
      .or(page.getByRole('link', { name: /^master data$/i }));
    this.jamPelajaranMenu = page
      .getByTestId('jam-pelajaran-menu')
      .or(page.getByRole('link', { name: /^jam pelajaran$/i }))
      .or(page.locator('a[href="/master-data/jam_pelajaran"], a[href*="/master-data/jam_pelajaran"]').first());
    this.pageMarker = page
      .getByTestId('jam-pelajaran-page')
      .or(page.getByRole('heading', { name: /^data jam pelajaran$/i }))
      .or(page.locator('#jampelajaran-table'))
      .first();
    this.addButton = page
      .getByTestId('jam-pelajaran-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah jam pelajaran/i }));
    this.searchInput = page
      .getByTestId('jam-pelajaran-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('jam-pelajaran-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('jam-pelajaran-table-body')
      .or(page.locator('#jampelajaran-table tbody'));
    this.rows = page
      .getByTestId('jam-pelajaran-row')
      .or(page.locator('#jampelajaran-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.masterDataMenu);

    const menu = this.jamPelajaranMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(JAM_PELAJARAN_URL);
      });
    } else {
      await this.page.goto(JAM_PELAJARAN_URL);
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

  form(title = /tambah jam pelajaran|edit jam pelajaran/i) {
    return this.page
      .getByTestId('jam-pelajaran-form-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: title }))
      .last();
  }

  deleteDialog() {
    return this.page
      .getByTestId('jam-pelajaran-delete-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: /hapus jam pelajaran/i }))
      .last();
  }

  orderInput(modal) {
    return modal.getByTestId('jam-pelajaran-order-input').or(modal.locator('input[name="jam_pelajaran_ke"]'));
  }

  nameInput(modal) {
    return modal.getByTestId('jam-pelajaran-name-input').or(modal.locator('input[name="nama"]'));
  }

  startButton(modal) {
    return modal.getByTestId('jam-pelajaran-start-button').or(modal.locator('button#jam-mulai'));
  }

  startHiddenInput(modal) {
    return modal.getByTestId('jam-pelajaran-start-input').or(modal.locator('input[name="jam_mulai"]'));
  }

  endButton(modal) {
    return modal.getByTestId('jam-pelajaran-end-button').or(modal.locator('button#jam-selesai'));
  }

  endHiddenInput(modal) {
    return modal.getByTestId('jam-pelajaran-end-input').or(modal.locator('input[name="jam_akhir"]'));
  }

  breakCheckbox(modal) {
    return modal.getByTestId('jam-pelajaran-break-checkbox').or(modal.locator('input[name="istirahat"]'));
  }

  defaultCheckbox(modal) {
    return modal.getByTestId('jam-pelajaran-default-checkbox').or(modal.locator('input[name="is_default"]'));
  }

  descriptionInput(modal) {
    return modal.getByTestId('jam-pelajaran-description-input').or(modal.locator('input[name="deskripsi"], textarea[name="deskripsi"]'));
  }

  saveButton(modal) {
    return modal.getByTestId('jam-pelajaran-save-button').or(modal.getByRole('button', { name: /^simpan$/i }));
  }

  cancelButton(modal) {
    return modal.getByTestId('jam-pelajaran-cancel-button').or(modal.getByRole('button', { name: /^batal$/i }));
  }

  async openCreateForm() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const modal = this.form(/tambah jam pelajaran/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstEditForm() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('jam-pelajaran-edit-button')
      .or(this.rows.first().getByRole('button', { name: /edit data/i }))
      .or(this.rows.first().locator('button').filter({ hasNot: this.page.locator('input') }).first())
      .click();

    const modal = this.form(/edit jam pelajaran/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstDeleteDialog() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('jam-pelajaran-delete-button')
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
      .filter(text => text && !/^(aksi|default|ya|-|\d+|edit data|hapus data)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('jam-pelajaran-row')
      .or(this.page.locator('#jampelajaran-table tbody tr'))
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
  JamPelajaranPage,
  JAM_PELAJARAN_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
