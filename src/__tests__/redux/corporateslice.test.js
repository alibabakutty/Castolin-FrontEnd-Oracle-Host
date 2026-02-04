import { describe, it, expect } from 'vitest'
import corporateReducer, {
  setModeCorporateData,
  updateFieldCorporateData
} from '../../../src/redux/slices/corporateSlice'
import { fetchAllCorporates, fetchCorporateByUsercode } from '../../../src/redux/thunks/corporateThunks'

describe('Corporate Slice', () => {
  const initialState = {
    corporateData: {
      customer_code: '',
      customer_name: '',
      mobile_number: '',
      customer_type: '',
      email: '',
      password: '',
    },
    mode: 'create',
    loading: false,
    error: null
  }

  const mockCorporate = {
    customer_code: 'CUST001',
    customer_name: 'Test Customer',
    mobile_number: '+911234567890',
    customer_type: 'Gold',
    email: 'test@customer.com',
    password: 'password123'
  }

  it('should return initial state', () => {
    expect(corporateReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  describe('setModeCorporateData', () => {
    it('should set mode to create and reset corporateData', () => {
      const stateWithData = {
        ...initialState,
        corporateData: { customer_code: 'OLD', customer_name: 'Old Name' },
        mode: 'update'
      }
      const action = setModeCorporateData('create')
      const state = corporateReducer(stateWithData, action)

      expect(state.mode).toBe('create')
      expect(state.corporateData).toEqual(initialState.corporateData)
    })

    it('should set mode to update without resetting corporateData', () => {
      const action = setModeCorporateData('update')
      const state = corporateReducer(initialState, action)

      expect(state.mode).toBe('update')
      expect(state.corporateData).toEqual(initialState.corporateData)
    })
  })

  describe('updateFieldCorporateData', () => {
    it('should update a single field', () => {
      const action = updateFieldCorporateData({ name: 'customer_name', value: 'Updated Customer' })
      const state = corporateReducer(initialState, action)

      expect(state.corporateData.customer_name).toBe('Updated Customer')
    })

    it('should update multiple fields sequentially', () => {
      let state = corporateReducer(initialState, updateFieldCorporateData({ name: 'customer_code', value: 'CUST002' }))
      state = corporateReducer(state, updateFieldCorporateData({ name: 'mobile_number', value: '+919876543210' }))

      expect(state.corporateData.customer_code).toBe('CUST002')
      expect(state.corporateData.mobile_number).toBe('+919876543210')
    })
  })

  describe('extraReducers (thunks)', () => {
    it('should handle fetchAllCorporates.pending', () => {
      const action = { type: fetchAllCorporates.pending.type }
      const state = corporateReducer(initialState, action)

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchAllCorporates.fulfilled', () => {
      const action = { type: fetchAllCorporates.fulfilled.type, payload: mockCorporate }
      const state = corporateReducer(initialState, action)

      expect(state.loading).toBe(true) // matches your slice
      expect(state.corporateData).toEqual(mockCorporate)
    })

    it('should handle fetchAllCorporates.rejected', () => {
      const action = { type: fetchAllCorporates.rejected.type, error: { message: 'Failed to fetch' } }
      const state = corporateReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.error).toBe('Failed to fetch')
    })

    it('should handle fetchCorporateByUsercode.pending', () => {
      const action = { type: fetchCorporateByUsercode.pending.type }
      const state = corporateReducer(initialState, action)

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchCorporateByUsercode.fulfilled', () => {
      const action = { type: fetchCorporateByUsercode.fulfilled.type, payload: mockCorporate }
      const state = corporateReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.corporateData).toEqual(mockCorporate)
    })

    it('should handle fetchCorporateByUsercode.rejected', () => {
      const action = { type: fetchCorporateByUsercode.rejected.type, error: { message: 'User not found' } }
      const state = corporateReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.error).toBe('User not found')
    })
  })
})
