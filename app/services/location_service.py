from app.models.location import Location
from sqlalchemy.orm import Session

class LocationService:
    def __init__(self):
        pass

    def get_location(self, db: Session, location_id: int) -> Location | None: 
        return db.query(Location).filter(Location.id == location_id).first()
    
    def get_all_locations(self, db: Session) -> list[Location]:
        return db.query(Location).all()

    def get_location_by_name(self, db: Session, name: str) -> Location | None:
        return db.query(Location).filter(Location.name == name).first()
    
    def get_location_by_coordinates(self, db: Session, latitude: float, longitude: float) -> Location | None:
        return db.query(Location).filter(Location.latitude == latitude, Location.longitude == longitude).first()

    def create_location(self, db: Session, name: str, latitude: float | None, longitude: float | None) -> Location | None:
        new_location = Location(name=name, latitude=latitude, longitude=longitude)
        db.add(new_location)
        db.commit()
        db.refresh(new_location)
        return new_location
    
    def delete_location(self, db: Session, location_id: int) -> bool:
        location = db.query(Location).filter(Location.id == location_id).first()
        if location:
            db.delete(location)
            db.commit()
            return True # Successfully deleted
        return False
    
    def update_location(self, db: Session, location_id: int, name: str | None = None, latitude: float | None = None, longitude: float | None = None) -> Location | None:
        location = db.query(Location).filter(Location.id == location_id).first()
        if not location:
            return None
        
        if name is not None:
            location.name = name
        if latitude is not None:
            location.latitude = latitude
        if longitude is not None:
            location.longitude = longitude
        
        db.commit()
        db.refresh(location)
        return location