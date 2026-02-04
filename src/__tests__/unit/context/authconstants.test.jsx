import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AuthContext, useAuth } from '../../../context/authConstants'

describe('authConstants', () => {
  it('returns context value when used inside AuthContext.Provider', () => {
    const mockAuthValue = {
      user: { uid: '123' },
      role: 'admin',
      login: () => {},
      logout: () => {},
    }

    const wrapper = ({ children }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toBe(mockAuthValue)
  })

  it('returns undefined when used outside AuthContext.Provider', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current).toBeUndefined()
  })
})
