const { expect } = require('@playwright/test');

const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactText(text) {
  return new RegExp(`^${escapeRegExp(text)}$`, 'i');
}

const MONTH_OPTIONS = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mei',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Agu',
  '09': 'Sep',
  10: 'Okt',
  11: 'Nov',
  12: 'Des',
};

class TahunAjaranPage {
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
    this.tahunAjaranMenu = page
      .getByTestId('tahun-ajaran-menu')
      .or(page.getByRole('link', { name: /^tahun ajaran$/i }))
      .or(page.getByRole('button', { name: /^tahun ajaran$/i }))
      .or(page.locator('a[href*="tahun-ajaran"]').first());
    this.pageMarker = page
      .getByTestId('tahun-ajaran-page')
      .or(page.getByRole('heading', { name: /^data tahun ajaran$/i }))
      .or(page.getByRole('heading', { name: /^tahun ajaran$/i }))
      .or(page.getByTestId('tahun-ajaran-add-button'))
      .or(page.locator('#dt-search-0'))
      .first();
    this.addButton = page
      .getByTestId('tahun-ajaran-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah tahun ajaran/i }))
      .or(page.locator('main').getByRole('link', { name: /tambah tahun ajaran/i }));
    this.searchInput = page
      .getByTestId('tahun-ajaran-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('tahun-ajaran-length-select')
      .or(page.locator('#dt-length-0'));
    this.tableBody = page
      .getByTestId('tahun-ajaran-table-body')
      .or(page.locator('table tbody'));
    this.rows = page
      .getByTestId('tahun-ajaran-row')
      .or(page.locator('table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('tahun-ajaran-table-info')
      .or(page.locator('.dt-info'));
    this.nextPageButton = page
      .getByTestId('tahun-ajaran-pagination-next')
      .or(page.getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('tahun-ajaran-pagination-previous')
      .or(page.getByRole('link', { name: /previous|‹/i }));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.kelolaAkademikMenu);
    await this.clickIfVisible(this.ruangKelasMenu);

    const tahunAjaranMenu = this.tahunAjaranMenu.first();

    if (await tahunAjaranMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await tahunAjaranMenu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto('https://smard.id/akademik/ruang-belajar/tahun-ajaran');
      });
    } else {
      await this.page.goto('https://smard.id/akademik/ruang-belajar/tahun-ajaran');
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

  form(title = /tambah tahun ajaran|edit tahun ajaran/i) {
    return this.page
      .getByTestId('tahun-ajaran-form-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: title }))
      .first();
  }

  deleteDialog() {
    return this.page
      .getByTestId('tahun-ajaran-delete-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: /hapus tahun ajaran/i }))
      .first();
  }

  nameInput(modal) {
    return modal
      .getByTestId('tahun-ajaran-name-input')
      .or(modal.locator('input[name="nama"]'));
  }

  startDateButton(modal) {
    return modal
      .getByTestId('tahun-ajaran-start-date-input')
      .or(modal.locator('#tgl-mulai'));
  }

  endDateButton(modal) {
    return modal
      .getByTestId('tahun-ajaran-end-date-input')
      .or(modal.locator('#tgl-akhir'));
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

    if (!(await modal.isVisible({ timeout: 5000 }).catch(() => false))) {
      await this.page.goto('https://smard.id/akademik/ruang-belajar/tahun-ajaran');
      await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
      await expect(this.addButton.first()).toBeVisible({ timeout: 15000 });
      await this.addButton.first().click();
    }

    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async selectDate(modal, buttonLocator, fieldName, value) {
    const [year, month, day] = value.split('-');

    await buttonLocator.click();

    const pickerHeader = this.page.getByRole('button', { name: /\/\s*\d{4}/ }).last();
    await expect(pickerHeader).toBeVisible({ timeout: 15000 });
    await pickerHeader.click();

    await this.page.getByRole('button', { name: exactText(year) }).last().click();
    await this.page.getByRole('button', { name: exactText(MONTH_OPTIONS[month]) }).last().click();
    await this.page.getByRole('button', { name: exactText(String(Number(day))) }).last().click();

    await expect(modal.locator(`input[name="${fieldName}"]`)).toHaveValue(value, { timeout: 15000 });
  }

  async clearHiddenDate(modal, fieldName) {
    await modal.locator(`input[name="${fieldName}"]`).evaluate((input) => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  async chooseStatus(modal, status) {
    const statusButton = this.statusButton(modal);

    await expect(statusButton).toBeVisible({ timeout: 15000 });
    await statusButton.click();

    const option = this.page
      .getByTestId(`tahun-ajaran-status-option-${status.toLowerCase().replace(/\s+/g, '-')}`)
      .or(this.page.getByRole('button', { name: exactText(status) }))
      .last();

    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click();
    } else {
      await statusButton.evaluate((button, statusText) => {
        button.value = statusText;
        button.textContent = statusText;
        button.dispatchEvent(new Event('input', { bubbles: true }));
        button.dispatchEvent(new Event('change', { bubbles: true }));
      }, status);
    }
  }

  async clearStatus(modal) {
    await this.statusButton(modal).evaluate((button) => {
      button.value = '';
      button.textContent = 'Pilih Status';
      button.dispatchEvent(new Event('input', { bubbles: true }));
      button.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  async fillForm(modal, { nama, tglMulai, tglSelesai, status }) {
    if (nama !== undefined) {
      await this.nameInput(modal).fill(nama);
    }

    if (tglMulai !== undefined) {
      await this.selectDate(modal, this.startDateButton(modal), 'tgl_mulai', tglMulai);
    }

    if (tglSelesai !== undefined) {
      await this.selectDate(modal, this.endDateButton(modal), 'tgl_akhir', tglSelesai);
    }

    if (status !== undefined) {
      await this.chooseStatus(modal, status);
    }
  }

  async submitForm(modal) {
    await this.saveButton(modal).click();
  }

  async createYear(data) {
    const modal = await this.openCreateForm();

    await this.fillForm(modal, data);
    await this.submitForm(modal);

    await expect(async () => {
      await this.search(data.nama);
      await expect(this.rowByYearName(data.nama).first()).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });

    if (await modal.isVisible().catch(() => false)) {
      await this.cancelButton(modal).click().catch(() => {});
      await expect(modal).toBeHidden({ timeout: 5000 }).catch(() => {});
    }

    return data;
  }

  rowByYearName(name) {
    return this.page
      .getByTestId('tahun-ajaran-row')
      .or(this.page.locator('table tbody tr'))
      .filter({
        has: this.page.locator('td').filter({ hasText: exactText(name) }),
      });
  }

  rowByText(text) {
    return this.page
      .getByTestId('tahun-ajaran-row')
      .or(this.page.locator('table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async search(keyword) {
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    await this.searchInput.fill(keyword);
  }

  async expectYearVisible(data) {
    await this.search(data.nama);

    const row = this.rowByYearName(data.nama);

    await expect(row.first()).toBeVisible({ timeout: 15000 });
  }

  async openEditForm(name) {
    await this.search(name);

    const row = this.rowByYearName(name).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    await row
      .getByTestId('tahun-ajaran-edit-button')
      .or(row.getByRole('button', { name: /edit data|edit/i }))
      .click();

    const modal = this.form(/edit tahun ajaran/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async editYear(name, data) {
    const modal = await this.openEditForm(name);

    await this.fillForm(modal, data);
    await this.submitForm(modal);

    await expect(async () => {
      await this.search(data.nama);
      await expect(this.rowByYearName(data.nama).first()).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });

    if (await modal.isVisible().catch(() => false)) {
      await this.cancelButton(modal).click().catch(() => {});
      await expect(modal).toBeHidden({ timeout: 5000 }).catch(() => {});
    }
  }

  async openDeleteDialog(name) {
    await this.search(name);

    const row = this.rowByYearName(name).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    await row
      .getByTestId('tahun-ajaran-delete-button')
      .or(row.getByRole('button', { name: /hapus data|hapus/i }))
      .click();

    const dialog = this.deleteDialog();
    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async deleteYear(name) {
    const dialog = await this.openDeleteDialog(name);
    await dialog
      .getByTestId('tahun-ajaran-confirm-delete-button')
      .or(dialog.getByRole('button', { name: /^hapus$/i }))
      .click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
  }

  async ensureYear(data) {
    await this.search(data.nama);

    if (await this.rowByYearName(data.nama).count() === 0) {
      await this.search('');
      await this.createYear(data);
    }

    await this.expectYearVisible(data);
  }

  async getFirstSearchableKeyword() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });

    const firstCellText = await this.rows.first().locator('td').first().innerText();
    const firstCellKeyword = firstCellText.trim();

    if (firstCellKeyword) {
      return firstCellKeyword;
    }

    const firstRowCells = await this.rows.first().locator('td').allInnerTexts();

    return firstRowCells
      .flatMap(text => text.split(/\n+/))
      .map(text => text.trim())
      .filter(text => text && !/^(aksi|\d+|edit|hapus|detail|lihat detail)$/i.test(text))
      .sort((a, b) => b.length - a.length)[0];
  }

  async getLastYearName() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });

    const names = (await this.page.locator('table tbody tr td:first-child').allInnerTexts())
      .map(text => text.trim())
      .filter(text => /^\d{4}\/\d{4}$/.test(text));

    names.sort();

    return names[names.length - 1];
  }

  async visibleRowTexts() {
    return (await this.rows.allInnerTexts()).map(text => text.trim()).filter(Boolean);
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = {
  TahunAjaranPage,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
  exactText,
};
