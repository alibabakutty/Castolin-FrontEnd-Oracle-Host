import { expect } from '@playwright/test';

export class CorporateDashboardPage {
  constructor(page) {
    this.page = page;

    // Main dashboard elements
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.companyName = page.getByTestId('company-name');
    this.contactPerson = page.getByTestId('contact-person');
    this.companyEmail = page.getByTestId('company-email');

    // Statistics cards
    this.totalOrdersCard = page.getByTestId('stat-total-orders');
    this.pendingOrdersCard = page.getByTestId('stat-pending-orders');
    this.completedOrdersCard = page.getByTestId('stat-completed-orders');
    this.totalSpentCard = page.getByTestId('stat-total-spent');

    // Credit information
    this.creditLimitInfo = page.getByTestId('credit-limit');
    this.currentBalanceInfo = page.getByTestId('current-balance');
    this.availableCreditInfo = page.getByTestId('available-credit');
    this.lowCreditAlert = page.locator('.alert-warning', { hasText: /credit/i });

    // Recent orders
    this.recentOrdersSection = page.getByTestId('recent-orders');
    this.recentOrdersTable = page.getByTestId('recent-orders-table');
    this.recentOrdersHeader = page.getByRole('heading', { name: /recent orders/i });
    this.orderRows = page.locator('[data-testid^="order-row-"]');
    this.viewOrderButtons = page.getByRole('button', { name: /view/i });

    // Quick actions
    this.quickActionsSection = page.getByTestId('quick-actions');
    this.createOrderButton = page.getByRole('button', { name: /create order/i });
    this.viewAllOrdersLink = page.getByRole('link', { name: /view all orders/i });
    this.accountSettingsLink = page.getByRole('link', { name: /account settings/i });
    this.paymentHistoryLink = page.getByRole('link', { name: /payment history/i });

    // Filters and search
    this.searchInput = page.getByTestId('search-input');
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.clearSearchButton = page.getByRole('button', { name: /clear search/i });
    this.statusFilter = page.getByLabel(/filter by status/i);
    this.dateRangeFilter = page.getByLabel(/date range/i);
    this.clearFiltersButton = page.getByRole('button', { name: /clear filters/i });

    // Export
    this.exportButton = page.getByRole('button', { name: /export/i });
    this.exportCSV = page.getByRole('menuitem', { name: /csv/i });
    this.exportPDF = page.getByRole('menuitem', { name: /pdf/i });
    this.exportExcel = page.getByRole('menuitem', { name: /excel/i });

    // Notifications
    this.pendingOrdersNotification = page.locator('.notification', { hasText: /pending/i });

    // Mobile
    this.mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    this.mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Session
    this.sessionWarning = page.locator('.alert-info', { hasText: /session/i });
    this.extendSessionButton = page.getByRole('button', { name: /extend session/i });
  }

  async verifyDashboardLoaded() {
    await this.page.waitForURL(/.*dashboard/);
    await expect(this.welcomeMessage).toBeVisible({ timeout: 10000 });
    await expect(this.recentOrdersSection).toBeVisible();
    await expect(this.quickActionsSection).toBeVisible();
  }

  async getWelcomeMessage() {
    return await this.welcomeMessage.textContent();
  }

  async getTotalOrders() {
    const text = await this.totalOrdersCard.textContent();
    return text.match(/\d+/)?.[0] || '0';
  }

  async getPendingOrders() {
    const text = await this.pendingOrdersCard.textContent();
    return text.match(/\d+/)?.[0] || '0';
  }

  async getCompletedOrders() {
    const text = await this.completedOrdersCard.textContent();
    return text.match(/\d+/)?.[0] || '0';
  }

  async getTotalSpent() {
    const text = await this.totalSpentCard.textContent();
    return text.match(/\$[\d,]+\.\d{2}/)?.[0] || '$0.00';
  }

  async getCreditLimit() {
    const text = await this.creditLimitInfo.textContent();
    return text.match(/\$[\d,]+\.\d{2}/)?.[0] || '$0.00';
  }

  async getCurrentBalance() {
    const text = await this.currentBalanceInfo.textContent();
    return text.match(/\$[\d,]+\.\d{2}/)?.[0] || '$0.00';
  }

  async getAvailableCredit() {
    const text = await this.availableCreditInfo.textContent();
    return text.match(/\$[\d,]+\.\d{2}/)?.[0] || '$0.00';
  }

  async getRecentOrdersCount() {
    return await this.orderRows.count();
  }

  async getOrderRowData(rowIndex, field) {
    const row = this.orderRows.nth(rowIndex);

    switch (field) {
      case 'orderNumber': {
        const orderNumberCell = row.locator('[data-testid="order-number"]');
        return await orderNumberCell.textContent();
      }

      case 'date': {
        const dateCell = row.locator('[data-testid="order-date"]');
        return await dateCell.textContent();
      }

      case 'amount': {
        const amountCell = row.locator('[data-testid="order-amount"]');
        return await amountCell.textContent();
      }

      case 'status': {
        const statusCell = row.locator('[data-testid="order-status"]');
        return await statusCell.textContent();
      }

      default:
        return '';
    }
  }

  async clickCreateOrder() {
    await this.createOrderButton.click();
  }

  async clickViewAllOrders() {
    await this.viewAllOrdersLink.click();
  }

  async clickAccountSettings() {
    await this.accountSettingsLink.click();
  }

  async clickPaymentHistory() {
    await this.paymentHistoryLink.click();
  }

  async searchOrders(query) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearSearch() {
    await this.clearSearchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterOrdersByStatus(status) {
    await this.statusFilter.selectOption(status);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByDateRange(range) {
    await this.dateRangeFilter.selectOption(range);
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearDateFilter() {
    await this.dateRangeFilter.selectOption('');
    await this.page.waitForLoadState('networkidle');
  }

  async exportOrders(format) {
    await this.exportButton.click();

    switch (format.toLowerCase()) {
      case 'csv':
        await this.exportCSV.click();
        break;
      case 'pdf':
        await this.exportPDF.click();
        break;
      case 'excel':
        await this.exportExcel.click();
        break;
    }
  }

  async viewOrder(rowIndex) {
    const viewButtons = this.viewOrderButtons;
    await viewButtons.nth(rowIndex).click();
  }

  async refreshDashboard() {
    await this.page.reload();
    await this.verifyDashboardLoaded();
  }

  async hasLowCreditWarning() {
    return await this.lowCreditAlert.isVisible();
  }

  async clickLowCreditLink() {
    const link = this.lowCreditAlert.getByRole('link');
    await link.click();
  }

  async clickPendingOrdersNotification() {
    await this.pendingOrdersNotification.click();
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await expect(this.mobileMenu).toBeVisible();
  }

  async closeMobileMenu() {
    const closeButton = this.mobileMenu.getByRole('button', { name: /close/i });
    await closeButton.click();
    await expect(this.mobileMenu).not.toBeVisible();
  }

  async hasSessionWarning() {
    return await this.sessionWarning.isVisible();
  }

  async extendSession() {
    await this.extendSessionButton.click();
  }
}
