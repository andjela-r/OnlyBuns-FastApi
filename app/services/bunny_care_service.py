from sqlalchemy.orm import Session
from app.models.bunny_care import BunnyCare

class BunnyCareService:
    def __init__(self):
        pass

    def get_bunny_care(self, db: Session, bunny_care_id: int) -> BunnyCare | None:
        return db.query(BunnyCare).filter(BunnyCare.id == bunny_care_id).first()
    
    def get_all_bunny_care(self, db: Session) -> list[BunnyCare]:
        return db.query(BunnyCare).all()
    
    def create_bunny_care(self, db: Session, bunny_care: BunnyCare) -> BunnyCare:
        db.add(bunny_care)
        db.commit()
        db.refresh(bunny_care)
        return bunny_care
    
    def get_bunny_care_by_name(self, db: Session, name: str) -> BunnyCare | None:
        return db.query(BunnyCare).filter(BunnyCare.name == name).first()
    
    def get_bunny_care_by_coordinates(self, db: Session, latitude: float, longitude: float) -> BunnyCare | None:
        return db.query(BunnyCare).filter(BunnyCare.latitude == latitude, BunnyCare.longitude == longitude).first()
    
    def delete_bunny_care(self, db: Session, bunny_care_id: int) -> bool:
        bunny_care = db.query(BunnyCare).filter(BunnyCare.id == bunny_care_id).first()
        if bunny_care:
            db.delete(bunny_care)
            db.commit()
            return True
        return False

    def update_bunny_care(self, db: Session, bunny_care_id: int, name: str | None = None, latitude: float | None = None, longitude: float | None = None) -> BunnyCare | None:
        bunny_care = db.query(BunnyCare).filter(BunnyCare.id == bunny_care_id).first()
        if bunny_care:
            if name is not None:
                bunny_care.name = name
            if latitude is not None:
                bunny_care.latitude = latitude
            if longitude is not None:
                bunny_care.longitude = longitude
            db.commit()
            db.refresh(bunny_care)
            return bunny_care
        return None