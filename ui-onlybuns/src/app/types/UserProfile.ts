import { RegisteredUser } from '../types/Post';

export interface UserProfile extends RegisteredUser {
    username: string;
    email: string;
    address: string;
    followers: number;
    posts_count: number;
    following: number;
    latitude?: number;
    longitude?: number;
}