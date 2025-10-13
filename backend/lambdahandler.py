from mangum import Mangum
from app.main import app


#mangum used to convert python api events to server gateway events
handler = Mangum(app, lifespan="off")