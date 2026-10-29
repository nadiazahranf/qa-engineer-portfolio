const { expect } = require('@playwright/test');

const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;
const reservedAcademicYears = new Set();
const SEMESTER_URL = 'https://smard.id/akademik/semester';

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

function defaultDatesForAcademicYear(tahunAjaran) {
  const startYear = Number(tahunAjaran.match(/^(\d{4})\//)?.[1] ?? 2027);

  return {
    tglMulai: `${startYear}-08-01`,
    tglSelesai: `${startYear}-12-31`,
  };
}

class SemesterPage {
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
    this.semesterMenu = page
      .getByTestId('semester-menu')
      .or(page.getByRole('link', { name: /^semester$/i }))
      .or(page.getByRole('button', { name: /^semester$/i }))
      .or(page.locator('a[href*="semester"]').first());
    this.pageMarker = page
      .getByTestId('semester-page')
      .or(page.getByRole('heading', { name: /^data semester$/i }))
      .or(page.getByTestId('semester-add-button'))
      .or(page.locator('#semester-table'))
      .first();
    this.addButton = page
      .getByTestId('semester-add-button')
      .or(page.locator('main').getByRole('button', { name: /tambah semester/i }))
      .or(page.locator('main').getByRole('link', { name: /tambah semester/i }));
    this.searchInput = page
      .getByTestId('semester-search-input')
      .or(page.locator('#dt-search-0'));
    this.lengthSelect = page
      .getByTestId('semester-length-select')
      .or(page.locator('#dt-length-0'));
    this.table = page
      .getByTestId('semester-table')
      .or(page.locator('#semester-table'));
    this.tableBody = page
      .getByTestId('semester-table-body')
      .or(page.locator('#semester-table tbody'));
    this.rows = page
      .getByTestId('semester-row')
      .or(page.locator('#semester-table tbody tr'))
      .filter({ hasNotText: NO_DATA_MESSAGE })
      .filter({ hasNotText: /loading/i });
    this.info = page
      .getByTestId('semester-table-info')
      .or(page.locator('#semester-table_info, .dt-info'));
    this.nextPageButton = page
      .getByTestId('semester-pagination-next')
      .or(page.getByRole('link', { name: /next|›/i }));
    this.previousPageButton = page
      .getByTestId('semester-pagination-previous')
      .or(page.getByRole('link', { name: /previous|‹/i }));
  }

  async gotoFromDashboard() {
    await this.clickIfVisible(this.kelolaAkademikMenu);
    await this.clickIfVisible(this.ruangKelasMenu);

    const semesterMenu = this.semesterMenu.first();

    if (await semesterMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await semesterMenu.click({ timeout: 3000 }).catch(async () => {
        await this.page.goto(SEMESTER_URL);
      });
    } else {
      await this.page.goto(SEMESTER_URL);
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

  form(title = /tambah semester|edit semester/i) {
    return this.page
      .getByTestId('semester-form-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: title }))
      .first();
  }

  deleteDialog() {
    return this.page
      .getByTestId('semester-delete-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: /hapus semester/i }))
      .first();
  }

  toggleDialog() {
    return this.page
      .getByTestId('semester-toggle-status-modal')
      .or(this.page.locator('.fixed.inset-0').filter({ hasText: /ubah status semester/i }))
      .first();
  }

  academicYearButton(modal) {
    return modal
      .getByTestId('semester-tahun-ajaran-select')
      .or(modal.locator('#semester-tahun-ajaran'))
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
      .getByTestId('semester-start-date-input')
      .or(modal.locator('#semester-tgl-awal'));
  }

  endDateButton(modal) {
    return modal
      .getByTestId('semester-end-date-input')
      .or(modal.locator('#semester-tgl-akhir'));
  }

  statusButton(modal) {
    return modal
      .getByTestId('semester-status-select')
      .or(modal.locator('#semester-status'))
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

  async chooseAcademicYear(modal, tahunAjaran) {
    const button = this.academicYearButton(modal);
    const option = this.page
      .getByTestId(`semester-tahun-ajaran-option-${tahunAjaran.replace(/\//g, '-')}`)
      .or(this.page.getByRole('button', { name: exactText(tahunAjaran) }))
      .last();

    await expect(button).toBeVisible({ timeout: 15000 });

    if (!(await option.isVisible({ timeout: 1000 }).catch(() => false))) {
      await button.click();
    }

    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();
    await expect(button).toContainText(tahunAjaran, { timeout: 15000 });
  }

  async getFirstAvailableAcademicYear(modal) {
    const options = await this.getAvailableAcademicYears(modal);

    if (options.length === 0) {
      throw new Error('Tidak ada tahun ajaran tersedia untuk membuat data Semester.');
    }

    const selected = options[0];
    await this.chooseAcademicYear(modal, selected);

    return selected;
  }

  async getAvailableAcademicYears(modal) {
    const button = this.academicYearButton(modal);

    await expect(button).toBeVisible({ timeout: 15000 });
    await button.click();

    const options = await this.page
      .getByRole('button')
      .evaluateAll(buttons => buttons
        .map(button => button.innerText.trim())
        .filter(text => /^\d{4}\/\d{4}$/.test(text)));

    if (options.length === 0) {
      return [];
    }

    const futureOptions = [...options].reverse();
    const candidates = futureOptions
      .filter(option => Number(option.slice(0, 4)) >= 2029 && !reservedAcademicYears.has(option));

    return candidates.length > 0 ? candidates : futureOptions;
  }

  async chooseStatus(modal, status) {
    const statusButton = this.statusButton(modal);

    await expect(statusButton).toBeVisible({ timeout: 15000 });
    await statusButton.click();

    const option = this.page
      .getByTestId(`semester-status-option-${status.toLowerCase().replace(/\s+/g, '-')}`)
      .or(this.page.getByRole('button', { name: exactText(status) }))
      .last();

    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();
  }

  async clearStatus(modal) {
    await this.statusButton(modal).evaluate((button) => {
      button.value = '';
      button.textContent = 'Pilih Status';
      button.dispatchEvent(new Event('input', { bubbles: true }));
      button.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  async selectDate(modal, buttonLocator, fieldName, value) {
    const [year, month, day] = value.split('-');

    await expect(buttonLocator).toBeEnabled({ timeout: 15000 });
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

  async fillForm(modal, data) {
    if (data.tahunAjaran !== undefined) {
      await this.chooseAcademicYear(modal, data.tahunAjaran);
    }

    if (data.nama !== undefined) {
      await this.nameInput(modal).fill(data.nama);
    }

    if (data.urutan !== undefined) {
      await this.orderInput(modal).fill(String(data.urutan));
    }

    if (data.tglMulai !== undefined) {
      await this.selectDate(modal, this.startDateButton(modal), 'tgl_awal', data.tglMulai);
    }

    if (data.tglSelesai !== undefined) {
      await this.selectDate(modal, this.endDateButton(modal), 'tgl_akhir', data.tglSelesai);
    }

    if (data.status !== undefined) {
      const currentStatus = (await this.statusButton(modal).innerText()).trim();

      if (!exactText(data.status).test(currentStatus)) {
        await this.chooseStatus(modal, data.status);
      }
    }
  }

  async submitForm(modal) {
    await this.saveButton(modal).click();
  }

  async createSemester(data) {
    const modal = await this.openCreateForm();
    const candidateYears = data.tahunAjaran ? [data.tahunAjaran] : await this.getAvailableAcademicYears(modal);
    let lastPayload;

    for (const tahunAjaran of candidateYears) {
      reservedAcademicYears.add(tahunAjaran);

      const defaultDates = defaultDatesForAcademicYear(tahunAjaran);
      const payload = {
        ...data,
        tahunAjaran,
        tglMulai: data.tglMulai ?? defaultDates.tglMulai,
        tglSelesai: data.tglSelesai ?? defaultDates.tglSelesai,
      };

      lastPayload = payload;

      await this.fillForm(modal, payload);
      await this.submitForm(modal);

      const saved = await expect(async () => {
        await this.search(payload.nama);
        await expect(this.rowBySemesterName(payload.nama).first()).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 7000 }).then(() => true).catch(() => false);

      if (saved) {
        if (await modal.isVisible().catch(() => false)) {
          await this.cancelButton(modal).click().catch(() => {});
          await expect(modal).toBeHidden({ timeout: 5000 }).catch(() => {});
        }

        return payload;
      }

      if (!(await modal.isVisible().catch(() => false))) {
        break;
      }
    }

    throw new Error(`Semester gagal dibuat. Payload terakhir: ${JSON.stringify(lastPayload)}`);
  }

  async createSemesterOrUseExisting(data, { attemptCreate = false } = {}) {
    if (!attemptCreate) {
      return { data: await this.getExistingSemesterData(), created: false };
    }

    try {
      return { data: await this.createSemester(data), created: true };
    } catch (error) {
      await this.page.goto(SEMESTER_URL);
      await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
      await this.lengthSelect.selectOption('100').catch(() => {});

      return { data: await this.getExistingSemesterData(), created: false, error };
    }
  }

  async getExistingSemesterData(preferredKeyword = 'QASM') {
    await this.search(preferredKeyword);

    if (await this.rows.count() === 0) {
      await this.search('');
    }

    const actionableRows = this.rows.filter({
      has: this.page.getByRole('button', { name: /edit data|edit|hapus data|ubah status semester/i }),
    });
    const row = (await actionableRows.count()) > 0 ? actionableRows.first() : this.rows.first();

    await expect(row).toBeVisible({ timeout: 15000 });

    const cells = (await row.locator('td').allInnerTexts()).map(text => text.trim());

    return {
      tahunAjaran: cells[0],
      nama: cells[1],
      urutan: cells[2],
      status: cells[5],
    };
  }

  rowBySemesterName(name) {
    return this.page
      .getByTestId('semester-row')
      .or(this.page.locator('#semester-table tbody tr'))
      .filter({
        has: this.page.locator('td').filter({ hasText: exactText(name) }),
      });
  }

  rowByText(text) {
    return this.page
      .getByTestId('semester-row')
      .or(this.page.locator('#semester-table tbody tr'))
      .filter({ hasText: text })
      .filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async search(keyword) {
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    await this.searchInput.fill(keyword);
  }

  async expectSemesterVisible(data) {
    await this.search(data.nama);

    const row = this.rowBySemesterName(data.nama);

    await expect(row.first()).toBeVisible({ timeout: 15000 });
    await expect(row.first()).toContainText(data.tahunAjaran);
    await expect(row.first()).toContainText(String(data.urutan));
    await expect(row.first()).toContainText(data.status);
  }

  async openEditForm(name) {
    await this.search(name);

    const row = this.rowBySemesterName(name).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    await row
      .getByTestId('semester-edit-button')
      .or(row.getByRole('button', { name: /edit data|edit/i }))
      .click();

    const modal = this.form(/edit semester/i);
    await expect(modal).toBeVisible({ timeout: 15000 });

    return modal;
  }

  async editSemester(name, data) {
    const modal = await this.openEditForm(name);

    await this.fillForm(modal, data);
    await this.submitForm(modal);

    await expect(async () => {
      await this.search(data.nama);
      await expect(this.rowBySemesterName(data.nama).first()).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });

    if (await modal.isVisible().catch(() => false)) {
      await this.cancelButton(modal).click().catch(() => {});
      await expect(modal).toBeHidden({ timeout: 5000 }).catch(() => {});
    }
  }

  async openDeleteDialog(name) {
    await this.search(name);

    const row = this.rowBySemesterName(name).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    await row
      .getByTestId('semester-delete-button')
      .or(row.getByRole('button', { name: /hapus data|hapus/i }))
      .click();

    const dialog = this.deleteDialog();
    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async deleteSemester(name) {
    const dialog = await this.openDeleteDialog(name);
    await dialog
      .getByTestId('semester-confirm-delete-button')
      .or(dialog.getByRole('button', { name: /^hapus$/i }))
      .click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
  }

  async openToggleStatusDialog(name) {
    await this.search(name);

    const row = this.rowBySemesterName(name).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    await row
      .getByTestId('semester-toggle-status-button')
      .or(row.getByRole('button', { name: /ubah status semester/i }))
      .click();

    const dialog = this.toggleDialog();
    await expect(dialog).toBeVisible({ timeout: 15000 });

    return dialog;
  }

  async toggleStatus(name) {
    const dialog = await this.openToggleStatusDialog(name);
    await dialog
      .getByTestId('semester-confirm-toggle-status-button')
      .or(dialog.getByRole('button', { name: /ya,\s*ubah/i }))
      .click();

    const closed = await dialog.isHidden({ timeout: 15000 }).catch(() => false);

    if (!closed) {
      await dialog
        .getByTestId('semester-cancel-toggle-status-button')
        .or(dialog.getByRole('button', { name: /^batal$/i }))
        .click()
        .catch(() => {});
    }

    return closed;
  }

  async ensureSemester(data) {
    await this.search(data.nama);

    if (await this.rowBySemesterName(data.nama).count() === 0) {
      await this.search('');
      return this.createSemester(data);
    }

    await this.expectSemesterVisible(data);

    return data;
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
  SemesterPage,
  NO_DATA_MESSAGE,
  SYSTEM_ERROR_MESSAGE,
  exactText,
};
