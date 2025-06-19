from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.shemas.post import PostBase, PostResponse, PostUpdate
from app.models.post import Post
from app.models.user import User

router = APIRouter()

# Kreiranje novog posta
@router.post("/", response_model=PostResponse)
def create_post(post: PostBase, db: Session = Depends(get_db)):
    # Proveri da li korisnik postoji
    if not db.query(User).filter(User.id == post.registereduserid).first():
        raise HTTPException(status_code=404, detail="User not found")

    # Kreiranje novog posta
    db_post = Post(
        registereduserid = post.registereduserid,
        description=post.description,
        image=post.image,
        location=post.location
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# Ažuriranje postojećeg posta
@router.put("/{postid}", response_model=PostUpdate)
def update_post(postid: int, post: PostUpdate, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == postid).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Ažuriraj podatke posta
    db_post.description = post.description if post.description else db_post.description
    db_post.image = post.image if post.image else db_post.image
    db_post.compressedimage = post.compressedimage if post.compressedimage else db_post.compressedimage
    db_post.location = post.location if post.location else db_post.location
    
    db.commit()
    db.refresh(db_post)
    return db_post

# Brisanje postojećeg posta
@router.delete("/{postid}")
def delete_post(postid: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == postid).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")

    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted"}

@router.get("/")
def read_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = db.query(Post).offset(skip).limit(limit).all()
    return posts
'''''''''
@router.get("/posts/", response_model=List[PostResponse])
def read_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = db.query(Post).offset(skip).limit(limit).all()
    
    # Count likes and comments manually before returning the posts
    for post in posts:
        # Count likes (adjust based on your model structure)
        post.likes_count = len(post.likes)  # assuming post.likes is a relationship
        post.comments_count = len(post.comments)  # assuming post.comments is a relationship
    
    return [PostResponse.model_validate(post) for post in posts]

# Čitanje jednog posta na osnovu ID
@router.get("/{postid}", response_model=PostResponse)
def read_post(postid: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == postid).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db_post.likes = db.query(func.count(Like.postid)).filter(Like.postid == db_post.id).scalar()
    db_post.comments = db.query(func.count(Comment.id)).filter(Comment.postid == db_post.id).scalar()
    return db_post

'''