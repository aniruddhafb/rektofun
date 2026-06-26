"use client";

import React from "react";
import { Challenge } from "../../lib/challenges-service/challenges";

interface ChallengeCardProps {
    challenge: Challenge;
    onClick?: (challenge: Challenge) => void;
    onRekt?: (challenge: Challenge) => void;
    onToggleBookmark?: (challengeId: string) => void;
    isBookmarked?: boolean;
    ownerAddress?: string;
}

export function ChallengeCard({
    challenge,
    onClick,
    onRekt,
    onToggleBookmark,
    isBookmarked = false,
    ownerAddress,
}: ChallengeCardProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            window.setTimeout(() => onClick(challenge), 0);
        } else if (onRekt) {
            window.setTimeout(() => onRekt(challenge), 0);
        }
    };

    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleBookmark?.(challenge.id.toString());
    };

    // Format expiry date
    const expiryDate = new Date(challenge.expiry);
    const timeLeft = expiryDate.getTime() - Date.now();
    const isExpired = timeLeft <= 0;
    
    const formatTimeLeft = () => {
        if (isExpired) return "Expired";
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `${days}d ${hours}h`;
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    // Format created time
    const createdDate = new Date(challenge.created_at);
    const timeAgo = () => {
        const diff = Date.now() - createdDate.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return "just now";
    };

    return (
        <div className="challenge-card-shell group/card block overflow-hidden rounded-xl border border-gray-200 bg-[#fffaf6] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md sm:p-4">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {challenge.ticker.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h3 className="break-words text-gray-900 leading-tight">
                            <span
                                onClick={handleClick}
                                className="block cursor-pointer break-words text-[15px] font-black tracking-tight text-black transition-colors sm:text-[16px]"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {challenge.statement}
                            </span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{challenge.ticker} • {challenge.trading_pair}</p>
                    </div>
                </div>
                {/* Watchlist Button */}
                <button
                    type="button"
                    onClick={handleBookmarkClick}
                    aria-label={isBookmarked ? "Remove Pin" : "Pin this"}
                    title={isBookmarked ? "Remove pin" : "Pin this"}
                    className="shrink-0 cursor-pointer border-2 border-black bg-white p-2 transition-all hover:-translate-y-0.5 hover:bg-[#f5d547] hover:text-black hover:shadow-[2px_2px_0_#111]"
                >
                    <svg className="w-5 h-5 text-black rotate-45" stroke="currentColor" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3h8l-1 6 3 3H6l3-3-1-6z" />
                    </svg>
                </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-3"></div>

            {/* Challenge Mode Info */}
            <div onClick={handleClick} className="mb-4 flex items-center justify-center">
                <div className="group relative inline-flex cursor-pointer">
                    <h2 className="border border-black bg-[#f5d547] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black hover:shadow-[2px_2px_0_#111]">
                        {challenge.mode} Mode
                    </h2>
                </div>
            </div>

            {/* Target Info */}
            <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">Target Price</p>
                <p className="text-xl font-black text-gray-900">${challenge.target.toLocaleString()}</p>
                <p className={`text-sm font-bold ${challenge.direction === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
                    {challenge.direction === 'UP' ? '↑ Price will go UP' : '↓ Price will go DOWN'}
                </p>
            </div>

            {/* Pool Info */}
            <div className="mb-4">
                <div className="flex items-center justify-center gap-2">
                    <span className="inline-flex rounded-full border border-emerald-300 bg-white/70 px-2 py-0.5 text-[9px] text-emerald-600 font-medium">
                        Pool Size
                    </span>
                </div>
                <p className="text-center text-[18px] font-extrabold text-emerald-600 sm:text-[20px]">
                    ${challenge.pool_size.toLocaleString()} USDC
                </p>
                <p className="text-center text-xs text-gray-500">
                    Initial Bet: ${challenge.initial_bet} USDC
                </p>
            </div>

            {/* CTA Button */}
            <div className="flex gap-2">
                <div className="group relative w-full">
                    <button
                        disabled={isExpired}
                        onClick={(e) => {
                            e.preventDefault();
                            if (isExpired) return;
                            handleClick(e);
                        }}
                        className={`w-full h-11 px-4 border-2 border-black font-black text-sm flex items-center justify-center gap-2 uppercase tracking-[0.06em] ${
                            isExpired
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "cursor-pointer bg-[#246044] hover:bg-[#2b7351] text-white hover:-translate-y-1 hover:shadow-[3px_3px_0_#111] transition-all"
                        }`}
                    >
                        {isExpired ? "EXPIRED" : challenge.mode === 'PVP' ? "COUNTER ⚔️" : "JOIN CHALLENGE ⚔️"}
                    </button>
                </div>
            </div>

            {/* Challenge Expiry */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-gray-600">
                <span>Expires in</span>
                <span className={`font-medium ${timeLeft < 60 * 60 * 1000 ? "text-red-600" : "text-gray-900"}`}>
                    {formatTimeLeft()}
                </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-1.5 text-gray-600 sm:gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="min-w-0 break-words text-xs sm:text-sm">
                        <span className="font-semibold text-gray-900">{timeAgo()}</span>
                    </span>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
                    {/* Share Icon */}
                    <div
                        className="flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer"
                        title="Share challenge link"
                        aria-label="Share challenge link"
                    >
                        <svg className="w-5 h-5 text-gray-500 hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </div>
                    {/* Status */}
                    <div className="flex items-center gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            challenge.status === 'OPEN' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {challenge.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Participants */}
            <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                    {challenge.participants} participant{challenge.participants !== 1 ? 's' : ''}
                </p>
            </div>
        </div>
    );
}