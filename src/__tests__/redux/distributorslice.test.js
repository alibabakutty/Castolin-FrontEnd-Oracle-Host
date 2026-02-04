import { describe, it, expect } from 'vitest'
import distributorReducer, {
  setModeDistributorData,
  updateFieldDistributorData
} from '../../../src/redux/slices/distributorSlice'
import { fetchAllDistributors, fetchDistributorByUsercode } from '../../../src/redux/thunks/distributorThunks'

describe('Distributor Slice', () => {
  const initialState = {
    distributorData: {
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

  const mockDistributor = {
    customer_code: 'DIST001',
    customer_name: 'Test Distributor',
    mobile_number: '+911234567890',
    customer_type: 'Silver',
    email: 'test@distributor.com',
    password: 'password123'
  }

  it('should return initial state', () => {
    expect(distributorReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  describe('setModeDistributorData', () => {
    it('should set mode to create and reset distributorData', () => {
      const stateWithData = {
        ...initialState,
        distributorData: { customer_code: 'OLD', customer_name: 'Old Name' },
        mode: 'update'
      }
      const action = setModeDistributorData('create')
      const state = distributorReducer(stateWithData, action)

      expect(state.mode).toBe('create')
      expect(state.distributorData).toEqual(initialState.distributorData)
    })

    it('should set mode to update without resetting distributorData', () => {
      const action = setModeDistributorData('update')
      const state = distributorReducer(initialState, action)

      expect(state.mode).toBe('update')
      expect(state.distributorData).toEqual(initialState.distributorData)
    })
  })

  describe('updateFieldDistributorData', () => {
    it('should update a single field', () => {
      const action = updateFieldDistributorData({ name: 'customer_name', value: 'Updated Distributor' })
      const state = distributorReducer(initialState, action)

      expect(state.distributorData.customer_name).toBe('Updated Distributor')
    })

    it('should update multiple fields sequentially', () => {
      let state = distributorReducer(initialState, updateFieldDistributorData({ name: 'customer_code', value: 'DIST002' }))
      state = distributorReducer(state, updateFieldDistributorData({ name: 'mobile_number', value: '+919876543210' }))

      expect(state.distributorData.customer_code).toBe('DIST002')
      expect(state.distributorData.mobile_number).toBe('+919876543210')
    })
  })

  describe('extraReducers (thunks)', () => {
    it('should handle fetchAllDistributors.pending', () => {
      const action = { type: fetchAllDistributors.pending.type }
      const state = distributorReducer(initialState, action)

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchAllDistributors.fulfilled', () => {
      const action = { type: fetchAllDistributors.fulfilled.type, payload: mockDistributor }
      const state = distributorReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.distributorData).toEqual(mockDistributor)
    })

    it('should handle fetchAllDistributors.rejected', () => {
      const action = { type: fetchAllDistributors.rejected.type, error: { message: 'Failed to fetch' } }
      const state = distributorReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.error).toBe('Failed to fetch')
    })

    it('should handle fetchDistributorByUsercode.pending', () => {
      const action = { type: fetchDistributorByUsercode.pending.type }
      const state = distributorReducer(initialState, action)

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchDistributorByUsercode.fulfilled', () => {
      const action = { type: fetchDistributorByUsercode.fulfilled.type, payload: mockDistributor }
      const state = distributorReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.distributorData).toEqual(mockDistributor)
    })

    it('should handle fetchDistributorByUsercode.rejected', () => {
      const action = { type: fetchDistributorByUsercode.rejected.type, error: { message: 'Distributor not found' } }
      const state = distributorReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.error).toBe('Distributor not found')
    })
  })
})
