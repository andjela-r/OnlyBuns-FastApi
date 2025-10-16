from pydantic import BaseModel

class FollowingBase(BaseModel):
    idfollower: int
    idfollowing: int

class FollowCreate(FollowingBase):
    pass

class FollowRead(FollowingBase):
    class Config:
        from_attributes = True