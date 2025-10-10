import { useState, useEffect } from 'react'
import databaseService from './services/databaseService.js'
import schwabService from './services/schwabService.js'
import { isSupabaseConfigured } from './utils/supabase.js'
import './App.css'

function App() {
  const [equityData, setEquityData] = useState([])
  const [optionsData, setOptionsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('equity')
  const [configError, setConfigError] = useState(null)

  useEffect(() => {
    // Initialize data fetch
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured) {
        setConfigError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
        setLoading(false)
        return
      }
      
      await Promise.all([
        fetchEquityData(),
        fetchOptionsData()
      ])
    } catch (error) {
      console.error('Error fetching initial data:', error)
      setConfigError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchEquityData = async () => {
    try {
      const data = await databaseService.getLatestData(20, 'equity_data')
      setEquityData(data)
    } catch (error) {
      console.error('Error fetching equity data:', error)
      setEquityData([])
    }
  }

  const fetchOptionsData = async () => {
    try {
      const data = await databaseService.getLatestData(20, 'options_data')
      setOptionsData(data)
    } catch (error) {
      console.error('Error fetching options data:', error)
      setOptionsData([])
    }
  }

  const downloadSchwabData = async () => {
    try {
      setLoading(true)
      // Download sample equity data
      await schwabService.downloadEquityData(['AAPL', 'GOOGL', 'MSFT'])

      // Download sample options data
      await schwabService.downloadOptionsData(['AAPL', 'GOOGL'])

      // Refresh the display data
      await fetchInitialData()
    } catch (error) {
      console.error('Error downloading Schwab data:', error)
      alert('Error downloading data from Schwab API')
    } finally {
      setLoading(false)
    }
  }

  const currentData = activeTab === 'equity' ? equityData : optionsData

  return (
    <div className="app">
      <header className="app-header">
        <h1>Alpha Kite - Financial Data Dashboard</h1>
        <p>Real-time options and equity data from Schwab API</p>
      </header>

      <main className="app-main">
        {configError && (
          <div className="config-error">
            <h3>⚠️ Configuration Error</h3>
            <p>{configError}</p>
          </div>
        )}
        
        <div className="services-section">
          <h2>Available Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>1. Schwab Data Downloader</h3>
              <p>Downloads equity and options data from Schwab API</p>
              <button onClick={downloadSchwabData} disabled={loading}>
                {loading ? 'Downloading...' : 'Download Data'}
              </button>
            </div>

            <div className="service-card">
              <h3>2. Supabase CRUD</h3>
              <p>Database operations for storing and retrieving financial data</p>
              <button onClick={fetchInitialData} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Database'}
              </button>
            </div>

            <div className="service-card">
              <h3>3. Data Display</h3>
              <p>Real-time display of options and equity data</p>
              <button onClick={fetchInitialData} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Display'}
              </button>
            </div>
          </div>
        </div>

        <div className="data-section">
          <div className="data-tabs">
            <button
              className={`tab-button ${activeTab === 'equity' ? 'active' : ''}`}
              onClick={() => setActiveTab('equity')}
            >
              Equity Data
            </button>
            <button
              className={`tab-button ${activeTab === 'options' ? 'active' : ''}`}
              onClick={() => setActiveTab('options')}
            >
              Options Data
            </button>
          </div>

          <h2>{activeTab === 'equity' ? 'Equity' : 'Options'} Data Overview</h2>
          {loading ? (
            <p>Loading data...</p>
          ) : currentData.length === 0 ? (
            <p>No data available. Use the Schwab Data Downloader to fetch data.</p>
          ) : (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    {activeTab === 'equity' ? (
                      <>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Volume</th>
                        <th>Timestamp</th>
                      </>
                    ) : (
                      <>
                        <th>Symbol</th>
                        <th>Strike</th>
                        <th>Type</th>
                        <th>Bid</th>
                        <th>Ask</th>
                        <th>Timestamp</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, index) => (
                    <tr key={index}>
                      {activeTab === 'equity' ? (
                        <>
                          <td>{item.symbol || 'N/A'}</td>
                          <td>${item.price?.toFixed(2) || '0.00'}</td>
                          <td>{item.volume?.toLocaleString() || '0'}</td>
                          <td>{item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}</td>
                        </>
                      ) : (
                        <>
                          <td>{item.symbol || 'N/A'}</td>
                          <td>${item.strike?.toFixed(2) || '0.00'}</td>
                          <td>{item.type || 'N/A'}</td>
                          <td>${item.bid?.toFixed(2) || '0.00'}</td>
                          <td>${item.ask?.toFixed(2) || '0.00'}</td>
                          <td>{item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Alpha Kite - Financial Data Platform</p>
      </footer>
    </div>
  )
}

export default App
