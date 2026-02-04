import { describe, it, expect } from 'vitest'
import stockItemReducer, { setModeStockItemData, updateFieldStockItemData } from '../../redux/slices/stockItemSlice.js'
import { fetchAllStockItems, fetchStockItemByItemCode } from '../../redux/thunks/stockItemThunks.js'

describe('Stock Item Slice', () => {
  const initialState = {
    stockItemData: {
      itemCode: '',
      stockItemName: '',
      hsnCode: '',
      gst: '',
      uom: '',
      rate: '',
    },
    mode: 'create',
    loading: false,
    error: null
  }

  it('should return the initial state', () => {
    expect(stockItemReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  describe('Reducers', () => {
    it('should set mode to "create" and reset stockItemData', () => {
      const modifiedState = {
        ...initialState,
        stockItemData: { itemCode: '123', stockItemName: 'Test' },
        mode: 'update'
      }
      const state = stockItemReducer(modifiedState, setModeStockItemData('create'))
      expect(state.mode).toBe('create')
      expect(state.stockItemData).toEqual(initialState.stockItemData)
    })

    it('should update mode to "update" without resetting stockItemData', () => {
      const state = stockItemReducer(initialState, setModeStockItemData('update'))
      expect(state.mode).toBe('update')
      expect(state.stockItemData).toEqual(initialState.stockItemData)
    })

    it('should update a field in stockItemData', () => {
      const action = updateFieldStockItemData({ name: 'stockItemName', value: 'Laptop' })
      const state = stockItemReducer(initialState, action)
      expect(state.stockItemData.stockItemName).toBe('Laptop')
    })
  })

  describe('Extra reducers', () => {
    it('should handle fetchAllStockItems.pending', () => {
      const action = { type: fetchAllStockItems.pending.type }
      const state = stockItemReducer(initialState, action)
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchAllStockItems.fulfilled', () => {
      const payload = { itemCode: '001', stockItemName: 'Test Item' }
      const action = { type: fetchAllStockItems.fulfilled.type, payload }
      const state = stockItemReducer(initialState, action)
      expect(state.loading).toBe(false)
      expect(state.stockItemData).toEqual(payload)
    })

    it('should handle fetchAllStockItems.rejected', () => {
      const action = { type: fetchAllStockItems.rejected.type, error: { message: 'Error fetching' } }
      const state = stockItemReducer(initialState, action)
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Error fetching')
    })

    it('should handle fetchStockItemByItemCode.pending', () => {
      const action = { type: fetchStockItemByItemCode.pending.type }
      const state = stockItemReducer(initialState, action)
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchStockItemByItemCode.fulfilled', () => {
      const payload = { itemCode: '002', stockItemName: 'Another Item' }
      const action = { type: fetchStockItemByItemCode.fulfilled.type, payload }
      const state = stockItemReducer(initialState, action)
      expect(state.loading).toBe(false)
      expect(state.stockItemData).toEqual(payload)
    })

    it('should handle fetchStockItemByItemCode.rejected', () => {
      const action = { type: fetchStockItemByItemCode.rejected.type, error: { message: 'Error fetching by code' } }
      const state = stockItemReducer(initialState, action)
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Error fetching by code')
    })
  })
})
