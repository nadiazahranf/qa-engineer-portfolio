const { expect } = require('@playwright/test');

const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactText(text) {
  return new RegExp(`^${escapeRegExp(text)}$`, 'i');
}

class DataKelasPage {
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
    this.dataKelasMenu = page
      .getByTestId('data-kelas-menu')
      .or(page.getByRole('link', { name: /^data kelas$/i }))
      .or(page.getByRole('button', { name: /^data kelas$/i }))
      .or(page.locator('a[href*="data-kelas"]').first());
    this.pageMarker = page
      .getByTestId('data-kelas-page')
      .or(page.getByRole('heading', { name: /^data kelas$/i }))
      .or(page.getByTestId('data-kelas-add-button'))
      .or(page.locator('#dt-search-0'))
      .first();
    this.addButton = page
      .getByTestId('data-kelas-add-button')
      .or(page.getByRole('button', { name: /tambah kelas/i }))
      .or(page.getByRole('link', { name: /tambah kelas/i }));
    this.searchInput = page
      .getByTestId('data-kelas-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('data-kelas-length-select')
      .or(page.locator('#dt-length-0'));
    this.table = page
      .getByTestId('data-kelas-table')
      .or(page.locator('table'));
    this.tableBody = page
      .getByTestId('data-kelas-table-body')
      .or(page.locator('table tbody'));
    this.rows = page
      .getByTestId('data-kelas-row')
      .or(page.locator('table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('data-kelas-table-info')
      .or(page.locator('.dt-info'));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.kelolaAkademikMenu);
    await this.clickIfVisible(this.ruangKelasMenu);

    const dataKelasMenu = this.dataKelasMenu.first();

    if (await dataKelasMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dataKelasMenu.click();
    } else {
      await this.page.goto('https://smard.id/akademik/ruang-belajar/data-kelas');
    }

    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }

  async clickIfVisible(locator) {
    const target = locator.first();

    if (await target.isVisible({ timeout: 3000 }).catch(() => false)) {
      await target.click({ timeout: 3000 }).catch(() => {});
    }
  }

  form(title = /tambah kelas|edit kelas/i) {
    return this.page
      .getByTestId('data-kelas-form-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: title }))
      .first();
  }

  deleteDialog() {
    return this.page
      .getByTestId('data-kelas-delete-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: /hapus kelas/i }))
      .first();
  }

  field(modal, testId, fallback) {
    return modal.getByTestId(testId).or(fallback);
  }

  nameInput(modal) {
    return this.field(modal, 'data-kelas-name-input', modal.locator('input[name="nama"]'));
  }

  levelButton(modal) {
    return this.field(
      modal,
      'data-kelas-level-select',
      modal.getByRole('button', { name: /pilih tingkat|^[1-6]$/i }),
    );
  }

  descriptionInput(modal) {
    return this.field(
      modal,
      'data-kelas-description-input',
      modal.locator('textarea[name="deskripsi"], input[name="deskripsi"]'),
    );
  }

  saveButton(modal) {
    return modal
      .getByTestId('data-kelas-save-button')
      .or(modal.getByRole('button', { name: /^simpan$/i }));
  }

  cancelButton(modal) {
    return modal
      .getByTestId('data-kelas-cancel-button')
      .or(modal.getByRole('button', { name: /^batal$/i }));
  }

  async openCreateForm() {
    await this.addButton.first().click();

    const modal = this.form(/tambah kelas/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async chooseLevel(modal, level) {
    await this.levelButton(modal).click();

    const option = this.page
      .getByTestId(`data-kelas-level-option-${level}`)
      .or(this.page.getByRole('button', { name: exactText(String(level)) }))
      .last();

    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();
  }

  async fillForm(modal, { nama, tingkat, deskripsi }) {
    if (nama !== undefined) {
      await this.nameInput(modal).fill(nama);
    }

    if (tingkat !== undefined) {
      await this.chooseLevel(modal, tingkat);
    }

    if (deskripsi !== undefined) {
      await this.descriptionInput(modal).fill(deskripsi);
    }
  }

  async submitForm(modal) {
    await this.saveButton(modal).click();
  }

  async createClass(data) {
    const modal = await this.openCreateForm();

    await this.fillForm(modal, data);
    await this.submitForm(modal);
    await expect(modal).toBeHidden({ timeout: 15000 });

    return data;
  }

  rowByClassName(name) {
    return this.page
      .getByTestId('data-kelas-row')
      .or(this.page.locator('table tbody tr'))
      .filter({
        has: this.page.locator('td').filter({ hasText: exactText(name) }),
      });
  }

  rowByText(text) {
    return this.page
      .getByTestId('data-kelas-row')
      .or(this.page.locator('table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async search(keyword) {
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    await this.searchInput.fill(keyword);
  }

  async expectClassVisible(data) {
    await this.search(data.nama);

    const row = this.rowByClassName(data.nama);

    await expect(row.first()).toBeVisible({ timeout: 15000 });
    await expect(row.first()).toContainText(data.tingkat);

    if (data.deskripsi) {
      await expect(row.first()).toContainText(data.deskripsi);
    }
  }

  async openEditForm(name) {
    await this.search(name);

    const row = this.rowByClassName(name).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    await row
      .getByTestId('data-kelas-edit-button')
      .or(row.getByRole('button', { name: /edit data|edit/i }))
      .click();

    const modal = this.form(/edit kelas/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async editClass(name, data) {
    const modal = await this.openEditForm(name);

    await this.fillForm(modal, data);
    await this.submitForm(modal);
    await expect(modal).toBeHidden({ timeout: 15000 });
  }

  async openDeleteDialog(name) {
    await this.search(name);

    const row = this.rowByClassName(name).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    await row
      .getByTestId('data-kelas-delete-button')
      .or(row.getByRole('button', { name: /hapus data|hapus/i }))
      .click();

    const dialog = this.deleteDialog();
    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async deleteClass(name) {
    const dialog = await this.openDeleteDialog(name);
    await dialog
      .getByTestId('data-kelas-confirm-delete-button')
      .or(dialog.getByRole('button', { name: /^hapus$/i }))
      .click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
  }

  async ensureClass(data) {
    await this.search(data.nama);

    if (await this.rowByClassName(data.nama).count() === 0) {
      await this.search('');
      await this.createClass(data);
    }

    await this.expectClassVisible(data);
  }

  async getFirstSearchableKeyword() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });

    const firstRowCells = await this.rows.first().locator('td').allInnerTexts();

    return firstRowCells
      .flatMap(text => text.split(/\n+/))
      .map(text => text.trim())
      .filter(text => text && !/^(aksi|\d+|edit|hapus|detail|lihat detail)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  async visibleRowTexts() {
    return (await this.rows.allInnerTexts()).map(text => text.trim()).filter(Boolean);
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = {
  DataKelasPage,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
  exactText,
};
