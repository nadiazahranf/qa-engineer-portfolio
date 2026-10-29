const { expect } = require('@playwright/test');

const AKADEMIK_TAHUN_AJARAN_URL = 'https://smard.id/akademik/tahun_ajaran';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class AkademikTahunAjaranPage {
  constructor(page) {
    this.page = page;
    this.akademikMenu = page
      .getByTestId('akademik-menu')
      .or(page.getByRole('button', { name: /^akademik$/i }))
      .or(page.getByRole('link', { name: /^akademik$/i }));
    this.tahunAjaranMenu = page
      .getByTestId('tahun-ajaran-menu')
      .or(page.getByRole('link', { name: /^tahun ajaran$/i }))
      .or(page.locator('a[href="/akademik/tahun_ajaran"], a[href*="/akademik/tahun_ajaran"]').first());
    this.pageMarker = page
      .getByTestId('tahun-ajaran-page')
      .or(page.getByRole('heading', { name: /^data tahun ajaran$/i }))
      .or(page.locator('#tahunajaran-table'))
      .first();
    this.addButton = page
      .getByTestId('tahun-ajaran-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah tahun ajaran/i }));
    this.searchInput = page
      .getByTestId('tahun-ajaran-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('tahun-ajaran-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('tahun-ajaran-table-body')
      .or(page.locator('#tahunajaran-table tbody'));
    this.rows = page
      .getByTestId('tahun-ajaran-row')
      .or(page.locator('#tahunajaran-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.akademikMenu);

    const menu = this.tahunAjaranMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(AKADEMIK_TAHUN_AJARAN_URL);
      });
    } else {
      await this.page.goto(AKADEMIK_TAHUN_AJARAN_URL);
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

  form(title = /tambah tahun ajaran|edit tahun ajaran/i) {
    return this.page
      .getByTestId('tahun-ajaran-form-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: title }))
      .last();
  }

  deleteDialog() {
    return this.page
      .getByTestId('tahun-ajaran-delete-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: /hapus tahun ajaran/i }))
      .last();
  }

  nameInput(modal) {
    return modal
      .getByTestId('tahun-ajaran-name-input')
      .or(modal.locator('input[name="nama"]'));
  }

  startDateButton(modal) {
    return modal
      .getByTestId('tahun-ajaran-start-date-button')
      .or(modal.locator('button#tgl-mulai'));
  }

  startDateInput(modal) {
    return modal
      .getByTestId('tahun-ajaran-start-date-input')
      .or(modal.locator('input[name="tgl_mulai"]'));
  }

  endDateButton(modal) {
    return modal
      .getByTestId('tahun-ajaran-end-date-button')
      .or(modal.locator('button#tgl-akhir'));
  }

  endDateInput(modal) {
    return modal
      .getByTestId('tahun-ajaran-end-date-input')
      .or(modal.locator('input[name="tgl_akhir"]'));
  }

  statusButton(modal) {
    return modal
      .getByTestId('tahun-ajaran-status-select')
      .or(modal.locator('button[name="tahun_ajaran_aktif"]'));
  }

  saveButton(modal) {
    return modal
      .getByTestId('tahun-ajaran-save-button')
      .or(modal.getByRole('button', { name: /^simpan$/i }));
  }

  cancelButton(modal) {
    return modal
      .getByTestId('tahun-ajaran-cancel-button')
      .or(modal.getByRole('button', { name: /^batal$/i }));
  }

  async openCreateForm() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const modal = this.form(/tambah tahun ajaran/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstEditForm() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('tahun-ajaran-edit-button')
      .or(this.rows.first().getByRole('button', { name: /edit data/i }))
      .or(this.rows.first().locator('button').first())
      .click();

    const modal = this.form(/edit tahun ajaran/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstDeleteDialog() {
    await this.expectHasRows();
    await this.rows
      .first()
      .getByTestId('tahun-ajaran-delete-button')
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
      .filter(text => text && !/^(aksi|aktif|non aktif|akan datang|edit data|hapus data|-|\d+)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('tahun-ajaran-row')
      .or(this.page.locator('#tahunajaran-table tbody tr'))
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
  AkademikTahunAjaranPage,
  AKADEMIK_TAHUN_AJARAN_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
