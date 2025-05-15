from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from . import models, schemas, crud, database
import uuid

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme için tüm originlere izin veriyoruz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/pods", response_model=schemas.PodResponse)
def create_pod(
    name: str = Form(...),
    type: str = Form(...),
    planting_date: str = Form(...),
    description: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    import datetime
    pod_in = schemas.PodCreate(
        name=name,
        type=type,
        planting_date=datetime.datetime.strptime(planting_date, "%Y-%m-%d").date(),
        description=description
    )
    pod = crud.create_pod(db, pod_in)
    # Eğer ilk fotoğraf varsa kaydet
    if image:
        ext = os.path.splitext(image.filename)[1]
        unique_name = f"{pod.id}_{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        crud.add_image_to_pod(db, pod.id, unique_name)
    db.refresh(pod)
    return pod

@app.get("/api/pods", response_model=List[schemas.PodResponse])
def list_pods(db: Session = Depends(get_db)):
    return crud.get_pods(db)

@app.post("/api/pods/{pod_id}/images", response_model=schemas.ImageResponse)
def add_image(
    pod_id: int,
    image: UploadFile = File(...),
    description: str = Form(None),
    db: Session = Depends(get_db)
):
    pod = crud.get_pod(db, pod_id)
    if not pod:
        raise HTTPException(status_code=404, detail="Pod not found")
    ext = os.path.splitext(image.filename)[1]
    unique_name = f"{pod_id}_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    return crud.add_image_to_pod(db, pod_id, unique_name, description)

@app.get("/api/uploads/{filename}")
def get_image(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    from fastapi.responses import FileResponse
    return FileResponse(file_path)

@app.delete("/api/pods/{pod_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pod(pod_id: int, db: Session = Depends(get_db)):
    pod = crud.get_pod(db, pod_id)
    if not pod:
        raise HTTPException(status_code=404, detail="Pod not found")
    db.delete(pod)
    db.commit()
    return

@app.put("/api/pods/{pod_id}", response_model=schemas.PodResponse)
def update_pod(pod_id: int, pod_update: schemas.PodUpdate, db: Session = Depends(get_db)):
    pod = crud.update_pod(db, pod_id, pod_update)
    if not pod:
        raise HTTPException(status_code=404, detail="Pod not found")
    return pod

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "init-db":
        from .database import init_db
        init_db()
        print("Veritabanı başarıyla oluşturuldu.") 