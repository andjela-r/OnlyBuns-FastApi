import { RegisteredUser } from '../types/Post';

export interface UserProfile extends RegisteredUser {
    email: string;
    address: string;
    followers: number;
    posts_count: number;
    following: number;
}