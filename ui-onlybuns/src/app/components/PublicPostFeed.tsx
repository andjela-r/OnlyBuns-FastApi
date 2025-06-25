"use client";
import React, { useEffect, useState } from 'react';
import { Post } from '../types/Post';
import { fetchPublicPosts } from '../lib/api';
import Link from "next/link";
import Image from "next/image";
import CommentsList from "@/app/components/commentList";

const PublicPostFeed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);

        const loadPosts = async () => {
            try {
                const fetchedPosts = await fetchPublicPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    const handleLike = (postId: string) => {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }
        console.log(`Liked post with ID: ${postId}`);
    };

    const handleComment = (postId: string) => {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }
        console.log(`Commented on post with ID: ${postId}`);
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
                        <div className="flex items-center mb-4">
                            <div>
                                {post.user ? (
                                    <Link href={`/users/${post.user.name}${post.user.surname}`} className="font-bold text-gray-800 hover:text-pink-600 transition-colors">
                                        {post.user.name} {post.user.surname}
                                    </Link>
                                ) : (
                                    <h3 className="text-gray-800 font-bold">Anonymous User</h3>
                                )}
                                <p className="text-gray-500 text-xs">{new Date(post.timecreated).toLocaleString()}</p>
                            </div>
                        </div>

                        <p className="text-gray-700 text-base mb-4">{post.description}</p>
                        
                        <div className="relative w-full h-auto mb-4 bg-gray-100 rounded-lg">
                             {/*
                                CHANGE HERE: Added max-h-[500px] to limit height and object-contain to prevent cropping.
                                A light gray background is added for any letterboxing.
                             */}
                            <img
                                src={post.image || '/placeholder.png'}
                                alt="Post image"
                                className="w-full max-h-[500px] h-auto rounded-lg object-contain mx-auto"
                            />
                        </div>

                        <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                            <span>{post.likes} 15 Likes</span>
                            <span>{post.comments} 1 Comments</span>
                        </div>

                        <div className="flex justify-around items-center pt-3 border-t border-gray-200/80">
                            <button
                                onClick={() => handleLike(post.id)}
                                className="flex items-center gap-2 text-gray-600 font-semibold hover:text-pink-600 transition-colors p-2 rounded-lg"
                            >
                                <Image src="/images/like.png" alt="Like icon" width={20} height={20} />
                                Like
                            </button>
                            <button
                                onClick={() => handleComment(post.id)}
                                className="flex items-center gap-2 text-gray-600 font-semibold hover:text-pink-600 transition-colors p-2 rounded-lg"
                            >
                                <Image src="/images/comments.png" alt="Comment icon" width={20} height={20} />
                                Comment
                            </button>
                        </div>
                        <CommentsList postId={post.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicPostFeed;