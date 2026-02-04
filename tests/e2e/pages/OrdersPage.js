import { expect } from '@playwright/test';

export class OrdersPage {
  constructor(page) {
    this.page = page;

    // Page elements
    this.pageTitle = page.getByRole('heading', { name: /orders/i });
    this.searchInput = page.getByTestId('search-input');
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.clearSearchButton = page.getByRole('button', { name: /clear search/i });

    // Filters
    this.filtersSection = page.getByTestId('filters-section');
    this.statusFilter = page.getByLabel(/filter by status/i);
    this.dateRangeFilter = page.getByLabel(/date range/i);
    this.customDateStart = page.getByLabel(/start date/i);
    this.customDateEnd = page.getByLabel(/end date/i);
    this.applyDateFilter = page.getByRole('button', { name: /apply date filter/i });
    this.clearFiltersButton = page.getByRole('button', { name: /clear filters/i });
    this.clearAllFiltersButton = page.getByRole('button', { name: /clear all filters/i });

    // Orders table
    this.ordersTable = page.getByTestId('orders-table');
    this.orderRows = page.locator('[data-testid^="order-row-"]');
    this.tableHeaders = page.locator('thead th');

    // Table columns
    this.orderNumberCells = page.locator('[data-testid="order-number"]');
    this.dateCells = page.locator('[data-testid="order-date"]');
    this.amountCells = page.locator('[data-testid="order-amount"]');
    this.statusCells = page.locator('[data-testid="order-status"]');

    // Actions
    this.viewButtons = page.getByRole('button', { name: /view/i });
    this.editButtons = page.getByRole('button', { name: /edit/i });
    this.cancelButtons = page.getByRole('button', { name: /cancel/i });
    this.reorderButtons = page.getByRole('button', { name: /reorder/i });

    // Selection and bulk actions
    this.selectCheckboxes = page.locator('[data-testid="select-order"]');
    this.selectAllCheckbox = page.getByLabel(/select all/i);
    this.bulkActionsMenu = page.getByTestId('bulk-actions-menu');
    this.bulkExportButton = page.getByRole('button', { name: /export selected/i });
    this.selectedCount = page.getByTestId('selected-count');

    // Pagination
    this.pagination = page.getByTestId('pagination');
    this.currentPage = page.getByTestId('current-page');
    this.totalPages = page.getByTestId('total-pages');
    this.prevButton = page.getByRole('button', { name: /previous/i });
    this.nextButton = page.getByRole('button', { name: /next/i });
    this.pageInput = page.getByLabel(/go to page/i);
    this.itemsPerPageSelect = page.getByLabel(/items per page/i);

    // Export
    this.exportButton = page.getByRole('button', { name: /export/i });
    this.exportCSV = page.getByRole('menuitem', { name: /csv/i });
    this.exportPDF = page.getByRole('menuitem', { name: /pdf/i });
    this.exportExcel = page.getByRole('menuitem', { name: /excel/i });
    this.exportFiltered = page.getByRole('button', { name: /export filtered/i });

    // Statistics
    this.statisticsSummary = page.getByTestId('statistics-summary');
    this.totalOrdersStat = page.getByTestId('stat-total-orders');
    this.totalAmountStat = page.getByTestId('stat-total-amount');
    this.averageOrderStat = page.getByTestId('stat-average-order');

    // Empty state
    this.emptyState = page.getByTestId('empty-state');

    // Success/error messages
    this.successMessage = page.getByTestId('success-message');
    this.errorMessage = page.getByTestId('error-message');

    // Mobile
    this.mobileFiltersButton = page.getByTestId('mobile-filters-button');
    this.mobileFiltersPanel = page.getByTestId('mobile-filters-panel');
    this.applyMobileFilters = page.getByRole('button', { name: /apply filters/i });
    this.closeMobileFilters = page.getByRole('button', { name: /close filters/i });

    // Quick actions
    this.quickStatusDropdowns = page.locator('[data-testid="quick-status-dropdown"]');
  }

  async verifyPageLoaded() {
    await this.page.waitForURL(/.*orders/);
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    await expect(this.ordersTable).toBeVisible();
    await expect(this.filtersSection).toBeVisible();
  }

  async getOrderCount() {
    return await this.orderRows.count();
  }

