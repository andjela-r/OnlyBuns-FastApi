"use client";
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Post } from '../types/Post';
import { fetchPublicPosts, getMyProfile, getPostLocation } from '../lib/api'; 
import { UserProfile } from '../types/UserProfile';
import { Location } from '../types/Location';

const addLocationsToPosts = async (posts: Post[]): Promise<Post[]> => {
    const postsWithLocations = await Promise.all(
        posts.map(async (post) => {
            if (post.location_name) {
                try {
                    const locationData = await getPostLocation(post.location_name);
                    const location: Location | null = locationData && locationData.name && locationData.latitude && locationData.longitude
                        ? {
                            name: locationData.name,
                            latitude: locationData.latitude,
                            longitude: locationData.longitude,
                        }
                        : null;
                    return { ...post, location };
                } catch (e) {
                    return { ...post, location: null };
                }
            } else {
                return { ...post, location: null };
            }
        })
    );
    return postsWithLocations;
};

const MapPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [fetchedPosts, fetchedUser] = await Promise.all([
                    fetchPublicPosts(),
                    getMyProfile()
                ]);
                // Fetch locations for each post
                const postsWithLocations = await addLocationsToPosts(fetchedPosts);
                console.log("Posts with locations:", postsWithLocations);
                setPosts(postsWithLocations);
                setCurrentUser(fetchedUser);
            } catch (error) {
                console.error("Failed to fetch posts or user:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const MapComponent = useMemo(() => dynamic(
        () => import('../components/Map'),
        { 
            loading: () => <p>Loading map...</p>,
            ssr: false 
        }
    ), []);

    if (loading || !currentUser) return <div>Loading posts...</div>;

    return (
        <div className="w-full h-screen">
            <MapComponent posts={posts} currentUser={currentUser} />
        </div>
    );
};

export default MapPage;