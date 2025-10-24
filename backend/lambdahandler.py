from mangum import Mangum
from main import app

# Simple handler - let main.py do the heavy lifting
handler = Mangum(
    app,
    lifespan="off",
    api_gateway_base_path="/prod"
)