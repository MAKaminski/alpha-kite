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

  // Fetch data from backend API
  const fetchData = async () => {
    try {
      setError(null)

      // Fetch current QQQ data
      const qqqResponse = await fetch('http://localhost:8000/qqq-data')
      if (!qqqResponse.ok) throw new Error('Failed to fetch QQQ data')
      const qqqData = await qqqResponse.json()

      // Fetch data count
      const countResponse = await fetch('http://localhost:8000/data-count')
      if (!countResponse.ok) throw new Error('Failed to fetch data count')
      const countData = await countResponse.json()

      // Fetch historical data for chart
      const historyResponse = await fetch('http://localhost:8000/qqq-history?days=3')
      if (!historyResponse.ok) throw new Error('Failed to fetch history data')
      const historyData = await historyResponse.json()

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

    } catch (err) {
      setError(err.message)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount and set up polling
  useEffect(() => {
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

      <main className="main-content">
        <PolynomialWidget historyData={data.historyData} loading={loading} />
      </main>
    </div>
  )
}

export default App
