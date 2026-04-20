"use client";

import { useState } from "react";
import Link from "next/link";
import { usePrivy } from '@privy-io/react-auth';
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { login, authenticated, user, logout, ready } = usePrivy();
    const [searchQuery, setSearchQuery] = useState("");
    const pathname = usePathname();

    const handleAuth = () => {
        login();
    };

    const handleLogout = () => {
        logout();
    };

    // Get wallet address from user object (handles both embedded and external wallets)
    const getWalletAddress = () => {
        if (!user) return null;
        // Check for embedded wallet first, then external wallet
        return user.wallet?.address || null;
    };

    const walletAddress = getWalletAddress();
    const displayAddress = walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : null;

    // Helper function to check if link is active
    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    // Navigation links data
    const navLinks = [
        { href: "/challenges", label: "Challenges" },
        { href: "/markets", label: "Markets" },
        { href: "/leaderboard", label: "Leaderboard" },
        { href: "/referral", label: "Referral" },
        { href: "/activity", label: "Activity" },
        { href: "/roadmap", label: "Roadmap" },
    ];

    return (
        <>
            {/* Main Navbar - Sticky at top */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f3e1d7]/80 backdrop-blur-md border-b border-white-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo - Smaller on mobile */}
                        <div className="flex items-center gap-2">
                            <Link href="/" className="hover:opacity-80 transition-opacity">
                                <Image
                                    src="/logos/mainlogo.png"
                                    alt="REKTO"
                                    width={220}
                                    height={60}
                                    className="h-6 sm:h-8 w-auto"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Desktop Search Bar & How it Works */}
                        <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-2xl mx-8">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search Challenges..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2.5 pl-10 bg-white/50 border border-gray-300 rounded-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all"
                                />
                                <svg
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <Link
                                href="/how-it-works"
                                className="text-sm font-medium text-gray-700 hover:text-black transition-colors whitespace-nowrap"
                            >
                                How it works?
                            </Link>
                        </div>

                        {/* Auth Buttons - Desktop & Mobile */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {authenticated ? (
                                <div className="flex items-center gap-3">
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                                        {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={handleAuth}
                                        className="px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer border border-gray-700 rounded-full"
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={handleAuth}
                                        className="px-4 sm:px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* Sub Navbar - Desktop & Mobile Navigation Links */}
                <div className="bg-[#f3e1d7]/60 border-b border-gray-200/50 mt-[-12px]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Desktop: centered */}
                        <div className="hidden md:flex items-center justify-center gap-8 h-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors cursor-pointer ${isActive(link.href)
                                        ? "text-black font-semibold"
                                        : "text-gray-700 hover:text-black"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        {/* Mobile: horizontally scrollable with hidden scrollbar */}
                        <div
                            className="flex md:hidden items-center gap-6 h-12 overflow-x-auto whitespace-nowrap"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors cursor-pointer flex-shrink-0 ${isActive(link.href)
                                        ? "text-black font-semibold"
                                        : "text-gray-700 hover:text-black"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer for fixed navbar */}
            <div className="h-[128px] md:h-[128px]" />

            {/* Hide scrollbar for WebKit browsers */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Mobile Bottom Navigation - Fixed at bottom */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#f3e1d7]/95 backdrop-blur-md border-t border-gray-200/50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="flex items-center justify-around h-14">
                    {/* Home */}
                    <Link
                        href="/"
                        className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 ${isActive("/") && !isActive("/challenges") && !isActive("/markets") && !isActive("/leaderboard") && !isActive("/referral") && !isActive("/activity") && !isActive("/roadmap") && !isActive("/profile")
                            ? "text-black"
                            : "text-gray-500"
                            }`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-[10px] font-medium truncate">Home</span>
                    </Link>

                    {/* Markets */}
                    <Link
                        href="/markets"
                        className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 ${isActive("/markets")
                            ? "text-black"
                            : "text-gray-500"
                            }`}
                    >
                        <Image
                            src="/Icons/discover.png"
                            alt="Markets"
                            width={20}
                            height={20}
                            className="w-5 h-5 flex-shrink-0"
                        />
                        <span className="text-[10px] font-medium truncate">Markets</span>
                    </Link>

                    {/* Search */}
                    <button
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 text-gray-500"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-[10px] font-medium truncate">Search</span>
                    </button>

                    {/* Leaderboard */}
                    <Link
                        href="/leaderboard"
                        className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 ${isActive("/leaderboard")
                            ? "text-black"
                            : "text-gray-500"
                            }`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-[10px] font-medium truncate">Leaderboard</span>
                    </Link>

                    {/* Profile */}
                    <Link
                        href="/profile"
                        className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 ${isActive("/profile")
                            ? "text-black"
                            : "text-gray-500"
                            }`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-[10px] font-medium truncate">Profile</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
