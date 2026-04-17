"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="flex-shrink-0 z-50 bg-[#f3e1d7]/80 backdrop-blur-md border-b border-white-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
                            REKTO
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/challenges" className="text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer">
                            Challenges
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer">
                            Leaderboard
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer">
                            Referral
                        </Link>
                        <Link href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer">
                            Roadmap
                        </Link>
                    </div>

                    {/* Desktop CTA Button */}
                    <button className="hidden md:block px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
                        Get Started
                    </button>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:text-black transition-colors cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-4">
                            <Link href="/challenges" className="text-sm font-medium text-gray-700 hover:text-black transition-colors py-2 cursor-pointer">
                                Challenges
                            </Link>
                            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors py-2 cursor-pointer">
                                Leaderboard
                            </Link>
                            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors py-2 cursor-pointer">
                                Referral
                            </Link>
                            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors py-2 cursor-pointer">
                                Roadmap
                            </Link>
                            <button className="mt-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors w-full cursor-pointer">
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
