import { vi } from 'vitest'

export const mockLogin = vi.fn()
export const mockLoginCorporate = vi.fn()
export const mockLoginDistributor = vi.fn()

vi.mock('../../../../src/context/authConstants', () => ({
  useAuth: () => ({
    login: mockLogin,
    loginCorporate: mockLoginCorporate,
    loginDistributor: mockLoginDistributor,
  }),
}))
