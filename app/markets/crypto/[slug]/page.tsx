"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { CreateChallengeModal } from "../../../components/challenge-components/CreateChallengeModal";
import { MarketHeader } from "../../../components/market-slug-components/MarketHeader";
import { ChartSection } from "../../../components/market-slug-components/ChartSection";
import { TopTradersSection } from "../../../components/market-slug-components/TopTradersSection";
import { FilterBar } from "../../../components/market-slug-components/FilterBar";
import { MarketChallengesGrid } from "../../../components/market-slug-components/MarketChallengesGrid";
import {
    getChallenges,
    type ChallengeListItem,
} from "@/app/lib/challenges-service/challenges";
import {
    getMarkets,
    type Market,
} from "@/app/lib/markets-service/market";

function formatMarketTitle(name: string) {
    return `${name} Challenge Markets`;
}

function formatMarketDescription(name: string) {
    return `Predict and earn by betting on ${name} market movements`;
}

export default function MarketPage() {
    const params = useParams<{ slug: string }>();
    const slugName = useMemo(() => decodeURIComponent(params.slug ?? ""), [params.slug]);
    const [showChart, setShowChart] = useState(true);
    const [showTopTraders, setShowTopTraders] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Latest");
    const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
    const [market, setMarket] = useState<Market | null>(null);
    const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadMarketChallenges() {
            if (!slugName) {
                if (isMounted) {
                    setMarket(null);
                    setChallenges([]);
                    setError("Market not found.");
                    setIsLoading(false);
                }
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const [marketsResponse, challengesResponse] = await Promise.all([
                    getMarkets({ parent_name: "Crypto" }),
                    getChallenges({ category: slugName }),
                ]);

                const matchedMarket =
                    marketsResponse.markets.find(
                        (item) => item.name.toLowerCase() === slugName.toLowerCase()
                    ) ?? null;

                if (isMounted) {
                    setMarket(matchedMarket);
                    setChallenges(challengesResponse.challenges);
                }
            } catch (fetchError) {
                if (isMounted) {
                    setMarket(null);
                    setChallenges([]);
                    setError(
                        fetchError instanceof Error
                            ? fetchError.message
                            : "Something went wrong while loading challenges."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadMarketChallenges();

        return () => {
            isMounted = false;
        };
    }, [slugName]);

    const marketName = market?.name || slugName || "Market";
    const marketDescription =
        market?.description || formatMarketDescription(marketName);
    const marketLogo = market?.icon || market?.image || "/scribbles/coins.png";

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#f3e1d7" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <MarketHeader
                    marketName={formatMarketTitle(marketName)}
                    marketDescription={marketDescription}
                    marketLogo={marketLogo}
                    onCreateChallenge={() => setIsCreateChallengeOpen(true)}
                />

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                        <ChartSection
                            showChart={showChart}
                            onToggleChart={() => setShowChart(!showChart)}
                        />

                        <TopTradersSection
                            showTopTraders={showTopTraders}
                            onToggleTopTraders={() => setShowTopTraders(!showTopTraders)}
                        />

                        <FilterBar
                            selectedFilter={selectedFilter}
                            onFilterChange={setSelectedFilter}
                            filterOpen={filterOpen}
                            onFilterOpenChange={setFilterOpen}
                        />

                        {isLoading ? (
                            <div className="rounded-2xl bg-white/40 border border-white/50 p-8 text-center text-gray-700">
                                Loading challenges...
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl bg-white/40 border border-white/50 p-8 text-center text-red-700">
                                {error}
                            </div>
                        ) : challenges.length === 0 ? (
                            <div className="rounded-2xl bg-white/40 border border-white/50 p-8 text-center text-gray-700">
                                No challenges found for {marketName}.
                            </div>
                        ) : (
                            <MarketChallengesGrid challenges={challenges} />
                        )}
                    </div>
                </div>
            </div>

            <CreateChallengeModal
                isOpen={isCreateChallengeOpen}
                onClose={() => setIsCreateChallengeOpen(false)}
                onCreated={() => { }}
            />
        </div>
    );
}
