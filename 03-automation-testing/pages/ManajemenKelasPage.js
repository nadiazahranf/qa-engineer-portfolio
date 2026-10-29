const { expect } = require('@playwright/test');

const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactText(text) {
  return new RegExp(`^${escapeRegExp(text)}$`, 'i');
}

class ManajemenKelasPage {
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
    this.manajemenKelasMenu = page
      .getByTestId('manajemen-kelas-menu')
      .or(page.getByRole('link', { name: /^manajemen kelas$/i }))
      .or(page.getByRole('button', { name: /^manajemen kelas$/i }))
      .or(page.locator('a[href*="manajemen-kelas"]').first());
    this.pageMarker = page
      .getByTestId('manajemen-kelas-page')
      .or(page.getByRole('heading', { name: /^manajemen kelas$/i }))
      .or(page.locator('#kelassemester-table'))
      .first();
    this.addButton = page
      .getByTestId('manajemen-kelas-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah kelas/i }));
    this.yearFilter = page
      .getByTestId('manajemen-kelas-year-filter')
      .or(page.locator('#filter-tahun-ajaran'));
    this.semesterFilter = page
      .getByTestId('manajemen-kelas-semester-filter')
      .or(page.locator('#filter-semester'));
    this.resetFilterButton = page
      .getByTestId('manajemen-kelas-reset-filter-button')
      .or(page.locator('#filter-reset'))
      .or(page.locator('main').getByRole('button', { name: /^reset$/i }));
    this.searchInput = page
      .getByTestId('manajemen-kelas-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('manajemen-kelas-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('manajemen-kelas-table-body')
      .or(page.locator('#kelassemester-table tbody'));
    this.rows = page
      .getByTestId('manajemen-kelas-row')
      .or(page.locator('#kelassemester-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('manajemen-kelas-table-info')
      .or(page.locator('#kelassemester-table_info, .dt-info'));
    this.nextPageButton = page
      .getByTestId('manajemen-kelas-pagination-next')
      .or(page.locator('#kelassemester-table_wrapper').getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('manajemen-kelas-pagination-previous')
      .or(page.locator('#kelassemester-table_wrapper').getByRole('link', { name: /previous|‹/i }));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.kelolaAkademikMenu);
    await this.clickIfVisible(this.ruangKelasMenu);

    const menu = this.manajemenKelasMenu.first();

    if (await menu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto('https://smard.id/akademik/ruang-belajar/manajemen-kelas');
      });
    } else {
      await this.page.goto('https://smard.id/akademik/ruang-belajar/manajemen-kelas');
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

  form(title = /tambah kelas|edit kelas/i) {
    return this.page
      .getByTestId('manajemen-kelas-form-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: title }))
      .last();
  }

  yearButton(modal) {
    return modal
      .getByTestId('manajemen-kelas-year-select')
      .or(modal.locator('button[name="id_tahun_ajaran"]'));
  }

  semesterButton(modal) {
    return modal
      .getByTestId('manajemen-kelas-semester-select')
      .or(modal.locator('button[name="id_semester"]'));
  }

  classButton(modal) {
    return modal
      .getByTestId('manajemen-kelas-class-select')
      .or(modal.locator('button[name="id_kelas"]'));
  }

  homeroomButton(modal) {
    return modal
      .getByTestId('manajemen-kelas-homeroom-select')
      .or(modal.locator('button[name="id_wali_kelas"]'));
  }

  statusButton(modal) {
    return modal
      .getByTestId('manajemen-kelas-status-select')
      .or(modal.locator('button[name="kelas_aktif"]'));
  }

  saveButton(modal) {
    return modal
      .getByTestId('manajemen-kelas-save-button')
      .or(modal.getByRole('button', { name: /^simpan$/i }))
      .or(modal.getByRole('button', { name: /simpan perubahan/i }));
  }

  cancelButton(modal) {
    return modal
      .getByTestId('manajemen-kelas-cancel-button')
      .or(modal.getByRole('button', { name: /^batal$/i }));
  }

  async openCreateForm() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const modal = this.form(/tambah kelas/i);
    await expect(modal).toContainText(/tambah kelas/i, { timeout: 15000 });

    return modal;
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
      .filter(text => text && !/^(aksi|edit|hapus|kelola siswa kelas)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('manajemen-kelas-row')
      .or(this.page.locator('#kelassemester-table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async selectFirstNonEmptyOption(selectLocator) {
    const options = await selectLocator.locator('option').evaluateAll(options =>
      options.map(option => ({ value: option.value, text: option.textContent.trim() })).filter(option => option.value));

    if (options.length === 0) {
      throw new Error('Tidak ada opsi filter tersedia.');
    }

    await selectLocator.selectOption(options[0].value);

    return options[0];
  }

  async openFirstManageStudents() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
    await this.rows
      .first()
      .getByTestId('manajemen-kelas-manage-students-button')
      .or(this.rows.first().getByRole('button', { name: /kelola siswa kelas/i }))
      .click();

    const detail = new KelolaSiswaKelasPage(this.page);
    await detail.expectLoaded();

    return detail;
  }

  async openFirstEditForm() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
    await this.rows
      .first()
      .getByTestId('manajemen-kelas-edit-button')
      .or(this.rows.first().getByRole('button', { name: /edit data|edit/i }))
      .click();

    const modal = this.form(/edit kelas/i);
    await expect(modal).toContainText(/edit kelas/i, { timeout: 15000 });

    return modal;
  }

  async openFirstDeleteDialog() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
    await this.rows
      .first()
      .getByTestId('manajemen-kelas-delete-button')
      .or(this.rows.first().getByRole('button', { name: /hapus data|hapus/i }))
      .click();

    const dialog = this.page
      .getByTestId('manajemen-kelas-delete-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: /hapus kelas|tidak bisa dihapus/i }))
      .last();

    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async chooseOptionByText(buttonLocator, optionPattern) {
    await expect(buttonLocator).toBeVisible({ timeout: 15000 });
    await buttonLocator.click();

    const option = this.page.getByRole('button', { name: optionPattern }).last();
    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

class KelolaSiswaKelasPage {
  constructor(page) {
    this.page = page;
    this.pageMarker = page
      .getByTestId('kelola-siswa-kelas-page')
      .or(page.locator('#kelas-siswa-table'))
      .or(page.getByRole('heading', { name: /kelas/i }))
      .first();
    this.addButton = page
      .getByTestId('kelola-siswa-kelas-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah siswa/i }));
    this.searchInput = page
      .getByTestId('kelola-siswa-kelas-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('kelola-siswa-kelas-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('kelola-siswa-kelas-table-body')
      .or(page.locator('#kelas-siswa-table tbody'));
    this.rows = page
      .getByTestId('kelola-siswa-kelas-row')
      .or(page.locator('#kelas-siswa-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('kelola-siswa-kelas-table-info')
      .or(page.locator('#kelas-siswa-table_info, .dt-info'));
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/akademik\/kelas_semester\/.+\/siswa/, { timeout: 15000 });
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
  }

  addStudentDialog() {
    return this.page
      .getByTestId('kelola-siswa-kelas-add-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: /tambah siswa ke kelas/i }))
      .last();
  }

  studentSearchInput(dialog) {
    return dialog
      .getByTestId('kelola-siswa-kelas-modal-search-input')
      .or(dialog.getByPlaceholder(/masukkan nama atau nis/i))
      .or(dialog.locator('input[type="text"]').first());
  }

  studentCheckboxes(dialog) {
    return dialog
      .getByTestId('kelola-siswa-kelas-student-checkbox')
      .or(dialog.locator('input[name="selected_student[]"]'));
  }

  addSelectedButton(dialog) {
    return dialog
      .getByTestId('kelola-siswa-kelas-add-selected-button')
      .or(dialog.getByRole('button', { name: /^tambahkan$/i }));
  }

  cancelButton(dialog) {
    return dialog
      .getByTestId('kelola-siswa-kelas-cancel-button')
      .or(dialog.getByRole('button', { name: /^batal$/i }));
  }

  async openAddStudentDialog() {
    await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
    await this.addButton.first().click();

    const dialog = this.addStudentDialog();
    await expect(dialog).toContainText(/tambah siswa ke kelas/i, { timeout: 15000 });

    return dialog;
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
      .filter(text => text && !/^(aksi|hapus)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page
      .getByTestId('kelola-siswa-kelas-row')
      .or(this.page.locator('#kelas-siswa-table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = {
  ManajemenKelasPage,
  KelolaSiswaKelasPage,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
  exactText,
};
