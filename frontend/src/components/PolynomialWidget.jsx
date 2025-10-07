import { useEffect, useRef } from 'react'

function PolynomialWidget() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Set canvas size
    canvas.width = 600
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw coordinate system
    drawCoordinateSystem(ctx, canvas.width, canvas.height)

    // Draw polynomial curve (example: y = x^3 - 3x^2 + 2x + 1)
    drawPolynomial(ctx, canvas.width, canvas.height)

  }, [])

  const drawCoordinateSystem = (ctx, width, height) => {
    const centerX = width / 2
    const centerY = height / 2

    // Draw axes
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2

    // X-axis
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // Draw tick marks and labels
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'

    // X-axis ticks
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue
      const x = centerX + (i * 50)
      ctx.beginPath()
      ctx.moveTo(x, centerY - 5)
      ctx.lineTo(x, centerY + 5)
      ctx.stroke()

      ctx.fillText(i.toString(), x - 5, centerY + 20)
    }

    // Y-axis ticks
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue
      const y = centerY - (i * 50)
      ctx.beginPath()
      ctx.moveTo(centerX - 5, y)
      ctx.lineTo(centerX + 5, y)
      ctx.stroke()

      ctx.fillText(i.toString(), centerX + 10, y + 5)
    }

    // Axis labels
    ctx.fillText('x', width - 20, centerY - 10)
    ctx.fillText('y', centerX + 15, 20)
  }

  const drawPolynomial = (ctx, width, height) => {
    const centerX = width / 2
    const centerY = height / 2

    ctx.strokeStyle = '#2563eb'
    ctx.lineWidth = 3
    ctx.beginPath()

    let isFirstPoint = true

    // Draw polynomial curve from x = -5 to x = 5
    for (let x = -5; x <= 5; x += 0.1) {
      // Example polynomial: y = x^3 - 3x^2 + 2x + 1
      const y = Math.pow(x, 3) - 3 * Math.pow(x, 2) + 2 * x + 1

      const canvasX = centerX + (x * 50)
      const canvasY = centerY - (y * 50)

      if (isFirstPoint) {
        ctx.moveTo(canvasX, canvasY)
        isFirstPoint = false
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }

    ctx.stroke()

    // Draw polynomial equation
    ctx.fillStyle = '#2563eb'
    ctx.font = '16px Arial'
    ctx.fillText('y = x³ - 3x² + 2x + 1', 20, 30)
  }

  return (
    <div className="polynomial-widget">
      <h2>Polynomial Visualization</h2>
      <canvas
        ref={canvasRef}
        className="polynomial-canvas"
      />
    </div>
  )
}

export default PolynomialWidget
