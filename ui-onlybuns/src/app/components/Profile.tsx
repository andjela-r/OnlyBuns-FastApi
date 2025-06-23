import React, { useState, useEffect } from 'react';
import { Post, RegisteredUser } from '../types/Post'; 
import { UserProfile } from '../types/UserProfile';
import { XIcon } from "../components/Icons";


export const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-white p-4 rounded shadow-md mb-4 w-full"><p className="text-gray-800 text-xl mb-2">{post.description}</p>{post.image && <img src={post.image} alt="Post image" className="w-full h-auto mt-2 rounded"/>}<p className="text-gray-500 text-sm mt-2">{new Date(post.timecreated).toLocaleString()}</p><hr className="border-t border-gray-300 my-2"/><div className="flex justify-between items-center text-gray-600 text-sm"><span>{post.likes} Likes</span><span>{post.comments} Comments</span></div></div>
);

export const UserCard = ({ user }: { user: RegisteredUser }) => (
    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm"><div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-xl mr-4">{user.name.charAt(0)}{user.surname.charAt(0)}</div><a href={`/users/${user.id}`} className="font-semibold text-gray-800 hover:text-green-800">{user.name} {user.surname}</a></div>
);

export const EditProfileModal = ({ isOpen, onClose, currentUser, onSave }: { isOpen: boolean, onClose: () => void, currentUser: UserProfile, onSave: (data: any) => Promise<void> }) => {
    const [name, setName] = useState(currentUser.name);
    const [surname, setSurname] = useState(currentUser.surname);
    const [address, setAddress] = useState(currentUser.address);
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { if(isOpen) { setName(currentUser.name); setSurname(currentUser.surname); setAddress(currentUser.address || ''); setPassword(''); setConfirmPassword(''); setError(''); } }, [isOpen, currentUser]);
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password && password !== confirm_password) { setError('Passwords do not match.'); return; }
        try {
            const dataToUpdate: { name: string, surname: string, address: string, password?: string, confirm_password?: string } = { name, surname, address };
            if (password) { dataToUpdate.password = password; }
            if (confirm_password) { dataToUpdate.confirm_password = confirm_password; }
            await onSave(dataToUpdate);
            onClose();
        } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred.'); }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"><XIcon className="w-6 h-6"/></button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Edit Profile</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full p-3 border rounded-lg"/>
                    <input type="text" value={surname} onChange={e => setSurname(e.target.value)} placeholder="Surname" className="w-full p-3 border rounded-lg"/>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="w-full p-3 border rounded-lg"/>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password (optional)" className="w-full p-3 border rounded-lg"/>
                    <input type="password" value={confirm_password} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full p-3 border rounded-lg"/>
                    <div className="flex justify-end gap-4 mt-6"><button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button><button type="submit" className="px-6 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800">Save</button></div>
                </form>
            </div>
        </div>
    );
};

export const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full py-3 font-semibold transition-colors ${ isActive ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500 hover:text-green-600' }`}>{label}</button>
);