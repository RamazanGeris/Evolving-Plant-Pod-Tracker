

from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel

class ImageBase(BaseModel):
    description: Optional[str] = None

class ImageCreate(ImageBase):
    pass  # Sadece description alınacak, dosya upload ayrı olacak

class ImageResponse(ImageBase):
    id: int
    filename: str
    upload_time: datetime

    class Config:
        orm_mode = True

class PodBase(BaseModel):
    name: str
    type: str
    planting_date: date
    description: Optional[str] = None

class PodCreate(PodBase):
    pass  # İlk fotoğraf upload ayrı olacak

class PodResponse(PodBase):
    id: int
    images: List[ImageResponse] = []

    class Config:
        orm_mode = True

class PodUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    planting_date: Optional[date] = None
    description: Optional[str] = None 