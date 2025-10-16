"use client";
import React, { useEffect, useState } from 'react';
import { Post } from '../types/Post';
import { fetchPublicPosts, likePost, updatePost, addComment, fetchCommentsByPostId, deletePost  } from '../lib/api';
import Link from "next/link";
import Image from "next/image";
import CommentsList from "@/app/components/commentList";

const PublicPostFeed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [commentsRefresh, setCommentsRefresh] = useState<{[key:number]:number}>({});
    const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editInputs, setEditInputs] = useState<{ description: string; location: string }>({
        description: "",
        location: ""
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);

        if(token){
            const user = localStorage.getItem('username');
            setCurrentUser(user);
        }

        const user = localStorage.getItem('user_name'); // <-- make sure this key matches what you set on login
        setCurrentUser(user);

        const loadPosts = async () => {
            try {
                const fetchedPosts = await fetchPublicPosts(20);
                setPosts(fetchedPosts);

                const initLikedPosts: { [key: number]: boolean } = {};
                fetchedPosts.forEach(posts => {
                    initLikedPosts[posts.id] = false;
                });
                setLikedPosts(initLikedPosts);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    const handleEditClick = (post: Post) => {
        setEditingPostId(post.id);
        setEditInputs({ description: post.description, location: post.location_name || ""});
    }

    const handleDeletePost = async (postId: number) => {
        const token = localStorage.getItem("access_token")!;
        try {
            await deletePost(postId, token); // Implement deletePost in API
            setPosts(prev => prev.filter(p => p.id !== postId)); // remove from UI immediately
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleLike = async (postId: number) => {  
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }

        try {
            const result = await likePost(postId);
            setPosts(prev =>
                prev.map(p =>
                    p.id === postId
                        ? { ...p, likes_count: result.liked ? p.likes_count + 1 : p.likes_count - 1 }
                        : p
                )
            );
        setLikedPosts(prev => ({
            ...prev,
            [postId]: result.liked
        }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (postId: number) => {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }
        const content = commentInputs[postId]; 
        if (!content || content.trim() === "") return;

        try {
            const token = localStorage.getItem("access_token")!; // token treba za API
            await addComment(postId, content, token);
            setCommentInputs(prev => ({ ...prev, [postId]: "" }));
            setActiveCommentPostId(prev => prev === postId ? null : postId);

            setPosts(prev =>
              prev.map(p =>
                p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
              )
            );
            const updatedComments = await fetchCommentsByPostId(postId);
            setCommentsRefresh(prev => ({
                ...prev,
                [postId]: (prev[postId] || 0) + 1
              }));
        } catch (err: any) {
            console.error(err);
            alert(err.message);
    }
    };   

    const handleSaveEdit = async (postId: number) => {
        const token = localStorage.getItem("access_token")!;
        try {
            await updatePost(postId, editInputs.description, editInputs.location, token); // implement API
            setPosts(prev =>
                prev.map(p => p.id === postId ? { ...p, description: editInputs.description, location_name: editInputs.location } : p)
            );
            setEditingPostId(null);
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };
    

    const closeModal = () => setShowModal(false);

    if (loading) return <div className="text-center text-gray-500 py-10">Loading posts...</div>;

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-4 flex flex-col items-center max-w-2xl">
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
                            <h2 className="text-2xl font-bold mb-2 text-gray-800">Join the Conversation!</h2>
                            <p className="mb-6 text-gray-600">You need to be logged in to like or comment.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <a href="/login" className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors">Login</a>
                                <a href="/register" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Register</a>
                            </div>
                            <button onClick={closeModal} className="mt-6 text-sm text-gray-500 hover:underline">Maybe later</button>
                        </div>
                    </div>
                )}

                {posts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200/80 p-4 sm:p-6 rounded-xl shadow-sm mb-6 w-full">
                        <div className="flex items-center mb-4 w-full">
                            <div>
                                {post.user ? (
                                    <Link href={`/users/${post.user.name}_${post.user.surname}`} className="font-bold text-gray-800 hover:text-pink-600 transition-colors">
                                        {post.user.name} {post.user.surname}
                                    </Link>
                                ) : (
                                    <h3 className="text-gray-800 font-bold">Anonymous User</h3>
                                )}
                                <p className="text-gray-500 text-xs">{new Date(post.timecreated).toLocaleString()}</p>
                            </div>
                        

                        {currentUser && post.user?.name === currentUser && (
                            <div className="relative ml-auto">
                                <button className="text-gray-500 hover:text-gray-700 text-3xl leading-[2rem]" onClick={() => setDropdownOpen(prev => prev === post.id ? null : post.id)}>
                                    ⋮
                                </button>
                                {dropdownOpen === post.id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            onClick={() => handleEditClick(post)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                                            onClick={() => handleDeletePost(post.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                        {editingPostId === post.id ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={editInputs.description}
                                    onChange={(e) => setEditInputs(prev => ({ ...prev, description: e.target.value }))}
                                />
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={editInputs.location}
                                    onChange={(e) => setEditInputs(prev => ({ ...prev, location: e.target.value }))}
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="bg-green-500 text-white px-4 py-1 rounded"
                                        onClick={() => handleSaveEdit(post.id)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-300 px-4 py-1 rounded"
                                        onClick={() => setEditingPostId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-700 text-base mb-4">{post.description}</p>
                                <p className="text-gray-500 text-sm mb-4">{post.location_name}</p>
                            </>
                        )}


                       {/* <p className="text-gray-700 text-base mb-4">{post.description}</p>*/}
                        
                        <div className="relative w-full h-auto mb-4 bg-gray-100 rounded-lg">
                            <img
                                src={post.image || '/placeholder.png'}
                                alt="Post image"
                                className="w-full max-h-[500px] h-auto rounded-lg object-contain mx-auto"
                            />
                        </div>

                        <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                             <span>{post.likes_count} Likes</span>
                             <span>{post.comments_count} Comments</span>
                        </div>

                        <div className="flex justify-around items-center pt-3 border-t border-gray-200/80">
                            <button
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center gap-2 font-semibold p-2 rounded-lg transition-colors ${
                                    likedPosts[post.id] ? "text-pink-600" : "text-gray-600 hover:text-pink-600"
                                }`}
                            >
                                <Image
                                    src="/images/like.png"
                                    alt="Like icon"
                                    width={20}
                                    height={20}
                                />
                                Like
                            </button>
                            <button
                                onClick={() =>
                                    setActiveCommentPostId((prev) => (prev === post.id ? null : post.id))
                                }
                                className="flex items-center gap-2 text-gray-600 font-semibold hover:text-pink-600 transition-colors p-2 rounded-lg"
                            >
                                <Image src="/images/comments.png" alt="Comment icon" width={20} height={20} />
                                Comment
                            </button>

                        </div>
                        
                        {activeCommentPostId === post.id && (
                        <div className="mt-2">
                            <textarea
                                className="w-full border p-2 rounded resize-none"
                                placeholder="Write a comment…"
                                value={commentInputs[post.id] || ""}
                                onChange={(e) =>
                                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                                }
                            />
                            <button
                            className="mt-2 bg-pink-500 text-white px-4 py-1 rounded"
                            onClick={() => handleComment(post.id)
                            }
                            >
                            Submit
                            </button>
                        </div>
                        )}

                        <CommentsList postId={post.id} 
                               commentsRefresh={commentsRefresh[post.id] || 0}
                               onCommentAdded={async () => {
                             console.log("Comment added, reload CommentsList");
                          }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicPostFeed;