from mangum import Mangum
from main import app

def handler(event, context):
    """
    Lambda handler that properly handles binary data from API Gateway
    """
    
    print(f"HTTP Method: {event.get('httpMethod')}")
    print(f"Content-Type: {event.get('headers', {}).get('content-type', 'none')}")
    print(f"IsBase64Encoded: {event.get('isBase64Encoded', False)}")
    

    if event.get('isBase64Encoded', False):
        import base64
        if 'body' in event and event['body']:
            try:

                event['body'] = base64.b64decode(event['body'])
                print(f"Decoded body to {len(event['body'])} bytes")
            except Exception as e:
                print(f"Base64 decode error: {e}")
    

    mangum_handler = Mangum(
        app,
        lifespan="off",
        api_gateway_base_path="/prod"
    )
    
    return mangum_handler(event, context)