import { describe, it, expect, vi, beforeEach } from 'vitest'
import schwabService from '../schwabService.js'

// Mock Supabase
vi.mock('../../utils/supabase.js', () => ({
  TABLES: {
    EQUITY_DATA: 'equity_data',
    OPTIONS_DATA: 'options_data'
  },
  dbHelpers: {
    insert: vi.fn(() => Promise.resolve([{ id: 1 }]))
  }
}))

describe('SchwabService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialize', () => {
    it('should initialize successfully with valid credentials', async () => {
      // Mock environment variables
      vi.stubEnv('VITE_SCHWAB_API_KEY', 'test-key')
      vi.stubEnv('VITE_SCHWAB_API_SECRET', 'test-secret')

      const result = await schwabService.initialize()
      expect(result).toBe(true)
    })

    it('should throw error with missing credentials', async () => {
      // Mock missing environment variables
      vi.stubEnv('VITE_SCHWAB_API_KEY', '')
      vi.stubEnv('VITE_SCHWAB_API_SECRET', '')

      await expect(schwabService.initialize()).rejects.toThrow('Schwab API credentials not configured')
    })
  })

  describe('downloadEquityData', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_SCHWAB_API_KEY', 'test-key')
      vi.stubEnv('VITE_SCHWAB_API_SECRET', 'test-secret')
    })

    it('should download and store equity data', async () => {
      const symbols = ['AAPL', 'GOOGL']

      const result = await schwabService.downloadEquityData(symbols)

      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('symbol', 'AAPL')
      expect(result[0]).toHaveProperty('price')
      expect(result[0]).toHaveProperty('volume')
      expect(result[0]).toHaveProperty('timestamp')
      expect(result[0]).toHaveProperty('source', 'schwab_api')
    })

    it('should handle empty symbols array', async () => {
      const result = await schwabService.downloadEquityData([])
      expect(result).toEqual([])
    })
  })

  describe('downloadOptionsData', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_SCHWAB_API_KEY', 'test-key')
      vi.stubEnv('VITE_SCHWAB_API_SECRET', 'test-secret')
    })

    it('should download and store options data', async () => {
      const symbols = ['AAPL']

      const result = await schwabService.downloadOptionsData(symbols)

      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('symbol', 'AAPL')
      expect(result[0]).toHaveProperty('strike')
      expect(result[0]).toHaveProperty('type')
      expect(result[0]).toHaveProperty('bid')
      expect(result[0]).toHaveProperty('ask')
      expect(result[0]).toHaveProperty('volume')
      expect(result[0]).toHaveProperty('open_interest')
      expect(result[0]).toHaveProperty('timestamp')
      expect(result[0]).toHaveProperty('source', 'schwab_api')
    })
  })

  describe('getRealTimeQuotes', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_SCHWAB_API_KEY', 'test-key')
      vi.stubEnv('VITE_SCHWAB_API_SECRET', 'test-secret')
    })

    it('should fetch real-time quotes', async () => {
      const symbols = ['AAPL', 'GOOGL']

      const result = await schwabService.getRealTimeQuotes(symbols)

      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('symbol', 'AAPL')
      expect(result[0]).toHaveProperty('price')
      expect(result[0]).toHaveProperty('change')
      expect(result[0]).toHaveProperty('volume')
      expect(result[0]).toHaveProperty('timestamp')
    })
  })

  describe('validateConnection', () => {
    it('should return true for valid connection', async () => {
      const result = await schwabService.validateConnection()
      expect(result).toBe(true)
    })
  })
})

