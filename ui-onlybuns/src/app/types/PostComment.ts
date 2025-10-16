import {Post, RegisteredUser} from "@/app/types/Post";

export interface PostComment {
    id: number,
    content: string,
    user: RegisteredUser,
    post: Post,
    timecreated: string,
}