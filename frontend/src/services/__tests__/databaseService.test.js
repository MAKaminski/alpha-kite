import { describe, it, expect, vi, beforeEach } from 'vitest'
import databaseService from '../databaseService.js'

// Mock Supabase
vi.mock('../../utils/supabase.js', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  },
  TABLES: {
    EQUITY_DATA: 'equity_data',
    OPTIONS_DATA: 'options_data'
  },
  dbHelpers: {
    select: vi.fn(() => Promise.resolve([])),
    insert: vi.fn(() => Promise.resolve([])),
    update: vi.fn(() => Promise.resolve([])),
    delete: vi.fn(() => Promise.resolve(true))
  }
}))

describe('DatabaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getLatestData', () => {
    it('should fetch latest equity data', async () => {
      const mockData = [
        { id: 1, symbol: 'AAPL', price: 150.00, timestamp: new Date().toISOString() },
        { id: 2, symbol: 'GOOGL', price: 2800.00, timestamp: new Date().toISOString() }
      ]

      const { supabase } = await import('../../utils/supabase.js')
      supabase.from.mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: mockData, error: null }))
          }))
        }))
      })

      const result = await databaseService.getLatestData(2, 'equity_data')
      expect(result).toEqual(mockData)
    })

    it('should handle errors gracefully', async () => {
      const { supabase } = await import('../../utils/supabase.js')
      supabase.from.mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: null, error: new Error('Database error') }))
          }))
        }))
      })

      await expect(databaseService.getLatestData(10, 'equity_data')).rejects.toThrow('Database error')
    })
  })

  describe('getDataBySymbol', () => {
    it('should fetch data for specific symbol', async () => {
      const mockData = [
        { id: 1, symbol: 'AAPL', price: 150.00 }
      ]

      const { dbHelpers } = await import('../../utils/supabase.js')
      dbHelpers.select.mockResolvedValue(mockData)

      const result = await databaseService.getDataBySymbol('AAPL', 'equity')
      expect(dbHelpers.select).toHaveBeenCalledWith('equity_data', '*', { symbol: 'AAPL' })
      expect(result).toEqual(mockData)
    })
  })

  describe('validateData', () => {
    it('should validate equity data correctly', async () => {
      const validRecord = {
        symbol: 'AAPL',
        price: 150.00,
        timestamp: new Date().toISOString()
      }

      const result = await databaseService.validateData('equity_data', validRecord)
      expect(result).toBe(true)
    })

    it('should reject invalid data', async () => {
      const invalidRecord = {
        symbol: 'AAPL'
        // Missing price and timestamp
      }

      await expect(databaseService.validateData('equity_data', invalidRecord))
        .rejects.toThrow('Missing required fields')
    })
  })
})

