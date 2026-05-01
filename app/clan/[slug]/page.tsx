"use client";

import { useState, useEffect } from "react";
import * as ClanComponents from "@/app/components/clan-slug-components";
import type { Tab } from "@/app/components/clan-slug-components";
import type { ClanData } from "@/app/components/clan-slug-components/types";
import { getClanDataBySlug } from "@/app/lib/clan-service/clans";
import { LoadingPage } from "@/app/components/LoadingPage";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ClanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [slug, setSlug] = useState<string>("");
    const [activeTab, setActiveTab] = useState<Tab>("Overview");
    const [clanData, setClanData] = useState<ClanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Handle clan membership change (when user joins or leaves)
    const handleClanMembershipChange = (newMemberCount: number) => {
        setClanData((prevData) => {
            if (!prevData) return prevData;
            return {
                ...prevData,
                members: newMemberCount,
            };
        });
        // Refresh clan data from server after a short delay
        setTimeout(() => {
            if (slug) {
                getClanDataBySlug(slug)
                    .then((freshData) => setClanData(freshData))
                    .catch((err) => console.error("Failed to refresh clan data:", err));
            }
        }, 500);
    };

    // Handle clan data update (when clan settings are saved)
    const handleClanDataUpdate = () => {
        // Refresh clan data from server after a short delay
        setTimeout(() => {
            if (slug) {
                getClanDataBySlug(slug)
                    .then((freshData) => setClanData(freshData))
                    .catch((err) => console.error("Failed to refresh clan data:", err));
            }
        }, 500);
    };

    // Resolve params promise
    useEffect(() => {
        params.then(p => {
            setSlug(p.slug);
        });
    }, [params]);

    useEffect(() => {
        async function fetchClan() {
            if (!slug) return;
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching clan with slug:", slug);
                // Fetch clan by slug (ID) and transform to ClanData format
                const clan = await getClanDataBySlug(slug);
                console.log("Fetched clan data:", clan);
                setClanData(clan);
            } catch (err) {
                console.error("Failed to fetch clan:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch clan");
            } finally {
                setLoading(false);
            }
        }

        fetchClan();
    }, [slug]);

    const tabs: Tab[] = ["Overview", "Chat"];

    return (
        <>
            {loading ? (
                <LoadingPage variant="simple" message="Loading clan details..." />
            ) : clanData ? (
                <div className="min-h-screen" style={{ backgroundColor: "#f3e1d7" }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                        {/* ── Clan Header ── */}
                        <ClanComponents.ClanHeader clanData={clanData} onClanMembershipChange={handleClanMembershipChange} onClanDataUpdate={handleClanDataUpdate} />

                        {/* ── Tabs ── */}
                        <ClanComponents.ClanTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            tabs={tabs}
                        />

                        {/* ── Overview Tab ── */}
                        {activeTab === "Overview" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                {/* Left: Clan Challenges */}
                                <div className="lg:col-span-2">
                                    <ClanComponents.ClanChallenges challenges={ClanComponents.challengesData} />
                                </div>

                                {/* Right: Members */}
                                <div className="lg:col-span-1">
                                    <ClanComponents.ClanMembers
                                        clanId={clanData.slug}
                                        maxMembers={clanData.maxMembers}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Chat Tab ── */}
                        {activeTab === "Chat" && (
                            <ClanComponents.ChatSection clanData={clanData} />
                        )}

                    </div>
                </div>
            ) : (
                <div className="min-h-screen" style={{ backgroundColor: "#f3e1d7" }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/70 shadow-sm p-5 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-sm">Clan not found</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
