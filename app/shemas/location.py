from pydantic import BaseModel

class LocationSchema(BaseModel):
    name: str
    latitude: float | None = None
    longitude: float | None = None

    class Config:
        from_attributes = True