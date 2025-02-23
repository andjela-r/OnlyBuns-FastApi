from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.shemas.like import LikeCreate, LikeRead
from app.models.like import Like
from app.models.post import Post 
from app.models.user import User  
import psycopg2


router = APIRouter()
#prefix="/likes", tags=["likes"]

@router.post("/", response_model=LikeRead)
def create_like(like: LikeCreate, db: Session = Depends(get_db)):
    # Proveri da li post i korisnik postoje
    if not db.query(Post).filter(Post.id == like.postid).first():
        raise HTTPException(status_code=404, detail="Post not found")
    if not db.query(User).filter(User.id == like.userid).first():
        raise HTTPException(status_code=404, detail="User not found")

    # Kreiranje lajka
    try:
        db_like = Like(postid=like.postid, userid=like.userid)
        db.add(db_like)
        db.commit()
        db.refresh(db_like)
        return db_like
    except IntegrityError as e:
        # U slucaju da like vec postoji
        if isinstance(e.orig, psycopg2.errors.UniqueViolation):
            db.rollback()  
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User {like.userid} has already liked this post {like.postid}. Duplicate entry not allowed."
            )

        db.rollback()  
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )

@router.delete("/{postid}/{userid}")
def delete_like(postid: int, userid: int, db: Session = Depends(get_db)):
    like = db.query(Like).filter(Like.postid == postid, Like.userid == userid).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    
    db.delete(like)
    db.commit()
    return {"message": "Like removed"}

@router.get("/")
def read_likes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    likes = db.query(Like).offset(skip).limit(limit).all()
    return likes

@router.get("/{postid}/{userid}/liked", response_model=bool)
def is_post_liked(postid: int, userid: int, db: Session = Depends(get_db)):
    like = db.query(Like).filter(Like.postid == postid, Like.userid == userid).first()
    return like is not None  # Ako postoji like u bazi, vrati True, inače False

