const { expect } = require('@playwright/test');

const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

class GantiSemesterPage {
  constructor(page) {
    this.page = page;
    this.kelolaAkademikMenu = page
      .getByTestId('kelola-akademik-menu')
      .or(page.getByRole('button', { name: /kelola akademik/i }))
      .or(page.getByRole('link', { name: /kelola akademik/i }));
    this.ruangKelasMenu = page
      .getByTestId('ruang-kelas-menu')
      .or(page.getByRole('button', { name: /ruang kelas/i }))
      .or(page.getByRole('link', { name: /ruang kelas/i }))
      .or(page.getByRole('button', { name: /ruang belajar/i }))
      .or(page.getByRole('link', { name: /ruang belajar/i }));
    this.gantiSemesterMenu = page
      .getByTestId('ganti-semester-menu')
      .or(page.getByRole('link', { name: /^ganti semester$/i }))
      .or(page.getByRole('button', { name: /^ganti semester$/i }))
      .or(page.locator('a[href*="ganti-semester"]').first());
    this.pageMarker = page
      .getByTestId('ganti-semester-page')
      .or(page.getByRole('heading', { name: /^ganti semester$/i }))
      .or(page.locator('#ganti-semester-table'))
      .first();
    this.addButton = page
      .getByTestId('ganti-semester-add-button')
      .or(page.locator('main').getByRole('button', { name: /buat ganti semester|tambah ganti semester/i }))
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
    this.info = page
      .getByTestId('ganti-semester-table-info')
      .or(page.locator('#ganti-semester-table_info, .dt-info'));
    this.nextPageButton = page
      .getByTestId('ganti-semester-pagination-next')
      .or(page.locator('#ganti-semester-table_wrapper').getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('ganti-semester-pagination-previous')
      .or(page.locator('#ganti-semester-table_wrapper').getByRole('link', { name: /previous|‹/i }));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.kelolaAkademikMenu);
    await this.clickIfVisible(this.ruangKelasMenu);

    const menu = this.gantiSemesterMenu.first();

    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto('https://smard.id/akademik/ruang-belajar/ganti-semester');
      });
    } else {
      await this.page.goto('https://smard.id/akademik/ruang-belajar/ganti-semester');
    }

    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await this.expectNoSystemError();
  }

  async clickIfVisible(locator) {
    const target = locator.first();

    if (await target.isVisible({ timeout: 3000 }).catch(() => false)) {
      await target.click({ timeout: 3000 }).catch(() => {});
    }
  }

  createPanel() {
    return this.page
      .getByTestId('ganti-semester-create-panel')
      .or(this.page.locator('main').filter({ hasText: /validasi ganti semester|keterangan|selanjutnya/i }))
      .first();
  }

  noteInput() {
    return this.page
      .getByTestId('ganti-semester-note-input')
      .or(this.page.locator('#ganti-semester-keterangan'))
      .or(this.page.locator('textarea[name="keterangan"]'));
  }

  nextButton() {
    return this.page
      .getByTestId('ganti-semester-next-button')
      .or(this.page.locator('main').getByRole('button', { name: /^selanjutnya$/i }));
  }

  backButton() {
    return this.page
      .getByTestId('ganti-semester-back-button')
      .or(this.page.locator('main').getByRole('button', { name: /^kembali$/i }));
  }

  cancelButton() {
    return this.page
      .getByTestId('ganti-semester-cancel-button')
      .or(this.page.locator('main').getByRole('button', { name: /^batal$/i }));
  }

  async openCreatePanel() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();
    await expect(this.createPanel()).toContainText(/validasi ganti semester|keterangan|selanjutnya/i, { timeout: 15000 });

    return this.createPanel();
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
      .filter(text => text && !/^(aksi|detail|hapus)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('ganti-semester-row')
      .or(this.page.locator('#ganti-semester-table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async openFirstDetail() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
    await this.rows
      .first()
      .getByTestId('ganti-semester-detail-button')
      .or(this.rows.first().getByRole('button', { name: /detail ganti semester/i }))
      .click();

    const detail = new GantiSemesterDetailPage(this.page);
    await detail.expectLoaded();

    return detail;
  }

  async openDeleteDialogFromFirstRow() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
    await this.rows
      .first()
      .getByTestId('ganti-semester-delete-button')
      .or(this.rows.first().getByRole('button', { name: /hapus ganti semester/i }))
      .click();

    const dialog = this.page
      .getByTestId('ganti-semester-delete-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: /hapus ganti semester|tidak bisa dihapus/i }))
      .first();

    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async visibleRowTexts() {
    return (await this.rows.allInnerTexts()).map(text => text.trim()).filter(Boolean);
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

class GantiSemesterDetailPage {
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
    this.info = page
      .getByTestId('ganti-semester-detail-table-info')
      .or(page.locator('#kenaikan-detail-table_info, .dt-info'));
    this.nextPageButton = page
      .getByTestId('ganti-semester-detail-pagination-next')
      .or(page.locator('#kenaikan-detail-table_wrapper').getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('ganti-semester-detail-pagination-previous')
      .or(page.locator('#kenaikan-detail-table_wrapper').getByRole('link', { name: /previous|‹/i }));
    this.backLink = page
      .getByTestId('ganti-semester-detail-back-link')
      .or(page.getByRole('link', { name: /ganti semester/i }));
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/akademik\/ganti-semester\/\d+/, { timeout: 15000 });
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
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
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('ganti-semester-detail-row')
      .or(this.page.locator('#kenaikan-detail-table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async visibleRowTexts() {
    return (await this.rows.allInnerTexts()).map(text => text.trim()).filter(Boolean);
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = {
  GantiSemesterPage,
  GantiSemesterDetailPage,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
};
