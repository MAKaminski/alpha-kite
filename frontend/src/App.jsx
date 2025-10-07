import { useState, useEffect } from 'react'
import './App.css'
import PolynomialWidget from './components/PolynomialWidget'

function App() {
  const [data, setData] = useState({
    sessionVWAP: '245.67',
    ma9: '244.89',
    lastTrade: '245.23',
    nearestStrike: '245.00',
    bidAsk: '245.20 / 245.25'
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        sessionVWAP: (parseFloat(prev.sessionVWAP) + (Math.random() - 0.5) * 0.1).toFixed(2),
        ma9: (parseFloat(prev.ma9) + (Math.random() - 0.5) * 0.1).toFixed(2),
        lastTrade: (parseFloat(prev.lastTrade) + (Math.random() - 0.5) * 0.1).toFixed(2),
        nearestStrike: prev.nearestStrike,
        bidAsk: `${(parseFloat(prev.lastTrade) - 0.05).toFixed(2)} / ${(parseFloat(prev.lastTrade) + 0.05).toFixed(2)}`
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const headerBoxes = [
    { label: 'Session VWAP', value: data.sessionVWAP, color: '#3b82f6' },
    { label: 'MA9', value: data.ma9, color: '#10b981' },
    { label: 'Last_Trade', value: data.lastTrade, color: '#f59e0b' },
    { label: 'Nearest Strike', value: data.nearestStrike, color: '#ef4444' },
    { label: 'Bid/Ask', value: data.bidAsk, color: '#8b5cf6' }
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

      <main className="main-content">
        <PolynomialWidget />
      </main>
    </div>
  )
}

export default App
