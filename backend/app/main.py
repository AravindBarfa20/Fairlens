from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FairLens API", version="1.0.0")

# Allow the local Next.js frontend to call the API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "FairLens Math Engine is Online"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "AIF360"}
