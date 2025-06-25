"use client";
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Post } from '../types/Post';
import { fetchPublicPosts } from '../lib/api'; // Assuming you have this API function

// This is a mock function to add locations to your posts.
// In a real application, this location data should come from your database with the post.
const addLocationsToPosts = (posts: Omit<Post, 'location'>[]): Post[] => {
    const serbiaCenter = { lat: 44.20, lng: 20.92 }; // Centered on Serbia

    return posts.map((post) => ({
        ...post,
        location: {
            name: "Some address", // Using the post title as the location name
            latitude: serbiaCenter.lat + (Math.random() - 0.5) * 5, // Random locations across a wider area
            longitude: serbiaCenter.lng + (Math.random() - 0.5) * 5,
        }
    }));
};

const MapPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const fetchedPosts = await fetchPublicPosts();
                const postsWithLocations = addLocationsToPosts(fetchedPosts);
                setPosts(postsWithLocations);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    // The map component needs to be loaded on the client side.
    // We use next/dynamic to prevent server-side rendering for this component.
    const MapComponent = useMemo(() => dynamic(
        () => import('../components/Map'),
        { 
            loading: () => <p>Loading map...</p>,
            ssr: false 
        }
    ), []);

    if (loading) return <div>Loading posts...</div>;

    return (
        <div className="w-full h-screen">
            <MapComponent posts={posts} />
        </div>
    );
};

export default MapPage;
