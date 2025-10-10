// Database Service - CRUD Operations for Financial Data
// This service provides comprehensive CRUD operations for all financial data tables

import { supabase, TABLES, dbHelpers } from '../utils/supabase.js'

class DatabaseService {
  // Equity Data Operations
  async getEquityData(filters = {}) {
    try {
      const data = await dbHelpers.select(TABLES.EQUITY_DATA, '*', filters)
      return data
    } catch (error) {
      console.error('Error fetching equity data:', error)
      throw error
    }
  }

  async insertEquityData(equityRecords) {
    try {
      const result = await dbHelpers.insert(TABLES.EQUITY_DATA, equityRecords)
      return result
    } catch (error) {
      console.error('Error inserting equity data:', error)
      throw error
    }
  }

  async updateEquityData(id, data) {
    try {
      const result = await dbHelpers.update(TABLES.EQUITY_DATA, id, data)
      return result
    } catch (error) {
      console.error('Error updating equity data:', error)
      throw error
    }
  }

  async deleteEquityData(id) {
    try {
      const result = await dbHelpers.delete(TABLES.EQUITY_DATA, id)
      return result
    } catch (error) {
      console.error('Error deleting equity data:', error)
      throw error
    }
  }

  // Options Data Operations
  async getOptionsData(filters = {}) {
    try {
      const data = await dbHelpers.select(TABLES.OPTIONS_DATA, '*', filters)
      return data
    } catch (error) {
      console.error('Error fetching options data:', error)
      throw error
    }
  }

  async insertOptionsData(optionsRecords) {
    try {
      const result = await dbHelpers.insert(TABLES.OPTIONS_DATA, optionsRecords)
      return result
    } catch (error) {
      console.error('Error inserting options data:', error)
      throw error
    }
  }

  async updateOptionsData(id, data) {
    try {
      const result = await dbHelpers.update(TABLES.OPTIONS_DATA, id, data)
      return result
    } catch (error) {
      console.error('Error updating options data:', error)
      throw error
    }
  }

  async deleteOptionsData(id) {
    try {
      const result = await dbHelpers.delete(TABLES.OPTIONS_DATA, id)
      return result
    } catch (error) {
      console.error('Error deleting options data:', error)
      throw error
    }
  }

  // Options Minute Aggregations Operations
  async getOptionsMinuteAggs(filters = {}) {
    try {
      const data = await dbHelpers.select(TABLES.OPTIONS_MINUTE_AGGS, '*', filters)
      return data
    } catch (error) {
      console.error('Error fetching options minute aggregations:', error)
      throw error
    }
  }

  async insertOptionsMinuteAggs(aggsRecords) {
    try {
      const result = await dbHelpers.insert(TABLES.OPTIONS_MINUTE_AGGS, aggsRecords)
      return result
    } catch (error) {
      console.error('Error inserting options minute aggregations:', error)
      throw error
    }
  }

  // Options Minute Aggregations Normalized Operations
  async getOptionsMinuteAggsNormalized(filters = {}) {
    try {
      const data = await dbHelpers.select(TABLES.OPTIONS_MINUTE_AGGS_NORMALIZED, '*', filters)
      return data
    } catch (error) {
      console.error('Error fetching normalized options minute aggregations:', error)
      throw error
    }
  }

  async insertOptionsMinuteAggsNormalized(normalizedRecords) {
    try {
      const result = await dbHelpers.insert(TABLES.OPTIONS_MINUTE_AGGS_NORMALIZED, normalizedRecords)
      return result
    } catch (error) {
      console.error('Error inserting normalized options minute aggregations:', error)
      throw error
    }
  }

  // Advanced query methods
  async getDataBySymbol(symbol, dataType = 'equity') {
    try {
      const table = dataType === 'equity' ? TABLES.EQUITY_DATA : TABLES.OPTIONS_DATA
      const data = await dbHelpers.select(table, '*', { symbol })
      return data
    } catch (error) {
      console.error(`Error fetching ${dataType} data for symbol ${symbol}:`, error)
      throw error
    }
  }

  async getDataByDateRange(startDate, endDate, table = TABLES.EQUITY_DATA) {
    try {
      const data = await dbHelpers.select(table, '*', {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      })
      return data
    } catch (error) {
      console.error(`Error fetching data from ${startDate} to ${endDate}:`, error)
      throw error
    }
  }

