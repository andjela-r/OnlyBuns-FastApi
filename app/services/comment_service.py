from sqlalchemy.orm import Session, joinedload
from app.models.comment import Comment
from app.models.user import User  

class CommentService:

    def __init__(self):
        pass


    def get_post_comments(self, db: Session, post_id: int):
        """
        Retrieve all comments for a given post, including user and post info.
        """
        comments = (
            db.query(Comment)
            .options(
                joinedload(Comment.user),   
                joinedload(Comment.post)
            )
            .filter(Comment.postid == post_id)
            .all()
        )
        return comments