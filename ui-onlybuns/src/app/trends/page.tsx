"use client";

import { useState, useEffect } from "react";
import { User, NetworkStats } from "../types/Trends";
import { Post } from "../types/Post";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8000";
const CACHE_TTL = 60 * 1000;

async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}

async function getCachedPosts<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (typeof window === "undefined") return fetcher();
  const cacheRaw = localStorage.getItem(key);
  if (cacheRaw) {
    const { timestamp, data } = JSON.parse(cacheRaw);
    if (Date.now() - timestamp < CACHE_TTL) {
      console.log(`[Trends] Cache hit for ${key}`);
      return data;
    }
  }
  console.log(`[Trends] Cache miss for ${key}`);
  const data = await fetcher();
  localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  return data;
}

export const getNetworkStats = async (): Promise<NetworkStats> => {
  const data = await fetchWithAuth<{ total_posts: number; posts_last_30_days: number }>("/stats/total_count");
  return {
    totalPosts: data.total_posts,
    postsLast30Days: data.posts_last_30_days,
  };
};

export const getPopularPostsLast7Days = async (): Promise<Post[]> => {
  return getCachedPosts("trends_top7d", async () => {
    const posts = await fetchWithAuth<any[]>("/stats/top_liked");
    return posts.map((p) => ({
      id: p.id,
      user: p.user,
      description: p.description || p.content,
      image: p.image || null,
      compressedImage: p.compressedImage || null,
      location_name: p.location_name || null,
      location: p.location || null,
      timecreated: p.timecreated || p.createdAt,
      likes: p.likes?.length ?? p.like_count ?? 0,
      comments: p.comments?.length ?? p.comment_count ?? 0,
      isDeleted: p.isDeleted ?? false,
      isForAd: p.isForAd ?? false,
      forAd: p.forAd ?? false,
      deleted: p.deleted ?? false,
    }));
  });
};

export const getTop10PostsAllTime = async (): Promise<Post[]> => {
  return getCachedPosts("trends_topall", async () => {
    const posts = await fetchWithAuth<any[]>("/stats/top_liked_all_time");
    return posts.map((p) => ({
      id: p.id,
      user: p.user,
      description: p.description || p.content,
      image: p.image || null,
      compressedImage: p.compressedImage || null,
      location_name: p.location_name || null,
      location: p.location || null,
      timecreated: p.timecreated || p.createdAt,
      likes: p.likes?.length ?? p.like_count ?? 0,
      comments: p.comments ?? 0,
      isDeleted: p.isDeleted ?? false,
      isForAd: p.isForAd ?? false,
      forAd: p.forAd ?? false,
      deleted: p.deleted ?? false,
    }));
  });
};

export const getTopLikersLast7Days = async (): Promise<User[]> => {
  return getCachedPosts("trends_toplikers", async () => {
    const users = await fetchWithAuth<any[]>("/stats/top_likers");
    return users.map((u) => ({
      id: u.user_id || u.id,
      username: u.name || u.username,
      likesGiven: u.like_count || u.likesGiven,
      avatarUrl: u.avatarUrl,
    }));
  });
};


export function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-200">
      <h3 className="text-md font-medium text-gray-500">{title}</h3>
      <p className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">{value}</p>
    </div>
  );
}

function PublicPostFeedCard({ post }: { post: Post }) {
  return (
    <div className="bg-white border border-gray-200/80 p-4 sm:p-6 rounded-xl shadow-sm mb-6 w-full">
      <div className="flex items-center mb-4">
        <div>
          <Link href={`/users/${post.user?.name ?? "unknown"}_${post.user?.surname ?? ""}`}>
            <span className="font-bold text-gray-800 hover:text-pink-600 transition-colors">
              {post.user?.name} {post.user?.surname}
            </span>
          </Link>
          <p className="text-gray-500 text-xs">{new Date(post.timecreated).toLocaleString()}</p>
        </div>
      </div>
      <p className="text-gray-700 text-base mb-4">{post.description}</p>
      {post.image && (
        <div className="relative w-full h-auto mb-4 bg-gray-100 rounded-lg">
          <img
            src={post.image}
            alt="Post image"
            className="w-full max-h-[500px] h-auto rounded-lg object-contain mx-auto"
          />
        </div>
      )}
      <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
        <span>{post.likes} Likes</span>
        <span>{post.comments} Comments</span>
      </div>
    </div>
  );
}

export function PostList({ title, posts }: { title: string; posts: Post[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-5">{title}</h3>
      <ul className="space-y-4">
        {posts?.map((post, index) => (
          <li key={post.id}>
            <span className="text-xl font-bold text-gray-400 w-6 text-center mr-2">{index + 1}.</span>
            <PublicPostFeedCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UserList({ title, users }: { title: string; users: User[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-5">{title}</h3>
      <ul className="space-y-3">
        {users?.map((user, index) => (
          <li key={user.id} className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-gray-400 w-6 text-center">{index + 1}.</span>
              <p className="text-gray-800 font-medium">{user.username}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
              {user.likesGiven} likes
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl text-gray-800 font-semibold">Loading trends...</h1>
        <p className="text-gray-500">Please wait</p>
      </div>
    </div>
  );
}


interface TrendsData {
  stats: NetworkStats | null;
  popularPosts7d: Post[];
  top10PostsAllTime: Post[];
  topLikers7d: User[];
}

function TrendsPage() {
  const [data, setData] = useState<TrendsData>({
    stats: null,
    popularPosts7d: [],
    top10PostsAllTime: [],
    topLikers7d: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          statsData,
          popularPosts7dData,
          top10PostsAllTimeData,
          topLikers7dData,
        ] = await Promise.all([
          getNetworkStats(),
          getPopularPostsLast7Days(),
          getTop10PostsAllTime(),
          getTopLikersLast7Days(),
        ]);
        setData({
          stats: statsData,
          popularPosts7d: popularPosts7dData,
          top10PostsAllTime: top10PostsAllTimeData,
          topLikers7d: topLikers7dData,
        });
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Trends
          </h1>
          <p className="text-gray-600 mt-2">
            Stay in the loop with what’s trending and what everyone’s talking about right now
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatCard
            title="Total number of posts"
            value={data.stats?.totalPosts?.toLocaleString("en-US") || "N/A"}
          />
          <StatCard
            title="Posts in the last 30 days"
            value={data.stats?.postsLast30Days?.toLocaleString("en-US") || "N/A"}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <PostList
            title="🔥 Top 5 posts this week"
            posts={data.popularPosts7d}
          />
          <UserList
            title="👍 Top 10 likers this week"
            users={data.topLikers7d}
          />
        </section>

        <section>
          <PostList
            title="🏆 Top 10 posts of all time"
            posts={data.top10PostsAllTime}
          />
        </section>
      </div>
    </main>
  );
}

export default TrendsPage;