  async getLatestData(limit = 10, table = TABLES.EQUITY_DATA) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error fetching latest ${limit} records:`, error)
      throw error
    }
  }

  async getDataStats(table = TABLES.EQUITY_DATA) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('symbol, price, volume')
        .order('timestamp', { ascending: false })
        .limit(1000)

      if (error) throw error

      // Calculate basic statistics
      const stats = {
        totalRecords: data.length,
        uniqueSymbols: new Set(data.map(d => d.symbol)).size,
        averagePrice: data.reduce((sum, d) => sum + (d.price || 0), 0) / data.length,
        totalVolume: data.reduce((sum, d) => sum + (d.volume || 0), 0)
      }

      return stats
    } catch (error) {
      console.error('Error calculating data statistics:', error)
      throw error
    }
  }

  // Bulk operations
  async bulkInsert(table, records) {
    try {
      const batchSize = 1000 // Supabase recommended batch size
      const results = []

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize)
        const result = await dbHelpers.insert(table, batch)
        results.push(...result)
      }

      return results
    } catch (error) {
      console.error(`Error bulk inserting to ${table}:`, error)
      throw error
    }
  }

  async bulkUpdate(table, updates) {
    try {
      const results = []

      for (const update of updates) {
        const result = await dbHelpers.update(table, update.id, update.data)
        results.push(result)
      }

      return results
    } catch (error) {
      console.error(`Error bulk updating ${table}:`, error)
      throw error
    }
  }

  async bulkDelete(table, ids) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .in('id', ids)

      if (error) throw error
      return true
    } catch (error) {
      console.error(`Error bulk deleting from ${table}:`, error)
      throw error
    }
  }

  // Search and filtering
  async searchData(query, table = TABLES.EQUITY_DATA) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .or(`symbol.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(50)

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error searching in ${table}:`, error)
      throw error
    }
  }

  // Data aggregation functions
  async getPriceHistory(symbol, days = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000))

      const data = await this.getDataByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
        TABLES.EQUITY_DATA
      )

      return data.filter(d => d.symbol === symbol)
    } catch (error) {
      console.error(`Error getting price history for ${symbol}:`, error)
      throw error
    }
  }

  async getOptionsChain(symbol, expiryDate = null) {
    try {
      let filters = { symbol }
      if (expiryDate) {
        filters.expiry = expiryDate
      }

      const data = await dbHelpers.select(TABLES.OPTIONS_DATA, '*', filters)

      // Group by strike and type
      const chain = {}
      data.forEach(option => {
        const key = `${option.strike}_${option.type}`
        if (!chain[key]) {
          chain[key] = option
        }
      })

      return Object.values(chain)
    } catch (error) {
      console.error(`Error getting options chain for ${symbol}:`, error)
      throw error
    }
  }

  // Real-time data operations
  async subscribeToTable(table, callback) {
    try {
      const subscription = supabase
        .channel(`public:${table}`)
        .on('postgres_changes',
          { event: '*', schema: 'public', table },
          callback
        )
        .subscribe()

      return subscription
    } catch (error) {
      console.error(`Error subscribing to ${table}:`, error)
      throw error
    }
  }

  async unsubscribeFromTable(subscription) {
    try {
      await supabase.removeChannel(subscription)
    } catch (error) {
      console.error('Error unsubscribing from table:', error)
      throw error
    }
  }

  // Data validation and cleanup
  async validateData(table, record) {
    try {
      // Basic validation rules
      const requiredFields = {
        [TABLES.EQUITY_DATA]: ['symbol', 'price', 'timestamp'],
        [TABLES.OPTIONS_DATA]: ['symbol', 'strike', 'type', 'expiry', 'timestamp'],
        [TABLES.OPTIONS_MINUTE_AGGS]: ['timestamp', 'data'],
        [TABLES.OPTIONS_MINUTE_AGGS_NORMALIZED]: ['timestamp', 'data']
      }

      const required = requiredFields[table] || []
      const missing = required.filter(field => !record[field])

      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`)
      }

      return true
    } catch (error) {
      console.error('Data validation failed:', error)
      throw error
    }
  }

  async cleanupOldData(daysOld = 90, table = TABLES.EQUITY_DATA) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const { error } = await supabase
        .from(table)
        .delete()
        .lt('timestamp', cutoffDate.toISOString())

      if (error) throw error
      return true
    } catch (error) {
      console.error(`Error cleaning up old data from ${table}:`, error)
      throw error
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()
export default databaseService
