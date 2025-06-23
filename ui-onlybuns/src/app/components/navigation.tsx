"use client"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const Navigation = () => {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('access_token');
            setIsAuthenticated(!!token);
        };
            checkAuth();
            window.addEventListener('authChanged', checkAuth);
            return () => window.removeEventListener('authChanged', checkAuth);
        }, []);

        const handleLogout = () => {
            localStorage.removeItem('access_token');
            setIsAuthenticated(false);
            setDropdownOpen(false);
            window.location.href = '/';
        };

    return (
        <nav className="text-xl relative">
            <Link
                href="/"
                className={`hover:text-white mr-1 py-2 px-4 hover:bg-green-900 hover:border-2 hover:border-green-900 rounded-xl transition-colors ${pathname === "/" ? "font-bold text-green-900 mr-4" : "mr-4"}`}
            >
                Home
            </Link>
            {isAuthenticated ? (
                <div className="inline-block relative">
                    <button
                        onClick={() => setDropdownOpen((open) => !open)}
                        className="border-2 border-pink-400 bg-pink-400 text-white py-2 px-4 rounded-xl hover:bg-pink-600 hover:border-pink-600 transition-colors"
                    >
                        Profile
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10 text-green-900">
                            <Link
                                href="/profile"
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Profile
                            </Link>
                            <hr />
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-red-500  hover:border-red-600 hover:text-white"
                                onClick={handleLogout}
                            >
                                Odjavi se
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <Link
                        href="/login"
                        className="border-2 border-green-900 text-green-900 py-2 px-4 mr-1 rounded-xl hover:bg-green-900 hover:text-white transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="border-2 border-pink-400 bg-pink-400 text-white py-2 px-4 rounded-xl hover:bg-pink-600 hover:border-pink-600 transition-colors"
                    >
                        Register
                    </Link>
                </>
            )}
        </nav>
    );
};
