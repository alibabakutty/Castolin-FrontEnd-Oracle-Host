import { expect } from '@playwright/test'

export class CreateOrderPage {
  constructor(page) {
    this.page = page
    
    // Form inputs
    this.orderNameInput = page.getByTestId('order-name-input')
    this.itemSearchInput = page.getByTestId('item-search-input')
    this.searchButton = page.getByRole('button', { name: /search/i })
    
    // Item list and selection
    this.itemList = page.getByTestId('item-list')
    this.itemCards = page.locator('[data-testid^="item-card-"]')
    this.addItemButtons = page.getByRole('button', { name: /add to order/i })
    this.itemQuantityInputs = page.locator('[data-testid="item-quantity-input"]')
    
    // Order summary
    this.orderSummary = page.getByTestId('order-summary')
    this.orderItemsList = page.getByTestId('order-items-list')
    this.orderItemRows = page.locator('[data-testid^="order-item-"]')
    this.emptyOrderMessage = page.getByTestId('empty-order-message')
    this.totalAmount = page.getByTestId('total-amount')
    this.subtotalAmount = page.getByTestId('subtotal-amount')
    this.taxAmount = page.getByTestId('tax-amount')
    this.shippingAmount = page.getByTestId('shipping-amount')
    
    // Item management
    this.updateQuantityButtons = page.getByRole('button', { name: /update quantity/i })
    this.removeItemButtons = page.getByRole('button', { name: /remove/i })
    
    // Shipping section
    this.shippingSection = page.getByTestId('shipping-section')
    this.shippingNameInput = page.getByLabel(/name/i)
    this.shippingCompanyInput = page.getByLabel(/company/i)
    this.shippingStreetInput = page.getByLabel(/street/i)
    this.shippingCityInput = page.getByLabel(/city/i)
    this.shippingStateInput = page.getByLabel(/state/i)
    this.shippingZipInput = page.getByLabel(/zip code|postal code/i)
    this.shippingCountryInput = page.getByLabel(/country/i)
    this.shippingPhoneInput = page.getByLabel(/phone/i)
    this.shippingEmailInput = page.getByLabel(/email/i)
    
    // Shipping methods
    this.shippingMethodRadios = page.locator('[name="shippingMethod"]')
    this.selectedShippingMethod = page.getByTestId('selected-shipping-method')
    this.shippingCost = page.getByTestId('shipping-cost')
    
    // Delivery instructions
    this.deliveryInstructions = page.getByLabel(/delivery instructions/i)
    
    // Order notes
    this.orderNotes = page.getByLabel(/order notes/i)
    
    // Discount
    this.discountInput = page.getByTestId('discount-input')
    this.applyDiscountButton = page.getByRole('button', { name: /apply discount/i })
    this.discountApplied = page.getByTestId('discount-applied')
    this.discountError = page.getByTestId('discount-error')
    this.removeDiscountButton = page.getByRole('button', { name: /remove discount/i })
    
    // Actions
    this.submitButton = page.getByRole('button', { name: /place order|submit order/i })
    this.saveDraftButton = page.getByRole('button', { name: /save draft/i })
    this.cancelButton = page.getByRole('button', { name: /cancel/i })
    
    // Validation
    this.validationError = page.getByTestId('validation-error')
    this.stockError = page.getByTestId('stock-error')
    
    // Success/Error messages
    this.draftSavedMessage = page.getByTestId('draft-saved')
    this.submissionError = page.getByTestId('submission-error')
    
    // Mobile specific
    this.mobileOrderSummary = page.getByTestId('mobile-order-summary')
    
    // Templates
    this.orderTemplates = page.getByTestId('order-templates')
    this.loadTemplateButton = page.getByRole('button', { name: /load template/i })
  }

  async verifyPageLoaded() {
    await this.page.waitForURL(/.*orders\/create/)
    await expect(this.orderNameInput).toBeVisible({ timeout: 10000 })
    await expect(this.itemSearchInput).toBeVisible()
    await expect(this.orderSummary).toBeVisible()
  }

