import { describe, it, expect, vi, beforeEach } from 'vitest'

// 🔥 MOCK firebase/auth
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}))

// 🔥 MOCK firebaseConfig
vi.mock('../../../auth/firebaseConfig', () => ({
  auth: { currentUser: null }
}))

import {
  signup,
  login,
  authState,
  logout
} from '../../../auth/auth.js'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

describe('Firebase Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signup', () => {
    it('calls createUserWithEmailAndPassword with auth, email and password', async () => {
      createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } })

      const result = await signup('test@test.com', 'password123')

      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1)
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'test@test.com',
        'password123'
      )
      expect(result).toEqual({ user: { uid: '123' } })
    })
  })

  describe('login', () => {
    it('calls signInWithEmailAndPassword with auth, email and password', async () => {
      signInWithEmailAndPassword.mockResolvedValue({ user: { uid: '456' } })

      const result = await login('login@test.com', 'pass123')

      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1)
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'login@test.com',
        'pass123'
      )
      expect(result).toEqual({ user: { uid: '456' } })
    })
  })

  describe('authState', () => {
    it('registers onAuthStateChanged listener', () => {
      const callback = vi.fn()
      const unsubscribe = vi.fn()

      onAuthStateChanged.mockReturnValue(unsubscribe)

      const result = authState(callback)

      expect(onAuthStateChanged).toHaveBeenCalledTimes(1)
      expect(onAuthStateChanged).toHaveBeenCalledWith(
        expect.any(Object),
        callback
      )
      expect(result).toBe(unsubscribe)
    })
  })

  describe('logout', () => {
    it('calls signOut with auth', async () => {
      signOut.mockResolvedValue()

      await logout()

      expect(signOut).toHaveBeenCalledTimes(1)
      expect(signOut).toHaveBeenCalledWith(expect.any(Object))
    })
  })
})
