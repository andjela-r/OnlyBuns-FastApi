"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Post } from "../types/Post";
import { UserProfile } from "../types/UserProfile";

export default function AdminHome() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPosts, setMinPosts] = useState<number | "">("");
  const [maxPosts, setMaxPosts] = useState<number | "">("");
  const [sortKey, setSortKey] = useState<"email" | "following" | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const username = "Ian";

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios
      .get("http://localhost:8000/users/adminuserview", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: any) => setUsers(res.data))
      .catch((err: any) => console.error(err));

    axios
      .get("http://localhost:8000/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: any) => setPosts(res.data))
      .catch((err: any) => console.error(err));
  }, []);
    useEffect(() => {
    let result = [...users];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(term) ||
          u.surname?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
      );
    }

    if (minPosts !== "") result = result.filter((u) => u.posts_count >= Number(minPosts));
    if (maxPosts !== "") result = result.filter((u) => u.posts_count <= Number(maxPosts));

    if (sortKey === "email") result.sort((a, b) => a.email.localeCompare(b.email));
    if (sortKey === "following") result.sort((a, b) => b.following - a.following);

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, minPosts, maxPosts, sortKey, users]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-8 text-green-900 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8">Hello, {username}</h1>

      {/* === USERS TABLE SECTION === */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">All Users</h2>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, surname, email..."
            className="border rounded-lg px-4 py-2 flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min posts"
            className="border rounded-lg px-4 py-2 w-32"
            value={minPosts}
            onChange={(e) => setMinPosts(e.target.value ? Number(e.target.value) : "")}
          />
          <input
            type="number"
            placeholder="Max posts"
            className="border rounded-lg px-4 py-2 w-32"
            value={maxPosts}
            onChange={(e) => setMaxPosts(e.target.value ? Number(e.target.value) : "")}
          />
          <select
            className="border rounded-lg px-4 py-2"
            onChange={(e) => setSortKey(e.target.value as "email" | "following" | "")}
          >
            <option value="">Sort by...</option>
            <option value="email">Email (A-Z)</option>
            <option value="following">Following count</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-green-200 rounded-lg">
            <thead className="bg-green-100">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Surname</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Posts</th>
                <th className="p-3 border-b">Following</th>
                <th className="p-3 border-b">Followers</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-green-50 cursor-pointer transition-all"
                  onClick={() => (window.location.href = `/users/${user.username}`)}
                >
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.surname}</td>
                  <td className="p-3 border-b text-green-800">{user.email}</td>
                  <td className="p-3 border-b text-center">{user.posts_count}</td>
                  <td className="p-3 border-b text-center">{user.following}</td>
                  <td className="p-3 border-b text-center">{user.followers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-green-200 rounded-lg hover:bg-green-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-green-200 rounded-lg hover:bg-green-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* === POSTS SECTION === */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="font-semibold text-2xl mb-4 border-b pb-2 sticky top-0 bg-white z-10">All Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="mb-4 border-b pb-3">
            <p className="font-semibold text-green-800">
              {post.user.name} {post.user.surname}
            </p>
            <p className="text-gray-700">{post.description}</p>
            {post.image && (
              <img
                src={post.compressedImage || post.image}
                alt="Post image"
                className="max-w-full mt-2 rounded-xl shadow-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
