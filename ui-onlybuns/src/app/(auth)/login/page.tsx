"use client"

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showActivationModal, setShowActivationModal] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        const formData = new URLSearchParams();
        formData.append('username', email); // FastAPI expects 'username'
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/users/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });
        const data = await response.json();
        if (response.ok && data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem("user_name", data.user_name);
            localStorage.setItem("is_group_admin", data.is_group_admin);
            window.dispatchEvent(new Event('authChanged'));
            router.push('/');
        } else {
            // Check for activation error
            if (data.detail && data.detail.includes('Account not activated')) {
                setShowActivationModal(true); 
            } else {
                setError(data.detail || 'Login failed');
            }
        }
    } catch (err) {
        setError('Network error');
    }
};

    return (
        <>
        {showActivationModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-lg text-center">
                    <h2 className="text-xl font-bold mb-4">Account Not Activated</h2>
                    <p className="mb-4">Please check your email and activate your account before logging in.</p>
                    <button
                        onClick={() => setShowActivationModal(false)}
                        className="mt-4 text-gray-500 hover:underline"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
        <div className="flex items-center justify-center min-h-screen my-10 text-sm ">
            <div className="flex bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
                <div className="w-1/2 h-full">
                    <img
                        src="images/login.jpg" // Replace with your image path
                        alt="Register Image"
                        className="w-full h-full object-cover rounded-l-xl"
                    />
                </div>
                <div className="w-1/2 p-8 content-center-ns">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 drop-shadow-[0_1.1px_1.1px_rgba(0,0,0,0.5)]">
                        Login to Your Account
                    </h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {error && <div className="text-red-600 mb-4">{error}</div>}

                        <button
                            type="submit"
                            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                    <hr className="border-t border-gray-300 my-4"/>
                    <div className="mt-4 text-center tracking-tighter">
                        <p className="text-gray-700">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-green-800 hover:underline">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
            }