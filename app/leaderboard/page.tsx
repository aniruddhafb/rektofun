"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getLeaderboard, type LeaderboardUser } from "../lib/users-service/users";
import { LoadingPage } from "../components/LoadingPage";

const SparkleIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z" fill="currentColor" />
    </svg>
);

const StarBadge = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L9.5 5.5L14 6L10.5 9L11.5 13.5L8 11L4.5 13.5L5.5 9L2 6L6.5 5.5L8 1Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    </svg>
);

const DiamondIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 2L10 6L6 10L2 6L6 2Z" fill="#9ca3af" />
    </svg>
);

const ChallengeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-500">
        <path d="M8 1L9.5 5.5L14 6L10.5 9L11.5 13.5L8 11L4.5 13.5L5.5 9L2 6L6.5 5.5L8 1Z" fill="currentColor" />
    </svg>
);

const HandshakeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-amber-700">
        <path d="M10 2C10 2 12 4 14 4C16 4 17 6 17 8C17 10 16 12 14 13L10 17L6 13C4 12 3 10 3 8C3 6 4 4 6 4C8 4 10 2 10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M7 8C7 8 8 9 10 9C12 9 13 8 13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const CoinsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-amber-600">
        <ellipse cx="10" cy="14" rx="6" ry="3" fill="currentColor" opacity="0.6" />
        <ellipse cx="10" cy="11" rx="6" ry="3" fill="currentColor" opacity="0.8" />
        <ellipse cx="10" cy="8" rx="6" ry="3" fill="currentColor" />
        <ellipse cx="10" cy="8" rx="4" ry="2" fill="#fbbf24" />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const ChevronIcon = ({ direction }: { direction: "up" | "down" }) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
        {direction === "up" ? (
            <path d="M6 4L3 7H9L6 4Z" fill="currentColor" />
        ) : (
            <path d="M6 8L9 5H3L6 8Z" fill="currentColor" />
        )}
    </svg>
);

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {direction === "left" ? (
            <path d="M10 3.5L5.5 8L10 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
            <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        )}
    </svg>
);

type LeaderboardRow = {
    id: string;
    walletAddress: string;
    rank: number;
    username: string;
    avatar: string;
    wins: number;
    rekts: number;
    challenges: number;
    winRate: string;
    earnings: string;
};

type SortField = "rank" | "wins" | "rekts" | "challenges" | "earnings";
type SortOrder = "desc" | "asc";
type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

const SortIndicator = ({ active, order }: { active: boolean; order: SortOrder }) => {
    if (!active) return <span className="text-gray-300">↕</span>;
    return <ChevronIcon direction={order === "asc" ? "up" : "down"} />;
};

function mapUserToRow(user: LeaderboardUser, rank: number): LeaderboardRow {
    const referralCount = user.referrals?.length ?? 0;
    const wins = referralCount * 100;
    const challenges = referralCount;
    const rekts = Math.max(0, Math.floor(challenges * 0.2));
    const winRate = challenges > 0 ? `${Math.min(99, Math.max(1, Math.round((wins / (wins + rekts || 1)) * 100)))}%` : "0%";

    return {
        id: user.id,
        walletAddress: user.wallet_address,
        rank,
        username: user.username || `user-${user.wallet_address.slice(0, 6)}`,
        avatar: user.profile_image || "/scribbles/pepe.png",
        wins,
        rekts,
        challenges,
        winRate,
        earnings: (user.earnings ?? 0).toFixed(1),
    };
}

function getRankBadgeClass(rank: number): string {
    if (rank === 1) return "border-amber-300 bg-amber-100 text-amber-800";
    if (rank === 2) return "border-slate-300 bg-slate-100 text-slate-700";
    if (rank === 3) return "border-orange-300 bg-orange-100 text-orange-800";
    return "border-gray-200 bg-white text-gray-700";
}

