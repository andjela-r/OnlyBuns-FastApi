"use client";
import React, {useEffect, useState} from 'react';
import {Post} from '../types/Post';
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
        console.log("Auth token:", token, "isAuthenticated:", !!token);


        const loadPosts = async () => {
            try {
                // Fetch posts
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
    // Call like API here
};

    const handleComment = (postId: string) => {
    if (!isAuthenticated) {
        setShowModal(true);
        return;
    }
    console.log(`Commented on post with ID: ${postId}`);
    // Show comment input or call comment API here
};

    const closeModal = () => setShowModal(false);


    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white-20 container mx-auto p-4 flex flex-col items-center max-w-4xl">
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <h2 className="text-xl font-bold mb-4">Please log in or register</h2>
                        <p className="mb-4">You need to be logged in to like or comment on posts.</p>
                        <div className="flex justify-center gap-4">
                            <a href="/login" className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600">Login</a>
                            <a href="/register" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Register</a>
                        </div>
                        <button onClick={closeModal} className="mt-4 text-gray-500 hover:underline">Close</button>
                    </div>
                </div>
            )}
            {posts.map((post) => (
                <div key={post.id} className="bg-white-20 p-4 rounded shadow-md mb-4 w-full max-w-2xl">

                    {post.user ? (
                        <h3 className="text-gray-800 font-bold">
                            <Link href={`/users/${post.user.name}${post.user.surname}`} className="hover:text-blue-800">
                                {post.user.name} {post.user.surname}
                            </Link>
                        </h3>
                    ) : (
                        <h3 className="text-gray-800">Anonymous User</h3>
                    )}
                    <p className="text-gray-800 text-xl">{post.description}</p>
                    <img src={post.image || '/placeholder.png'} alt="Post" className="w-full h-auto mt-2 rounded"/>
                    <p className="text-gray-800 text-sm">{new Date(post.timecreated).toLocaleString()}</p>
                    <hr className="border-t border-gray-300 my-4"/>
                    <div className="flex justify-between items-center text-gray-600 text-sm">
                        <span>{post.likes} Likes</span>
                        <span>{post.comments} Comments</span>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handleLike(post.id)}
                            className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600 flex items-center"
                        >
                            <Image src="/images/like.png" alt="" width={25} height={10} className="mr-5 mb-2"></Image>
                            Like
                        </button>
                        <button
                            onClick={() => handleComment(post.id)}
                            className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600 flex items-center"
                        >
                            <Image src="/images/comments.png" alt="" width={25} height={25}
                                   className="mr-2 my-1"></Image>
                            Comment
                        </button>
                    </div>
                    <CommentsList postId={post.id}/>
                </div>
            ))}
        </div>
    );
};

export default PublicPostFeed;

