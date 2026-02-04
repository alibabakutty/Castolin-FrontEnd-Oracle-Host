import { expect } from '@playwright/test'

export class AdminDashboardPage {
  constructor(page) {
    this.page = page
    
    // Main elements
    this.welcomeMessage = page.getByTestId('welcome-message')
    this.statsCards = page.getByTestId('stats-cards')
    this.recentOrdersTable = page.getByTestId('recent-orders-table')
    this.systemAlerts = page.getByTestId('system-alerts')
    this.quickActions = page.getByTestId('quick-actions')
    
    // Stats
    this.totalOrdersStat = page.getByTestId('stat-total-orders')
    this.pendingOrdersStat = page.getByTestId('stat-pending-orders')
    this.totalRevenueStat = page.getByTestId('stat-total-revenue')
    this.activeUsersStat = page.getByTestId('stat-active-users')
    
    // Navigation
    this.viewAllOrdersLink = page.getByRole('link', { name: /view all orders/i })
    this.manageUsersLink = page.getByRole('link', { name: /manage users/i })
    this.inventoryLink = page.getByRole('link', { name: /inventory/i })
    this.reportsLink = page.getByRole('link', { name: /reports/i })
    this.settingsLink = page.getByRole('link', { name: /settings/i })
    
    // Filters and search
    this.searchInput = page.getByTestId('search-input')
    this.searchButton = page.getByRole('button', { name: /search/i })
    this.dateRangeFilter = page.getByLabel(/date range/i)
    this.statusFilter = page.getByLabel(/filter by status/i)
    this.clearFiltersButton = page.getByRole('button', { name: /clear filters/i })
    
    // Export
    this.exportButton = page.getByRole('button', { name: /export/i })
    this.exportCSV = page.getByRole('menuitem', { name: /csv/i })
    this.exportPDF = page.getByRole('menuitem', { name: /pdf/i })
    this.exportExcel = page.getByRole('menuitem', { name: /excel/i })
    
    // Table actions
    this.orderRows = page.locator('[data-testid^="order-row-"]')
    this.viewOrderButtons = page.getByRole('button', { name: /view/i })
    this.editOrderButtons = page.getByRole('button', { name: /edit/i })
  }

  async verifyDashboardLoaded() {
    await this.page.waitForURL(/.*dashboard/)
    await expect(this.welcomeMessage).toBeVisible()
    await expect(this.statsCards).toBeVisible()
    await expect(this.recentOrdersTable).toBeVisible()
  }

  async getStatValue(statName) {
    const statElement = this.page.getByTestId(`stat-${statName}`)
    return await statElement.textContent()
  }

  async getRecentOrdersRows() {
    return await this.orderRows.count()
  }

  async clickViewAllOrders() {
    await this.viewAllOrdersLink.click()
  }

  async clickQuickAction(actionName) {
    await this.page.getByTestId(`quick-action-${actionName}`).click()
  }

  async search(query) {
    await this.searchInput.fill(query)
    await this.searchButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async clearSearch() {
    await this.searchInput.clear()
    await this.searchButton.click()
  }

  async filterByDateRange(range) {
    await this.dateRangeFilter.selectOption(range)
    await this.page.waitForLoadState('networkidle')
  }

  async filterOrdersByStatus(status) {
    await this.statusFilter.selectOption(status)
    await this.page.waitForLoadState('networkidle')
  }

  async clearStatusFilter() {
    await this.statusFilter.selectOption('')
    await this.page.waitForLoadState('networkidle')
  }

  async exportData(format) {
    await this.exportButton.click()
    
    switch (format.toLowerCase()) {
      case 'csv':
        await this.exportCSV.click()
        break
      case 'pdf':
        await this.exportPDF.click()
        break
      case 'excel':
        await this.exportExcel.click()
        break
    }
  }

  async getOrderRowStatus(rowIndex) {
    const row = this.orderRows.nth(rowIndex)
    const statusBadge = row.locator('[data-testid="order-status"]')
    return await statusBadge.textContent()
  }

  async viewOrder(rowIndex) {
    const viewButtons = this.viewOrderButtons
    await viewButtons.nth(rowIndex).click()
  }

  async editOrder(rowIndex) {
    const editButtons = this.editOrderButtons
    await editButtons.nth(rowIndex).click()
  }

  async refreshDashboard() {
    await this.page.reload()
    await this.verifyDashboardLoaded()
  }

  async verifyAlertExists(alertText) {
    const alert = this.page.locator('.alert', { hasText: alertText })
    await expect(alert).toBeVisible()
    return alert
  }

  async dismissAlert(alertText) {
    const alert = await this.verifyAlertExists(alertText)
    const dismissButton = alert.getByRole('button', { name: /close/i })
    await dismissButton.click()
    await expect(alert).not.toBeVisible()
  }
}