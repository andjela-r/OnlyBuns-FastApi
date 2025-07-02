from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from app.routers.post_router import read_posts
from app.db.session import get_db
from app.security import get_current_user
from app.models.user import User
from app.models.post import Post
from app.shemas.post import PostWLikes
from datetime import datetime, timedelta
from typing import Annotated

router = APIRouter()

@router.get("/total_count")
def get_totals(user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):
    
    # Total count of posts
    total_posts = len(read_posts(db=db)) 

    # Count of posts in the last 30 days
    now = datetime.now()
    thirty_days_ago = now - timedelta(days=30)
    recent_posts = db.query(func.count(Post.id)).filter(Post.timecreated >= thirty_days_ago).scalar()

    return {
        "total_posts": total_posts,
        "posts_last_30_days": recent_posts
    }


@router.get("/top_liked", response_model=list[PostWLikes])
def get_top_liked_posts(
    user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    seven_days_ago = datetime.now() - timedelta(days=7)

    top_posts = (
        db.query(Post)
        .outerjoin(Post.likes)
        .filter(Post.timecreated >= seven_days_ago)  # Filter first
        .group_by(Post.id)
        .order_by(desc(func.count(Post.likes)))
        .options(joinedload(Post.likes))
        .limit(5)
        .all()
    )

    return top_posts

@router.get("/top_liked_all_time", response_model=list[PostWLikes])
def get_top_liked_all_time(
    user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    top_posts = (
        db.query(Post)
        .outerjoin(Post.likes)
        .group_by(Post.id)
        .order_by(desc(func.count(Post.likes)))
        .options(joinedload(Post.likes))
        .limit(5)
        .all()
    )

    return top_posts