"use client";

import React, { useState, useEffect } from 'react';
import { Post, RegisteredUser } from '../types/Post'; 
import { UserProfile } from '../types/UserProfile';
import { getMyProfile, getMyPosts, updateProfile, getMyFollowers, getMyFollowing, getUserByUsername, getUserPosts, getUserFollowers, getUserFollowing } from '../lib/api';
import { SettingsIcon } from "../components/Icons";
import { PostCard, UserCard, EditProfileModal, TabButton } from '../components/Profile';


interface ProfilePageProps {
    username?: string;
}

export default function ProfilePage({ username }: ProfilePageProps = {}) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [followers, setFollowers] = useState<RegisteredUser[]>([]);
    const [following, setFollowing] = useState<RegisteredUser[]>([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (!token) { window.location.href = '/login'; return; }
            const loadInitialData = async () => {
                try {
                    setLoading(true);
                    
                    if (username) {
                        // Loading another user's profile
                        setIsCurrentUser(false);
                        const profileData = await getUserByUsername(username);
                        setProfile(profileData);
                        const postsData = await getUserPosts(username);
                        setPosts(postsData);
                        setFollowers(await getUserFollowers(username));
                        setFollowing(await getUserFollowing(username));
                    } else {
                        // Loading current user's profile
                        setIsCurrentUser(true);
                        const profileData = await getMyProfile();
                        setProfile(profileData);
                        const postsData = await getMyPosts();
                        setPosts(postsData);
                        setFollowers(await getMyFollowers());
                        setFollowing(await getMyFollowing());
                    }
                } catch (err) { 
                    setError(err instanceof Error ? err.message : 'Failed to load data');
                } finally { 
                    setLoading(false); 
                }
            };
            loadInitialData();
        }
    }, [username]);

    useEffect(() => {
        if (profile) {
            const loadTabData = async () => {
                try {
                    if (activeTab === 'followers' && followers.length === 0) { 
                        if (isCurrentUser) {
                            setFollowers(await getMyFollowers()); 
                        } else if (username) {
                            setFollowers(await getUserFollowers(username));
                        }
                    } 
                    else if (activeTab === 'following' && following.length === 0) { 
                        if (isCurrentUser) {
                            setFollowing(await getMyFollowing()); 
                        } else if (username) {
                            setFollowing(await getUserFollowing(username));
                        }
                    }
                } catch (err) { console.error("Failed to load tab data:", err); }
            };
            loadTabData();
        }
    }, [activeTab, profile, followers.length, following.length, isCurrentUser, username]);

   const handleSaveProfile = async (data: any) => {
    try {
        await updateProfile(data);
        setProfile(await getMyProfile());
    } catch (err) {
        setError("Error: " + (err instanceof Error ? err.message : 'Failed to update profile'));
    }
};

    const renderContent = () => {
        switch (activeTab) {
            case 'posts': return <div className="space-y-4">{posts.map(post => <PostCard key={post.id} post={post} />)}</div>;
            case 'following': return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{following.map(user => <UserCard key={user.id} user={user} />)}</div>;
            case 'followers': return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{followers.map(user => <UserCard key={user.id} user={user} />)}</div>;
            default: return null;
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!profile) return <div className="flex justify-center items-center h-screen">Profile not found.</div>;

    return (
        <>
            <main className="bg-gray-50 min-h-screen p-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{profile.name} {profile.surname}</h1>
                                <p className="text-gray-500 mt-1">{profile.email}</p>
                                <p className="text-gray-500">{profile.address || 'Address not provided'}</p>
                            </div>
                            {isCurrentUser && (
                                <button onClick={() => setIsModalOpen(true)} className="text-gray-500 hover:text-green-700 p-2 rounded-full hover:bg-gray-100">
                                    <SettingsIcon className="w-6 h-6"/>
                                </button>
                            )}
                        </div>
                        <hr className="my-4"/>
                        <div className="flex justify-around text-center">
                            <div><p className="font-bold text-xl">{posts.length}</p><p className="text-gray-500">Posts</p></div>
                            <div><p className="font-bold text-xl">{following.length}</p><p className="text-gray-500">Following</p></div>
                            <div><p className="font-bold text-xl">{followers.length}</p><p className="text-gray-500">Followers</p></div>
                        </div>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-lg">
                        <nav className="flex justify-around"><TabButton label="Posts" isActive={activeTab === 'posts'} onClick={() => setActiveTab('posts')} /><TabButton label="Following" isActive={activeTab === 'following'} onClick={() => setActiveTab('following')} /><TabButton label="Followers" isActive={activeTab === 'followers'} onClick={() => setActiveTab('followers')} /></nav>
                        <div className="p-4">{renderContent()}</div>
                    </div>
                </div>
            </main>
            {isModalOpen && isCurrentUser && <EditProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentUser={profile} onSave={handleSaveProfile} />}
        </>
    );
}
