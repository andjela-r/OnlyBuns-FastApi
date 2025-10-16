import { Location } from "./Location";

export interface RegisteredUser {
    id: number;
    name: string;
    surname: string;
    username: string;
}

export interface Post {
    id: number;
    user: RegisteredUser;  // User information
    description: string;
    image: string | null;
    compressedImage: string | null;
    location_name: string | null;
    location: Location | null;  // Location information
    timecreated: string;
    likes_count: number;
    comments_count: number;
    isDeleted: boolean;
    isForAd: boolean;
    forAd: boolean;
    newComment?: string;
}
