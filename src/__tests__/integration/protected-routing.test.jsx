import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

// 🔴 MOCK useAuth FROM authConstants (IMPORTANT)
vi.mock('../../context/authConstants', () => ({
  useAuth: vi.fn()
}))

import { useAuth } from '../../context/authConstants'
import ProtectedRoutes from '../../context/ProtectedRoutes'

// Dummy components for assertions
const Home = () => <h1>Home Page</h1>
const Unauthorized = () => <h1>Unauthorized</h1>
const AdminDashboard = () => <h1>Admin Dashboard</h1>
const CorporateDashboard = () => <h1>Corporate Dashboard</h1>

describe('ProtectedRoutes (roles-based)', () => {

  const renderWithRouter = (route, ui) => {
    const store = configureStore({
      reducer: {
        auth: (state = {}) => state
      }
    })

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            {ui}
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to home (/) when user is not authenticated', async () => {
    useAuth.mockReturnValue({
      user: null,
      role: null
    })

    renderWithRouter(
      '/admin',
      <Route
        path="/admin"
        element={
          <ProtectedRoutes roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoutes>
        }
      />
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /home page/i })
      ).toBeInTheDocument()
    })
  })

  it('redirects to /unauthorized when role is not allowed', async () => {
    useAuth.mockReturnValue({
      user: { id: 1 },
      role: 'corporate'
    })

    renderWithRouter(
      '/admin',
      <Route
        path="/admin"
        element={
          <ProtectedRoutes roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoutes>
        }
      />
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /unauthorized/i })
      ).toBeInTheDocument()
    })
  })

  it('allows access when user role matches', async () => {
    useAuth.mockReturnValue({
      user: { id: 1 },
      role: 'admin'
    })

    renderWithRouter(
      '/admin',
      <Route
        path="/admin"
        element={
          <ProtectedRoutes roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoutes>
        }
      />
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /admin dashboard/i })
      ).toBeInTheDocument()
    })
  })

  it('allows access when multiple roles are allowed', async () => {
    useAuth.mockReturnValue({
      user: { id: 2 },
      role: 'corporate'
    })

    renderWithRouter(
      '/dashboard',
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes roles={['admin', 'corporate']}>
            <CorporateDashboard />
          </ProtectedRoutes>
        }
      />
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /corporate dashboard/i })
      ).toBeInTheDocument()
    })
  })
})
