import { Location } from "./Location";

export interface RegisteredUser {
    id: string;
    name: string;
    surname: string;
    username: string;
}

export interface Post {
    id: string;
    user: RegisteredUser;  // User information
    description: string;
    image: string | null;
    compressedImage: string | null;
    location_name: string | null;
    location: Location | null;  // Location information
    timecreated: string;
    likes: number;
    comments: number;
    isDeleted: boolean;
    isForAd: boolean;
    forAd: boolean;
    deleted: boolean;
}
