export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'Admin@123',
    name: 'Admin User',
    role: 'admin'
  },
  corporate: {
    email: 'corporate@test.com',
    password: 'Corporate@123',
    companyId: 'CORP001',
    companyName: 'Test Corporation',
    contactPerson: 'John Doe',
    role: 'corporate'
  },
  corporate2: {
    email: 'corporate2@test.com',
    password: 'Corporate2@123',
    companyId: 'CORP002',
    companyName: 'Another Corporation',
    contactPerson: 'Jane Smith',
    role: 'corporate'
  }
}

export const testOrders = {
  standard: {
    name: 'Office Supplies Order',
    items: [
      { id: 1, name: 'Laptop Pro', quantity: 2 },
      { id: 2, name: 'Wireless Mouse', quantity: 5 }
    ],
    shipping: {
      street: '123 Business Ave',
      city: 'Commerce City',
      state: 'CC',
      zipCode: '12345',
      country: 'USA'
    },
    notes: 'Please deliver before 5 PM'
  },
  large: {
    name: 'Bulk Equipment Order',
    items: [
      { id: 1, name: 'Laptop Pro', quantity: 10 },
      { id: 3, name: 'Mechanical Keyboard', quantity: 15 }
    ],
    shipping: {
      street: '456 Corporate Blvd',
      city: 'Business Town',
      state: 'BT',
      zipCode: '54321',
      country: 'USA'
    }
  },
  urgent: {
    name: 'Urgent Replacement Parts',
    items: [
      { id: 2, name: 'Wireless Mouse', quantity: 3 }
    ],
    shipping: {
      street: '789 Emergency Rd',
      city: 'Quick City',
      state: 'QC',
      zipCode: '67890',
      country: 'USA'
    },
    priority: true
  }
}

export const testStockItems = [
  {
    id: 1,
    name: 'Laptop Pro',
    sku: 'LP001',
    category: 'Electronics',
    price: 999.99,
    quantity: 50,
    minQuantity: 10,
    description: 'High-performance business laptop'
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    sku: 'WM002',
    category: 'Accessories',
    price: 29.99,
    quantity: 200,
    minQuantity: 50,
    description: 'Ergonomic wireless mouse'
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    sku: 'MK003',
    category: 'Accessories',
    price: 79.99,
    quantity: 150,
    minQuantity: 30,
    description: 'Mechanical keyboard with RGB lighting'
  },
  {
    id: 4,
    name: '27" Monitor',
    sku: 'MO004',
    category: 'Electronics',
    price: 299.99,
    quantity: 75,
    minQuantity: 15,
    description: '4K UHD monitor'
  },
  {
    id: 5,
    name: 'Docking Station',
    sku: 'DS005',
    category: 'Accessories',
    price: 149.99,
    quantity: 100,
    minQuantity: 20,
    description: 'USB-C docking station'
  }
]

export const orderStatuses = {
  pending: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  refunded: 'refunded'
}

export const paymentMethods = {
  creditCard: 'credit_card',
  bankTransfer: 'bank_transfer',
  invoice: 'invoice',
  cash: 'cash'
}

export const shippingOptions = {
  standard: {
    name: 'Standard Shipping',
    cost: 9.99,
    deliveryDays: '3-5 business days'
  },
  express: {
    name: 'Express Shipping',
    cost: 19.99,
    deliveryDays: '1-2 business days'
  },
  overnight: {
    name: 'Overnight Shipping',
    cost: 39.99,
    deliveryDays: 'Next business day'
  }
}

export const taxRates = {
  standard: 0.08, // 8%
  reduced: 0.05,   // 5%
  exempt: 0.00     // 0%
}

export const discountCodes = {
  welcome10: {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 50,
    validUntil: '2024-12-31'
  },
  bulk20: {
    code: 'BULK20',
    type: 'percentage',
    value: 20,
    minPurchase: 500,
    validUntil: '2024-12-31'
  },
  flat50: {
    code: 'FLAT50',
    type: 'fixed',
    value: 50,
    minPurchase: 200,
    validUntil: '2024-12-31'
  }
}