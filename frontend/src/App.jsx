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

      // Generate mock data for demo (replace with real API calls when backend is ready)
      addLog('Generating demo data for display')

      // Generate realistic QQQ data
      const basePrice = 245.0 + (Math.random() - 0.5) * 4; // Random between 243-247

      const qqqData = {
        session_vwap: Math.round(basePrice * 100) / 100,
        ma9: Math.round((basePrice - 0.5) * 100) / 100,
        last_trade: Math.round(basePrice * 100) / 100,
        call_bid: Math.round((basePrice - 1.0) * 100) / 100,
        call_ask: Math.round((basePrice - 0.5) * 100) / 100,
        put_bid: Math.round((basePrice - 1.5) * 100) / 100,
        put_ask: Math.round((basePrice - 1.0) * 100) / 100
      }

      addLog('QQQ data generated:', qqqData)

      // Generate data count
      const baseCount = 100;
      const countData = { data_points: baseCount + Math.floor(Date.now() / 1000) % 50 };
      addLog('Data count generated:', countData)

      // Generate historical data for chart
      const days = 3;
      const timestamps = [];
      const prices = [];
      const vwapValues = [];
      const ma9Values = [];

      const baseTime = new Date();
      for (let i = days * 24 - 1; i >= 0; i--) {
        const timestamp = new Date(baseTime.getTime() - (i * 60 * 60 * 1000));
        timestamps.push(timestamp.toISOString());

        // Generate realistic price movements
        const hoursAgo = i;
        const trend = -0.1 * hoursAgo;
        const volatility = (hoursAgo % 10) * 0.05;
        const randomFactor = (Math.sin(hoursAgo * 0.1) * 0.5);

        const price = 245.0 + trend + volatility + randomFactor +
                     (Math.sin(hoursAgo * 0.05) * 0.3);

        prices.push(Math.round(price * 100) / 100);

        const vwap = price + (Math.sin(hoursAgo * 0.07) * 0.1) - 0.05;
        vwapValues.push(Math.round(vwap * 100) / 100);

        const ma9 = price + (Math.sin(hoursAgo * 0.03) * 0.08) - 0.03;
        ma9Values.push(Math.round(ma9 * 100) / 100);
      }

      const historyData = {
        timestamps,
        prices,
        vwaps: vwapValues,
        ma9s: ma9Values
      };
      addLog('History data generated:', historyData)

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
