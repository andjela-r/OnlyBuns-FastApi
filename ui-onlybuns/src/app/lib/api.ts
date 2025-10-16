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

export async function fetchCommentsByPostId(postId: number): Promise<PostComment[]> {
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
  const response = await fetch(`${API_BASE_URL}/users/me/followers`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    console.error("Failed to fetch followers:", response.status, await response.text());
    throw new Error("Failed to fetch followers.");
  }
  return response.json();
}

export async function getMyFollowing(): Promise<RegisteredUser[]> {
  const response = await fetch(`${API_BASE_URL}/users/me/following`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    console.error("Failed to fetch following:", response.status, await response.text());
    throw new Error("Failed to fetch following users.");
  }
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

export const likePost = async (postId: number) => {
    const token = localStorage.getItem("access_token"); 
    if (!token) throw new Error("No access token found");
    console.log("132Sending like with token:123", token);
    try {
        const res = await fetch(`http://localhost:8000/posts/${postId}/like`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            const errData = await res.json();
            console.error("Response error:", errData);
            throw new Error("Failed to like post");
        }

        return await res.json();
    } catch (err) {
        console.error("likePost error:", err);
        throw err;
    }
};
  
  export const addComment = async (postId: number, content: string, token: string) => {
    const res = await fetch(`http://localhost:8000/comments/${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to add comment");
    return res.json();
  };

  export const deletePost = async (postId: number, token: string) => {
    const res = await fetch(`http://localhost:8000/posts/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to delete post");
};
  
export const updatePost = async (
    postId: number,
    description: string,
    location: string,
    token: string
) => {
    const res = await fetch(`http://localhost:8000/posts/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ description: description, location_name: location })
    });

    if (!res.ok) {
        throw new Error("Failed to update post");
    }
    return res.json(); 
};

export async function fetchPostsByUsername(username: string): Promise<Post[]> {
    const response = await fetch(`http://localhost:8000/posts/by-user/${username}`);
    if (!response.ok) throw new Error('Failed to fetch posts by user');
    return response.json();
  }

export async function getUserByUsername(username: string) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`http://localhost:8000/users/by-username/${username}`, {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
  });
  if (res.status === 404) throw new Error("User not found11");
  if (res.status === 401) throw new Error("Unauthorized11");
  if (!res.ok) throw new Error("Unexpected error");
  return res.json();
}

export const getFollowersCount = async (userId: number) => {
  const res = await fetch(`http://localhost:8000/users/${userId}/followers/count`);
  return res.json();
};

export const getFollowingCount = async (userId: number) => {
  const res = await fetch(`http://localhost:8000/users/${userId}/following/count`);
  return res.json();
};

export const getMe = async (token?: string) => {
  const res = await fetch(`http://localhost:8000/users/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
};

export const followUser = async (userId: number, token: string) => {
  const res = await fetch(`http://localhost:8000/users/${userId}/follow`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const unfollowUser = async (userId: number, token: string) => {
  const res = await fetch(`http://localhost:8000/users/${userId}/unfollow`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export async function createGroupChat(name: string, memberIds: (string | number)[], token: string) {
  const res = await fetch(`http://localhost:8000/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ name, is_group: true, members: memberIds }),
  });

  const text = await res.text();
  console.log("createGroupChat →", res.status, text);

  if (!res.ok) throw new Error("Failed to create group chat");
  return JSON.parse(text);
}

export async function myChats(token: string) {
  const res = await fetch(`http://localhost:8000/chats`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to load chats");
  return res.json();
}

export async function addMember(chatId: number, userId: string | number, token: string) {
  const res = await fetch(`http://localhost:8000/chats/${chatId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  const text = await res.text();
  console.log("addMember →", res.status, text);

  if (!res.ok) throw new Error("Failed to add member");
  return JSON.parse(text);
}


export async function removeMember(chatId: number, userId: number, token: string) {
  const res = await fetch(`http://localhost:8000/chats/${chatId}/members`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ user_id: userId })
  });
  if (!res.ok) throw new Error("Failed to remove member");
  return res.json();
}

export async function fetchHistory(token: string, chatId: number, limit = 50, beforeId?: number) {
  const q = new URLSearchParams({ limit: String(limit) });
  if (beforeId) q.set("before_id", String(beforeId));
  const res = await fetch(`http://localhost:8000/chats/${chatId}/messages?` + q.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}

export const sendMessage = async (chatId: number, content: string, token: string) => {
  const res = await fetch(`http://localhost:8000/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};

export const createPrivateChat = async (userId: number, token: string) => {
  const res = await fetch(`http://localhost:8000/chats/direct/${userId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to create private chat");
  return res.json();
};

