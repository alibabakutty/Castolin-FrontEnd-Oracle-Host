import { http, HttpResponse } from 'msw'

// Common test data
export const mockAdminUser = {
  id: 1,
  email: 'admin@test.com',
  name: 'Admin User',
  role: 'admin',
  permissions: ['all']
}

export const mockCorporateUser = {
  id: 2,
  email: 'corporate@test.com',
  companyName: 'Test Corporation',
  role: 'corporate',
  contactPerson: 'John Doe',
  companyId: 'CORP001'
}

export const mockOrders = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    status: 'pending',
    totalAmount: 1500.00,
    createdAt: '2024-01-15T10:30:00Z',
    items: [
      { id: 1, name: 'Product A', quantity: 2, price: 500 },
      { id: 2, name: 'Product B', quantity: 1, price: 500 }
    ]
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    status: 'completed',
    totalAmount: 2500.00,
    createdAt: '2024-01-14T14:20:00Z',
    items: [
      { id: 3, name: 'Product C', quantity: 5, price: 500 }
    ]
  }
]

export const mockStockItems = [
  { id: 1, name: 'Laptop', sku: 'LP001', quantity: 50, price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Mouse', sku: 'MS002', quantity: 200, price: 29.99, category: 'Accessories' },
  { id: 3, name: 'Keyboard', sku: 'KB003', quantity: 150, price: 79.99, category: 'Accessories' }
]

export const handlers = [
  // ===== AUTH HANDLERS =====
  http.post('/api/auth/admin/login', async ({ request }) => {
    const { email, password } = await request.json()
    
    if (email === 'admin@test.com' && password === 'Admin@123') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'admin-jwt-token-12345',
          user: mockAdminUser
        }
      })
    }
    
    return HttpResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/corporate/login', async ({ request }) => {
    const { email, password } = await request.json()
    
    if (email === 'corporate@test.com' && password === 'Corporate@123') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'corporate-jwt-token-12345',
          user: mockCorporateUser
        }
      })
    }
    
    return HttpResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/verify', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { valid: false, error: 'No token provided' },
        { status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    if (token.includes('admin')) {
      return HttpResponse.json({
        valid: true,
        user: mockAdminUser
      })
    }
    
    if (token.includes('corporate')) {
      return HttpResponse.json({
        valid: true,
        user: mockCorporateUser
      })
    }
    
    return HttpResponse.json(
      { valid: false, error: 'Invalid token' },
      { status: 401 }
    )
  }),

  // ===== ORDERS HANDLERS =====
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    
    let filteredOrders = mockOrders
    
    if (status) {
      filteredOrders = mockOrders.filter(order => order.status === status)
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        orders: filteredOrders,
        total: filteredOrders.length,
        page: 1,
        limit: 10
      }
    })
  }),

  http.get('/api/orders/:id', ({ params }) => {
    const order = mockOrders.find(o => o.id === Number(params.id))
    
    if (!order) {
      return HttpResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: order
    })
  }),

  http.post('/api/orders', async ({ request }) => {
    const orderData = await request.json()
    
    return HttpResponse.json({
      success: true,
      data: {
        id: Date.now(),
        orderNumber: `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        status: 'pending',
        ...orderData,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 })
  }),

  // ===== STOCK ITEMS HANDLERS =====
  http.get('/api/stock-items', () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: mockStockItems,
        total: mockStockItems.length
      }
    })
  }),

  http.get('/api/stock-items/:id', ({ params }) => {
    const item = mockStockItems.find(i => i.id === Number(params.id))
    
    if (!item) {
      return HttpResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: item
    })
  }),

  http.put('/api/stock-items/:id', async ({ request }) => {
    const updates = await request.json()
    return HttpResponse.json({
      success: true,
      data: {
        ...mockStockItems[0],
        ...updates
      }
    })
  }),

  // ===== CORPORATE HANDLERS =====
  http.get('/api/corporate/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader?.includes('corporate')) {
      return HttpResponse.json({
        success: true,
        data: mockCorporateUser
      })
    }
    
    return HttpResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }),

  http.put('/api/corporate/profile', async ({ request }) => {
    const updates = await request.json()
    return HttpResponse.json({
      success: true,
      data: {
        ...mockCorporateUser,
        ...updates
      }
    })
  }),

  // Default fallback
  http.all('*', ({ request }) => {
    console.warn(`Unhandled request: ${request.method} ${request.url}`)
    return HttpResponse.json(
      { error: `No handler for ${request.method} ${request.url}` },
      { status: 500 }
    )
  })
]