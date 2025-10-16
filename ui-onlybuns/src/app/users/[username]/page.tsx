"use client";
import { useEffect, useState, use } from "react";
import { Post } from "@/app/types/Post";
import { fetchPublicPosts, getUserByUsername, getFollowersCount, getMyFollowers, getMyFollowing, getFollowingCount, getMe, followUser, unfollowUser   } from "@/app/lib/api";

interface PageProps {
  params: Promise<{ username: string }>; 
}

export default function UserProfilePage({ params }: PageProps) {
  const { username } = use(params);
  const [name, surname] = username.split("_");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

  const userInfo = {
    name,
    surname,
    email: `${name.toLowerCase()}.${surname.toLowerCase()}@example.com`,
    followers: followersCount,
    following: followingCount,
  };

  useEffect(() => {
   (async () => {
      try {
        const allPosts = await fetchPublicPosts();
        setPosts(
          allPosts.filter(
            (p) =>
              p.user?.name.toLowerCase() === name.toLowerCase() &&
              p.user?.surname.toLowerCase() === surname.toLowerCase()
          )
        );

      const data = await getUserByUsername(username);
      setUserId(data.id);

      const followersRes = await getFollowersCount(data.id);
      const followingRes = await getFollowingCount(data.id);
      const followersData = await followersRes;
      const followingData = await followingRes;

      setFollowersCount(followersData.followers);
      setFollowingCount(followingData.following);

      const meRes = await getMe(localStorage.getItem("access_token") || undefined);
      const meData = await meRes;
      const isFollowingRes = await fetch(`http://localhost:8000/users/${meData.id}/following`).then(res => res);
      const followingList = await getMyFollowing();  
      setIsFollowing(followingList.some((u: any) => u.id === data.id));


      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [name, surname]);

const handleFollow = async () => {
  if (!userId) return;
  try {
    await followUser(userId, localStorage.getItem("access_token")!);
    setIsFollowing(true);
    setFollowersCount(followersCount + 1);
  } catch (err) {
    console.error(err);
  }
};

const handleUnfollow = async () => {
  if (!userId) return;
  try {
    await unfollowUser(userId, localStorage.getItem("access_token")!);
    setIsFollowing(false);
    setFollowersCount(followersCount - 1);
  } catch (err) {
    console.error(err);
  }
};


  if (loading) return <div>Loading user...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {userInfo.name} {userInfo.surname}
        </h1>
        <p className="text-gray-500 text-lg">{userInfo.email}</p>

        <div className="flex gap-6 mt-4 text-gray-700">
          <span>
            <strong>{userInfo.following}</strong> Following
          </span>
          <span>
            <strong>{userInfo.followers}</strong> Followers
          </span>
        </div>

        <div className="mt-4">
          {isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Follow
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-gray-500">No posts yet.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded shadow mb-4">
            <p className="text-gray-800">{post.description}</p>
            {post.image && (
              <img src={`/${post.image}`} alt="Post image" className="w-full h-auto mt-2 rounded"/>
            )}
          </div>
        ))
      )}
    </div>
  );
}
