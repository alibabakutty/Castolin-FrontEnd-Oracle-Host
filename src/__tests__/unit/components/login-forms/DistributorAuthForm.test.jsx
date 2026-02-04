import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

import DistributorAuthForm from '../../../../components/login-forms/DistributorAuthForm'
import { AuthContext } from '../../../../context/authConstants'

// --------------------
// Mocks
// --------------------
const mockNavigate = vi.fn()
const mockLoginDistributor = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}))

// --------------------
// Helper render
// --------------------
const renderForm = () => {
  return render(
    <AuthContext.Provider value={{ loginDistributor: mockLoginDistributor }}>
      <MemoryRouter>
        <DistributorAuthForm />
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

// --------------------
// Tests
// --------------------
describe('DistributorAuthForm', () => {
  it('renders login form correctly', () => {
    renderForm()

    expect(screen.getByText('Distributor Login')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Enter your username or email')
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Enter your password')
    ).toBeInTheDocument()
  })

  it('shows error toast when submitting empty form', async () => {
    renderForm()

    fireEvent.submit(
      screen.getByLabelText('distributor-login-form')
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Please enter both username and password!',
        expect.any(Object)
      )
    })
  })

  it('logs in successfully and navigates to distributor dashboard', async () => {
    mockLoginDistributor.mockResolvedValue({
      success: true,
      role: 'distributor',
    })

    renderForm()

    fireEvent.change(
      screen.getByPlaceholderText('Enter your username or email'),
      { target: { value: 'distributor@test.com' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Enter your password'),
      { target: { value: 'password123' } }
    )

    fireEvent.submit(
      screen.getByLabelText('distributor-login-form')
    )

    await waitFor(() => {
      expect(mockLoginDistributor).toHaveBeenCalledWith(
        'distributor@test.com',
        'password123'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/distributor')
    })
  })

  it('navigates to admin if role is admin', async () => {
    mockLoginDistributor.mockResolvedValue({
      success: true,
      role: 'admin',
    })

    renderForm()

    fireEvent.change(
      screen.getByPlaceholderText('Enter your username or email'),
      { target: { value: 'admin@test.com' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Enter your password'),
      { target: { value: 'password123' } }
    )

    fireEvent.submit(
      screen.getByLabelText('distributor-login-form')
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })

  it('shows error toast when login fails', async () => {
    mockLoginDistributor.mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
    })

    renderForm()

    fireEvent.change(
      screen.getByPlaceholderText('Enter your username or email'),
      { target: { value: 'wronguser' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Enter your password'),
      { target: { value: 'wrongpass' } }
    )

    fireEvent.submit(
      screen.getByLabelText('distributor-login-form')
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid credentials',
        expect.any(Object)
      )
    })
  })
})