  async searchItem(searchTerm) {
    await this.itemSearchInput.fill(searchTerm)
    await this.searchButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async getSearchResults() {
    return await this.itemCards.count()
  }

  async addItemToOrder(itemIndex, quantity = 1) {
    const itemCard = this.itemCards.nth(itemIndex)
    const quantityInput = itemCard.locator('[data-testid="item-quantity-input"]')
    const addButton = itemCard.getByRole('button', { name: /add to order/i })
    
    await quantityInput.fill(quantity.toString())
    await addButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async getItemStock(itemIndex) {
    const itemCard = this.itemCards.nth(itemIndex)
    const stockElement = itemCard.locator('[data-testid="item-stock"]')
    const stockText = await stockElement.textContent()
    return stockText.match(/\d+/)?.[0] || '0'
  }

  async getOrderItemCount() {
    return await this.orderItemRows.count()
  }

  async updateItemQuantity(orderItemIndex, newQuantity) {
    const orderItem = this.orderItemRows.nth(orderItemIndex)
    const quantityInput = orderItem.locator('[data-testid="quantity-input"]')
    const updateButton = orderItem.getByRole('button', { name: /update/i })
    
    await quantityInput.fill(newQuantity.toString())
    await updateButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async removeItemFromOrder(orderItemIndex) {
    const removeButton = this.removeItemButtons.nth(orderItemIndex)
    await removeButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async getTotalAmount() {
    const text = await this.totalAmount.textContent()
    return text.match(/\$[\d,]+\.\d{2}/)?.[0] || '$0.00'
  }

  async getSubtotal() {
    const text = await this.subtotalAmount.textContent()
    return text.match(/\$[\d,]+\.\d{2}/)?.[0] || '$0.00'
  }

  async getTaxAmount() {
    const text = await this.taxAmount.textContent()
    return text.match(/\$[\d,]+\.\d{2}/)?.[0] || '$0.00'
  }

  async fillShippingAddress(address) {
    if (address.name) await this.shippingNameInput.fill(address.name)
    if (address.company) await this.shippingCompanyInput.fill(address.company)
    if (address.street) await this.shippingStreetInput.fill(address.street)
    if (address.city) await this.shippingCityInput.fill(address.city)
    if (address.state) await this.shippingStateInput.fill(address.state)
    if (address.zipCode) await this.shippingZipInput.fill(address.zipCode)
    if (address.country) await this.shippingCountryInput.selectOption(address.country)
    if (address.phone) await this.shippingPhoneInput.fill(address.phone)
    if (address.email) await this.shippingEmailInput.fill(address.email)
  }

  async getShippingFieldValue(field) {
    switch (field) {
      case 'name':
        return await this.shippingNameInput.inputValue()
      case 'street':
        return await this.shippingStreetInput.inputValue()
      case 'city':
        return await this.shippingCityInput.inputValue()
      default:
        return ''
    }
  }

  async selectShippingMethod(method) {
    await this.page.locator(`[value="${method}"]`).check()
    await this.page.waitForLoadState('networkidle')
  }

  async addDeliveryInstructions(instructions) {
    await this.deliveryInstructions.fill(instructions)
  }

  async addOrderNotes(notes) {
    await this.orderNotes.fill(notes)
  }

  async applyDiscountCode(code) {
    await this.discountInput.fill(code)
    await this.applyDiscountButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async removeDiscount() {
    await this.removeDiscountButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async submitOrder() {
    await this.submitButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async saveAsDraft(draftName) {
    await this.orderNameInput.fill(draftName)
    await this.saveDraftButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async cancelOrder() {
    await this.cancelButton.click()
  }

  async getOrderSummary() {
    return {
      subtotal: await this.getSubtotal(),
      shipping: await this.shippingCost.textContent(),
      tax: await this.getTaxAmount(),
      total: await this.getTotalAmount()
    }
  }

  async hasOrderTemplates() {
    return await this.orderTemplates.isVisible()
  }

  async loadOrderTemplate(templateName) {
    await this.page.getByText(templateName).click()
    await this.loadTemplateButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async reorderFromPrevious(orderNumber) {
    await this.page.getByText(orderNumber).click()
    await this.page.getByRole('button', { name: /reorder/i }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async openMobileShippingForm() {
    await this.page.getByTestId('mobile-shipping-button').click()
  }
}