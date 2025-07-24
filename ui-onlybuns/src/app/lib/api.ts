import { Post } from '../types/Post';
import { PostComment } from '../types/PostComment';
import { UserProfile } from '../types/UserProfile';
import { RegisteredUser } from '../types/Post';
import { Location } from '../types/Location';

const API_BASE_URL = 'http://localhost:8000';

export function getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function fetchPublicPosts(limit?: number | null): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts/?skip=0&limit=${limit || 20}`);
    if (!response.ok) {
        throw new Error('Failed to fetch public posts');
    }
    return response.json();
}

export async function fetchCommentsByPostId(postId: string): Promise<PostComment[]> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/`);
    if (!response.ok) {
        throw new Error('Failed to fetch comments for post');
    }
    return response.json();
}

export async function getMyProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/users/me`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch profile. Please check if you are logged in.');
    return response.json();
}

export async function getMyPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/users/me/posts`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch posts.');
    return response.json();
}

export async function getMyFollowers(): Promise<RegisteredUser[]> {
    const response = await fetch(`${API_BASE_URL}/users/me/followers`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch followers.');
    return response.json();
}

export async function getMyFollowing(): Promise<RegisteredUser[]> {
    const response = await fetch(`${API_BASE_URL}/users/me/following`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch following users.');
    return response.json();
}

export async function updateProfile(data: { name?: string, surname?: string, address?: string, password?: string }) {
    console.log("Updating profile with data:", data);
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile.');
    return response.json();
}

export async function getPostLocation(post_location: string): Promise<Location | null> {
    const response = await fetch(`${API_BASE_URL}/locations/name/${post_location}`);
    if (!response.ok) {
        console.error('Failed to fetch post location:', response.statusText);
        return null;
    }
    const data = await response.json();
    return data as Location;
}

