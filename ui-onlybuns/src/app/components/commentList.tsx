"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {PostComment} from "../types/PostComment"
import {fetchCommentsByPostId, fetchPublicPosts, addComment} from "@/app/lib/api";


interface CommentsListProps {
    postId: number;
    commentsRefresh?: number;
    onCommentAdded?: () => void;
}

export default function CommentsList({ postId, commentsRefresh = 0, onCommentAdded  }: CommentsListProps){
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleAddComment = async () => {
        const content = prompt("Enter your comment:");
        if (!content) return;

        try {
            const token = localStorage.getItem("access_token")!;
            await addComment(postId, content, token); // poziv API-ja da se doda komentar
            const updatedComments = await fetchCommentsByPostId(postId);
            setComments(updatedComments);
            if (onCommentAdded) onCommentAdded();

        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    useEffect(() => {
       const loadComments = async () => {
           try {
               let fetchedComments = await fetchCommentsByPostId(postId);
               setComments(fetchedComments);
           } catch (error) {
               console.error(error);
           } finally {
               setLoading(false);
           }
       }
       loadComments();
    }, [postId, commentsRefresh]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>

    return (
        <div className="my-2 rounded">
             {comments.length !== 0 ? (
                comments
                    .sort((a, b) => new Date(b.timecreated).getTime() - new Date(a.timecreated).getTime())
                    .slice(0,3)
                    
                    .map((comment) => (
                    <div key={comment.id} className="mb-3 bg-gray-50 my-1 rounded shadow-md p-3">
                        <div className="flex items-center">
                            <p>
                                <Link 
                                    href={`/users/${comment.user.name}${comment.user.surname}`}
                                    className="font-bold hover:text-blue-800"
                                >
                                    {comment.user.name} {comment.user.surname}
                                </Link>
                            </p>
                            <p className="text-sm text-gray-500">&nbsp;•&nbsp;</p>
                            <p className="text-sm text-gray-500">{new Date(comment.timecreated).toLocaleString()}</p>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                ))
            ) : (
                <div>No comments yet.</div>
            )}
        </div>
    );
};