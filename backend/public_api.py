from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": str(datetime.now())}

@app.get("/qqq-data")
async def get_qqq_data():
    # Generate mock QQQ data for demo
    base_price = 245.0 + random.uniform(-2, 2)
    return {
        "session_vwap": round(base_price, 2),
        "ma9": round(base_price - 0.5, 2),
        "last_trade": round(base_price, 2),
        "call_bid": round(base_price - 1.0, 2),
        "call_ask": round(base_price - 0.5, 2),
        "put_bid": round(base_price - 1.5, 2),
        "put_ask": round(base_price - 1.0, 2)
    }

@app.get("/data-count")
async def get_data_count():
    return {"data_points": 42}

@app.get("/qqq-history")
async def get_qqq_history(days: int = 3):
    # Generate mock historical data
    timestamps = []
    prices = []
    vwap = []
    ma9 = []
    
    for i in range(days * 24):  # 24 hours per day
        timestamp = datetime.now().timestamp() - (i * 3600)
        timestamps.append(datetime.fromtimestamp(timestamp).isoformat())
        prices.append(245.0 + random.uniform(-3, 3))
        vwap.append(245.0 + random.uniform(-2, 2))
        ma9.append(245.0 + random.uniform(-1, 1))
    
    return {
        "timestamps": timestamps,
        "prices": prices,
        "vwaps": vwap,
        "ma9s": ma9
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
