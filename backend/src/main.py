"""
Alpha Kite Backend API
FastAPI backend for QQQ options data with Schwab API integration
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import logging
from typing import List, Dict, Any

# Import our modules
from database import engine, get_db, create_tables
from models import QQQData, DataPoint
from schwab_client import SchwabClient
from data_service import DataService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Alpha Kite Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
schwab_client = SchwabClient()
data_service = DataService()

@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    create_tables()
    logger.info("Database tables created/verified")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Alpha Kite Backend API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/qqq-data")
async def get_qqq_data(db: Session = Depends(get_db)):
    """Get current QQQ data including VWAP, MA9, and options"""
    try:
        data = await data_service.get_current_qqq_data(db)
        return data
    except Exception as e:
        logger.error(f"Error fetching QQQ data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch QQQ data")

@app.get("/qqq-history")
async def get_qqq_history(days: int = 3, db: Session = Depends(get_db)):
    """Get historical QQQ data for charting"""
    try:
        history = await data_service.get_qqq_history(db, days)
        return history
    except Exception as e:
        logger.error(f"Error fetching QQQ history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch QQQ history")

@app.get("/data-count")
async def get_data_count(db: Session = Depends(get_db)):
    """Get count of data points in database"""
    try:
        count = data_service.get_data_count(db)
        return {"data_points": count}
    except Exception as e:
        logger.error(f"Error getting data count: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get data count")

@app.post("/refresh-data")
async def refresh_data(db: Session = Depends(get_db)):
    """Manually trigger data refresh from Schwab API"""
    try:
        await data_service.refresh_qqq_data(db)
        return {"message": "Data refreshed successfully"}
    except Exception as e:
        logger.error(f"Error refreshing data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to refresh data")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
