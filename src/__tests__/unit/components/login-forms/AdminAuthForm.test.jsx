import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminAuthForm from '../../../../components/login-forms/AdminAuthForm'
import { AuthContext } from '../../../../context/authConstants'

// ------------------
// Mocks
// ------------------

const mockNavigate = vi.fn()
const mockLogin = vi.fn()

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
    success: vi.fn(),
  },
}))

// ------------------
// Test Wrapper
// ------------------

const renderForm = () =>
  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <AdminAuthForm />
      </MemoryRouter>
    </AuthContext.Provider>
  )

// ------------------
// Tests
// ------------------

describe('AdminAuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders admin login form', () => {
    renderForm()

    expect(screen.getByText('Admin Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
  })

  it('disables submit button when password is less than 6 characters', () => {
  renderForm()

  fireEvent.change(screen.getByPlaceholderText('Enter email'), {
    target: { value: 'admin@test.com' },
  })

  fireEvent.change(screen.getByPlaceholderText('Enter password'), {
    target: { value: '123' },
  })

  const button = screen.getByRole('button', { name: /login as admin/i })

  expect(button).toBeDisabled()
  expect(mockLogin).not.toHaveBeenCalled()
})


  it('logs in admin and navigates to /admin', async () => {
    mockLogin.mockResolvedValue({
      success: true,
      role: 'admin',
    })

    renderForm()

    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'admin@test.com' },
    })

    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /login as admin/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'admin@test.com',
        'password123'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })

  it('redirects to unauthorized if role is not admin', async () => {
    mockLogin.mockResolvedValue({
      success: true,
      role: 'distributor',
    })

    renderForm()

    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'user@test.com' },
    })

    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /login as admin/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/unauthorized')
    })
  })

  it('shows error toast when login throws error', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))

    renderForm()

    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'admin@test.com' },
    })

    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /login as admin/i }))

    const { toast } = await import('react-toastify')

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid credentials'
      )
    })
  })

  it('disables submit button when form is invalid', () => {
    renderForm()

    const button = screen.getByRole('button', { name: /login as admin/i })
    expect(button).toBeDisabled()
  })
})
