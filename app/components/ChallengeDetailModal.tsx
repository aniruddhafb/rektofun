"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Clock, Trophy, Skull, TrendingUp, TrendingDown, User, Calendar, AlertCircle, CheckCircle } from "lucide-react";

interface Challenge {
    id: string;
    asset: string;
    assetLogo: string;
    title: string;
    creator: {
        name: string;
        avatar: string;
    };
    betAmount: number;
    prediction: string;
    currentPrice: number;
    priceChange: number;
    targetPrice: number;
    startPrice: number;
    timeRemaining: string;
    likes: number;
    status: "active" | "expired" | "won" | "lost" | "created" | "accepted";
    accepter?: {
        name: string;
        avatar: string;
    };
    createdAt?: string;
    expiresAt?: string;
    endsAt?: string;
}

interface ChallengeDetailModalProps {
    challenge: Challenge | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ChallengeDetailModal({ challenge, isOpen, onClose }: ChallengeDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen || !challenge) return null;

    const isAccepted = challenge.status === "accepted" || challenge.status === "active" || challenge.status === "won" || challenge.status === "lost";
    const hasWon = challenge.status === "won";
    const hasLost = challenge.status === "lost";

    const getStatusBadge = () => {
        switch (challenge.status) {
            case "active":
                return { label: "LIVE", className: "bg-emerald-500 text-white", icon: <TrendingUp className="w-3 h-3" /> };
            case "accepted":
                return { label: "ACCEPTED", className: "bg-blue-500 text-white", icon: <CheckCircle className="w-3 h-3" /> };
            case "created":
                return { label: "PENDING", className: "bg-amber-500 text-white", icon: <Clock className="w-3 h-3" /> };
            case "won":
                return { label: "WON", className: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white", icon: <Trophy className="w-3 h-3" /> };
            case "lost":
                return { label: "REKT", className: "bg-red-600 text-white", icon: <Skull className="w-3 h-3" /> };
            case "expired":
                return { label: "EXPIRED", className: "bg-gray-500 text-white", icon: <AlertCircle className="w-3 h-3" /> };
            default:
                return { label: "UNKNOWN", className: "bg-gray-400 text-white", icon: null };
        }
    };

    const statusBadge = getStatusBadge();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#f8ede7] via-[#f3e1d7] to-[#e8d5c4] rounded-3xl shadow-2xl border border-[#d4a574]/30 animate-in zoom-in-95 duration-300"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#d4a574 transparent"
                }}
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#d4a574]/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-[#246044]/20 to-transparent rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Main Content */}
                <div className="relative p-6 sm:p-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        {/* Asset Image */}
                        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#2d1f1a] to-[#4a3830] p-1 shadow-xl">
                                <div className="w-full h-full rounded-xl bg-[#f8ede7] flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={challenge.assetLogo}
                                        alt={challenge.asset}
                                        width={80}
                                        height={80}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                                    />
                                </div>
                            </div>
                            {/* Status Badge */}
                            <div className={`absolute -bottom-2 -right-2 flex items-center gap-1 px-2.5 py-1 rounded-full ${statusBadge.className} text-xs font-bold shadow-lg`}>
                                {statusBadge.icon}
                                <span>{statusBadge.label}</span>
                            </div>
                        </div>

                        {/* Challenge Info */}
                        <div className="flex-1 text-center sm:text-left">
                            {/* Market Tag */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2d1f1a]/10 rounded-full mb-3">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                    <span className="text-[10px]">₿</span>
                                </div>
                                <span className="text-xs font-semibold text-[#2d1f1a] uppercase tracking-wide">{challenge.asset} Market</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d1f1a] mb-3 leading-tight">
                                {challenge.title}
                            </h2>

                            {/* Prediction */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-[#d4a574]/30">
                                <span className="text-lg">🎯</span>
                                <span className="font-semibold text-[#5c4a42]">{challenge.prediction}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bet Amount - Highlighted */}
                    <div className="relative mb-8 p-6 bg-gradient-to-r from-[#246044] to-[#2d6f4a] rounded-2xl text-white shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full translate-x-8 -translate-y-8" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full -translate-x-6 translate-y-6" />
                        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-white/80 text-sm font-medium mb-1">Prize Pool</p>
                                <p className="text-4xl font-black">
                                    ${challenge.betAmount}
                                    <span className="text-xl ml-1 text-white/70">SOL</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-white/70 text-xs">Start</p>
                                    <p className="font-bold">${challenge.startPrice.toLocaleString()}</p>
                                </div>
                                <div className="w-12 h-0.5 bg-white/30 rounded" />
                                <div className="text-right">
                                    <p className="text-white/70 text-xs">Target</p>
                                    <p className="font-bold text-amber-300">${challenge.targetPrice.toLocaleString()}</p>
                                </div>
                                <div className="w-12 h-0.5 bg-white/30 rounded" />
                                <div className="text-right">
                                    <p className="text-white/70 text-xs">Current</p>
                                    <p className={`font-bold ${challenge.priceChange >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                                        ${challenge.currentPrice.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VS Section - Only show if accepted */}
                    <div className="mb-8">
                        <h3 className="text-center text-sm font-bold text-[#8b7355] uppercase tracking-wider mb-4">
                            {isAccepted ? "Battle Matchup" : "Waiting for Challenger"}
                        </h3>

                        <div className={`flex flex-col ${isAccepted ? "sm:flex-row" : "sm:flex-row sm:justify-center"} items-center gap-4`}>
                            {/* Challenger Profile */}
                            <div className="relative group">
                                <div className={`relative p-4 rounded-2xl transition-all duration-300 ${hasWon
                                    ? "bg-gradient-to-br from-amber-100 to-yellow-50 border-2 border-amber-400 shadow-lg shadow-amber-200"
                                    : hasLost
                                        ? "bg-gradient-to-br from-red-100 to-rose-50 border-2 border-red-300"
                                        : "bg-white/80 border-2 border-[#d4a574]/30"
                                    }`}>
                                    {/* Winner Crown */}
                                    {hasWon && (
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                                            👑
                                        </div>
                                    )}

                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className={`w-20 h-20 rounded-full overflow-hidden border-3 ${hasWon ? "border-amber-400" : "border-[#d4a574]"
                                            } shadow-lg`}>
                                            <Image
                                                src={challenge.creator.avatar}
                                                alt={challenge.creator.name}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Label */}
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#2d1f1a] text-white text-[10px] font-bold rounded-full">
                                            CHALLENGER
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="mt-6 text-center">
                                        <p className="font-bold text-[#2d1f1a] text-sm">{challenge.creator.name}</p>
                                        <p className="text-xs text-[#8b7355] mt-1">
                                            {hasWon ? "Won the bet!" : hasLost ? "Lost the bet" : "Created challenge"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* VS Badge or Pending Badge */}
                            <div className="flex flex-col items-center justify-center">
                                {isAccepted ? (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2d1f1a] to-[#4a3830] flex items-center justify-center shadow-xl">
                                            <span className="text-2xl font-black text-[#f3e1d7]">VS</span>
                                        </div>
                                        {hasWon || hasLost ? (
                                            <div className="mt-2 text-center">
                                                <p className={`text-2xl font-black ${hasWon ? "text-amber-500" : "text-red-500"}`}>
                                                    {hasWon ? "+" : "-"}${challenge.betAmount}
                                                </p>
                                                <p className="text-[10px] text-[#8b7355]">SOL</p>
                                            </div>
                                        ) : null}
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg animate-pulse">
                                            <User className="w-8 h-8 text-white/50" />
                                        </div>
                                        <div className="mt-3 px-4 py-1.5 bg-[#8b7355]/20 rounded-full">
                                            <p className="text-xs font-semibold text-[#8b7355]">Seeking Challenger</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Accepter Profile - Only show if accepted */}
                            {isAccepted && challenge.accepter && (
                                <div className="relative group">
                                    <div className={`relative p-4 rounded-2xl transition-all duration-300 ${hasLost
                                        ? "bg-gradient-to-br from-amber-100 to-yellow-50 border-2 border-amber-400 shadow-lg shadow-amber-200"
                                        : hasWon
                                            ? "bg-gradient-to-br from-red-100 to-rose-50 border-2 border-red-300"
                                            : "bg-white/80 border-2 border-[#d4a574]/30"
                                        }`}>
                                        {/* Winner Crown */}
                                        {hasLost && (
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                                                👑
                                            </div>
                                        )}

                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className={`w-20 h-20 rounded-full overflow-hidden border-3 ${hasLost ? "border-amber-400" : "border-[#d4a574]"
                                                } shadow-lg`}>
                                                <Image
                                                    src={challenge.accepter.avatar}
                                                    alt={challenge.accepter.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {/* Label */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#2d1f1a] text-white text-[10px] font-bold rounded-full">
                                                ACCEPTER
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="mt-6 text-center">
                                            <p className="font-bold text-[#2d1f1a] text-sm">{challenge.accepter.name}</p>
                                            <p className="text-xs text-[#8b7355] mt-1">
                                                {hasLost ? "Won the bet!" : hasWon ? "Lost the bet" : "Accepted challenge"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Placeholder for pending state */}
                            {!isAccepted && (
                                <div className="relative">
                                    <div className="p-4 rounded-2xl bg-white/40 border-2 border-dashed border-[#d4a574]/30">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-3 border-[#d4a574]/50">
                                            <span className="text-3xl">❓</span>
                                        </div>
                                        <div className="mt-6 text-center">
                                            <p className="font-semibold text-[#8b7355] text-sm">No one yet</p>
                                            <p className="text-xs text-[#a08070] mt-1">Be the first to accept!</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="mb-6">
                        <h3 className="text-center text-sm font-bold text-[#8b7355] uppercase tracking-wider mb-4">
                            Challenge Timeline
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Created */}
                            <div className="relative p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#d4a574]/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-xs font-semibold text-[#8b7355] uppercase">Created</span>
                                </div>
                                <p className="font-bold text-[#2d1f1a]">{challenge.createdAt || "2 hours ago"}</p>
                            </div>

                            {/* Expires */}
                            <div className="relative p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#d4a574]/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <span className="text-xs font-semibold text-[#8b7355] uppercase">Expires</span>
                                </div>
                                <p className="font-bold text-[#2d1f1a]">{challenge.expiresAt || challenge.timeRemaining}</p>
                            </div>

                            {/* Ends */}
                            <div className="relative p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#d4a574]/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <AlertCircle className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-semibold text-[#8b7355] uppercase">Ends</span>
                                </div>
                                <p className="font-bold text-[#2d1f1a]">{challenge.endsAt || challenge.timeRemaining}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-[#2d1f1a]/5 rounded-xl">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">
                                {challenge.priceChange >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                            </span>
                            <span className={`font-bold ${challenge.priceChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                {challenge.priceChange >= 0 ? "+" : ""}{challenge.priceChange}%
                            </span>
                            <span className="text-sm text-[#8b7355]">price change</span>
                        </div>

                        <div className="w-px h-6 bg-[#d4a574]/30 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <span className="text-lg">👁️</span>
                            <span className="font-bold text-[#2d1f1a]">{challenge.likes}</span>
                            <span className="text-sm text-[#8b7355]">watching</span>
                        </div>

                        <div className="w-px h-6 bg-[#d4a574]/30 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <span className="text-lg">🎫</span>
                            <span className="font-bold text-[#2d1f1a]">#{challenge.id}</span>
                            <span className="text-sm text-[#8b7355]">challenge</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 py-3.5 px-6 bg-[#246044] hover:bg-[#2d6f4a] rounded-xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
                            Accept Challenge
                            <span className="text-xl">⚔️</span>
                        </button>
                        <button className="flex-1 py-3.5 px-6 bg-white/80 hover:bg-white rounded-xl text-[#2d1f1a] font-semibold text-base border border-[#d4a574]/30 hover:border-[#d4a574] transition-all duration-200 flex items-center justify-center gap-2">
                            Share
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
