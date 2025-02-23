from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.shemas.role import RoleCreate, RoleResponse
from app.services.role_service import RoleService

router = APIRouter()
role_service = RoleService()

@router.post("/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    """
    Create a new role.
    """
    return role_service.create_role(role.name, db)

@router.get("/", response_model=list[RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    """
    Retrieve all roles.
    """
    return role_service.get_all_roles(db)
