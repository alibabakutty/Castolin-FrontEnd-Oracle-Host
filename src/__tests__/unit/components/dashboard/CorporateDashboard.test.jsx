import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CorporateDashboard from '../../../../components/dashboard/CorporateDashboard'
import { AuthContext } from '../../../../context/authConstants'

// ------------------
// Mocks
// ------------------

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../../../auth/auth', () => ({
  logout: vi.fn(() => Promise.resolve()),
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock child pages
vi.mock('../../../../components/orders-page/NewOrder', () => ({
  default: ({ onBack }) => (
    <div>
      <h2>New Order Page</h2>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}))

vi.mock('../../../../components/reports-page/ViewFetchCorporate', () => ({
  default: ({ onBack }) => (
    <div>
      <h2>Sales Report Page</h2>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}))

// ------------------
// Test Wrapper
// ------------------

const mockUser = {
  displayName: 'Sriram',
  email: 'sriram@test.com',
  role: 'Corporate',
  state: 'TN',
}

const renderDashboard = () =>
  render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <MemoryRouter>
        <CorporateDashboard />
      </MemoryRouter>
    </AuthContext.Provider>
  )

// ------------------
// Tests
// ------------------

describe('CorporateDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title', () => {
    renderDashboard()
    expect(
      screen.getByText('Direct Order Dashboard')
    ).toBeInTheDocument()
  })

  it('displays logged-in user info', () => {
    renderDashboard()

    expect(screen.getByText('Sriram')).toBeInTheDocument()
    expect(screen.getByText('Corporate')).toBeInTheDocument()
    expect(screen.getByText('TN')).toBeInTheDocument()
  })

  it('navigates to New Order page when Orders button is clicked', () => {
    renderDashboard()

    fireEvent.click(screen.getByText('Orders Place'))

    expect(
      screen.getByText('New Order Page')
    ).toBeInTheDocument()
  })

  it('navigates to Sales Report page when Sales Reports button is clicked', () => {
    renderDashboard()

    fireEvent.click(screen.getByText('Sales Reports'))

    expect(
      screen.getByText('Sales Report Page')
    ).toBeInTheDocument()
  })

  it('logs out when Logout button is clicked and confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderDashboard()

    fireEvent.click(screen.getByText('Logout'))

    const { logout } = await import('../../../../auth/auth')
    expect(logout).toHaveBeenCalled()
  })

  it('does NOT logout if user cancels confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    renderDashboard()

    fireEvent.click(screen.getByText('Logout'))

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
