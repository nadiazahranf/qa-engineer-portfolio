const { expect } = require('@playwright/test');

const ALUMNI_URL = 'https://smard.perpuskita.id/alumni';
const NO_DATA_MESSAGE = /no matching records|tidak ada data|data tidak ditemukan|no data available/i;
const SYSTEM_ERROR_MESSAGE = /server error|internal server error|whoops|terjadi kesalahan|sqlstate/i;

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function exactText(text) {
  return new RegExp(`^${escapeRegExp(text)}$`, 'i');
}

class AlumniPage {
  constructor(page) {
    this.page = page;
    this.kelolaAlumniMenu = page.getByRole('button', { name: /kelola alumni/i }).or(page.getByText(/^kelola alumni$/i));
    this.alumniMenu = page.getByRole('link', { name: /^alumni$/i }).or(page.getByRole('button', { name: /^alumni$/i }));
    this.pageMarker = page.getByRole('heading', { name: /^data alumni$/i }).first();
    this.addButton = page.getByRole('link', { name: /tambah alumni/i }).or(page.getByRole('button', { name: /tambah alumni/i }));
    this.searchInput = page.locator('input[type="search"]').first();
    this.lengthSelect = page.locator('select').filter({ hasText: /10|25|50|100/i }).first();
    this.statusFilter = page.getByRole('combobox').filter({ hasText: /aktif|nonaktif|semua/i }).first();
    this.resetFilterButton = page.getByRole('button', { name: /reset/i });
    this.tableBody = page.locator('table tbody').first();
    this.rows = page.locator('table tbody tr').filter({ hasNotText: NO_DATA_MESSAGE }).filter({ hasNotText: /loading/i });
    this.info = page.locator('[id$="_info"], .dt-info').first();
    this.nextPageButton = page.getByRole('link', { name: /next|â€º/i }).first();
    this.previousPageButton = page.getByRole('link', { name: /previous|â€¹/i }).first();
  }

  async gotoFromDashboard() {
    await this.page.goto(ALUMNI_URL);
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await this.expectRowsOrEmpty();
    await this.expectNoSystemError();
  }

  async openCreatePage() {
    const addButton = this.addButton.first();
    await expect(addButton).toBeVisible({ timeout: 15000 });
    await addButton.click();

    const form = new AlumniFormPage(this.page, /tambah alumni/i);
    await form.expectLoaded();
    return form;
  }

  async openFirstDetailPage() {
    await this.expectHasRows();
    await this.rows.first().getByRole('link', { name: /detail/i }).click();
    const detail = new AlumniDetailPage(this.page);
    await detail.expectLoaded();
    return detail;
  }

  async openFirstEditPage() {
    await this.expectHasRows();
    await this.rows.first().getByRole('link', { name: /edit/i }).click();
    const form = new AlumniFormPage(this.page, /edit alumni/i);
    await form.expectLoaded();
    return form;
  }

  async openFirstDeleteDialog() {
    await this.expectHasRows();
    await this.rows.first().getByRole('link', { name: /hapus/i }).click();
    const dialog = this.page.getByRole('dialog').filter({ hasText: /hapus alumni/i }).first();
    await expect(dialog).toBeVisible({ timeout: 15000 });
    return dialog;
  }

  async openFirstDeactivateDialog() {
    await this.expectHasRows();
    const row = this.rows.first();
    await row.getByRole('button', { name: /nonaktif|aktifkan/i }).click();
    const dialog = this.page.getByRole('dialog').filter({ hasText: /nonaktif|aktifkan/i }).first();
    await expect(dialog).toBeVisible({ timeout: 15000 });
    return dialog;
  }

  async search(keyword) {
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    await this.searchInput.fill(keyword);
  }

  async filterStatus(status) {
    const target = this.statusFilter;
    if (await target.count().catch(() => 0)) {
      await target.selectOption({ label: status }).catch(async () => {
        await target.selectOption(status).catch(() => {});
      });
    }
  }

