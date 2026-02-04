import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import AdminDashboard from '../../../../components/dashboard/AdminDashboard'

// --------------------
// MOCKS
// --------------------

// mock navigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// mock logout
const mockLogout = vi.fn()

vi.mock('../../../../auth/auth', () => ({
  logout: () => mockLogout(),
}))

// mock toast
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// mock auth context
vi.mock('../../../../context/authConstants', () => ({
  useAuth: () => ({
    user: {
      displayName: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
    },
  }),
}))

// mock sub-pages (important)
vi.mock('../../../../components/CDAPage', () => ({
  default: ({ moduleType }) => (
    <div data-testid="cda-page">CDA PAGE - {moduleType}</div>
  ),
}))

vi.mock('../../../../components/reports-page/ViewFetchReport', () => ({
  default: () => <div>FETCH REPORT PAGE</div>,
}))

vi.mock('../../../../components/reports-page/ViewItemFetchReport', () => ({
  default: () => <div>ITEM REPORT PAGE</div>,
}))

vi.mock('../../../../components/reports-page/ViewPendingFetchReport', () => ({
  default: () => <div>PENDING REPORT PAGE</div>,
}))

// --------------------
// TESTS
// --------------------

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  const renderDashboard = () =>
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )

  it('renders Admin Dashboard title', () => {
    renderDashboard()
    expect(
      screen.getByText(/admin dashboard/i)
    ).toBeInTheDocument()
  })

  it('shows logged-in user info', () => {
    renderDashboard()

    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('opens CDA page when clicking Customer Management', async () => {
    renderDashboard()

    fireEvent.click(
      screen.getByText(/customer management/i)
    )

    await waitFor(() => {
      expect(
        screen.getByTestId('cda-page')
      ).toBeInTheDocument()
      expect(
        screen.getByText(/customer/i)
      ).toBeInTheDocument()
    })
  })

  it('logs out and navigates to home', async () => {
    renderDashboard()

    fireEvent.click(
      screen.getByRole('button', { name: /logout/i })
    )

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('logs out when Escape key is pressed', async () => {
    renderDashboard()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
