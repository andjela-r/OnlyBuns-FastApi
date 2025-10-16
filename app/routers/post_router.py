from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.security import get_current_user
from app.shemas.post import PostBase, PostResponse
from app.shemas.comment import CommentWithUserAndPost
from app.services.comment_service import CommentService
from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.models.comment import Comment
from app.shemas.post import PostDetailWithCounts
from app.shemas.post import PostUpdate
from typing import Optional
import time

router = APIRouter()
comment_service = CommentService()

@router.post("/", response_model=PostResponse)
def create_post(post: PostResponse, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.query(User).filter(User.id == user.id).first():
        raise HTTPException(status_code=404, detail="User not found")

    db_post = Post(
        registereduserid = user.id,
        description=post.description,
        image=post.image,
        location_name=post.location.name if post.location.name else None,
        timecreated = time.now(),
        compressedimage=post.compressedimage if post.compressedimage else None,
        isforad=post.isforad if post.isforad is not None else False
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# Ažuriranje postojećeg posta
#@router.put("/{post_id}", response_model=PostBase)
##def update_post(post_id: int, post: PostBase, db: Session = Depends(get_db)):
 #   db_post = db.query(Post).filter(Post.id == post_id).first()
 #   if not db_post:
 #       raise HTTPException(status_code=404, detail="Post not found")

    # Ažuriraj podatke posta
  ##  db_post.description = post.description if post.description else db_post.description
   # db_post.image = post.image if post.image else db_post.image
  #  db_post.compressedimage = post.compressedimage if post.compressedimage else db_post.compressedimage
  #  db_post.location_name = post.location.name if post.location.name else db_post.location_name

   # db.commit()
   # db.refresh(db_post)
   # return db_post

# Brisanje postojećeg posta
@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")

    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted"}

@router.get("/", response_model=list[PostResponse])
def read_posts(skip: int = 0, limit: Optional[int] = None, db: Session = Depends(get_db)):
    posts = (
        db.query(Post)
        .options(joinedload(Post.user), joinedload(Post.comments), joinedload(Post.likes))
        .offset(skip)
    )
    if limit is not None:
        posts = posts.limit(limit)

    results = []
    for post in posts.all():
        results.append(PostResponse(
            id=post.id,
            description=post.description,
            image=post.image,
            compressedimage=post.compressedimage,
            location_name=post.location_name,
            user=post.user,
            timecreated=post.timecreated,
            likes_count=len(post.likes),
            comments_count=len(post.comments),
            isdeleted=post.isdeleted,
            isforad=post.isforad
        ))
    return results

@router.get("/{post_id}/comments", response_model=list[CommentWithUserAndPost])
def read_comments(post_id: int, db: Session = Depends(get_db)):
    comments = comment_service.get_post_comments(db, post_id)
    return comments

@router.get("/{postid}", response_model=PostDetailWithCounts)
def read_post_detail(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).options(
        joinedload(Post.comments).joinedload(Comment.user)
    ).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    like_count = db.query(Like).filter(Like.postid == post.id).count()
    comment_count = db.query(Comment).filter(Comment.postid == post.id).count()

    # prva 3 komentara
    comments = post.comments[:3]

    return PostDetailWithCounts(
        id=post.id,
        description=post.description,
        image=post.image,
        likes_count=like_count,
        comments_count=comment_count,
        comments=comments,
        is_owner=post.userid == current_user.id  # flag za frontend da vidi edit/delete
    )

@router.post("/{postid}/like")
def like_post(postid: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == postid, Post.isdeleted == False).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(Like).filter(Like.postid == postid, Like.userid == current_user.id).first()
    if existing_like:
        # ako već lajkovano, ukloni
        db.delete(existing_like)
        db.commit()
        return {"liked": False}
    else:
        like = Like(postid=postid, userid=current_user.id)
        db.add(like)
        db.commit()
        return {"liked": True}

@router.put("/{post_id}")
def edit_post(post_id: int, post_data: PostUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.isdeleted == False).first()
    if not post or post.registereduserid != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    post.description = post_data.description
    post.location_name = post_data.location_name
    db.commit()
    db.refresh(post)
    return post

@router.get("/by-user/{username}", response_model=list[PostResponse])
def read_posts_by_user(username: str, db: Session = Depends(get_db)):
    name, surname = username.split("_")
    posts = (
        db.query(Post)
        .join(User)
        .options(joinedload(Post.user), joinedload(Post.comments), joinedload(Post.likes))
        .filter(User.name == name, User.surname == surname)
        .all()
    )
    return [
        PostResponse(
            id=p.id,
            description=p.description,
            image=p.image,
            compressedimage=p.compressedimage,
            location_name=p.location_name,
            user=p.user,
            timecreated=p.timecreated,
            likes_count=len(p.likes),
            comments_count=len(p.comments),
            isdeleted=p.isdeleted,
            isforad=p.isforad,
        )
        for p in posts
    ]

''''
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