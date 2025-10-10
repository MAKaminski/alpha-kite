import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App.jsx'

// Mock the services
vi.mock('../services/databaseService.js', () => ({
  default: {
    getLatestData: vi.fn(() => Promise.resolve([
      { id: 1, symbol: 'AAPL', price: 150.00, volume: 1000000, timestamp: new Date().toISOString() }
    ]))
  }
}))

vi.mock('../services/schwabService.js', () => ({
  default: {
    downloadEquityData: vi.fn(() => Promise.resolve([{ id: 1 }])),
    downloadOptionsData: vi.fn(() => Promise.resolve([{ id: 1 }]))
  }
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main heading', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Alpha Kite - Financial Data Dashboard')).toBeInTheDocument()
    })
  })

  it('displays service cards', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('1. Schwab Data Downloader')).toBeInTheDocument()
      expect(screen.getByText('2. Supabase CRUD')).toBeInTheDocument()
      expect(screen.getByText('3. Data Display')).toBeInTheDocument()
    })
  })

  it('shows equity data tab by default', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Equity Data')).toBeInTheDocument()
    })
  })

  it('switches to options tab when clicked', async () => {
    render(<App />)

    await waitFor(() => {
      const optionsTab = screen.getByText('Options Data')
      fireEvent.click(optionsTab)
      expect(screen.getByText('Options Data Overview')).toBeInTheDocument()
    })
  })

  it('calls Schwab data download when button is clicked', async () => {
    const { default: schwabService } = await import('../services/schwabService.js')

    render(<App />)

    await waitFor(() => {
      const downloadButton = screen.getByText('Download Data')
      fireEvent.click(downloadButton)
    })

    await waitFor(() => {
      expect(schwabService.downloadEquityData).toHaveBeenCalledWith(['AAPL', 'GOOGL', 'MSFT'])
      expect(schwabService.downloadOptionsData).toHaveBeenCalledWith(['AAPL', 'GOOGL'])
    })
  })

  it('shows loading state during data fetch', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Loading data...')).toBeInTheDocument()
    })
  })
})

