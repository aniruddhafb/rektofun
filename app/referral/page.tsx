"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Sparkles,
    HandHeart,
    Trophy,
    Skull,
    ChevronLeft,
    ChevronRight,
    Search,
    Crown,
    Gem,
    Users,
    Coins,
    Lock,
} from "lucide-react";

const leaderboardData = [
    {
        rank: 1,
        player: "TraderX",
        avatar: "/scribbles/pepe.png",
        flag: "ðŸ‡ºðŸ‡¸",
        joined: "Jun 2023",
        referrals: "8.9k",
        points: 840,
        earnings: "128.4 SOL",
    },
    {
        rank: 2,
        player: "CryptoNinja",
        avatar: "/scribbles/shiba.png",
        flag: "ðŸ‡°ðŸ‡·",
        joined: "Jan 2024",
        referrals: "7.6k",
        points: 675,
        earnings: "116.2 SOL",
    },
    {
        rank: 3,
        player: "WhaleWatcher",
        avatar: "/scribbles/doge.png",
        flag: "ðŸ‡¯ðŸ‡µ",
        joined: "Mar 2023",
        referrals: "6.2k",
        points: 590,
        earnings: "98.7 SOL",
    },
    {
        rank: 4,
        player: "MoonHunter",
        avatar: "/scribbles/pengu.png",
        flag: "ðŸ‡¬ðŸ‡§",
        joined: "Aug 2023",
        referrals: "5.1k",
        points: 445,
        earnings: "76.3 SOL",
    },
    {
        rank: 5,
        player: "DiamondHands",
        avatar: "/scribbles/btc.png",
        flag: "ðŸ‡¨ðŸ‡¦",
        joined: "Dec 2023",
        referrals: "4.3k",
        points: 380,
        earnings: "62.1 SOL",
    },
];

export default function ReferralPage() {
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const referralLink = "rekto.fun/?ref=UQKDn6e6";

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
        if (rank === 2) return <Gem className="w-5 h-5 text-slate-400" />;
        if (rank === 3) return <Gem className="w-5 h-5 text-amber-700" />;
        return <span className="text-gray-500 font-medium">{rank}</span>;
    };

    return (
        <div className="min-h-full" style={{ backgroundColor: "#f3e1d7" }}>
            <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-amber-600 mt-1" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Refer & Earn REKT POINTS
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg mb-8 ml-11">
                        Invite friends to Rekto.fun and earn REKT POINTS by competing challenges.
                    </p>

                    <div className="flex flex-col xl:flex-row gap-6">
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/50 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <HandHeart className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Refer Friends</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Get <span className="font-semibold text-gray-900">100 REKT POINTS</span> for every friend you invite when they sign up.
                                    </p>
                                </div>

                                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/50 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Win Challenges</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Earn <span className="font-semibold text-gray-900">20 REKT POINTS</span> for every challenge you win.
                                    </p>
                                </div>

                                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/50 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Skull className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Get Rekt!</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Even if you lose, you still receive <span className="font-semibold text-gray-900">10 REKT POINTS</span>.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/50">
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm w-full">
                                        <span className="text-gray-600 font-medium text-sm sm:text-base truncate">{referralLink}</span>
                                        <button
                                            onClick={handleCopy}
                                            className="ml-auto px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium text-sm transition-colors flex-shrink-0"
                                        >
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 bg-white/60 rounded-xl p-4 border border-white/50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lock className="w-5 h-5 text-gray-600" />
                                        <span className="font-semibold text-gray-900">Referral Accounts Paused</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Privy-backed sign-in has been removed, so personal referral links, redemptions, and tracked referral stats are temporarily unavailable in this build.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="xl:w-80 flex flex-col gap-4">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/50 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">Referral Status</h3>

                                <div className="mb-4 p-4 bg-white/40 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tracked Referrals</p>
                                            <p className="text-2xl font-bold text-gray-900">Paused</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/40 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Coins className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Reward Tracking</p>
                                            <p className="text-2xl font-bold text-gray-900">Offline</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">A new auth or wallet layer will be needed to restore user-specific referral data.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-gray-600" />
                            <h2 className="text-xl font-bold text-gray-900">Referral Leaderboard</h2>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search traders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 bg-white/60 border border-white/50 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="min-w-[700px] grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 border-b border-white/50 text-sm font-medium text-gray-500">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-3">Player</div>
                                <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                    Joined
                                    <ChevronLeft className="w-3 h-3 rotate-[-90deg]" />
                                </div>
                                <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                    Referrals
                                    <ChevronLeft className="w-3 h-3 rotate-[-90deg]" />
                                </div>
                                <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                    Points
                                    <ChevronLeft className="w-3 h-3 rotate-[-90deg]" />
                                </div>
                                <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                    Earnings
                                    <ChevronLeft className="w-3 h-3 rotate-[-90deg]" />
                                </div>
                            </div>

                            <div className="min-w-[700px] divide-y divide-white/50">
                                {leaderboardData.map((user) => (
                                    <div
                                        key={user.rank}
                                        className="grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 items-center hover:bg-white/30 transition-colors"
                                    >
                                        <div className="col-span-1 flex items-center gap-2">
                                            {getRankIcon(user.rank)}
                                        </div>

                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.player}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="font-medium text-gray-900 truncate">{user.player}</span>
                                                <span className="text-lg flex-shrink-0">{user.flag}</span>
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-gray-600 text-sm">{user.joined}</div>
                                        <div className="col-span-2 text-gray-900 font-medium text-sm">{user.referrals}</div>
                                        <div className="col-span-2 text-gray-900 font-medium text-sm">{user.points}</div>
                                        <div className="col-span-2 text-gray-900 font-medium text-sm">{user.earnings}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
