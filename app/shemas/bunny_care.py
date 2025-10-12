from pydantic import BaseModel

class BunnyCareSchema(BaseModel):
    name: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True
