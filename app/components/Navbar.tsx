"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DepositModal } from "./DepositModal";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const navLinks = [
        { href: "/challenges", label: "Challenges" },
        { href: "/markets", label: "Markets" },
        { href: "/leaderboard", label: "Leaderboard" },
        { href: "/referral", label: "Referral" },
        { href: "/activity", label: "Activity" },
        { href: "https://rektofun.gitbook.io/rektofun/roadmap/whats-next", label: "Roadmap" },
    ];

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-100 border-b border-amber-300">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-amber-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-amber-900 font-medium text-center hidden md:block">
                        Development Mode - Dummy data is displayed and wallet actions are disabled
                    </p>
                    <p className="text-sm text-amber-900 font-medium text-center md:hidden">
                        Dev Mode
                    </p>
                </div>
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f3e1d7]/80 backdrop-blur-md border-b border-white-100 pt-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-2 relative">
                            <div className="absolute -top-3 -left-[-128px] hidden md:block">
                                <div className="relative w-10 h-10">
                                    <svg viewBox="0 0 80 80" className="w-full h-full rotate-12">
                                        <polygon
                                            points="40,0 45,15 60,10 52,25 65,35 50,40 55,55 40,48 25,55 30,40 15,35 28,25 20,10 35,15"
                                            fill="#e85a2d"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 mb-1 flex items-center justify-center text-white text-[8px] font-bold rotate-12">
                                        Beta
                                    </span>
                                </div>
                            </div>
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
                                href="https://rektofun.gitbook.io/rektofun/introduction/how-it-works"
                                target="_blank"
                                className="text-sm font-medium text-gray-700 hover:text-black transition-colors whitespace-nowrap"
                            >
                                How it works?
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={() => setIsDepositModalOpen(true)}
                                className="px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer border border-gray-700 rounded-full"
                            >
                                Wallet Status
                            </button>
                            <Link
                                href="/settings"
                                className="px-4 sm:px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                Settings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-[#f3e1d7]/60 border-b border-gray-200/50 mt-[-12px]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                        <div
                            className="flex md:hidden items-center gap-6 h-12 overflow-x-auto whitespace-nowrap"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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

            <div className="h-[128px] md:h-[128px]" />

            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
            />

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#f3e1d7]/95 backdrop-blur-md border-t border-gray-200/50" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
                <div className="flex items-center justify-around h-14">
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

                    <button
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 text-gray-500"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-[10px] font-medium truncate">Search</span>
                    </button>

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

                    <Link
                        href="/settings"
                        className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 ${isActive("/settings")
                            ? "text-black"
                            : "text-gray-500"
                            }`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5a1.5 1.5 0 011.5 1.5v.32a1.5 1.5 0 001.04 1.43l.3.1a1.5 1.5 0 001.67-.49l.22-.27a1.5 1.5 0 012.12 0l.79.8a1.5 1.5 0 010 2.12l-.27.22a1.5 1.5 0 00-.49 1.67l.1.3a1.5 1.5 0 001.43 1.04H21a1.5 1.5 0 011.5 1.5v1.14A1.5 1.5 0 0121 16.5h-.32a1.5 1.5 0 00-1.43 1.04l-.1.3a1.5 1.5 0 00.49 1.67l.27.22a1.5 1.5 0 010 2.12l-.8.79a1.5 1.5 0 01-2.12 0l-.22-.27a1.5 1.5 0 00-1.67-.49l-.3.1A1.5 1.5 0 0013.5 23v.32A1.5 1.5 0 0112 24.82h-1.14a1.5 1.5 0 01-1.5-1.5V23a1.5 1.5 0 00-1.04-1.43l-.3-.1a1.5 1.5 0 00-1.67.49l-.22.27a1.5 1.5 0 01-2.12 0l-.79-.8a1.5 1.5 0 010-2.12l.27-.22a1.5 1.5 0 00.49-1.67l-.1-.3A1.5 1.5 0 003 16.5h-.32a1.5 1.5 0 01-1.5-1.5v-1.14A1.5 1.5 0 013 12.36h.32a1.5 1.5 0 001.43-1.04l.1-.3a1.5 1.5 0 00-.49-1.67l-.27-.22a1.5 1.5 0 010-2.12l.8-.79a1.5 1.5 0 012.12 0l.22.27a1.5 1.5 0 001.67.49l.3-.1A1.5 1.5 0 0010.5 6V5.68A1.5 1.5 0 0112 4.18z" />
                            <circle cx="12" cy="14" r="3" />
                        </svg>
                        <span className="text-[10px] font-medium truncate">Settings</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
