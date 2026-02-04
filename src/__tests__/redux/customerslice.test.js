import { describe, it, expect } from 'vitest'
import customerReducer, {
  setModeCustomerData,
  updateFieldCustomerData
} from '../../../src/redux/slices/customerSlice'
import { fetchAllCustomers, fetchCustomerByCustomerCode } from '../../../src/redux/thunks/customerThunks'

describe('Customer Slice', () => {
  const initialState = {
    customerData: {
      customer_code: '',
      customer_name: '',
      mobile_number: '',
      email: '',
      customer_type: '',
    },
    mode: 'create',
    loading: false,
    error: null
  }

  const mockCustomer = {
    customer_code: 'CUST001',
    customer_name: 'Test Customer',
    mobile_number: '+911234567890',
    email: 'test@customer.com',
    customer_type: 'Gold'
  }

  it('should return initial state', () => {
    expect(customerReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  describe('setModeCustomerData', () => {
    it('should set mode to create and reset customerData', () => {
      const stateWithData = {
        ...initialState,
        customerData: { customer_code: 'OLD', customer_name: 'Old Name' },
        mode: 'update'
      }
      const action = setModeCustomerData('create')
      const state = customerReducer(stateWithData, action)

      expect(state.mode).toBe('create')
      expect(state.customerData).toEqual(initialState.customerData)
    })

    it('should set mode to update without resetting customerData', () => {
      const action = setModeCustomerData('update')
      const state = customerReducer(initialState, action)

      expect(state.mode).toBe('update')
      expect(state.customerData).toEqual(initialState.customerData)
    })
  })

  describe('updateFieldCustomerData', () => {
    it('should update a single field', () => {
      const action = updateFieldCustomerData({ name: 'customer_name', value: 'Updated Customer' })
      const state = customerReducer(initialState, action)

      expect(state.customerData.customer_name).toBe('Updated Customer')
    })

    it('should update multiple fields sequentially', () => {
      let state = customerReducer(initialState, updateFieldCustomerData({ name: 'customer_code', value: 'CUST002' }))
      state = customerReducer(state, updateFieldCustomerData({ name: 'mobile_number', value: '+919876543210' }))

      expect(state.customerData.customer_code).toBe('CUST002')
      expect(state.customerData.mobile_number).toBe('+919876543210')
    })
  })

  describe('extraReducers (thunks)', () => {
    it('should handle fetchAllCustomers.pending', () => {
      const action = { type: fetchAllCustomers.pending.type }
      const state = customerReducer(initialState, action)

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchAllCustomers.fulfilled', () => {
      const action = { type: fetchAllCustomers.fulfilled.type, payload: mockCustomer }
      const state = customerReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.customerData).toEqual(mockCustomer)
    })

    it('should handle fetchAllCustomers.rejected', () => {
      const action = { type: fetchAllCustomers.rejected.type, error: { message: 'Failed to fetch' } }
      const state = customerReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.error).toBe('Failed to fetch')
    })

    it('should handle fetchCustomerByCustomerCode.pending', () => {
      const action = { type: fetchCustomerByCustomerCode.pending.type }
      const state = customerReducer(initialState, action)

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchCustomerByCustomerCode.fulfilled', () => {
      const action = { type: fetchCustomerByCustomerCode.fulfilled.type, payload: mockCustomer }
      const state = customerReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.customerData).toEqual(mockCustomer)
    })

    it('should handle fetchCustomerByCustomerCode.rejected', () => {
      const action = { type: fetchCustomerByCustomerCode.rejected.type, error: { message: 'Customer not found' } }
      const state = customerReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.error).toBe('Customer not found')
    })
  })
})
