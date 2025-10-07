"""
Data service for processing QQQ data, calculations, and storage
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
import pandas as pd
import numpy as np

from .models import QQQData, DataPoint
from .schwab_client import SchwabClient

logger = logging.getLogger(__name__)

class DataService:
    """Service for handling QQQ data operations"""

    def __init__(self):
        self.schwab_client = SchwabClient()

    async def get_current_qqq_data(self, db: Session) -> Dict:
        """Get current QQQ data with calculations"""
        try:
            # Try to get latest data from database first
            latest_data = db.query(QQQData).order_by(desc(QQQData.timestamp)).first()

            if latest_data and (datetime.now() - latest_data.timestamp).seconds < 60:
                # Use cached data if less than 1 minute old
                return self._format_current_data(latest_data)
            else:
                # Fetch fresh data from Schwab API
                return await self.refresh_qqq_data(db)

        except Exception as e:
            logger.error(f"Error getting current QQQ data: {str(e)}")
            raise

    async def refresh_qqq_data(self, db: Session) -> Dict:
        """Fetch fresh data from Schwab API and store in database"""
        try:
            # Get current quote and options data
            quote = await self.schwab_client.get_qqq_quote()
            call_data, _, put_data, _ = await self.schwab_client.get_0dte_options()

            # Calculate VWAP and MA9 (simplified for demo)
            # In a real implementation, these would be calculated from actual trade data
            session_vwap = quote["lastPrice"]  # Simplified
            ma9 = quote["lastPrice"]  # Simplified

            # Create new QQQ data record
            qqq_data = QQQData(
                timestamp=datetime.now(),
                last_trade=quote["lastPrice"],
                bid=quote.get("bid"),
                ask=quote.get("ask"),
                session_vwap=session_vwap,
                ma9=ma9,
                nearest_strike=call_data["strike"],
                call_bid=call_data["bid"],
                call_ask=call_data["ask"],
                put_bid=put_data["bid"],
                put_ask=put_data["ask"]
            )

            # Store in database
            db.add(qqq_data)

            # Also store individual data points for charting
            price_point = DataPoint(
                timestamp=datetime.now(),
                price=quote["lastPrice"],
                vwap=session_vwap,
                ma9=ma9,
                data_type="price"
            )
            db.add(price_point)

            db.commit()
            db.refresh(qqq_data)

            logger.info(f"Stored new QQQ data: {quote['lastPrice']} at {datetime.now()}")

            return self._format_current_data(qqq_data)

        except Exception as e:
            logger.error(f"Error refreshing QQQ data: {str(e)}")
            db.rollback()
            raise

    def get_data_count(self, db: Session) -> int:
        """Get total count of data points in database"""
        try:
            # Count both QQQData and DataPoint records
            qqq_count = db.query(QQQData).count()
            point_count = db.query(DataPoint).count()
            return qqq_count + point_count
        except Exception as e:
            logger.error(f"Error getting data count: {str(e)}")
            return 0

    async def get_qqq_history(self, db: Session, days: int = 3) -> Dict:
        """Get historical QQQ data for charting"""
        try:
            # Calculate cutoff time
            cutoff_time = datetime.now() - timedelta(days=days)

            # Get historical data points
            data_points = db.query(DataPoint).filter(
                DataPoint.timestamp >= cutoff_time
            ).order_by(DataPoint.timestamp).all()

            if not data_points:
                return {"timestamps": [], "prices": [], "vwaps": [], "ma9s": []}

            # Convert to lists for charting
            timestamps = [point.timestamp.isoformat() for point in data_points]
            prices = [point.price for point in data_points]
            vwap = [point.vwap for point in data_points]
            ma9 = [point.ma9 for point in data_points]

            return {
                "timestamps": timestamps,
                "prices": prices,
                "vwaps": vwap,
                "ma9s": ma9
            }

        except Exception as e:
            logger.error(f"Error getting QQQ history: {str(e)}")
            return {"timestamps": [], "prices": [], "vwaps": [], "ma9s": []}

    def _format_current_data(self, qqq_data: QQQData) -> Dict:
        """Format QQQ data for API response"""
        return {
            "timestamp": qqq_data.timestamp.isoformat(),
            "session_vwap": round(qqq_data.session_vwap, 2) if qqq_data.session_vwap else None,
            "ma9": round(qqq_data.ma9, 2) if qqq_data.ma9 else None,
            "last_trade": round(qqq_data.last_trade, 2) if qqq_data.last_trade else None,
            "nearest_strike": round(qqq_data.nearest_strike, 2) if qqq_data.nearest_strike else None,
            "call_bid": round(qqq_data.call_bid, 2) if qqq_data.call_bid else None,
            "call_ask": round(qqq_data.call_ask, 2) if qqq_data.call_ask else None,
            "put_bid": round(qqq_data.put_bid, 2) if qqq_data.put_bid else None,
            "put_ask": round(qqq_data.put_ask, 2) if qqq_data.put_ask else None
        }
