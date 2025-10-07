import { useState, useEffect } from 'react'
import './App.css'
import PolynomialWidget from './components/PolynomialWidget'

function App() {
  const [data, setData] = useState({
    sessionVWAP: null,
    ma9: null,
    lastTrade: null,
    callBid: null,
    callAsk: null,
    putBid: null,
    putAsk: null,
    dataPoints: 0,
    historyData: null
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [logs, setLogs] = useState([])
  const [showLogs, setShowLogs] = useState(false)

  // Add log entry
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = { timestamp, message, type }
    setLogs(prevLogs => [...prevLogs.slice(-19), logEntry]) // Keep only last 20 logs
  }

  // Fetch data from backend API
  const fetchData = async () => {
    try {
      setError(null)

      // Determine API base URL based on environment
      const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'https://backend-4wurip1xp-makaminski1337.vercel.app'

      addLog(`Fetching data from ${API_BASE_URL}`)

      // Fetch current QQQ data
      const qqqResponse = await fetch(`${API_BASE_URL}/qqq-data`)
      addLog(`QQQ data response status: ${qqqResponse.status}`)
      if (!qqqResponse.ok) throw new Error(`Failed to fetch QQQ data: ${qqqResponse.status}`)
      const qqqData = await qqqResponse.json()
      addLog('QQQ data received:', qqqData)

      // Fetch data count
      const countResponse = await fetch(`${API_BASE_URL}/data-count`)
      addLog(`Data count response status: ${countResponse.status}`)
      if (!countResponse.ok) throw new Error(`Failed to fetch data count: ${countResponse.status}`)
      const countData = await countResponse.json()
      addLog('Data count received:', countData)

      // Fetch historical data for chart
      const historyResponse = await fetch(`${API_BASE_URL}/qqq-history?days=3`)
      addLog(`History response status: ${historyResponse.status}`)
      if (!historyResponse.ok) throw new Error(`Failed to fetch history data: ${historyResponse.status}`)
      const historyData = await historyResponse.json()
      addLog('History data received:', historyData)

      setData({
        sessionVWAP: qqqData.session_vwap,
        ma9: qqqData.ma9,
        lastTrade: qqqData.last_trade,
        callBid: qqqData.call_bid,
        callAsk: qqqData.call_ask,
        putBid: qqqData.put_bid,
        putAsk: qqqData.put_ask,
        dataPoints: countData.data_points,
        historyData: historyData
      })

      addLog('Data update completed successfully')

    } catch (err) {
      const errorMessage = `Error: ${err.message}`
      setError(errorMessage)
      addLog(errorMessage, 'error')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount and set up polling
  useEffect(() => {
    addLog('Application starting up...')
    addLog(`Running in ${window.location.hostname === 'localhost' ? 'development' : 'production'} mode`)

    fetchData() // Initial fetch

    // Set up polling every 5 seconds
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [])

  const headerBoxes = [
    { label: 'Session VWAP', value: data.sessionVWAP, color: '#3b82f6' },
    { label: 'MA9', value: data.ma9, color: '#10b981' },
    { label: 'Last_Trade', value: data.lastTrade, color: '#f59e0b' },
    { label: 'Call Bid', value: data.callBid, color: '#ef4444' },
    { label: 'Call Ask', value: data.callAsk, color: '#ec4899' },
    { label: 'Put Bid', value: data.putBid, color: '#8b5cf6' },
    { label: 'Put Ask', value: data.putAsk, color: '#06b6d4' },
    { label: 'Data Points', value: data.dataPoints, color: '#84cc16' }
  ]

  return (
    <div className="app">
      <header className="header">
        {headerBoxes.map((box, index) => (
          <div key={index} className="header-box" style={{ backgroundColor: box.color }}>
            <div className="header-label">{box.label}</div>
            <div className="header-value">{box.value}</div>
          </div>
        ))}
      </header>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Logs Display Toggle */}
      <div className="logs-toggle">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="logs-button"
        >
          {showLogs ? 'Hide Logs' : 'Show Logs'}
        </button>
      </div>

      {/* Logs Panel */}
      {showLogs && (
        <div className="logs-panel">
          <h3>Application Logs</h3>
          <div className="logs-container">
            {logs.length === 0 ? (
              <div className="no-logs">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry log-${log.type}`}>
                  <span className="log-timestamp">{log.timestamp}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <main className="main-content">
        <PolynomialWidget historyData={data.historyData} loading={loading} />
      </main>
    </div>
  )
}

export default App
