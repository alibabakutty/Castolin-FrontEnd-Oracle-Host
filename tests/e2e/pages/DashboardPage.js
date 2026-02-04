import { expect } from '@playwright/test'

export class DashboardPage {
  constructor(page) {
    this.page = page
    
    // Dashboard elements
    this.welcomeMessage = page.getByTestId('welcome-message')
    this.statsCards = page.getByTestId('stats-cards')
    this.recentOrdersTable = page.getByTestId('recent-orders-table')
    this.logoutButton = page.getByRole('button', { name: /logout/i })
    
    // Admin specific
    this.adminTitle = page.getByRole('heading', { name: /admin dashboard/i })
    this.manageUsersLink = page.getByRole('link', { name: /manage users/i })
    this.inventoryLink = page.getByRole('link', { name: /inventory/i })
    
    // Corporate specific
    this.corporateTitle = page.getByRole('heading', { name: /corporate dashboard/i })
    this.createOrderButton = page.getByRole('button', { name: /create order/i })
    this.myOrdersLink = page.getByRole('link', { name: /my orders/i })
  }

  async verifyAdminDashboard() {
    await this.page.waitForURL(/.*dashboard/)
    await expect(this.adminTitle).toBeVisible()
    await expect(this.statsCards).toBeVisible()
    await expect(this.manageUsersLink).toBeVisible()
  }

  async verifyCorporateDashboard() {
    await this.page.waitForURL(/.*dashboard/)
    await expect(this.corporateTitle).toBeVisible()
    await expect(this.createOrderButton).toBeVisible()
    await expect(this.myOrdersLink).toBeVisible()
  }

  async logout() {
    await this.logoutButton.click()
    await this.page.waitForURL(/.*login/)
  }

  async navigateToOrders() {
    await this.myOrdersLink.click()
    await this.page.waitForURL(/.*orders/)
  }

  async getWelcomeMessage() {
    return await this.welcomeMessage.textContent()
  }
}