import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NewOrder from '../../../../components/orders-page/NewOrder'

// ==========================
// MOCKS
// ==========================

// ---- Router ----
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ orderNumberFetch: undefined }),
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      pathname: '/corporate/new-order',
    }),
  }
})

// ---- Toast ----
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// ---- API ----
vi.mock('../../../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

// ---- Child Components ----
vi.mock('../../../../components/orders-page/OrderHeader', () => ({
  default: ({ onBack }) => (
    <div data-testid="order-header">
      <button onClick={onBack}>Back</button>
    </div>
  ),
}))

vi.mock('../../../../components/orders-page/OrderTable', () => ({
  default: () => <div data-testid="order-table">Order Table</div>,
}))

vi.mock('../../../../components/orders-page/OrderFooter', () => ({
  default: ({ handleSubmit, isSubmitting }) => (
    <div data-testid="order-footer">
      <button onClick={handleSubmit} disabled={isSubmitting}>
        Submit
      </button>
    </div>
  ),
}))

// ---- useOrderFormHook ----
vi.mock('../../../../components/orders-page/useOrderFormHook', () => ({
  useOrderFormHook: vi.fn(),
}))

import { useOrderFormHook } from '../../../../components/orders-page/useOrderFormHook'
import api from '../../../../services/api'

// ==========================
// TEST DATA
// ==========================

const baseHookState = {
  date: '2026-01-01',
  setDate: vi.fn(),
  customerName: { customer_code: 'C001', customer_name: 'Test Customer' },
  setCustomerName: vi.fn(),
  orderNumber: 'ORD-001',
  setOrderNumber: vi.fn(),
  orderData: [],
  setOrderData: vi.fn(),
  remarks: '',
  setRemarks: vi.fn(),
  selectedCustomer: null,
  setSelectedCustomer: vi.fn(),
  showRowValueRows: true,
  setShowRowValueRows: vi.fn(),
  editingRow: {},
  setEditingRow: vi.fn(),
  voucherType: 'Sales Order',
  setVoucherType: vi.fn(),
  executiveName: {},
  setExecutiveName: vi.fn(),
  status: 'pending',
  setStatus: vi.fn(),
  isSubmitting: false,
  setIsSubmitting: vi.fn(),
  formResetKey: 0,
  setFormResetKey: vi.fn(),
  distributorUser: null,
  isDistributorRoute: false,
  isDirectRoute: true,
  isCorporateReport: false,
  isDistributorReport: false,
  isReportRoute: false,
  isViewOnlyReport: false,
  location: { pathname: '/corporate/new-order' },
  navigate: vi.fn(),
  dbTotals: null,
  setDbTotals: vi.fn(),
  userRole: 'corporate',
  isTamilNaduState: () => true,
}

// ==========================
// SETUP
// ==========================

beforeEach(() => {
  vi.clearAllMocks()
  useOrderFormHook.mockReturnValue(baseHookState)
  window.confirm = vi.fn(() => true)
})

// ==========================
// TESTS
// ==========================

describe('NewOrder Component', () => {
  it('renders header, table and footer', () => {
    render(
      <MemoryRouter>
        <NewOrder />
      </MemoryRouter>
    )

    expect(screen.getByTestId('order-header')).toBeInTheDocument()
    expect(screen.getByTestId('order-table')).toBeInTheDocument()
    expect(screen.getByTestId('order-footer')).toBeInTheDocument()
  })

  it('generates order number in create mode', () => {
    render(
      <MemoryRouter>
        <NewOrder />
      </MemoryRouter>
    )

    expect(baseHookState.setOrderNumber).toHaveBeenCalled()
  })

  it('prevents submit when no items exist', async () => {
    const { toast } = await import('react-toastify')

    render(
      <MemoryRouter>
        <NewOrder />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No items in the order.')
    })
  })

  it('submits order when valid data exists', async () => {
    api.post.mockResolvedValueOnce({
      data: { success: true },
    })

    useOrderFormHook.mockReturnValue({
      ...baseHookState,
      orderData: [
        {
          itemCode: 'I001',
          itemName: 'Item 1',
          hsn: '1234',
          gst: 18,
          sgst: 9,
          cgst: 9,
          igst: 0,
          itemQty: 1,
          uom: 'Nos',
          rate: 100,
          amount: 100,
          netRate: 100,
          grossAmount: 100,
          delivery_date: '2026-01-02',
          delivery_mode: 'Truck',
        },
      ],
    })

    render(
      <MemoryRouter>
        <NewOrder />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled()
    })
  })

  it('handles back navigation confirmation', () => {
    const onBack = vi.fn(() => {
        window.confirm('Are you sure?')
    })

    render(
      <MemoryRouter>
        <NewOrder onBack={onBack} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Back'))

    expect(window.confirm).toHaveBeenCalled()
  })
})
