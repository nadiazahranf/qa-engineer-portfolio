const { expect } = require('@playwright/test');

const AKADEMIK_GANTI_SEMESTER_URL = 'https://smard.id/akademik/ganti-semester';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class AkademikGantiSemesterPage {
  constructor(page) {
    this.page = page;
    this.akademikMenu = page
      .getByTestId('akademik-menu')
      .or(page.getByRole('button', { name: /^akademik$/i }))
      .or(page.getByRole('link', { name: /^akademik$/i }));
    this.gantiSemesterMenu = page
      .getByTestId('ganti-semester-menu')
      .or(page.getByRole('link', { name: /^ganti semester$/i }))
      .or(page.locator('a[href="/akademik/ganti-semester"], a[href*="/akademik/ganti-semester"]').first());
    this.pageMarker = page
      .getByTestId('ganti-semester-page')
      .or(page.getByRole('heading', { name: /^ganti semester$/i }))
      .or(page.locator('#ganti-semester-table'))
      .first();
    this.addButton = page
      .getByTestId('ganti-semester-add-button')
      .or(page.locator('main').getByRole('button', { name: /buat ganti semester/i }))
      .or(page.locator('#btn-open-ganti-semester'));
    this.searchInput = page
      .getByTestId('ganti-semester-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('ganti-semester-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('ganti-semester-table-body')
      .or(page.locator('#ganti-semester-table tbody'));
    this.rows = page
      .getByTestId('ganti-semester-row')
      .or(page.locator('#ganti-semester-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.akademikMenu);

    const menu = this.gantiSemesterMenu.first();
    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(AKADEMIK_GANTI_SEMESTER_URL);
      });
    } else {
      await this.page.goto(AKADEMIK_GANTI_SEMESTER_URL);
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

  createDialog() {
    return this.page
      .getByTestId('ganti-semester-create-modal')
      .or(this.page.locator('[role="dialog"]:visible').filter({ hasText: /validasi ganti semester|keterangan|selanjutnya|pergi ke semester/i }))
      .last();
  }

  noteInput(dialog = this.createDialog()) {
    return dialog
      .getByTestId('ganti-semester-note-input')
      .or(dialog.locator('textarea[name="keterangan"]'))
      .or(dialog.locator('#ganti-semester-keterangan'));
  }

  nextButton(dialog) {
    return dialog
      .getByTestId('ganti-semester-next-button')
      .or(dialog.getByRole('button', { name: /^selanjutnya$/i }));
  }

  backButton(dialog) {
    return dialog
      .getByTestId('ganti-semester-back-button')
      .or(dialog.getByRole('button', { name: /^kembali$/i }));
  }

  cancelButton(dialog) {
    return dialog
      .getByTestId('ganti-semester-cancel-button')
      .or(dialog.getByRole('button', { name: /^batal$/i }))
      .or(dialog.getByRole('button', { name: /^tutup$/i }))
      .first();
  }

  deleteDialog() {
    return this.page
      .getByTestId('ganti-semester-delete-modal')
      .or(this.page.locator('[role="dialog"]:visible').filter({ hasText: /hapus ganti semester|tidak bisa dihapus/i }))
      .last();
  }

  async openCreateDialog() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const dialog = this.createDialog();
    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async openFirstDetail() {
    await this.expectHasRows();

    await this.rows
      .first()
      .getByTestId('ganti-semester-detail-button')
      .or(this.rows.first().getByRole('button', { name: /detail ganti semester/i }))
      .or(this.rows.first().getByRole('link', { name: /detail ganti semester/i }))
      .click();

    const detail = new AkademikGantiSemesterDetailPage(this.page);
    await detail.expectLoaded();

    return detail;
  }

  async openFirstDeleteDialog() {
    await this.expectHasRows();

    await this.rows
      .first()
      .getByTestId('ganti-semester-delete-button')
      .or(this.rows.first().getByRole('button', { name: /hapus ganti semester/i }))
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
      .filter(text => text && !/^(aksi|detail|hapus|-|\d+)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('ganti-semester-row')
      .or(this.page.locator('#ganti-semester-table tbody tr'))
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

class AkademikGantiSemesterDetailPage {
  constructor(page) {
    this.page = page;
    this.pageMarker = page
      .getByTestId('ganti-semester-detail-page')
      .or(page.locator('#kenaikan-detail-table'))
      .first();
    this.searchInput = page
      .getByTestId('ganti-semester-detail-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('ganti-semester-detail-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('ganti-semester-detail-table-body')
      .or(page.locator('#kenaikan-detail-table tbody'));
    this.rows = page
      .getByTestId('ganti-semester-detail-row')
      .or(page.locator('#kenaikan-detail-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.backLink = page
      .getByTestId('ganti-semester-detail-back-link')
      .or(page.locator('main').getByRole('link').first());
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/akademik\/ganti-semester\/\d+/, { timeout: 15000 });
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await this.expectRowsOrEmpty();
    await this.expectNoSystemError();
  }

  async search(keyword) {
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    await this.searchInput.fill(keyword);
  }

  async getFirstSearchableKeyword() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });

    const cells = await this.rows.first().locator('td').allInnerTexts();

    return cells
      .flatMap(text => text.split(/\n+/))
      .map(text => text.trim())
      .filter(text => text && !/^(ya|tidak|-|\d+)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('ganti-semester-detail-row')
      .or(this.page.locator('#kenaikan-detail-table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
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
  AkademikGantiSemesterPage,
  AkademikGantiSemesterDetailPage,
  AKADEMIK_GANTI_SEMESTER_URL,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
