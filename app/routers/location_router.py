from app.services.location_service import LocationService
from app.shemas.location import LocationSchema
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()
location_service = LocationService()

@router.get("/{location_id}", response_model=LocationSchema)
def get_location(location_id: int, db: Session = Depends(get_db)):
    location = location_service.get_location(db, location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

@router.get("/", response_model=list[LocationSchema])
def get_all_locations(db: Session = Depends(get_db)):
    locations = location_service.get_all_locations(db)
    if not locations:
        raise HTTPException(status_code=404, detail="No locations found")
    return locations

@router.get("/name/{name}", response_model=LocationSchema)
def get_location_by_name(name: str, db: Session = Depends(get_db)):
    location = location_service.get_location_by_name(db, name)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

@router.post("/", response_model=LocationSchema)
def create_location(location: LocationSchema, db: Session = Depends(get_db)):
    existing_location = location_service.get_location_by_name(db, location.name)
    if existing_location:
        raise HTTPException(status_code=400, detail="Location with this name already exists")
    
    coordinates = location_service.get_location_by_coordinates(db, location.latitude, location.longitude)
    if coordinates:
        raise HTTPException(status_code=400, detail="Location with these coordinates already exists")
    
    new_location = location_service.create_location(db, location.name, location.latitude, location.longitude)
    if not new_location:
        raise HTTPException(status_code=500, detail="Failed to create location")
    
    return new_location

@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    success = location_service.delete_location(db, location_id)
    if not success:
        raise HTTPException(status_code=404, detail="Location not found or could not be deleted")
    return {"detail": "Location deleted successfully"}

@router.put("/{location_id}", response_model=LocationSchema)
def update_location(location_id: int, location: LocationSchema, db: Session = Depends(get_db)):
    updated_location = location_service.update_location(
        db, 
        location_id, 
        name=location.name, 
        latitude=location.latitude, 
        longitude=location.longitude
    )
    
    if not updated_location:
        raise HTTPException(status_code=404, detail="Location not found or could not be updated")
    
    return updated_location

