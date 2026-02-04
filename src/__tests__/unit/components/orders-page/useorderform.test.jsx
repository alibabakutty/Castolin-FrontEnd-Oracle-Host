import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useOrderFormHook } from '../../../../components/orders-page/useOrderFormHook';
import { AuthContext } from '../../../../context/authConstants';

/* ------------------------------------------------------------------ */
/* MOCK react-router-dom (ESM SAFE) */
/* ------------------------------------------------------------------ */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: vi.fn(), // 👈 MUST be mocked
  };
});

import { useLocation } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/* HELPER: Wrapper with Auth + Router */
/* ------------------------------------------------------------------ */
const createWrapper = ({ user = null, distributorUser = null, route = '/' } = {}) => {
  useLocation.mockReturnValue({ pathname: route });

  return ({ children }) => (
    <AuthContext.Provider value={{ user, distributorUser }}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </AuthContext.Provider>
  );
};

/* ------------------------------------------------------------------ */
/* TESTS */
/* ------------------------------------------------------------------ */
describe('useOrderFormHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const wrapper = createWrapper();

    const { result } = renderHook(() => useOrderFormHook(), { wrapper });

    expect(result.current.orderData).toEqual([]);
    expect(result.current.remarks).toBe('');
    expect(result.current.status).toBe('pending');
    expect(result.current.voucherType).toBe('Sales Order');
  });

  it('detects distributor route correctly', () => {
    const wrapper = createWrapper({
      user: { role: 'distributor' },
      distributorUser: { state: 'Tamil Nadu' },
      route: '/distributor/orders',
    });

    const { result } = renderHook(() => useOrderFormHook(), { wrapper });

    expect(result.current.isDistributorRoute).toBe(true);
    expect(result.current.isDirectRoute).toBe(false);
  });

  it('detects corporate route correctly', () => {
    const wrapper = createWrapper({
      user: { role: 'corporate' },
      route: '/corporate/orders',
    });

    const { result } = renderHook(() => useOrderFormHook(), { wrapper });

    expect(result.current.isDirectRoute).toBe(true);
    expect(result.current.isDistributorRoute).toBe(false);
  });

  it('returns correct userRole (admin)', () => {
    const wrapper = createWrapper({
      user: { role: 'ADMIN' },
    });

    const { result } = renderHook(() => useOrderFormHook(), { wrapper });

    expect(result.current.userRole).toBe('admin');
  });

  it('admin + Tamil Nadu customer → uses SGST/CGST', () => {
    const wrapper = createWrapper({
      user: { role: 'admin' },
      route: '/admin/orders',
    });

    const { result } = renderHook(() => useOrderFormHook(), { wrapper });

    act(() => {
      result.current.setSelectedCustomer({ state: 'Tamil Nadu' });
    });

    // After act(), the memoized function sees the updated selectedCustomer
    expect(result.current.isTamilNaduState()).toBe(true);
  });

  it('admin + non-TN customer → uses IGST', () => {
    const wrapper = createWrapper({
      user: { role: 'admin' },
    });

    const { result } = renderHook(() => useOrderFormHook(), { wrapper });

    act(() => {
      result.current.setSelectedCustomer({ state: 'Kerala' });
    });

    expect(result.current.isTamilNaduState()).toBe(false);
  });

  it('distributor user uses distributor state', () => {
    const wrapper = createWrapper({
      user: { role: 'distributor' },
      distributorUser: { state: 'TN' },
      route: '/distributor/orders',
    });

    const { result } = renderHook(() => useOrderFormHook(), { wrapper });

    expect(result.current.isTamilNaduState()).toBe(true);
  });

  it('report routes are detected correctly', () => {
    const wrapper = createWrapper({
      route: '/order-report-distributor',
    });

    const { result } = renderHook(() => useOrderFormHook(), { wrapper });

    expect(result.current.isReportRoute).toBe(true);
    expect(result.current.isViewOnlyReport).toBe(true);
  });
});
