import json
import time

def handler(request):
    """Get data count - for demo, return simulated count"""
    # In production, this would query the database
    # For now, return a simulated growing count
    base_count = 100
    count = base_count + int(time.time() % 50)  # Varies between 100-150

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'data_points': count})
    }
