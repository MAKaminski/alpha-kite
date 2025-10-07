import json
import random
from datetime import datetime

def handler(request):
    """Get historical QQQ data"""
    query = request.get('query', {})
    days = int(query.get('days', '3'))

    timestamps = []
    prices = []
    vwap_values = []
    ma9_values = []

    base_time = datetime.now()
    for i in range(days * 24):  # 24 hours per day
        timestamp = base_time.timestamp() - (i * 3600)
        timestamps.append(datetime.fromtimestamp(timestamp).isoformat())

        # Generate realistic price movements
        hours_ago = i
        trend = -0.1 * hours_ago
        volatility = (hours_ago % 10) * 0.05
        price = 245.0 + trend + volatility + (hash(str(hours_ago)) % 100) * 0.01 - 0.5
        prices.append(round(price, 2))

        vwap = price + (hash(str(hours_ago * 2)) % 20) * 0.01 - 0.1
        vwap_values.append(round(vwap, 2))

        ma9 = price + (hash(str(hours_ago * 3)) % 15) * 0.01 - 0.075
        ma9_values.append(round(ma9, 2))

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            'timestamps': timestamps,
            'prices': prices,
            'vwaps': vwap_values,
            'ma9s': ma9_values
        })
    }
