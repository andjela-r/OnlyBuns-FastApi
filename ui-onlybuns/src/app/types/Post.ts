import { Location } from "./Location";

export interface RegisteredUser {
    id: string;
    name: string;
    surname: string;
}

export interface Post {
    id: string;
    user: RegisteredUser;  // User information
    description: string;
    image: string | null;
    compressedImage: string | null;
    location: Location | null;
    timecreated: string;
    likes: number;
    comments: number;
    isDeleted: boolean;
    isForAd: boolean;
    forAd: boolean;
    deleted: boolean;
}

export interface MapPost {
    id: string;
    user: RegisteredUser;  // User information
    description: string;
    image: string | null;
    compressedImage: string | null;
    location: Location | null
    timecreated: string;
    likes: number;
    comments: number;
    isDeleted: boolean;
    isForAd: boolean;
    forAd: boolean;
    deleted: boolean;
}
