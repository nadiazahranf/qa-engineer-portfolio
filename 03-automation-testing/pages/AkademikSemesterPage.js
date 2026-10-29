const { expect } = require('@playwright/test');

const AKADEMIK_SEMESTER_URL = 'https://smard.id/akademik/semester';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class AkademikSemesterPage {
  constructor(page) {
    this.page = page;
    this.akademikMenu = page
      .getByTestId('akademik-menu')
      .or(page.getByRole('button', { name: /^akademik$/i }))
      .or(page.getByRole('link', { name: /^akademik$/i }));
    this.semesterMenu = page
      .getByTestId('semester-menu')
      .or(page.getByRole('link', { name: /^semester$/i }))
      .or(page.locator('a[href="/akademik/semester"], a[href*="/akademik/semester"]').first());
    this.pageMarker = page
      .getByTestId('semester-page')
      .or(page.getByRole('heading', { name: /^data semester$/i }))
      .or(page.locator('#semester-table'))
      .first();
    this.addButton = page
      .getByTestId('semester-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah semester/i }));
    this.searchInput = page
      .getByTestId('semester-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('semester-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('semester-table-body')
      .or(page.locator('#semester-table tbody'));
    this.rows = page
      .getByTestId('semester-row')
      .or(page.locator('#semester-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.akademikMenu);

    const menu = this.semesterMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(AKADEMIK_SEMESTER_URL);
      });
    } else {
      await this.page.goto(AKADEMIK_SEMESTER_URL);
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

  actionableRows(actionName = /edit data|hapus data|ubah status semester/i) {
    return this.rows.filter({
      has: this.page.getByRole('button', { name: actionName }),
    });
  }

  form(title = /tambah semester|edit semester/i) {
    return this.page
      .getByTestId('semester-form-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: title }))
      .last();
  }

  deleteDialog() {
    return this.page
      .getByTestId('semester-delete-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: /hapus semester/i }))
      .last();
  }

  toggleDialog() {
    return this.page
      .getByTestId('semester-toggle-status-modal')
      .or(this.page.locator('.fixed.inset-0, [role="dialog"]').filter({ hasText: /ubah status semester/i }))
      .last();
  }

  academicYearButton(modal) {
    return modal
      .getByTestId('semester-tahun-ajaran-select')
      .or(modal.locator('button[name="id_tahun_ajaran"]'));
  }

  nameInput(modal) {
    return modal
      .getByTestId('semester-name-input')
      .or(modal.locator('input[name="nama"]'));
  }

  orderInput(modal) {
    return modal
      .getByTestId('semester-order-input')
      .or(modal.locator('input[name="urutan"]'));
  }

  startDateButton(modal) {
    return modal
      .getByTestId('semester-start-date-button')
      .or(modal.locator('button#semester-tgl-awal'));
  }

  startDateInput(modal) {
    return modal
      .getByTestId('semester-start-date-input')
      .or(modal.locator('input[name="tgl_awal"]'));
  }

  endDateButton(modal) {
    return modal
      .getByTestId('semester-end-date-button')
      .or(modal.locator('button#semester-tgl-akhir'));
  }

  endDateInput(modal) {
    return modal
      .getByTestId('semester-end-date-input')
      .or(modal.locator('input[name="tgl_akhir"]'));
  }

  statusButton(modal) {
    return modal
      .getByTestId('semester-status-select')
      .or(modal.locator('button[name="semester_aktif"]'));
  }

  saveButton(modal) {
    return modal
      .getByTestId('semester-save-button')
      .or(modal.getByRole('button', { name: /^simpan$/i }));
  }

  cancelButton(modal) {
    return modal
      .getByTestId('semester-cancel-button')
      .or(modal.getByRole('button', { name: /^batal$/i }));
  }

  async openCreateForm() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const modal = this.form(/tambah semester/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstEditForm() {
    const row = this.actionableRows(/edit data/i).first();
    await expect(row).toBeVisible({ timeout: 15000 });
    await row.getByRole('button', { name: /edit data/i }).click();

    const modal = this.form(/edit semester/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async openFirstDeleteDialog() {
    const row = this.actionableRows(/hapus data/i).first();
    await expect(row).toBeVisible({ timeout: 15000 });
    await row.getByRole('button', { name: /hapus data/i }).click();

    const dialog = this.deleteDialog();
    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async openFirstToggleStatusDialog() {
    const row = this.actionableRows(/ubah status semester/i).first();
    await expect(row).toBeVisible({ timeout: 15000 });
    await row.getByRole('button', { name: /ubah status semester/i }).click();

    const dialog = this.toggleDialog();
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
      .filter(text => text && !/^(aksi|aktif|non aktif|akan datang|edit data|hapus data|ubah status semester|-|\d+)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('semester-row')
      .or(this.page.locator('#semester-table tbody tr'))
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
  AkademikSemesterPage,
  AKADEMIK_SEMESTER_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
