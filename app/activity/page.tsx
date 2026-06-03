"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock, ListFilter, Search, Shapes } from "lucide-react";
import ChallengeDetailModal from "@/app/components/challenge-components/ChallengeDetailModal";
import {
    ChallengeListItem,
    getChallenges,
} from "@/app/lib/challenges-service/challenges";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";

type ActivityType = "All Activity" | "Sports" | "Crypto" | "PVP Mode" | "Multi Mode";
type ActivityStatus = "All Status" | "Expired" | "Ongoing" | "Resolved" | "Resolving" | "Completed";

const activityTypeOptions: ActivityType[] = ["All Activity", "Sports", "Crypto", "PVP Mode", "Multi Mode"];
const activityStatusOptions: ActivityStatus[] = ["All Status", "Expired", "Ongoing", "Resolved", "Resolving", "Completed"];
const SKELETON_CARDS_COUNT = 5;

function formatTimeAgo(dateString: string): string {
    const dateMs = new Date(dateString).getTime();
    if (Number.isNaN(dateMs)) return "recently";
    const diffMs = Date.now() - dateMs;
    if (diffMs < 0) return "just now";

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
}

function formatResolveCountdown(resolveTime: string): string {
    const resolveMs = new Date(resolveTime).getTime();
    if (Number.isNaN(resolveMs)) return "";

    const diffMs = resolveMs - Date.now();
    if (diffMs <= 0) return "ended";

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
}

