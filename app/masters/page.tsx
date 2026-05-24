"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLeaderboard, type LeaderboardUser } from "@/app/lib/users-service/users";
import { LoadingPage } from "@/app/components/LoadingPage";
import { followUser, unfollowUser } from "@/app/lib/users-service/users";
import { useSolanaWallet } from "@/app/lib/useSolanaWallet";
import { useUserStore } from "@/app/store/useUserStore";
import {
    buildPagination,
    CATEGORY_OPTIONS,
    mapUserToMaster,
    MastersFiltersBar,
    MastersGrid,
    MastersMobileFiltersSheet,
    MastersPageHeader,
    MastersPagination,
    type CategoryFilter,
    type Master,
    type VerificationFilter,
} from "@/app/components/master-components";

async function fetchAllUsers(): Promise<LeaderboardUser[]> {
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

export default function MastersPage() {
    const router = useRouter();
    const { solanaWallet } = useSolanaWallet();
    const { user: currentUser } = useUserStore();

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(CATEGORY_OPTIONS[0]);
    const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>("All Masters");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [masters, setMasters] = useState<Master[]>([]);
    const [followLoadingByWallet, setFollowLoadingByWallet] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categoryRef = useRef<HTMLDivElement>(null);
    const verificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (verificationRef.current && !verificationRef.current.contains(event.target as Node)) {
                setIsVerificationOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isMobileFiltersOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileFiltersOpen]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const users = await fetchAllUsers();
                setMasters(users.map((user, index) => mapUserToMaster(user, index)));
            } catch {
                setError("Failed to load masters.");
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    const toggleFollow = async (targetWalletAddress: string) => {
        if (!solanaWallet?.address || !currentUser?.id) return;

        const targetMaster = masters.find((m) => m.walletAddress === targetWalletAddress);
        if (!targetMaster || targetMaster.walletAddress === solanaWallet.address) return;

        const viewerAlreadyFollowing = targetMaster.followers.includes(currentUser.id);

        try {
            setFollowLoadingByWallet((prev) => ({ ...prev, [targetWalletAddress]: true }));
            const updatedTarget = viewerAlreadyFollowing
                ? await unfollowUser(targetWalletAddress, solanaWallet.address)
                : await followUser(targetWalletAddress, solanaWallet.address);

            setMasters((prev) =>
                prev.map((master) =>
                    master.walletAddress === targetWalletAddress
                        ? ({
                              ...master,
                              followers: updatedTarget.followers,
                          } as Master)
                        : master,
                ),
            );
        } catch (followError) {
            console.error("Failed to toggle follow:", followError);
        } finally {
            setFollowLoadingByWallet((prev) => ({ ...prev, [targetWalletAddress]: false }));
        }
    };

    const filteredMasters = useMemo(() => {
        return masters.filter((master) => {
            const matchesSearch =
                master.name.toLowerCase().includes(search.toLowerCase()) ||
                master.username.toLowerCase().includes(search.toLowerCase()) ||
                master.walletAddress.toLowerCase().includes(search.toLowerCase());

            const matchesCategory = categoryFilter === "All Categories" || master.category === categoryFilter;

            const matchesVerification =
                verificationFilter === "All Masters" ||
                (verificationFilter === "Verified" && master.verified) ||
                (verificationFilter === "Unverified" && !master.verified);

            return matchesSearch && matchesCategory && matchesVerification;
        });
    }, [masters, search, categoryFilter, verificationFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredMasters.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const pagedMasters = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * itemsPerPage;
        return filteredMasters.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMasters, itemsPerPage, safeCurrentPage]);

    const pageButtons = useMemo(() => buildPagination(safeCurrentPage, totalPages), [safeCurrentPage, totalPages]);
    const currentStart = filteredMasters.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
    const currentEnd = Math.min(safeCurrentPage * itemsPerPage, filteredMasters.length);

    const resetToFirstPage = () => setCurrentPage(1);

    if (isLoading) {
        return <LoadingPage variant="simple" message="Loading masters..." />;
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#f3e1d7" }}>
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <MastersPageHeader />

                <MastersFiltersBar
                    search={search}
                    categoryFilter={categoryFilter}
                    verificationFilter={verificationFilter}
                    isCategoryOpen={isCategoryOpen}
                    isVerificationOpen={isVerificationOpen}
                    categoryRef={categoryRef}
                    verificationRef={verificationRef}
                    onSearchChange={(value) => {
                        setSearch(value);
                        resetToFirstPage();
                    }}
                    onCategoryToggle={() => setIsCategoryOpen((prev) => !prev)}
                    onVerificationToggle={() => setIsVerificationOpen((prev) => !prev)}
                    onCategorySelect={(value) => {
                        setCategoryFilter(value);
                        resetToFirstPage();
                        setIsCategoryOpen(false);
                    }}
                    onVerificationSelect={(value) => {
                        setVerificationFilter(value);
                        resetToFirstPage();
                        setIsVerificationOpen(false);
                    }}
                    onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
                />

                <MastersMobileFiltersSheet
                    isOpen={isMobileFiltersOpen}
                    search={search}
                    categoryFilter={categoryFilter}
                    verificationFilter={verificationFilter}
                    onClose={() => setIsMobileFiltersOpen(false)}
                    onSearchChange={(value) => {
                        setSearch(value);
                        resetToFirstPage();
                    }}
                    onCategorySelect={(value) => {
                        setCategoryFilter(value);
                        resetToFirstPage();
                        setIsMobileFiltersOpen(false);
                    }}
                    onVerificationSelect={(value) => {
                        setVerificationFilter(value);
                        resetToFirstPage();
                        setIsMobileFiltersOpen(false);
                    }}
                />

                {error ? (
                    <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                ) : null}

                <MastersGrid
                    masters={pagedMasters}
                    error={error}
                    canFollow={Boolean(currentUser?.id && solanaWallet?.address)}
                    getIsOwnCard={(master) => master.walletAddress === solanaWallet?.address}
                    getIsFollowing={(master) => (currentUser?.id ? master.followers.includes(currentUser.id) : false)}
                    getIsFollowLoading={(walletAddress) => Boolean(followLoadingByWallet[walletAddress])}
                    onViewProfile={(walletAddress) => router.push(`/profile/${encodeURIComponent(walletAddress)}`)}
                    onToggleFollow={toggleFollow}
                />

                <MastersPagination
                    currentStart={currentStart}
                    currentEnd={currentEnd}
                    totalItems={filteredMasters.length}
                    safeCurrentPage={safeCurrentPage}
                    totalPages={totalPages}
                    pageButtons={pageButtons}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(size) => {
                        setItemsPerPage(size);
                        resetToFirstPage();
                    }}
                />
            </div>
        </div>
    );
}
