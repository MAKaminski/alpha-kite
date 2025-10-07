"""
Database models for QQQ options and price data
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class QQQData(Base):
    """Model for storing QQQ price and calculated data"""
    __tablename__ = "qqq_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Price data
    last_trade = Column(Float, nullable=False)
    bid = Column(Float)
    ask = Column(Float)

    # Calculated metrics
    session_vwap = Column(Float)
    ma9 = Column(Float)

    # Options data (nearest 0DTE strikes)
    nearest_strike = Column(Float)

    # Call options
    call_bid = Column(Float)
    call_ask = Column(Float)

    # Put options
    put_bid = Column(Float)
    put_ask = Column(Float)

class DataPoint(Base):
    """Model for storing individual data points for historical tracking"""
    __tablename__ = "data_points"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # QQQ price at this point
    price = Column(Float, nullable=False)

    # Metrics at this point
    vwap = Column(Float)
    ma9 = Column(Float)

    # Data type indicator
    data_type = Column(String, default="price")  # price, vwap, ma9
