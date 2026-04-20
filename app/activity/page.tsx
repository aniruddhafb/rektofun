"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Activity types
type ActivityType = "all" | "bets" | "wins" | "follows" | "buys";

// Activity item interface
interface ActivityItem {
    id: string;
    type: "bet" | "win" | "follow" | "buy";
    user: {
        name: string;
        avatar: string;
    };
    action: string;
    target?: string;
    amount?: string;
    details: string;
    subAction?: {
        user: string;
        action: string;
        icon?: string;
        highlight?: string;
    };
    timestamp: string;
}

// Mock activity data
const activityData: ActivityItem[] = [
    {
        id: "1",
        type: "bet",
        user: { name: "WhaleKing", avatar: "/scribbles/sol.png" },
        action: "bet",
        amount: "1.5 SOL",
        target: "Solana Above $170",
        details: "in 20 h",
        subAction: {
            user: "SOL",
            action: "bought",
            highlight: "🎫",
        },
        timestamp: "1hr ago",
    },
    {
        id: "2",
        type: "bet",
        user: { name: "Brenda", avatar: "/scribbles/pepe.png" },
        action: "bet",
        amount: "0.9 SOL",
        target: "Pepe Below 0.000010",
        details: "in 2 h",
        subAction: {
            user: "Brenda",
            action: "bought",
            highlight: "Down 9x",
        },
        timestamp: "9m ago",
    },
    {
        id: "3",
        type: "win",
        user: { name: "TraderX", avatar: "/scribbles/sol.png" },
        action: "hit jackpot!",
        amount: "+110 SOL",
        details: "",
        subAction: {
            user: "CryptoNinja",
            action: "bought",
            highlight: "🎫",
        },
        timestamp: "19m ago",
    },
    {
        id: "4",
        type: "bet",
        user: { name: "CryptoNinja", avatar: "/scribbles/pepe.png" },
        action: "bet",
        amount: "3.5 SOL",
        target: "Ethereum Below $3,200",
        details: "",
        subAction: {
            user: "SOL",
            action: "bought",
            highlight: "🎫 x3.5 SOL",
        },
        timestamp: "27m ago",
    },
    {
        id: "5",
        type: "follow",
        user: { name: "DegenLord", avatar: "/scribbles/doge.png" },
        action: "followed",
        target: "WhaleKing",
        details: "x1.5 SOL bet",
        subAction: {
            user: "SOL",
            action: "bought",
            highlight: "🥞",
        },
        timestamp: "35m ago",
    },
    {
        id: "6",
        type: "buy",
        user: { name: "ChadDegenerate", avatar: "/scribbles/btc.png" },
        action: "bought",
        amount: "Up x2.7 SOL",
        target: "Bitcoin Above $65,500",
        details: "",
        subAction: {
            user: "Bitcoin",
            action: "bought",
            highlight: "Up",
        },
        timestamp: "750m ago",
    },
    {
        id: "7",
        type: "bet",
        user: { name: "CryptoQueen", avatar: "/scribbles/pengu.png" },
        action: "YOLO bet",
        amount: "Up x1 SOL",
        target: "Dogewhale",
        details: "🐶",
        subAction: {
            user: "CryptoQueen",
            action: "bought",
            highlight: "Up",
        },
        timestamp: "1hr ago",
    },
];

// Filter tabs
const filterTabs: { label: string; value: ActivityType; count?: number }[] = [
    { label: "All Activity", value: "all" },
    { label: "Bets", value: "bets" },
    { label: "Wins", value: "wins" },
    { label: "Follows", value: "follows" },
    { label: "Buys", value: "buys" },
];

export default function ActivityPage() {
    const [activeFilter, setActiveFilter] = useState<ActivityType>("all");

    // Filter activities based on selected filter
    const filteredActivities = activityData.filter((item) => {
        if (activeFilter === "all") return true;
        return item.type === activeFilter.slice(0, -1);
    });

    // Get highlight color based on text
    const getHighlightColor = (text?: string) => {
        if (!text) return "text-gray-500";
        if (text.includes("Up")) return "text-green-600";
        if (text.includes("Down")) return "text-red-600";
        return "text-amber-600";
    };

    return (
        <div className="min-h-screen bg-[#f3e1d7]">
            {/* Header Section */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    Activity
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                    View the latest challenges and bets made across Rekto.fun.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveFilter(tab.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeFilter === tab.value
                                ? "bg-gray-900 text-white"
                                : "bg-white/60 text-gray-700 hover:bg-white hover:text-gray-900 border border-gray-300"
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="ml-1.5 text-xs opacity-70">{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Feed */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="space-y-0">
                    {filteredActivities.map((item, index) => (
                        <div
                            key={item.id}
                            className={`group flex items-start gap-4 py-4 ${index !== filteredActivities.length - 1
                                ? "border-b border-gray-400/30"
                                : ""
                                }`}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-gray-300 shadow-sm">
                                    <Image
                                        src={item.user.avatar}
                                        alt={item.user.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Status indicator for wins */}
                                {item.type === "win" && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-xs border-2 border-[#f3e1d7]">
                                        🎉
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {/* Main Activity Line */}
                                <div className="flex flex-wrap items-center gap-x-1.5 text-sm sm:text-base">
                                    <Link
                                        href={`/profile/${item.user.name}`}
                                        className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                                    >
                                        {item.user.name}
                                    </Link>
                                    <span className="text-gray-600">{item.action}</span>
                                    {item.amount && (
                                        <span className="font-semibold text-gray-900">
                                            {item.amount}
                                        </span>
                                    )}
                                    {item.target && (
                                        <>
                                            <span className="text-gray-600">on</span>
                                            <span className="text-gray-900">{item.target}</span>
                                        </>
                                    )}
                                    {item.details && (
                                        <span className="text-gray-500">{item.details}</span>
                                    )}
                                </div>

                                {/* Sub Action Line */}
                                {item.subAction && (
                                    <div className="flex items-center gap-2 mt-1.5 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-300">
                                            <Image
                                                src={item.user.avatar}
                                                alt=""
                                                width={16}
                                                height={16}
                                                className="w-4 h-4 object-cover"
                                            />
                                        </div>
                                        <span className="text-gray-700">{item.subAction.user}</span>
                                        <span className="text-gray-500">
                                            {item.subAction.action}
                                        </span>
                                        {item.subAction.highlight && (
                                            <span
                                                className={`font-medium ${getHighlightColor(
                                                    item.subAction.highlight
                                                )}`}
                                            >
                                                {item.subAction.highlight}
                                            </span>
                                        )}
                                        <span className="text-gray-400">@ {item.timestamp}</span>
                                    </div>
                                )}
                            </div>

                            {/* Timestamp & Arrow */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {!item.subAction && (
                                    <span className="text-gray-500 text-sm">{item.timestamp}</span>
                                )}
                                <Link
                                    href={`/activity/${item.id}`}
                                    className="text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="mt-8 text-center">
                    <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-full text-sm font-medium transition-all duration-200 border border-gray-300 shadow-sm">
                        Load More Activity
                    </button>
                </div>
            </div>

            {/* Custom scrollbar hide styles */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
