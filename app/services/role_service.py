from sqlalchemy.orm import Session
from app.models.role import Role

class RoleService:
    def find_by_name(self, name: str, db: Session):
        return db.query(Role).filter(Role.name == name).first()

    def create_role(self, name: str, db: Session):
        role = Role(name=name)
        db.add(role)
        db.commit()
        db.refresh(role)
        return role

    def get_all_roles(self, db: Session):
        return db.query(Role).all()
