"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";

// SVG Icons
const TrendingUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const TrophyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const BarChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);

const UsersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const CoinsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        <path d="M7 6h1v4" />
        <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
);

const FlameIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const BoltIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

export default function CategoryPage() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortBy, setSortBy] = useState("Trending");
    const dropdownRef = useRef(null);

    const sortOptions = [
        { label: "Trending", icon: <TrendingUpIcon /> },
        { label: "Top Rated", icon: <TrophyIcon /> },
        { label: "Volume", icon: <BarChartIcon /> },
        { label: "Newest", icon: <BoltIcon /> },
    ];

    return (
        <div className="min-h-screen bg-[#f3e1d7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Explore Markets</h1>
                        <p className="text-gray-600 text-base sm:text-lg">Predict trends and earn big on top challenge markets</p>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl">

                    {/* ── Crypto Markets Card ── */}
                    <div
                        className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        style={{
                            background: "linear-gradient(145deg, #f3e1d7 0%, #f8ede4 40%, #f5e4d0 100%)",
                            boxShadow: "0 4px 24px -6px rgba(220,180,140,0.3), 0 1px 4px rgba(0,0,0,0.04)",
                            border: "2.5px solid rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        {/* Decorative top stripe */}
                        {/* <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #e8a050, #f0b060, #f5c880)" }} /> */}

                        {/* Top visual area — shorter for rectangular look */}
                        <div className="relative h-44 sm:h-48 overflow-hidden flex-shrink-0 px-6 pt-6">

                            {/* Subtle dot-grid background */}
                            <div
                                className="absolute inset-0 opacity-[0.05]"
                                style={{
                                    backgroundImage: "radial-gradient(circle, #e8a050 1px, transparent 1px)",
                                    backgroundSize: "20px 20px",
                                }}
                            />

                            {/* Warm glow blob */}
                            <div
                                className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-20 blur-3xl"
                                style={{ background: "radial-gradient(circle, #f0b060, #e8a050)" }}
                            />

                            {/* Icon badge + label */}
                            <div className="relative z-10 flex items-center gap-3 mb-3">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[#d09040] shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                                    style={{ background: "rgba(255,255,255,0.85)" }}
                                >
                                    <TrendingUpIcon />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#d4a050] uppercase tracking-widest">Category</p>
                                    <h2 className="text-xl sm:text-2xl font-black text-[#1a1a1a] leading-tight">
                                        Crypto <span className="text-[#d09040]">Markets</span>
                                    </h2>
                                </div>
                            </div>

                            <p className="relative z-10 text-[#888] text-xs sm:text-sm font-medium leading-relaxed max-w-[200px]">
                                Predict price movements, market trends and major crypto events.
                            </p>

                            {/* Scribble coin images — scattered layout, slightly smaller */}
                            <div className="absolute right-0 bottom-0 w-[55%] h-full pointer-events-none select-none">
                                {/* BTC — large, center-right */}
                                <Image
                                    src="/scribbles/btc.png"
                                    alt="Bitcoin"
                                    width={95}
                                    height={95}
                                    className="scribble-btc absolute"
                                    style={{ right: "18%", bottom: "5%", zIndex: 4 }}
                                />
                                {/* SOL — top right */}
                                <Image
                                    src="/scribbles/sol.png"
                                    alt="Solana"
                                    width={62}
                                    height={62}
                                    className="scribble-sol absolute"
                                    style={{ right: "4%", top: "8%", zIndex: 3 }}
                                />
                                {/* DOGE — bottom left of cluster */}
                                <Image
                                    src="/scribbles/doge.png"
                                    alt="Dogecoin"
                                    width={58}
                                    height={58}
                                    className="scribble-doge absolute"
                                    style={{ right: "52%", bottom: "10%", zIndex: 3 }}
                                />
                                {/* SHIBA — top left of cluster */}
                                <Image
                                    src="/scribbles/shiba.png"
                                    alt="Shiba Inu"
                                    width={52}
                                    height={52}
                                    className="scribble-shiba absolute"
                                    style={{ right: "38%", top: "6%", zIndex: 2 }}
                                />
                                {/* PEPE — small accent */}
                                <Image
                                    src="/scribbles/pepe.png"
                                    alt="Pepe"
                                    width={42}
                                    height={42}
                                    className="scribble-pepe absolute"
                                    style={{ right: "2%", bottom: "12%", zIndex: 2 }}
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-[#e8c8a0]/50 to-transparent" />

                        {/* Stats row — more compact */}
                        <div className="mx-5 my-3.5 rounded-xl px-4 py-3 bg-white/70 backdrop-blur-sm border border-[#e8c8a0]/50">
                            <div className="grid grid-cols-4 divide-x divide-[#e8c8a0]/50">
                                <div className="flex flex-col items-center gap-0.5 px-1">
                                    <span className="text-[#d4a050]"><BarChartIcon /></span>
                                    <span className="text-sm sm:text-base font-black text-[#1a1a1a]">124</span>
                                    <span className="text-[9px] text-[#999] font-semibold uppercase tracking-wide">Markets</span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 px-1">
                                    <span className="text-[#d4a050]"><UsersIcon /></span>
                                    <span className="text-sm sm:text-base font-black text-[#1a1a1a]">12.5K</span>
                                    <span className="text-[9px] text-[#999] font-semibold uppercase tracking-wide">Traders</span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 px-1">
                                    <span className="text-[#d4a050]"><CoinsIcon /></span>
                                    <span className="text-sm sm:text-base font-black text-[#1a1a1a]">$12.4M</span>
                                    <span className="text-[9px] text-[#999] font-semibold uppercase tracking-wide">24H Vol</span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 px-1">
                                    <span className="text-[#d4a050]"><FlameIcon /></span>
                                    <span className="text-sm sm:text-base font-black text-[#d09040]">Hot 🔥</span>
                                    <span className="text-[9px] text-[#999] font-semibold uppercase tracking-wide">Trend</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-4">
                            <Link
                                href="/markets/crypto"
                                className="group/btn border border-gray-700 flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-white font-bold text-sm sm:text-base transition-all duration-300 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: "linear-gradient(135deg, #e8a050 0%, #d09040 100%)",
                                    boxShadow: "0 4px 16px rgba(220,150,60,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                                }}
                            >
                                <span>Explore Crypto Markets</span>
                                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 transition-transform duration-300 group-hover/btn:translate-x-1">
                                    <ArrowRightIcon />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* ── Sports Markets Card ── */}
                    <div
                        className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        style={{
                            background: "linear-gradient(145deg, #f3e1d7 0%, #f0e8ef 40%, #ece4f5 100%)",
                            boxShadow: "0 4px 24px -6px rgba(200,170,190,0.3), 0 1px 4px rgba(0,0,0,0.04)",
                            border: "2.5px solid rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        {/* Decorative top stripe */}
                        {/* <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #b080d0, #c8a0e0, #d8b8e8)" }} /> */}

                        {/* Top visual area — shorter for rectangular look */}
                        <div className="relative h-44 sm:h-48 overflow-hidden flex-shrink-0 px-6 pt-6">

                            {/* Subtle dot-grid background */}
                            <div
                                className="absolute inset-0 opacity-[0.05]"
                                style={{
                                    backgroundImage: "radial-gradient(circle, #b080d0 1px, transparent 1px)",
                                    backgroundSize: "20px 20px",
                                }}
                            />

                            {/* Purple glow blob */}
                            <div
                                className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-20 blur-3xl"
                                style={{ background: "radial-gradient(circle, #c8a0e0, #b080d0)" }}
                            />

                            {/* Icon badge + label */}
                            <div className="relative z-10 flex items-center gap-3 mb-3">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[#a070c0] shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                                    style={{ background: "rgba(255,255,255,0.85)" }}
                                >
                                    <TrophyIcon />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#b088d0] uppercase tracking-widest">Category</p>
                                    <h2 className="text-xl sm:text-2xl font-black text-[#1a1a1a] leading-tight">
                                        Sports <span className="text-[#a070c0]">Markets</span>
                                    </h2>
                                </div>
                            </div>

                            <p className="relative z-10 text-[#888] text-xs sm:text-sm font-medium leading-relaxed max-w-[200px]">
                                Predict match outcomes, player performances and sports events.
                            </p>

                            {/* Sports visuals — scattered balls */}
                            <div className="absolute right-0 bottom-0 w-[55%] h-full pointer-events-none select-none flex items-end justify-center pb-4">
                                <div className="relative w-44 h-44">

                                    {/* Cricket player silhouette */}
                                    <div className="absolute top-0 right-6 w-20 h-32 flex items-center justify-center z-10">
                                        <div className="relative" style={{ transform: "scale(0.7)" }}>
                                            <div className="w-8 h-8 rounded-full absolute -top-8 left-1/2 -translate-x-1/2"
                                                style={{ background: "linear-gradient(135deg, #c8a8e0, #a070c0)" }} />
                                            <div className="w-9 h-5 rounded-t-full absolute -top-10 left-1/2 -translate-x-1/2"
                                                style={{ background: "#8860a8" }} />
                                            <div className="w-10 h-20 rounded-t-full mx-auto"
                                                style={{ background: "linear-gradient(180deg, #c8a8e0 0%, #a070c0 100%)" }} />
                                            <div className="absolute -top-4 -right-8 w-16 h-2 rounded-full"
                                                style={{ background: "#c8a060", transform: "rotate(-45deg)", transformOrigin: "left center" }} />
                                            <div className="flex gap-1 mt-1">
                                                <div className="w-4 h-12 rounded-b-full" style={{ background: "#a070c0" }} />
                                                <div className="w-4 h-12 rounded-b-full" style={{ background: "#a070c0", transform: "rotate(10deg)" }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Soccer ball */}
                                    <div
                                        className="absolute bottom-4 left-0 w-14 h-14 rounded-full animate-float-gentle"
                                        style={{
                                            background: "radial-gradient(circle at 35% 35%, #ede9fe, #c8a8e0 60%, #a880c8 100%)",
                                            boxShadow: "0 6px 20px rgba(160,110,190,0.3), inset 0 -4px 8px rgba(0,0,0,0.12)",
                                        }}
                                    >
                                        <div className="absolute inset-0 rounded-full overflow-hidden opacity-35">
                                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#8860a8]" />
                                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#8860a8]" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#8860a8] rounded-sm rotate-45" />
                                        </div>
                                    </div>

                                    {/* Basketball */}
                                    <div
                                        className="absolute bottom-0 right-2 w-14 h-14 rounded-full animate-float-updown"
                                        style={{
                                            background: "radial-gradient(circle at 35% 35%, #fed7aa, #e8a050 60%, #d09040 100%)",
                                            boxShadow: "0 5px 16px rgba(220,150,60,0.25), inset 0 -4px 8px rgba(0,0,0,0.12)",
                                            animationDelay: "0.8s",
                                        }}
                                    >
                                        <div className="absolute inset-0 rounded-full overflow-hidden opacity-45">
                                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#b08040]" />
                                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#b08040]" />
                                            <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-[#b08040] rounded-full" style={{ transform: "rotate(-20deg)" }} />
                                            <div className="absolute bottom-1/4 left-1/4 right-1/4 h-0.5 bg-[#b08040] rounded-full" style={{ transform: "rotate(20deg)" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-[#d8c0e8]/50 to-transparent" />

                        {/* Stats row — more compact */}
                        <div className="mx-5 my-3.5 rounded-xl px-4 py-3 bg-white/70 backdrop-blur-sm border border-[#d8c0e8]/50">
                            <div className="grid grid-cols-4 divide-x divide-[#d8c0e8]/50">
                                <div className="flex flex-col items-center gap-0.5 px-1">
                                    <span className="text-[#b088d0]"><TrophyIcon /></span>
                                    <span className="text-sm sm:text-base font-black text-[#1a1a1a]">98</span>
                                    <span className="text-[9px] text-[#999] font-semibold uppercase tracking-wide">Markets</span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 px-1">
                                    <span className="text-[#b088d0]"><UsersIcon /></span>
                                    <span className="text-sm sm:text-base font-black text-[#1a1a1a]">8.7K</span>
                                    <span className="text-[9px] text-[#999] font-semibold uppercase tracking-wide">Traders</span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 px-1">
                                    <span className="text-[#b088d0]"><CoinsIcon /></span>
                                    <span className="text-sm sm:text-base font-black text-[#1a1a1a]">$8.3M</span>
                                    <span className="text-[9px] text-[#999] font-semibold uppercase tracking-wide">24H Vol</span>
                                </div>
                                <div className="flex flex-col items-center gap-0.5 px-1">
                                    <span className="text-[#b088d0]"><FlameIcon /></span>
                                    <span className="text-sm sm:text-base font-black text-[#a070c0]">Hot 🔥</span>
                                    <span className="text-[9px] text-[#999] font-semibold uppercase tracking-wide">Trend</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-4">
                            <Link
                                href="/markets/sports"
                                className="group/btn border border-gray-700 flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-white font-bold text-sm sm:text-base transition-all duration-300 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: "linear-gradient(135deg, #b080d0 0%, #a070c0 100%)",
                                    boxShadow: "0 4px 16px rgba(190,150,210,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                                }}
                            >
                                <span>Explore Sports Markets</span>
                                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 transition-transform duration-300 group-hover/btn:translate-x-1">
                                    <ArrowRightIcon />
                                </span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
