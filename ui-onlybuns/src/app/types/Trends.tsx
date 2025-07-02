export interface Post {
  id: string;
  content: string;
  likeCount: number;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  likesGiven: number;
}

export interface NetworkStats {
  totalPosts: number;
  postsLast30Days: number;
}