export class LoginPage {
  constructor(page) {
    this.page = page
    
    // Common elements
    this.emailInput = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.submitButton = page.getByRole('button', { name: /sign in/i })
    this.rememberCheckbox = page.getByRole('checkbox', { name: /remember me/i })
    this.errorMessage = page.getByTestId('error-message')
    this.loadingSpinner = page.getByTestId('loading-spinner')
    
    // Navigation
    this.adminLoginLink = page.getByRole('link', { name: /admin login/i })
    this.corporateLoginLink = page.getByRole('link', { name: /corporate login/i })
  }

  async goto() {
    await this.page.goto('/')
  }

  async gotoAdminLogin() {
    await this.goto()
    await this.adminLoginLink.click()
    await this.page.waitForURL(/.*admin-login/)
  }

  async gotoCorporateLogin() {
    await this.goto()
    await this.corporateLoginLink.click()
    await this.page.waitForURL(/.*corporate-login/)
  }

  async loginAsAdmin(email = 'admin@test.com', password = 'Admin@123', remember = false) {
    await this.gotoAdminLogin()
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    
    if (remember) {
      await this.rememberCheckbox.check()
    }
    
    await this.submitButton.click()
  }

  async loginAsCorporate(email = 'corporate@test.com', password = 'Corporate@123') {
    await this.gotoCorporateLogin()
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent()
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible()
  }

  async isLoginFormVisible() {
    return await this.emailInput.isVisible() && 
           await this.passwordInput.isVisible() &&
           await this.submitButton.isVisible()
  }
}