import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DistributorDashboard from '../../../../components/dashboard/DistributorDashboard'
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

// Mock child components
vi.mock('../../../../components/orders-page/NewOrder', () => ({
  default: ({ onBack }) => (
    <div>
      <h2>New Order Page</h2>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}))

vi.mock('../../../../components/reports-page/ViewFetchDistributor', () => ({
  default: ({ onBack }) => (
    <div>
      <h2>Distributor Sales Report Page</h2>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}))

// ------------------
// Test Wrapper
// ------------------

const mockUser = {
  displayName: 'Distributor User',
  email: 'distributor@test.com',
  role: 'Distributor',
  state: 'KA',
}

const renderDashboard = () =>
  render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <MemoryRouter>
        <DistributorDashboard />
      </MemoryRouter>
    </AuthContext.Provider>
  )

// ------------------
// Tests
// ------------------

describe('DistributorDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders distributor dashboard title', () => {
    renderDashboard()

    expect(
      screen.getByText('Distributor Dashboard')
    ).toBeInTheDocument()
  })

  it('shows logged-in distributor user info', () => {
    renderDashboard()

    expect(screen.getByText('Distributor User')).toBeInTheDocument()
    expect(screen.getByText('Distributor')).toBeInTheDocument()
    expect(screen.getByText('KA')).toBeInTheDocument()
  })

  it('opens New Order page when Orders Place button is clicked', () => {
    renderDashboard()

    fireEvent.click(screen.getByText('Orders Place'))

    expect(
      screen.getByText('New Order Page')
    ).toBeInTheDocument()
  })

  it('opens Distributor Sales Report page when Sales Reports button is clicked', () => {
    renderDashboard()

    fireEvent.click(screen.getByText('Sales Reports'))

    expect(
      screen.getByText('Distributor Sales Report Page')
    ).toBeInTheDocument()
  })

  it('logs out when Logout button is clicked and confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderDashboard()

    fireEvent.click(screen.getByText('Logout'))

    const { logout } = await import('../../../../auth/auth')
    expect(logout).toHaveBeenCalled()
  })

  it('does not logout if confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    renderDashboard()

    fireEvent.click(screen.getByText('Logout'))

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('logs out when Escape key is pressed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderDashboard()

    fireEvent.keyDown(document, { key: 'Escape' })

    const { logout } = await import('../../../../auth/auth')
    expect(logout).toHaveBeenCalled()
  })
})