function getVisiblePages(currentPage: number, totalPages: number): PaginationItem[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "ellipsis-right", totalPages];
    }

    if (currentPage >= totalPages - 3) {
        return [1, "ellipsis-left", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis-left", currentPage - 1, currentPage, currentPage + 1, "ellipsis-right", totalPages];
}

async function fetchAllLeaderboardUsers(): Promise<LeaderboardUser[]> {
    const pageSize = 100;
    let offset = 0;
    let total = 0;
    const allUsers: LeaderboardUser[] = [];

    do {
        const response = await getLeaderboard(pageSize, offset);
        total = response.count;
        allUsers.push(...response.users);
        offset += pageSize;
    } while (allUsers.length < total);

    return allUsers;
}

export default function LeaderboardPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField>("rank");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [rows, setRows] = useState<LeaderboardRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const users = await fetchAllLeaderboardUsers();
                const mapped = users.map((user, index) => mapUserToRow(user, index + 1));
                setRows(mapped);
            } catch {
                setError("Failed to load leaderboard users.");
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    const filteredData = useMemo(
        () => rows.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase())),
        [rows, searchQuery]
    );

    const sortedData = useMemo(() => {
        const sorted = [...filteredData];
        sorted.sort((a, b) => {
            const direction = sortOrder === "asc" ? 1 : -1;
            if (sortField === "earnings") return (Number(a.earnings) - Number(b.earnings)) * direction;
            return ((a[sortField] as number) - (b[sortField] as number)) * direction;
        });
        return sorted;
    }, [filteredData, sortField, sortOrder]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
    const totalEarned = rows.reduce((sum, row) => sum + Number(row.earnings), 0);
    const totalChallenges = rows.reduce((sum, row) => sum + row.challenges, 0);
    const totalPoints = rows.reduce((sum, row) => sum + row.wins, 0);
    const visiblePages = getVisiblePages(currentPage, totalPages);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSort = (field: SortField) => {
        setCurrentPage(1);
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortField(field);
        setSortOrder("desc");
    };

    if (isLoading) {
        return <LoadingPage variant="simple" message="Loading leaderboard..." />;
    }

    return (
        <div className="rekto-page min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Leaderboard</h1>
                        <p className="text-gray-600 text-base sm:text-lg">Explore the top challengers and their achievements</p>
                    </div>
                </div>

                {/* stats website  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    <div className="leaderboard-hover-shadow group bg-[#fffaf6]/80 backdrop-blur-sm rounded-xl px-5 py-4 flex items-center justify-between border border-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-black">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                <ChallengeIcon />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900">{totalChallenges}</div>
                                <div className="text-xs font-bold uppercase tracking-wide text-gray-500">Challenges Created</div>
                            </div>
                        </div>
                    </div>

                    <div className="leaderboard-hover-shadow group bg-[#fffaf6]/80 backdrop-blur-sm rounded-xl px-5 py-4 flex items-center justify-between border border-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-black">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                                <HandshakeIcon />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900">{rows.length}</div>
                                <div className="text-xs font-bold uppercase tracking-wide text-gray-500">Total Traders</div>
                            </div>
                        </div>
                    </div>

                    <div className="leaderboard-hover-shadow group bg-[#fffaf6]/80 backdrop-blur-sm rounded-xl px-5 py-4 flex items-center justify-between border border-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-black">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <CoinsIcon />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900">${totalEarned.toFixed(1)}</div>
                                <div className="text-xs font-bold uppercase tracking-wide text-gray-500">Total Earned</div>
                            </div>
                        </div>
                    </div>

                    <div className="leaderboard-hover-shadow group bg-[#fffaf6]/80 backdrop-blur-sm rounded-xl px-5 py-4 flex items-center justify-between border border-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-black">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                                <SparkleIcon className="text-rose-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900">{totalPoints}</div>
                                <div className="text-xs font-bold uppercase tracking-wide text-gray-500">Total Points</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div className="relative max-w-md w-full">
                        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search traders"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="leaderboard-hover-shadow pl-11 pr-4 py-3 bg-white/80 border border-black/10 rounded-xl text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 w-full"
                        />
                    </div>
                    <div className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-gray-600">
                        {sortedData.length} {sortedData.length === 1 ? "trader" : "traders"} ranked
                    </div>
                </div>

                <div className="leaderboard-hover-shadow bg-[#fffaf6]/80 backdrop-blur-sm rounded-2xl border border-black/10 overflow-hidden transition-all duration-200 hover:border-black">
                    <div className="flex flex-col gap-1 border-b border-black/10 bg-white/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-gray-900">Trader Rankings</h2>
                            <p className="text-sm font-medium text-gray-500">Sorted by {sortField} in {sortOrder === "asc" ? "ascending" : "descending"} order</p>
                        </div>
                        <div className="text-sm font-semibold text-gray-600">
                            Page {Math.min(currentPage, Math.max(totalPages, 1))} of {Math.max(totalPages, 1)}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-12 gap-4 border-b border-black/10 bg-[#fff8f4] px-6 py-3 text-xs font-black uppercase tracking-wide text-gray-500">
                                <div onClick={() => handleSort("rank")} className="col-span-1 flex cursor-pointer items-center gap-1 bg-transparent p-0 text-left font-black text-gray-500 transition hover:text-gray-900">
                                    Rank <SortIndicator active={sortField === "rank"} order={sortOrder} />
                                </div>
                                <div className="col-span-3">Trader</div>
                                <div onClick={() => handleSort("wins")} className="col-span-2 flex cursor-pointer items-center gap-1 bg-transparent p-0 text-left font-black text-gray-500 transition hover:text-gray-900">
                                    Points <SortIndicator active={sortField === "wins"} order={sortOrder} />
                                </div>
                                <div onClick={() => handleSort("rekts")} className="col-span-1 flex cursor-pointer items-center gap-1 bg-transparent p-0 text-left font-black text-gray-500 transition hover:text-gray-900">
                                    Rekts <SortIndicator active={sortField === "rekts"} order={sortOrder} />
                                </div>
                                <div onClick={() => handleSort("challenges")} className="col-span-2 flex cursor-pointer items-center gap-1 bg-transparent p-0 text-left font-black text-gray-500 transition hover:text-gray-900">
                                    Challenges <SortIndicator active={sortField === "challenges"} order={sortOrder} />
                                </div>
                                <div className="col-span-1 flex items-center gap-1">Win% <ChevronIcon direction="up" /></div>
                                <div onClick={() => handleSort("earnings")} className="col-span-2 flex cursor-pointer items-center justify-end gap-1 bg-transparent p-0 text-right font-black text-gray-500 transition hover:text-gray-900">
                                    Earnings <SortIndicator active={sortField === "earnings"} order={sortOrder} />
                                </div>
                            </div>

                            <div className="divide-y divide-black/5 bg-white/55">
                                {error && <div className="px-6 py-10 text-center font-semibold text-red-600">{error}</div>}
                                {!error && paginatedData.length === 0 && (
                                    <div className="px-6 py-10 text-center font-semibold text-gray-600">No users found.</div>
                                )}

                                {!error && paginatedData.map((user) => (
                                    <div
                                        key={user.id}
                                        className="grid cursor-pointer grid-cols-12 items-center gap-4 px-6 py-4 transition-all duration-200 hover:relative hover:z-10 hover:bg-white hover:shadow-[0_10px_24px_rgba(17,17,17,0.12)]"
                                        onClick={() => router.push(`/profile/${user.walletAddress}`)}
                                    >
                                        <div className="col-span-1 flex items-center gap-2">
                                            <span className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm font-black ${getRankBadgeClass(user.rank)}`}>
                                                {user.rank}
                                            </span>
                                            {user.rank === 1 ? <StarBadge /> : <DiamondIcon />}
                                        </div>

                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm flex-shrink-0">
                                                <Image src={user.avatar} alt={user.username} fill className="object-cover" sizes="40px" />
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <span className="font-semibold text-gray-900 truncate">{user.username}</span>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-center gap-2">
                                            <SparkleIcon className="text-amber-500" />
                                            <span className="font-black text-gray-900">{user.wins}</span>
                                        </div>

                                        <div className="col-span-1 flex items-center gap-1">
                                            <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-black text-red-600">{user.rekts}</span>
                                        </div>

                                        <div className="col-span-2 flex items-center gap-1">
                                            <span className="font-semibold text-gray-900">{user.challenges}</span>
                                        </div>

                                        <div className="col-span-1">
                                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">{user.winRate}</span>
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <span className="font-black text-gray-900">${user.earnings}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {!error && totalPages > 1 && (
                        <div className="flex flex-col gap-4 border-t border-black/10 bg-white/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm font-semibold text-gray-600">
                                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} traders
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-black transition-all ${currentPage === 1
                                        ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
                                        : "border border-black/10 bg-white text-gray-700 hover:border-black hover:bg-[#fff8f4] hover:text-gray-900"
                                        }`}
                                >
                                    <ArrowIcon direction="left" />
                                    Previous
                                </button>

                                {visiblePages.map((page) =>
                                    typeof page === "number" ? (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            aria-current={currentPage === page ? "page" : undefined}
                                            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-black transition-all ${currentPage === page
                                                ? "border border-black bg-black text-white shadow-[3px_3px_0_#e85a2d]"
                                                : "border border-black/10 bg-white text-gray-700 hover:border-black hover:bg-[#fff8f4] hover:text-gray-900"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ) : (
                                        <span key={page} className="flex h-9 min-w-9 items-center justify-center text-sm font-black text-gray-400">
                                            ...
                                        </span>
                                    )
                                )}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-black transition-all ${currentPage === totalPages
                                        ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
                                        : "border border-black/10 bg-white text-gray-700 hover:border-black hover:bg-[#fff8f4] hover:text-gray-900"
                                        }`}
                                >
                                    Next
                                    <ArrowIcon direction="right" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                .pixel-shell .leaderboard-hover-shadow.leaderboard-hover-shadow {
                    box-shadow: none !important;
                }

                .pixel-shell .leaderboard-hover-shadow.leaderboard-hover-shadow:hover {
                    box-shadow: 4px 4px 0 #111 !important;
                }

                .pixel-shell input.leaderboard-hover-shadow.leaderboard-hover-shadow:focus {
                    box-shadow: 4px 4px 0 #111 !important;
                }

                .pixel-shell input.leaderboard-hover-shadow.leaderboard-hover-shadow:hover:not(:focus) {
                    box-shadow: 4px 4px 0 #111 !important;
                }
            `}</style>
        </div>
    );
}