  async getTotalOrderCount() {
    const text = await this.totalOrdersStat.textContent();
    return parseInt(text.match(/\d+/)?.[0] || '0');
  }

  async getOrderCellText(rowIndex, column) {
    const row = this.orderRows.nth(rowIndex);

    switch (column) {
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
      case 'customer': {
        const customerCell = row.locator('[data-testid="customer-name"]');
        return await customerCell.textContent();
      }

      default: {
        return '';
      }
    }
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

  async filterByStatus(status) {
    if (Array.isArray(status)) {
      for (const s of status) {
        await this.statusFilter.selectOption(s);
      }
    } else {
      await this.statusFilter.selectOption(status);
    }
    await this.page.waitForLoadState('networkidle');
  }

  async clearStatusFilter() {
    await this.statusFilter.selectOption('');
    await this.page.waitForLoadState('networkidle');
  }

  async filterByDateRange(range) {
    await this.dateRangeFilter.selectOption(range);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByCustomDateRange(startDate, endDate) {
    await this.customDateStart.fill(startDate);
    await this.customDateEnd.fill(endDate);
    await this.applyDateFilter.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearDateFilter() {
    await this.dateRangeFilter.selectOption('');
    await this.page.waitForLoadState('networkidle');
  }

  async clearAllFilters() {
    await this.clearAllFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async sortBy(column, direction = 'asc') {
    const header = this.page.getByRole('columnheader', { name: new RegExp(column, 'i') });

    // Click to sort ascending
    await header.click();

    // If we want descending, click again
    if (direction === 'desc') {
      await header.click();
    }

    await this.page.waitForLoadState('networkidle');
  }

  async viewOrder(rowIndex) {
    await this.viewButtons.nth(rowIndex).click();
  }

  async cancelOrder(rowIndex) {
    await this.cancelButtons.nth(rowIndex).click();
  }

  async reorder(rowIndex) {
    await this.reorderButtons.nth(rowIndex).click();
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

  async exportFilteredOrders(format) {
    await this.exportFiltered.click();

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

  async getPageInfo() {
    return {
      currentPage: parseInt(await this.currentPage.textContent()) || 1,
      totalPages: parseInt(await this.totalPages.textContent()) || 1,
    };
  }

  async goToNextPage() {
    await this.nextButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPreviousPage() {
    await this.prevButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPage(pageNumber) {
    await this.pageInput.fill(pageNumber.toString());
    await this.pageInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async setItemsPerPage(count) {
    await this.itemsPerPageSelect.selectOption(count.toString());
    await this.page.waitForLoadState('networkidle');
  }

  async getItemsPerPage() {
    const value = await this.itemsPerPageSelect.inputValue();
    return parseInt(value);
  }

  async selectOrder(rowIndex) {
    await this.selectCheckboxes.nth(rowIndex).check();
  }

  async selectAllOnPage() {
    await this.selectAllCheckbox.check();
  }

  async getSelectedCount() {
    const text = await this.selectedCount.textContent();
    return parseInt(text.match(/\d+/)?.[0] || '0');
  }

  async bulkExportSelected() {
    await this.bulkActionsMenu.click();
    await this.bulkExportButton.click();
  }

  async clearSelection() {
    await this.selectAllCheckbox.uncheck();
  }

  async getStatistics() {
    return {
      totalOrders: parseInt(await this.totalOrdersStat.textContent()) || 0,
      totalAmount: await this.totalAmountStat.textContent(),
      averageOrder: await this.averageOrderStat.textContent(),
    };
  }

  async openMobileFilters() {
    await this.mobileFiltersButton.click();
    await expect(this.mobileFiltersPanel).toBeVisible();
  }

  async filterByStatusMobile(status) {
    const statusSelect = this.mobileFiltersPanel.getByLabel(/status/i);
    await statusSelect.selectOption(status);
  }

  async applyMobileFilters() {
    await this.applyMobileFilters.click();
    await this.page.waitForLoadState('networkidle');
  }

  async closeMobileFilters() {
    await this.closeMobileFilters.click();
    await expect(this.mobileFiltersPanel).not.toBeVisible();
  }

  async quickUpdateStatus(rowIndex, newStatus) {
    const dropdown = this.quickStatusDropdowns.nth(rowIndex);
    await dropdown.selectOption(newStatus);
    await this.page.waitForLoadState('networkidle');
  }
}
