import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CorporateAuthForm from '../../../../components/login-forms/CorporateAuthForm'
import { toast } from 'react-toastify'
import { useAuth } from '../../../../context/authConstants'
import { MemoryRouter } from 'react-router-dom'

// ------------------ mocks ------------------
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../../../context/authConstants', () => ({
  useAuth: vi.fn(),
}))

// ------------------ helpers ------------------
const mockLoginCorporate = vi.fn()

const renderForm = () => {
  useAuth.mockReturnValue({
    loginCorporate: mockLoginCorporate,
  })

  return render(
    <MemoryRouter>
      <CorporateAuthForm />
    </MemoryRouter>
  )
}

// ------------------ tests ------------------
describe('CorporateAuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    renderForm()

    expect(
      screen.getByText(/direct order login/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/username or email/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument()
  })

  it('disables submit button when inputs are empty', () => {
    renderForm()

    const button = screen.getByRole('button', {
      name: /login as direct order/i,
    })

    expect(button).toBeDisabled()
  })

  it('shows error toast if form is submitted with empty fields', async () => {
    renderForm()

    // enable submit by directly submitting form
    fireEvent.submit(screen.getByRole('form', { hidden: true }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Please enter both username and password!',
        expect.any(Object)
      )
    })
  })

  it('navigates to /corporate when login succeeds with direct role', async () => {
    mockLoginCorporate.mockResolvedValue({
      success: true,
      role: 'direct',
    })

    renderForm()

    fireEvent.change(
      screen.getByPlaceholderText(/username or email/i),
      { target: { value: 'directuser' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText(/enter your password/i),
      { target: { value: 'password123' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /login as direct order/i })
    )

    await waitFor(() => {
      expect(mockLoginCorporate).toHaveBeenCalledWith(
        'directuser',
        'password123'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/corporate')
    })
  })

  it('navigates to /admin when login succeeds with admin role', async () => {
    mockLoginCorporate.mockResolvedValue({
      success: true,
      role: 'admin',
    })

    renderForm()

    fireEvent.change(
      screen.getByPlaceholderText(/username or email/i),
      { target: { value: 'adminuser' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText(/enter your password/i),
      { target: { value: 'password123' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /login as direct order/i })
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })

  it('shows error toast when login fails', async () => {
    mockLoginCorporate.mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
    })

    renderForm()

    fireEvent.change(
      screen.getByPlaceholderText(/username or email/i),
      { target: { value: 'wronguser' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText(/enter your password/i),
      { target: { value: 'wrongpass' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /login as direct order/i })
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid credentials',
        expect.any(Object)
      )
    })
  })

  it('shows error toast on API error', async () => {
    mockLoginCorporate.mockRejectedValue(
      new Error('Network error')
    )

    renderForm()

    fireEvent.change(
      screen.getByPlaceholderText(/username or email/i),
      { target: { value: 'user' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText(/enter your password/i),
      { target: { value: 'password123' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /login as direct order/i })
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Network error'
      )
    })
  })
})