  async getFirstSearchableKeyword() {
    await this.expectHasRows();
    const cells = await this.rows.first().locator('td').allInnerTexts();
    return cells.flatMap(text => text.split(/\n+/)).map(text => text.trim()).filter(text => text && !/^(aksi|detail|edit|hapus|nonaktif|aktifkan|-|\d{4})$/i.test(text)).sort((a, b) => b.length - a.length)[0];
  }

  rowByText(text) {
    return this.page.locator('table tbody tr').filter({ hasText: text }).filter({ hasNotText: NO_DATA_MESSAGE });
  }

  async expectHasRows() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
  }

  async expectRowsOrEmpty() {
    await expect(this.tableBody).toBeVisible({ timeout: 15000 });
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

class AlumniFormPage {
  constructor(page, title = /tambah alumni|edit alumni/i) {
    this.page = page;
    this.title = title;
    this.pageMarker = page.getByRole('heading', { name: title }).first();
    this.photoInput = page.locator('input[type="file"]').first();
    this.studentAccountSelect = page.getByRole('combobox').filter({ hasText: /akun siswa|siswa/i }).first();
    this.nameInput = page.locator('input[name*="nama"], input#nama').first();
    this.yearInInput = page.locator('input[name*="tahun_masuk"], input#tahun_masuk').first();
    this.yearOutInput = page.locator('input[name*="tahun_lulus"], input#tahun_lulus').first();
    this.statusSelect = page.getByRole('combobox').filter({ hasText: /status data|aktif|nonaktif/i }).first();
    this.saveButton = page.getByRole('button', { name: /simpan|perbarui/i }).first();
    this.cancelLink = page.getByRole('link', { name: /^batal$/i }).or(page.getByRole('button', { name: /^batal$/i })).first();
  }

  async expectLoaded() {
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await this.expectNoSystemError();
  }

  async uploadPhoto(fileName = 'alumni-photo.png') {
    await expect(this.photoInput).toBeVisible({ timeout: 15000 });
    await this.photoInput.setInputFiles({ name: fileName, mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5pZp8AAAAASUVORK5CYII=', 'base64') });
  }

  async fillRequiredFields(data) {
    await expect(this.nameInput).toBeVisible({ timeout: 15000 });
    await this.nameInput.fill(data.name);
    await this.yearInInput.fill(String(data.yearIn));
    await this.yearOutInput.fill(String(data.yearOut));
    if (data.status) {
      await this.selectStatus(data.status);
    }
  }

  async selectStudentAccount(value) {
    const target = this.studentAccountSelect;
    if (await target.count().catch(() => 0)) {
      await target.selectOption({ label: value }).catch(async () => {
        await target.selectOption(value).catch(() => {});
      });
    }
  }

  async selectStatus(status) {
    const target = this.statusSelect;
    if (await target.count().catch(() => 0)) {
      await target.selectOption({ label: status }).catch(async () => {
        await target.selectOption(status).catch(() => {});
      });
    }
  }

  async save() {
    await expect(this.saveButton).toBeVisible({ timeout: 15000 });
    await this.saveButton.click();
  }

  async expectRequiredFieldsVisible() {
    await expect(this.photoInput).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.yearInInput).toBeVisible();
    await expect(this.yearOutInput).toBeVisible();
    await expect(this.statusSelect).toBeVisible();
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

class AlumniDetailPage {
  constructor(page) {
    this.page = page;
    this.pageMarker = page.getByRole('heading', { name: /detail alumni/i }).first();
    this.editLink = page.getByRole('link', { name: /edit/i }).first();
    this.backLink = page.getByRole('link', { name: /kembali/i }).first();
  }

  async expectLoaded() {
    await expect(this.pageMarker).toBeVisible({ timeout: 15000 });
    await this.expectNoSystemError();
  }

  async expectNoSystemError() {
    await expect(this.page.locator('body')).not.toContainText(SYSTEM_ERROR_MESSAGE);
  }
}

module.exports = { AlumniPage, AlumniFormPage, AlumniDetailPage, ALUMNI_URL, NO_DATA_MESSAGE, SYSTEM_ERROR_MESSAGE, exactText };
