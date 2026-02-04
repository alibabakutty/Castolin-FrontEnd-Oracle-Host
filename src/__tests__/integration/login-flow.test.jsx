import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// 🔴 MOCK AUTH HOOK (MOST IMPORTANT)
vi.mock('../../context/authConstants', () => ({
  useAuth: vi.fn()
}))

import { useAuth } from '../../context/authConstants'
import ProtectedRoutes from '../../context/ProtectedRoutes'

// ---- MOCK PAGES ---- //
const Home = () => (
  <div>
    <h1>Welcome</h1>
    <button>Admin Login</button>
    <button>Direct Order Login</button>
    <button>Distributor Login</button>
  </div>
)

const AdminDashboard = () => (
  <div>
    <h1>Admin Dashboard</h1>
    <button>Logout</button>
  </div>
)

const Unauthorized = () => <h1>Unauthorized</h1>

// ---- RENDER HELPER ---- //
const renderApp = (initialRoute = '/') => {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoutes roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Login Flow (ProtectedRoutes)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // -----------------------------
  // ❌ NOT LOGGED IN
  // -----------------------------
  it('redirects to home when user is not logged in', async () => {
    useAuth.mockReturnValue({
      user: null,
      role: null
    })

    renderApp('/admin')

    await waitFor(() => {
      expect(screen.getByText(/admin login/i)).toBeInTheDocument()
    })
  })

  // -----------------------------
  // ✅ ADMIN LOGGED IN
  // -----------------------------
  it('allows admin to access admin dashboard', async () => {
    useAuth.mockReturnValue({
      user: { uid: '123' },
      role: 'admin'
    })

    renderApp('/admin')

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /admin dashboard/i })
      ).toBeInTheDocument()
    })
  })

  // -----------------------------
  // 🚫 WRONG ROLE
  // -----------------------------
  it('redirects non-admin users to unauthorized', async () => {
    useAuth.mockReturnValue({
      user: { uid: '123' },
      role: 'corporate'
    })

    renderApp('/admin')

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /unauthorized/i })
      ).toBeInTheDocument()
    })
  })
})
