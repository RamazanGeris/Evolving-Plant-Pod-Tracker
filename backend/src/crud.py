

from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional
import uuid
import os

def get_pods(db: Session) -> List[models.Pod]:
    return db.query(models.Pod).all()

def get_pod(db: Session, pod_id: int) -> Optional[models.Pod]:
    return db.query(models.Pod).filter(models.Pod.id == pod_id).first()

def create_pod(db: Session, pod: schemas.PodCreate) -> models.Pod:
    db_pod = models.Pod(
        name=pod.name,
        type=pod.type,
        planting_date=pod.planting_date,
        description=pod.description
    )
    db.add(db_pod)
    db.commit()
    db.refresh(db_pod)
    return db_pod

def add_image_to_pod(db: Session, pod_id: int, filename: str, description: Optional[str] = None) -> models.Image:
    db_image = models.Image(
        pod_id=pod_id,
        filename=filename,
        description=description
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_images_for_pod(db: Session, pod_id: int) -> List[models.Image]:
    return db.query(models.Image).filter(models.Image.pod_id == pod_id).all()

def update_pod(db: Session, pod_id: int, pod_update: schemas.PodUpdate) -> Optional[models.Pod]:
    pod = get_pod(db, pod_id)
    if not pod:
        return None
    for field, value in pod_update.dict(exclude_unset=True).items():
        setattr(pod, field, value)
    db.commit()
    db.refresh(pod)
    return pod 