import { useEffect, useRef } from 'react'

function PolynomialWidget({ historyData, loading }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!historyData) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Set canvas size
    canvas.width = 700
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (historyData.timestamps.length === 0) {
      drawNoData(ctx, canvas.width, canvas.height)
      return
    }

    // Draw time-series chart
    drawTimeSeriesChart(ctx, canvas.width, canvas.height, historyData)

  }, [historyData, loading])

  const drawNoData = (ctx, width, height) => {
    ctx.fillStyle = '#6b7280'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('No historical data available', width / 2, height / 2)
  }

  const drawTimeSeriesChart = (ctx, width, height, data) => {
    const { timestamps, prices, vwap, ma9 } = data

    // Chart dimensions and padding
    const padding = { top: 40, right: 40, bottom: 60, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Draw chart background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight)

    // Draw grid lines
    drawGrid(ctx, padding, chartWidth, chartHeight)

    // Find data range for scaling
    const allPrices = [...prices, ...vwap.filter(v => v !== null), ...ma9.filter(m => m !== null)]
    const minPrice = Math.min(...allPrices.filter(p => p !== null))
    const maxPrice = Math.max(...allPrices.filter(p => p !== null))
    const priceRange = maxPrice - minPrice || 1

    // Draw data lines
    if (prices.length > 0) {
      drawLine(ctx, timestamps, prices, '#2563eb', padding, chartWidth, chartHeight, minPrice, priceRange)
    }
    if (vwap.length > 0 && vwap.some(v => v !== null)) {
      drawLine(ctx, timestamps, vwap, '#dc2626', padding, chartWidth, chartHeight, minPrice, priceRange)
    }
    if (ma9.length > 0 && ma9.some(m => m !== null)) {
      drawLine(ctx, timestamps, ma9, '#059669', padding, chartWidth, chartHeight, minPrice, priceRange)
    }

    // Draw axes and labels
    drawAxes(ctx, padding, chartWidth, chartHeight, minPrice, maxPrice)
    drawLegend(ctx, width)
  }

  const drawGrid = (ctx, padding, chartWidth, chartHeight) => {
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1

    // Vertical grid lines (every 6 hours for 3 days)
    for (let i = 0; i <= 12; i++) {
      const x = padding.left + (i / 12) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }
  }

  const drawLine = (ctx, timestamps, values, color, padding, chartWidth, chartHeight, minPrice, priceRange) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    let isFirstPoint = true

    timestamps.forEach((timestamp, index) => {
      const value = values[index]
      if (value === null) return

      const x = padding.left + (index / (timestamps.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((value - minPrice) / priceRange) * chartHeight

      if (isFirstPoint) {
        ctx.moveTo(x, y)
        isFirstPoint = false
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()
  }

  const drawAxes = (ctx, padding, chartWidth, chartHeight, minPrice, maxPrice) => {
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.stroke()

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + chartHeight)
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.stroke()

    // Y-axis labels
    ctx.fillStyle = '#374151'
    ctx.font = '12px Arial'
    ctx.textAlign = 'right'

    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (i / 5) * (maxPrice - minPrice)
      const y = padding.top + chartHeight - (i / 5) * chartHeight

      ctx.fillText(price.toFixed(2), padding.left - 10, y + 4)

      // Tick marks
      ctx.beginPath()
      ctx.moveTo(padding.left - 5, y)
      ctx.lineTo(padding.left, y)
      ctx.stroke()
    }

    // X-axis labels (time)
    ctx.textAlign = 'center'
    const timeLabels = ['3d ago', '2d ago', '1d ago', 'Now']

    timeLabels.forEach((label, index) => {
      const x = padding.left + (index / 3) * chartWidth
      ctx.fillText(label, x, padding.top + chartHeight + 20)
    })

    // Axis labels
    ctx.save()
    ctx.translate(20, padding.top + chartHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Price', 0, 0)
    ctx.restore()

    ctx.fillText('Time (Last 3 Days)', padding.left + chartWidth / 2, padding.top + chartHeight + 40)
  }

  const drawLegend = (ctx, width) => {
    const legendY = 20
    const legendItems = [
      { color: '#2563eb', label: 'QQQ Price' },
      { color: '#dc2626', label: 'Session VWAP' },
      { color: '#059669', label: 'MA9' }
    ]

    ctx.font = '14px Arial'
    legendItems.forEach((item, index) => {
      const x = width - 200 + index * 120

      // Color box
      ctx.fillStyle = item.color
      ctx.fillRect(x, legendY, 12, 12)

      // Label
      ctx.fillStyle = '#374151'
      ctx.textAlign = 'left'
      ctx.fillText(item.label, x + 18, legendY + 10)
    })
  }

  if (loading) {
    return (
      <div className="polynomial-widget">
        <h2>QQQ Price Chart (Last 3 Days)</h2>
        <div className="loading">Loading chart data...</div>
      </div>
    )
  }

  return (
    <div className="polynomial-widget">
      <h2>QQQ Price Chart (Last 3 Days)</h2>
      <canvas
        ref={canvasRef}
        className="polynomial-canvas"
      />
    </div>
  )
}

export default PolynomialWidget
