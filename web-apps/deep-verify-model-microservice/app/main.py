from typing import Union
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from starlette.responses import JSONResponse
from deepfake_detector import detect_deepfake
import tempfile
import os

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Deepfake Detection API"}

@app.post("/detect/{input_type}")
async def detect(input_type: str, file: UploadFile = File(...)):
    # Ensure input_type is valid
    if input_type not in ['image', 'video']:
        raise HTTPException(status_code=400, detail="Invalid input type. Choose from 'image' or 'video'.")

    # Ensure the file extension is valid for the given input type
    file_extension = file.filename.split('.')[-1].lower()
    valid_extensions = {
        'image': ['jpg', 'jpeg', 'png'],
        'video': ['mp4', 'avi', 'mov'],
    }

    if file_extension not in valid_extensions[input_type]:
        raise HTTPException(status_code=400, detail=f"Invalid file type for {input_type}. Supported types are {', '.join(valid_extensions[input_type])}")

    contents = await file.read()

    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_extension}") as temp_file:
        temp_file.write(contents)
        file_path = temp_file.name

    try:
        is_deepfake, confidence = detect_deepfake(file_path, input_type, file.filename)
        return JSONResponse(content={
            "isDeepfake": is_deepfake,
            "confidence": confidence
        })
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")
    finally:
        os.remove(file_path)  # Clean up the temporary file

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
