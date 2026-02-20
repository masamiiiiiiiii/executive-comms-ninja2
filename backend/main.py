from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Executive Comms Ninja API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import analysis, snapshot

app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(snapshot.router, prefix="/api", tags=["snapshot"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Executive Comms Ninja API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
