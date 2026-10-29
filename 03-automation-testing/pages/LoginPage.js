const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.masukPortalLink = page
      .getByTestId('masuk-portal-link')
      .or(page.locator('a[href$="/login"]').first())
      .or(page.getByRole('link', { name: /masuk portal/i }));
    this.emailInput = page
      .getByTestId('login-email-input')
      .or(page.getByRole('textbox', { name: /^email$/i }));
    this.passwordInput = page
      .getByTestId('login-password-input')
      .or(page.getByRole('textbox', { name: /^password$/i }));
    this.loginButton = page
      .getByTestId('login-submit-button')
      .or(page.getByRole('button', { name: /^login$/i }));
  }

  async goto() {
    await this.page.goto('https://smard.id/');
  }

  async login(email, password) {
    await this.goto();
    await this.masukPortalLink.first().click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  }
}

module.exports = { LoginPage };
