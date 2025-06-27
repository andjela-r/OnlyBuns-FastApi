"use client"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const Navigation = () => {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
        const token = localStorage.getItem("access_token");
        const name = localStorage.getItem("user_name");
        setIsAuthenticated(!!token);
        setUserName(name);
            };
            checkAuth();
            window.addEventListener("authChanged", checkAuth);
            return () => window.removeEventListener("authChanged", checkAuth);
        }, []);

        const handleLogout = () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_name');
            setIsAuthenticated(false);
            setUserName(null);
            setDropdownOpen(false);
            window.location.href = '/';
        };

    return (
        <nav className="text-xl relative">
            <Link
                href="/"
                className={`mr-4 py-2 px-5 rounded-xl  shadow-sm transition-all duration-200
                            ${pathname === "/"
                                ? "text-green-900 bg-accent border-2 border-accent hover:bg-green-900 hover:text-white hover:border-green-900"
                                : "text-gray-700  hover:bg-green-900 hover:text-white hover:border-green-900"}
                        `}>
                Home
            </Link>
            
            {isAuthenticated ? (
                <div className="inline-block relative">
                    <Link
                        href="/map"
                        className={`mr-4 py-2 px-5 rounded-xl  shadow-sm transition-all duration-200
                            ${pathname === "/map" 
                                ? "text-green-900 bg-accent border-2 border-accent  hover:bg-green-900 hover:text-white hover:border-green-900" 
                                : "text-gray-700  hover:bg-green-900 hover:text-white hover:border-green-900"}
                        `}>
                        Explore
                    </Link>
                    <Link
                        href="/trends"
                        className={`mr-4 py-2 px-5 rounded-xl  shadow-sm transition-all duration-200
                            ${pathname === "/trends" 
                                ? "text-green-900 bg-accent border-2 border-accent  hover:bg-green-900 hover:text-white hover:border-green-900" 
                                : "text-gray-700  hover:bg-green-900 hover:text-white hover:border-green-900"}
                        `}>
                        Trends
                    </Link>
                    
                    <button
                        onClick={() => setDropdownOpen((open) => !open)}
                        className="border-2 border-pink-400 bg-pink-400 text-white py-2 px-4 rounded-xl hover:bg-pink-600 hover:border-pink-600 transition-colors"
                    >
                        {userName ? `Howdy, ${userName}` : " My Account"}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-[9999] text-green-900">
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
                                Logout
                            </button>
                        </div>
                    )}
                    
                </div>
                
                
            ) : (
                <>
                    <Link
                        href="/login"
                        className={`mr-4 py-2 px-5 rounded-xl  shadow-sm transition-all duration-200
                            ${pathname === "/login" 
                                ? "text-green-900 bg-accent border-2 border-accent  hover:bg-green-900 hover:text-white hover:border-green-900" 
                                : "text-gray-700  hover:bg-green-900 hover:text-white hover:border-green-900"}
                        `}>
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className={`border-2 border-pink-400 bg-pink-400 text-white py-2 px-4 rounded-xl hover:bg-pink-600 hover:border-pink-600 transition-colors
                            ${pathname === "/register" 
                                ? "text-pink-900 bg-accent border-2 border-accent  hover:bg-pink-900 hover:text-white hover:border-pink-900" 
                                : "text-gray-700  hover:bg-pink-900 hover:text-white hover:border-pink-900"}
                        `}>
                        Register
                    </Link>
                </>
            )}
        </nav>
    );
};
