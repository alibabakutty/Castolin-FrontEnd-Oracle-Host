import { describe, it, expect, vi } from 'vitest'
import {
  generateClientSideOrderNumber,
  formatCurrency,
  formatDateToDDMMYYYYSimple,
  validateFutureDate,
  convertToMySQLDate,
  formatDateForInput,
  formatDate,
  formatOracleDate,
  convertToOracleDateString
} from '../../../../components/orders-page/orderUtils'

describe('Order Utils', () => {
  describe('generateClientSideOrderNumber', () => {
    it('generates order number with SQ prefix', () => {
      const orderNo = generateClientSideOrderNumber()
      expect(orderNo).toMatch(/^SQ-\d{2}-\d{2}-\d{2}-\d{4}$/)
    })

    it('generates unique order numbers', () => {
      const a = generateClientSideOrderNumber()
      const b = generateClientSideOrderNumber()
      expect(a).not.toBe(b)
    })
  })

  describe('formatCurrency', () => {
    it('formats number as INR currency', () => {
      expect(formatCurrency(1000)).toBe('₹ 1,000.00')
    })

    it('handles zero and undefined', () => {
      expect(formatCurrency(0)).toBe('₹ 0.00')
      expect(formatCurrency()).toBe('₹ 0.00')
    })
  })

  describe('formatDateToDDMMYYYYSimple', () => {
    it('formats YYYY-MM-DD to DD-MM-YYYY', () => {
      expect(formatDateToDDMMYYYYSimple('2024-01-15')).toBe('15-01-2024')
    })

    it('returns same value if already formatted', () => {
      expect(formatDateToDDMMYYYYSimple('15-01-2024')).toBe('15-01-2024')
    })

    it('returns empty string for invalid input', () => {
      expect(formatDateToDDMMYYYYSimple(null)).toBe('')
    })
  })

  describe('validateFutureDate', () => {
    it('returns true for future date', () => {
      const futureDate = '31-12-2099'
      expect(validateFutureDate(futureDate)).toBe(true)
    })

    it('returns false for past date', () => {
      const pastDate = '01-01-2000'
      expect(validateFutureDate(pastDate)).toBe(false)
    })
  })

  describe('convertToMySQLDate', () => {
    it('converts DD-MM-YYYY to YYYY-MM-DD', () => {
      expect(convertToMySQLDate('15-01-2024')).toBe('2024-01-15')
    })

    it('returns same value if already MySQL format', () => {
      expect(convertToMySQLDate('2024-01-15')).toBe('2024-01-15')
    })

    it('returns null for invalid input', () => {
      expect(convertToMySQLDate(null)).toBeNull()
    })
  })

  describe('formatDateForInput', () => {
    it('formats date for input field', () => {
      expect(formatDateForInput('2024-01-15T10:30:00Z')).toBe('2024-01-15')
    })
  })

  describe('formatDate', () => {
    it('formats ISO date to DD-MM-YYYY', () => {
      expect(formatDate('2024-01-15')).toBe('15-01-2024')
    })
  })

  describe('formatOracleDate', () => {
    it('formats oracle ISO date', () => {
      expect(formatOracleDate('2024-01-15T10:30:00Z')).toBe('15-01-2024')
    })
  })

  describe('convertToOracleDateString', () => {
    it('converts DD-MM-YYYY to YYYY-MM-DD', () => {
      expect(convertToOracleDateString('15-01-2024')).toBe('2024-01-15')
    })

    it('returns null for invalid format', () => {
      expect(convertToOracleDateString('invalid')).toBeNull()
    })
  })
})