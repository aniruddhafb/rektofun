'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChallengeCard } from "./ChallengeCard";
import { getChallenges } from "../../lib/challenges-service/challenges";
import { useSolanaWallet } from '@/app/lib/useSolanaWallet';
import { ChallengeListItem } from '../../lib/challenges-service/challenges';

interface ChallengeGridProps {
    onRekt: (challenge: ChallengeListItem) => void;
    onClick: (challenge: ChallengeListItem) => void;
    onOpenModal: () => void;
    onChallengesLoaded?: (challenges: ChallengeListItem[]) => void;
    isLoading?: boolean;
    refreshKey?: number;
}

export function ChallengeGrid({
    onRekt,
    onClick,
    onOpenModal,
    onChallengesLoaded,
    refreshKey = 0,
}: ChallengeGridProps) {
    const PAGE_SIZE = 6;
    const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [retryNonce, setRetryNonce] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const requestIdRef = useRef(0);
    const { publicKey } = useSolanaWallet();

    let ownerAddress = publicKey?.toString() || '';

    const fetchChallenges = useCallback(async (currentOffset: number, append: boolean) => {
        const requestId = ++requestIdRef.current;
        if (!append) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        setLoadError(null);

        try {
            const response = await getChallenges(
                { limit: PAGE_SIZE, offset: currentOffset },
                {
                    timeoutMs: 10000,
                    retries: 2,
                },
            );
            if (requestId !== requestIdRef.current) return;
            const nextChunk = response.challenges ?? [];
            setChallenges((prev) => {
                const merged = append ? [...prev, ...nextChunk] : nextChunk;
                onChallengesLoaded?.(merged);
                return merged;
            });
            setHasMore(nextChunk.length === PAGE_SIZE);
            setOffset(currentOffset + nextChunk.length);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error('Failed to fetch challenges:', error);
            if (!append) {
                setChallenges([]);
                onChallengesLoaded?.([]);
            }
            setLoadError('Could not load challenges. Please try again.');
        } finally {
            if (requestId !== requestIdRef.current) return;
            if (!append) {
                setIsLoading(false);
            } else {
                setIsLoadingMore(false);
            }
        }
    }, [PAGE_SIZE, onChallengesLoaded]);

    useEffect(() => {
        requestIdRef.current += 1;
        setChallenges([]);
        setOffset(0);
        setHasMore(true);
        fetchChallenges(0, false);
    }, [fetchChallenges, refreshKey, retryNonce]);

    useEffect(() => {
        if (!hasMore || isLoading || isLoadingMore) return;

        const node = loadMoreRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first?.isIntersecting) return;
                fetchChallenges(offset, true);
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.1,
            },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [fetchChallenges, hasMore, isLoading, isLoadingMore, offset]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
                <div className="text-center py-16 text-gray-700">Loading challenges…</div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
                <div className="text-center py-16">
                    <p className="text-red-600 text-base mb-4">{loadError}</p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => setRetryNonce((n) => n + 1)}
                            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-white/50 border border-gray-400 hover:bg-white/80 text-black text-sm font-medium rounded-full transition-colors"
                        >
                            Retry
                        </button>
                        <button
                            onClick={onOpenModal}
                            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-white/20 border border-gray-300 hover:bg-white/40 text-black text-sm font-medium rounded-full transition-colors"
                        >
                            Create a challenge
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (challenges.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-4">No challenges found yet.</p>
                    <button
                        onClick={onOpenModal}
                        className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-white/50 border border-gray-400 hover:bg-white/80 text-black text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Be the first to create one!
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {challenges.map((challenge) => (
                    <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onRekt={onRekt}
                        onClick={onClick}
                        ownerAddress={ownerAddress}
                    />
                ))}
            </div>
            {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isLoadingMore ? (
                        <span className="text-sm text-gray-600">Loading more challenges...</span>
                    ) : (
                        <span className="text-sm text-gray-400">Scroll to load more</span>
                    )}
                </div>
            )}
        </div>
    );
}
