from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.shemas.comment import CommentCreate, CommentRead
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=CommentRead)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    # Proveri da li post i korisnik postoje
    if not db.query(Post).filter(Post.id == comment.postid).first():
        raise HTTPException(status_code=404, detail="Post not found")
    if not db.query(User).filter(User.id == comment.userid).first():
        raise HTTPException(status_code=404, detail="User not found")

    db_comment = Comment(postid=comment.postid, userid=comment.userid, content=comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db.delete(comment)
    db.commit()
    return {"message": "Comment removed"}

@router.get("/")
def read_comments(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    comments = db.query(Comment).offset(skip).limit(limit).all()
    return comments