export default function ActivityPage() {
    const PAGE_SIZE = 5;
    const [activeFilter, setActiveFilter] = useState<ActivityType>("All Activity");
    const [activeStatus, setActiveStatus] = useState<ActivityStatus>("All Status");
    const [searchQuery, setSearchQuery] = useState("");
    const [activities, setActivities] = useState<ChallengeListItem[]>([]);
    const [totalActivities, setTotalActivities] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<ChallengeListItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [currentTimeMs, setCurrentTimeMs] = useState(() => Date.now());
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    useBodyScrollLock(isMobileFiltersOpen);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
                setIsTypeDropdownOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => setCurrentTimeMs(Date.now()), 60000);
        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadActivities = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setActivities([]);
                const offset = (currentPage - 1) * PAGE_SIZE;
                const response = await getChallenges({ limit: PAGE_SIZE, offset });
                if (!isMounted) return;

                const sorted = [...response.challenges].sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setActivities(sorted);
                setTotalActivities(response.count ?? 0);
            } catch (fetchError) {
                if (!isMounted) return;
                setError(fetchError instanceof Error ? fetchError.message : "Failed to load activity.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadActivities();
        return () => {
            isMounted = false;
        };
    }, [currentPage]);

    const filteredActivities = useMemo(() => {
        return activities.filter((activity) => {
            const mode = activity.mode?.toLowerCase() ?? "";
            const marketName = activity.market.name?.toLowerCase() ?? "";
            const parentId = activity.market.parent_id?.toLowerCase() ?? "";
            const resolutionStatus = activity.resolution_status?.toLowerCase() ?? "";
            const normalizedSearch = searchQuery.trim().toLowerCase();
            const expireMs = new Date(activity.expire_time).getTime();
            const resolveMs = new Date(activity.resolve_time).getTime();

            const matchesType =
                activeFilter === "All Activity" ||
                (activeFilter === "Sports" && (marketName.includes("sport") || parentId.includes("sport") || activity.resolution_source === "manual")) ||
                (activeFilter === "Crypto" && !marketName.includes("sport") && activity.resolution_source !== "manual") ||
                (activeFilter === "PVP Mode" && mode.includes("pvp")) ||
                (activeFilter === "Multi Mode" && mode.includes("multi"));

            const matchesStatus =
                activeStatus === "All Status" ||
                (activeStatus === "Expired" && Number.isFinite(expireMs) && expireMs <= currentTimeMs && activity.status !== "resolved") ||
                (activeStatus === "Ongoing" && activity.status === "open" && (!Number.isFinite(expireMs) || expireMs > currentTimeMs)) ||
                (activeStatus === "Resolved" && activity.status === "resolved") ||
                (activeStatus === "Resolving" && (activity.status === "locked" || resolutionStatus.includes("resolving") || (Number.isFinite(resolveMs) && resolveMs <= currentTimeMs && activity.status !== "resolved"))) ||
                (activeStatus === "Completed" && (activity.status === "resolved" || Boolean(activity.resolved_at)));

            const matchesSearch =
                normalizedSearch.length === 0 ||
                activity.title.toLowerCase().includes(normalizedSearch) ||
                activity.creator.username?.toLowerCase().includes(normalizedSearch) ||
                activity.creator.wallet_address?.toLowerCase().includes(normalizedSearch) ||
                activity.market.name?.toLowerCase().includes(normalizedSearch);

            return matchesType && matchesStatus && matchesSearch;
        });
    }, [activeFilter, activeStatus, activities, currentTimeMs, searchQuery]);
    const totalPages = Math.max(1, Math.ceil(totalActivities / PAGE_SIZE));
    const visiblePages = useMemo(
        () => Array.from({ length: totalPages }, (_, index) => index + 1),
        [totalPages]
    );

    const handleActivityClick = (challenge: ChallengeListItem) => {
        setSelectedChallenge(challenge);
        setIsDetailModalOpen(true);
    };

    const mobileFiltersSheet =
        isMobileFiltersOpen && typeof document !== "undefined"
            ? createPortal(
                <div className="fixed inset-0 z-[200] sm:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="absolute inset-0 bg-black/40"
                    />

                    <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-3xl border border-b-0 border-black/[0.06] bg-white p-4 pb-6">
                        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />

                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900">Activity Filters</h3>
                            <button
                                type="button"
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="px-2 py-1 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Search</p>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search activity..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full rounded-xl border border-black/[0.07] py-3 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-900/[0.04]"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Activity</p>
                            <div className="space-y-2">
                                {activityTypeOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setActiveFilter(option);
                                            setCurrentPage(1);
                                            setIsMobileFiltersOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm transition ${activeFilter === option
                                            ? "border-gray-950 bg-gray-950 font-semibold text-white"
                                            : "border-black/[0.07] text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <ListFilter className="h-4 w-4" />
                                        <span>{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
                            <div className="space-y-2">
                                {activityStatusOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setActiveStatus(option);
                                            setCurrentPage(1);
                                            setIsMobileFiltersOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm transition ${activeStatus === option
                                            ? "border-gray-950 bg-gray-950 font-semibold text-white"
                                            : "border-black/[0.07] text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Clock className="h-4 w-4" />
                                        <span>{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body,
            )
            : null;

    return (
        <div className="rekto-page min-h-screen">
            {/* Header Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-[#2d1f1a]">
                        Activity
                    </h1>
                </div>
                <p className="text-[#5c4a42] text-sm sm:text-base">
                    View the latest challenges and bets made across the platform
                </p>
            </div>

            {/* Filters */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-stretch gap-3 sm:gap-3 lg:flex-row lg:items-center">
                    <div className="relative hidden w-full sm:block lg:max-w-md lg:flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => {
                                setSearchQuery(event.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search activity..."
                            className="w-full rounded-full border border-black/15 bg-white/70 py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-[2px_2px_0_rgba(0,0,0,0.16)] placeholder:text-gray-400 outline-none transition hover:shadow-[3px_3px_0_rgba(0,0,0,0.18)] focus:border-black/25 focus:bg-white focus:ring-4 focus:ring-gray-900/[0.04]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-black/15 bg-white/75 px-4 py-3 text-sm font-medium text-gray-800 !shadow-none transition hover:border-black/25 hover:bg-white hover:!shadow-none active:!shadow-none sm:hidden"
                    >
                        <span>Filters</span>
                        <span className="max-w-[65%] truncate text-right text-xs text-gray-500">
                            {activeFilter} • {activeStatus}
                        </span>
                    </button>

                    <div className="hidden w-full items-stretch gap-3 sm:grid sm:grid-cols-2 lg:w-auto">
                        <div className="relative w-full min-w-0" ref={typeDropdownRef}>
                            <button
                                onClick={() => {
                                    setIsTypeDropdownOpen(!isTypeDropdownOpen);
                                    setIsStatusDropdownOpen(false);
                                }}
                                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${isTypeDropdownOpen
                                    ? "border-black/25 bg-white text-gray-950 shadow-[3px_3px_0_rgba(0,0,0,0.2)] ring-4 ring-gray-900/[0.04]"
                                    : "border-black/15 bg-white/70 text-gray-700 hover:border-black/25 hover:bg-white hover:shadow-[3px_3px_0_rgba(0,0,0,0.18)]"
                                    }`}
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <ListFilter className="h-4 w-4 text-gray-500" />
                                    <span className="truncate">{activeFilter}</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isTypeDropdownOpen ? "rotate-180 text-gray-700" : ""}`} />
                            </button>

                            {isTypeDropdownOpen && (
                                <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-black/15 bg-white p-1.5 sm:w-auto sm:min-w-[14rem]">
                                    {activityTypeOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setActiveFilter(option);
                                                setCurrentPage(1);
                                                setIsTypeDropdownOpen(false);
                                            }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${activeFilter === option
                                                ? "bg-gray-950 font-semibold text-white"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                                                }`}
                                        >
                                            <ListFilter className={`h-4 w-4 ${activeFilter === option ? "text-white" : "text-gray-500"}`} />
                                            <span>{option}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative w-full min-w-0" ref={statusDropdownRef}>
                            <button
                                onClick={() => {
                                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                                    setIsTypeDropdownOpen(false);
                                }}
                                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${isStatusDropdownOpen
                                    ? "border-black/25 bg-white text-gray-950 shadow-[3px_3px_0_rgba(0,0,0,0.2)] ring-4 ring-gray-900/[0.04]"
                                    : "border-black/15 bg-white/70 text-gray-700 hover:border-black/25 hover:bg-white hover:shadow-[3px_3px_0_rgba(0,0,0,0.18)]"
                                    }`}
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <Shapes className="h-4 w-4 text-gray-500" />
                                    <span className="truncate">{activeStatus}</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isStatusDropdownOpen ? "rotate-180 text-gray-700" : ""}`} />
                            </button>

                            {isStatusDropdownOpen && (
                                <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-black/15 bg-white p-1.5 sm:w-auto sm:min-w-[14rem]">
                                    {activityStatusOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setActiveStatus(option);
                                                setCurrentPage(1);
                                                setIsStatusDropdownOpen(false);
                                            }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${activeStatus === option
                                                ? "bg-gray-950 font-semibold text-white"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                                                }`}
                                        >
                                            <Clock className={`h-4 w-4 ${activeStatus === option ? "text-white" : "text-gray-500"}`} />
                                            <span>{option}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="relative z-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="space-y-3">
                    {isLoading && (
                        Array.from({ length: SKELETON_CARDS_COUNT }).map((_, index) => (
                            <div
                                key={`activity-skeleton-${index}`}
                                className="bg-[#f8ede7] rounded-2xl p-4 border border-[#e8d5c8] animate-pulse"
                                aria-hidden="true"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#e8d5c8] flex-shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="h-4 w-24 rounded-full bg-[#e8d5c8]" />
                                            <div className="h-4 w-10 rounded-full bg-[#e8d5c8]" />
                                            <div className="h-4 w-14 rounded-full bg-[#e8d5c8]" />
                                            <div className="h-4 w-8 rounded-full bg-[#e8d5c8]" />
                                            <div className="h-4 w-40 rounded-full bg-[#e8d5c8]" />
                                        </div>
                                        <div className="mt-2 h-3 w-16 rounded-full bg-[#e8d5c8]" />
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-[#e8d5c8] flex-shrink-0" />
                                </div>
                            </div>
                        ))
                    )}

                    {!isLoading && error && (
                        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-red-700">
                            Failed to load activity: {error}
                        </div>
                    )}

                    {!isLoading && !error && filteredActivities.length === 0 && (
                        <div className="bg-[#f8ede7] rounded-2xl p-6 border border-[#e8d5c8] text-[#5c4a42]">
                            {activities.length === 0 ? "No activity yet." : "No activity found."}
                        </div>
                    )}

                    {!isLoading && filteredActivities.map((item) => {
                        const creatorName = item.creator.username || "Unknown user";
                        const creatorWallet = item.creator.wallet_address || "";
                        const profileSlug = creatorWallet || creatorName;
                        const avatar = item.creator.profile_image || item.market.icon || "/scribbles/btc.png";
                        const betAmount = item.initial_bet ?? 0;
                        const timeAgo = formatTimeAgo(item.created_at);
                        const resolveCountdown = formatResolveCountdown(item.resolve_time);

                        return (
                            <div
                                key={item.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleActivityClick(item)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        handleActivityClick(item);
                                    }
                                }}
                                className="cursor-pointer group bg-[#f8ede7] hover:bg-white/50 rounded-2xl p-4 transition-all duration-200 border border-[#e8d5c8] hover:border-black hover:shadow-[4px_4px_0_#111]"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar with status */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4b8a8] bg-white">
                                            <Image
                                                src={avatar}
                                                alt={creatorName}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Main Activity Line */}
                                        <div className="flex flex-wrap items-center gap-x-1.5 text-sm sm:text-base leading-relaxed">
                                            <Link
                                                href={`/profile/${profileSlug}`}
                                                onClick={(event) => event.stopPropagation()}
                                                className="font-bold text-[#2d1f1a] hover:text-[#5c4a42] transition-colors"
                                            >
                                                {creatorName}
                                            </Link>
                                            <span className="text-[#5c4a42]">bet</span>
                                            <span className="font-bold text-[#2d1f1a]">${betAmount}</span>
                                            <span className="text-[#5c4a42]">on</span>
                                            <span className="font-semibold text-[#2d1f1a]">{item.title}</span>
                                            {resolveCountdown && <span className="text-[#8b7355]">{resolveCountdown}</span>}
                                        </div>

                                        <div className="mt-1.5">
                                            <span className="text-[#a08070] text-xs">{timeAgo}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f3e1d7]/50 group-hover:bg-[#2d1f1a] text-[#5c4a42] group-hover:text-[#f3e1d7] transition-all duration-200 flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!isLoading && !error && totalActivities > 0 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full scrollbar-hide">
                            {visiblePages.map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                        ? "bg-[#d4c4b5] text-gray-800"
                                        : "text-gray-600 hover:bg-white/30"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ChallengeDetailModal
                challenge={selectedChallenge}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedChallenge(null);
                }}
            />

            {mobileFiltersSheet}

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
