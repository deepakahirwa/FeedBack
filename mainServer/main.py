from fastapi import FastAPI
from routers import feedback
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost:5173",  # Adjust to your frontend origin
    "http://127.0.0.1:3000",  # If you're using this
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(feedback.router)

@app.get("/")
def root():
    return {"message": "Student Management System API"}

# If you are running the file directly (not through `uvicorn` command),
# this block will start the application on host "0.0.0.0" and port 8000.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
