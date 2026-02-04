import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ContextProvider from '../../../context/ContextProvider'
import { useAuth } from '../../../context/authConstants'
import api from '../../../services/api'

/* ================= MOCK firebase/auth ================= */
vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual, // 👈 keeps getAuth, initializeApp, etc
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, cb) => {
      cb(null)
      return vi.fn()
    }),
  }
})

import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

/* ================= MOCK API ================= */
vi.mock('../../../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

/* ================= TEST CONSUMER ================= */
const TestComponent = () => {
  const { role, login, logout } = useAuth()

  return (
    <div>
      <span data-testid="role">{role || ''}</span>
      <button onClick={() => login('admin@test.com', '123456')}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

describe('ContextProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('provides auth context', async () => {
    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('role')).toBeInTheDocument()
    })
  })

  it('logs in admin successfully', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: '1',
        email: 'admin@test.com',
        getIdToken: vi.fn().mockResolvedValue('token'),
      },
    })

    api.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          role: 'admin',
        },
      },
    })

    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    )

    screen.getByText('login').click()

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })
  })

  it('handles login failure', async () => {
    signInWithEmailAndPassword.mockRejectedValue(
      new Error('auth/wrong-password')
    )

    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    )

    screen.getByText('login').click()

    await waitFor(() => {
      expect(api.get).not.toHaveBeenCalled()
    })
  })

  it('logs out user', async () => {
    signOut.mockResolvedValue()

    render(
      <ContextProvider>
        <TestComponent />
      </ContextProvider>
    )

    screen.getByText('logout').click()

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled()
    })
  })
})
