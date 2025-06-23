"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { Post, RegisteredUser } from '../types/Post';

interface UserProfile extends RegisteredUser {
    email: string;
    address: string;
    followersCount: number;
    followingCount: number;
}

const API_BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
    // Provera da li se kod izvršava u browseru pre pristupa localStorage
    if (typeof window === 'undefined') {
        return {};
    }
    const token = localStorage.getItem('access_token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const getMyProfile = async (): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
};

const getMyPosts = async (): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts/me`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
};

const getMyFollowers = async (): Promise<RegisteredUser[]> => {
    const response = await fetch(`${API_BASE_URL}/users/me/followers`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch followers');
    return response.json();
};

const getMyFollowing = async (): Promise<RegisteredUser[]> => {
    const response = await fetch(`${API_BASE_URL}/users/me/following`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch following');
    return response.json();
};

const updateProfile = async (data: { name?: string, surname?: string, address?: string, password?: string }) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
};

const SettingsIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.23l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.23l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const XIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);


const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-white p-4 rounded shadow-md mb-4 w-full">
        <p className="text-gray-800 text-xl mb-2">{post.description}</p>
        {post.image && <img src={post.image} alt="Post image" className="w-full h-auto mt-2 rounded"/>}
        <p className="text-gray-500 text-sm mt-2">{new Date(post.timecreated).toLocaleString()}</p>
        <hr className="border-t border-gray-300 my-2"/>
        <div className="flex justify-between items-center text-gray-600 text-sm">
            <span>{post.likes} Likes</span>
            <span>{post.comments} Comments</span>
        </div>
    </div>
);

const UserCard = ({ user }: { user: RegisteredUser }) => (
    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
        <div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-xl mr-4">
            {user.name.charAt(0)}{user.surname.charAt(0)}
        </div>
        <a href={`/users/${user.name}${user.surname}`} className="font-semibold text-gray-800 hover:text-green-800">
            {user.name} {user.surname}
        </a>
    </div>
);

const EditProfileModal = ({ isOpen, onClose, currentUser, onSave }: { isOpen: boolean, onClose: () => void, currentUser: UserProfile, onSave: (data: any) => Promise<void> }) => {
    const [name, setName] = useState(currentUser.name);
    const [surname, setSurname] = useState(currentUser.surname);
    const [address, setAddress] = useState(currentUser.address);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if(isOpen) {
            setName(currentUser.name);
            setSurname(currentUser.surname);
            setAddress(currentUser.address || ''); 
            setPassword('');
            setConfirmPassword('');
            setError('');
        }
    }, [isOpen, currentUser]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password && password !== confirmPassword) {
            setError('Lozinke se ne podudaraju.');
            return;
        }
        try {
            const dataToUpdate: { name: string, surname: string, address: string, password?: string } = { name, surname, address };
            if (password) {
                dataToUpdate.password = password;
            }
            await onSave(dataToUpdate);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Došlo je do greške.');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"><XIcon className="w-6 h-6"/></button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Izmeni Profil</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ime" className="w-full p-3 border rounded-lg"/>
                    <input type="text" value={surname} onChange={e => setSurname(e.target.value)} placeholder="Prezime" className="w-full p-3 border rounded-lg"/>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Adresa" className="w-full p-3 border rounded-lg"/>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nova lozinka" className="w-full p-3 border rounded-lg"/>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Potvrdi novu lozinku" className="w-full p-3 border rounded-lg"/>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Poništi</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800">Sačuvaj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full py-3 font-semibold transition-colors ${ isActive ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500 hover:text-green-600' }`}>
        {label}
    </button>
);

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [followers, setFollowers] = useState<RegisteredUser[]>([]);
    const [following, setFollowing] = useState<RegisteredUser[]>([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const loadInitialData = async () => {
                try {
                    setLoading(true);
                    const profileData = await getMyProfile();
                    setProfile(profileData);
                    const postsData = await getMyPosts();
                    setPosts(postsData);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to load data');
                } finally {
                    setLoading(false);
                }
            };
            loadInitialData();
        }
    }, []);

    useEffect(() => {
        const loadTabData = async () => {
            try {
                if (activeTab === 'followers' && followers.length === 0) {
                    const data = await getMyFollowers();
                    setFollowers(data);
                } else if (activeTab === 'following' && following.length === 0) {
                    const data = await getMyFollowing();
                    setFollowing(data);
                }
            } catch (err) {
                 console.error("Failed to load tab data:", err);
            }
        };
        if (profile) {
            loadTabData();
        }
    }, [activeTab, profile, followers.length, following.length]);

    const handleSaveProfile = async (data: any) => {
        await updateProfile(data);
        const updatedProfile = await getMyProfile();
        setProfile(updatedProfile);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'posts': return <div className="space-y-4">{posts.map(post => <PostCard key={post.id} post={post} />)}</div>;
            case 'following': return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{following.map(user => <UserCard key={user.id} user={user} />)}</div>;
            case 'followers': return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{followers.map(user => <UserCard key={user.id} user={user} />)}</div>;
            default: return null;
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-screen">Učitavanje...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!profile) return <div className="flex justify-center items-center h-screen">Profil nije pronađen.</div>

    return (
        <>
            <main className="bg-gray-50 min-h-screen p-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{profile.name} {profile.surname}</h1>
                                <p className="text-gray-500 mt-1">{profile.email}</p>
                                <p className="text-gray-500">{profile.address || 'Adresa nije navedena'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(true)} className="text-gray-500 hover:text-green-700 p-2 rounded-full hover:bg-gray-100">
                                <SettingsIcon />
                            </button>
                        </div>
                        <hr className="my-4"/>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="font-bold text-xl">{posts.length}</p>
                                <p className="text-gray-500">Objave</p>
                            </div>
                            <div>
                                <p className="font-bold text-xl">{profile.followersCount}</p>
                                <p className="text-gray-500">Pratioci</p>
                            </div>
                            <div>
                                <p className="font-bold text-xl">{profile.followingCount}</p>
                                <p className="text-gray-500">Prati</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl shadow-lg">
                        <nav className="flex justify-around">
                            <TabButton label="Objave" isActive={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
                            <TabButton label="Prati" isActive={activeTab === 'following'} onClick={() => setActiveTab('following')} />
                            <TabButton label="Pratioci" isActive={activeTab === 'followers'} onClick={() => setActiveTab('followers')} />
                        </nav>
                        <div className="p-4">{renderContent()}</div>
                    </div>
                </div>
            </main>
            
            {profile && <EditProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentUser={profile} onSave={handleSaveProfile} />}
        </>
    );
}
