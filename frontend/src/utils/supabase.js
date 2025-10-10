import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Flag to track if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create client only if credentials are available, otherwise export null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

// Database table names (following Supabase conventions)
export const TABLES = {
  EQUITY_DATA: 'equity_data',
  OPTIONS_DATA: 'options_data',
  OPTIONS_MINUTE_AGGS: 'options_minute_aggs',
  OPTIONS_MINUTE_AGGS_NORMALIZED: 'options_minute_aggs_normalized'
}

// Helper functions for common database operations
export const dbHelpers = {
  // Generic insert function
  insert: async (table, data) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()

    if (error) throw error
    return result
  },

  // Generic select function
  select: async (table, columns = '*', filters = {}) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    let query = supabase.from(table).select(columns)

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query = query.in(key, value)
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([op, val]) => {
          query = query.filter(key, op, val)
        })
      } else {
        query = query.eq(key, value)
      }
    })

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Generic update function
  update: async (table, id, data) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()

    if (error) throw error
    return result
  },

  // Generic delete function
  delete: async (table, id) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

export default supabase
