import {Post, RegisteredUser} from "@/app/types/Post";

export interface PostComment {
    id: string,
    content: string,
    user: RegisteredUser,
    post: Post,
    timecreated: string,
}