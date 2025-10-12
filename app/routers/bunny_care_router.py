# bunny care router
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.bunny_care import BunnyCare
from app.shemas.bunny_care import BunnyCareSchema
from app.services.bunny_care_service import BunnyCareService

router = APIRouter()
bunny_care_service = BunnyCareService()

@router.post("/", response_model=BunnyCareSchema)
def create_bunny_care(bunny_care: BunnyCareSchema, db: Session = Depends(get_db)):
    # Check if bunny care with same name already exists
    existing_by_name = bunny_care_service.get_bunny_care_by_name(db, bunny_care.name)
    if existing_by_name:
        raise HTTPException(status_code=400, detail="Bunny care location with this name already exists")
    
    # Check if bunny care with same coordinates already exists
    existing_by_coords = bunny_care_service.get_bunny_care_by_coordinates(db, bunny_care.latitude, bunny_care.longitude)
    if existing_by_coords:
        raise HTTPException(status_code=400, detail="Bunny care location with these coordinates already exists")
    
    # Create new bunny care location
    new_bunny_care = BunnyCare(
        name=bunny_care.name,
        latitude=bunny_care.latitude,
        longitude=bunny_care.longitude
    )
    return bunny_care_service.create_bunny_care(db, new_bunny_care)

@router.get("/{bunny_care_id}", response_model=BunnyCareSchema)
def get_bunny_care(bunny_care_id: int, db: Session = Depends(get_db)):
    bunny_care = bunny_care_service.get_bunny_care(db, bunny_care_id)
    if not bunny_care:
        raise HTTPException(status_code=404, detail="Bunny care location not found")
    return bunny_care

@router.get("/", response_model=list[BunnyCareSchema])
def get_all_bunny_care(db: Session = Depends(get_db)):
    return bunny_care_service.get_all_bunny_care(db)

@router.get("/name/{name}", response_model=BunnyCareSchema)
def get_bunny_care_by_name(name: str, db: Session = Depends(get_db)):
    bunny_care = bunny_care_service.get_bunny_care_by_name(db, name)
    if not bunny_care:
        raise HTTPException(status_code=404, detail="Bunny care location not found")
    return bunny_care

@router.get("/coordinates/{latitude}/{longitude}", response_model=BunnyCareSchema)
def get_bunny_care_by_coordinates(latitude: float, longitude: float, db: Session = Depends(get_db)):
    bunny_care = bunny_care_service.get_bunny_care_by_coordinates(db, latitude, longitude)
    if not bunny_care:
        raise HTTPException(status_code=404, detail="Bunny care location not found")
    return bunny_care