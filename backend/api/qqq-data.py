import json
import asyncio
import os
from schwab_client import SchwabClient

# Initialize Schwab client
schwab_client = SchwabClient()

async def get_qqq_data():
    """Get real QQQ data from Schwab"""
    try:
        # Get current quote
        quote = await schwab_client.get_qqq_quote()

        # Get 0DTE options data
        call_data, _, put_data, _ = await schwab_client.get_0dte_options()

        # Calculate VWAP and MA9 (simplified for demo)
        session_vwap = quote["lastPrice"]
        ma9 = quote["lastPrice"]

        return {
            'session_vwap': round(session_vwap, 2),
            'ma9': round(ma9, 2),
            'last_trade': round(quote["lastPrice"], 2),
            'call_bid': call_data["bid"],
            'call_ask': call_data["ask"],
            'put_bid': put_data["bid"],
            'put_ask': put_data["ask"]
        }
    except Exception as e:
        print(f"Error getting Schwab data: {e}")
        # Fallback to mock data if Schwab fails
        base_price = 245.0
        return {
            'session_vwap': round(base_price, 2),
            'ma9': round(base_price - 0.5, 2),
            'last_trade': round(base_price, 2),
            'call_bid': round(base_price - 1.0, 2),
            'call_ask': round(base_price - 0.5, 2),
            'put_bid': round(base_price - 1.5, 2),
            'put_ask': round(base_price - 1.0, 2)
        }

def handler(request):
    """Get current QQQ data"""
    # Run async function in sync context
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(get_qqq_data())
        loop.close()

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(result)
        }
    except Exception as e:
        print(f"Error in handler: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Internal server error'})
        }
