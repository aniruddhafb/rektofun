"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    BadgeCheck,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Info,
    Search,
    Shapes,
    Shield,
    ShieldCheck,
    ShieldOff,
    UserPlus,
} from "lucide-react";

type BadgeTone = "violet" | "green" | "yellow" | "blue" | "red";

type Influencer = {
    id: number;
    name: string;
    username: string;
    category: "Crypto" | "Sports" | "Stocks" | "Others";
    verified: boolean;
    topGainer: boolean;
    role1: string;
    role2: string;
    role1Tone: BadgeTone;
    role2Tone: BadgeTone;
    challenges: number;
    winRate: number;
    wins: number;
    rekts: number;
    banner: string;
    bannerLabel: string;
    avatarPath: string;
};

const CATEGORY_OPTIONS = ["All Categories", "Crypto", "Sports", "Stocks", "Others"] as const;
type CategoryFilter = (typeof CATEGORY_OPTIONS)[number];
const VERIFICATION_OPTIONS = ["All Masters", "Verified", "Unverified"] as const;
type VerificationFilter = (typeof VERIFICATION_OPTIONS)[number];

const BASE_INFLUENCERS: Omit<Influencer, "id" | "avatarPath">[] = [
    {
        name: "Crypto Yoddha",
        username: "@cryptoyoddha",
        category: "Crypto",
        verified: true,
        topGainer: false,
        role1: "Crypto Analyst",
        role2: "Top Creator",
        role1Tone: "violet",
        role2Tone: "yellow",
        challenges: 342,
        winRate: 68,
        wins: 512,
        rekts: -243,
        banner: "linear-gradient(120deg, #211548 0%, #3d2e7a 45%, #20163e 100%)",
        bannerLabel: "CRYPTO YODDHA",
    },
    {
        name: "Street Alpha",
        username: "@streetalpha",
        category: "Stocks",
        verified: true,
        topGainer: false,
        role1: "Equity Pro",
        role2: "Top Creator",
        role1Tone: "blue",
        role2Tone: "yellow",
        challenges: 301,
        winRate: 65,
        wins: 497,
        rekts: -277,
        banner: "linear-gradient(120deg, #121f2f 0%, #214062 50%, #132439 100%)",
        bannerLabel: "STREET ALPHA",
    },
    {
        name: "Macro Monk",
        username: "@macromonk",
        category: "Others",
        verified: false,
        topGainer: false,
        role1: "Macro Trends",
        role2: "Community Pick",
        role1Tone: "green",
        role2Tone: "blue",
        challenges: 168,
        winRate: 57,
        wins: 266,
        rekts: -199,
        banner: "linear-gradient(120deg, #1f1f1f 0%, #3a3a3a 50%, #212121 100%)",
        bannerLabel: "MACRO MONK",
    },
    {
        name: "The Degen Trader",
        username: "@thedegentrader",
        category: "Crypto",
        verified: true,
        topGainer: false,
        role1: "Market Wizard",
        role2: "High Volume",
        role1Tone: "violet",
        role2Tone: "green",
        challenges: 586,
        winRate: 61,
        wins: 787,
        rekts: -501,
        banner: "linear-gradient(120deg, #0b0f18 0%, #1f2a43 52%, #111827 100%)",
        bannerLabel: "THE DEGEN",
    },
    {
        name: "Bullish Bantai",
        username: "@bullishbantai",
        category: "Crypto",
        verified: true,
        topGainer: true,
        role1: "Bullish",
        role2: "Top Gainer",
        role1Tone: "green",
        role2Tone: "yellow",
        challenges: 278,
        winRate: 71,
        wins: 605,
        rekts: -247,
        banner: "linear-gradient(120deg, #052d15 0%, #0f5f2e 52%, #081f16 100%)",
        bannerLabel: "BULLISH",
    },
    {
        name: "BearWala",
        username: "@bearwala",
        category: "Crypto",
        verified: true,
        topGainer: false,
        role1: "Contrarian",
        role2: "Top Creator",
        role1Tone: "red",
        role2Tone: "yellow",
        challenges: 315,
        winRate: 64,
        wins: 424,
        rekts: -238,
        banner: "linear-gradient(120deg, #2f0207 0%, #6b0914 52%, #1f0c12 100%)",
        bannerLabel: "BEARWALA",
    },
    {
        name: "Crypto Maafiya",
        username: "@cryptomaafiya",
        category: "Crypto",
        verified: true,
        topGainer: false,
        role1: "Alpha Hunter",
        role2: "High Volume",
        role1Tone: "violet",
        role2Tone: "green",
        challenges: 452,
        winRate: 67,
        wins: 892,
        rekts: -439,
        banner: "linear-gradient(120deg, #20062b 0%, #65108e 52%, #2a0b3e 100%)",
        bannerLabel: "CRYPTO MAAFIYA",
    },
    {
        name: "Futbol Predicts",
        username: "@futbolpredicts",
        category: "Sports",
        verified: true,
        topGainer: false,
        role1: "Sports Guru",
        role2: "Top Creator",
        role1Tone: "blue",
        role2Tone: "yellow",
        challenges: 189,
        winRate: 59,
        wins: 327,
        rekts: -228,
        banner: "linear-gradient(120deg, #0b1f30 0%, #12385a 45%, #0d1c2e 100%)",
        bannerLabel: "FUTBOL PREDICTS",
    },
    {
        name: "Moon Mission",
        username: "@moonmission",
        category: "Crypto",
        verified: true,
        topGainer: true,
        role1: "Long Term",
        role2: "Top Gainer",
        role1Tone: "violet",
        role2Tone: "yellow",
        challenges: 234,
        winRate: 73,
        wins: 556,
        rekts: -206,
        banner: "linear-gradient(120deg, #22084a 0%, #4b1a8c 52%, #2f125c 100%)",
        bannerLabel: "MOON MISSION",
    },
    {
        name: "King of Calls",
        username: "@kingofcalls",
        category: "Crypto",
        verified: true,
        topGainer: false,
        role1: "Accuracy King",
        role2: "Verified",
        role1Tone: "blue",
        role2Tone: "blue",
        challenges: 402,
        winRate: 69,
        wins: 723,
        rekts: -325,
        banner: "linear-gradient(120deg, #061326 0%, #12365e 50%, #0b1a33 100%)",
        bannerLabel: "KING OF CALLS",
    },
];

const influencers: Influencer[] = Array.from({ length: 24 }, (_, index) => {
    const seed = BASE_INFLUENCERS[index % BASE_INFLUENCERS.length];
    const cycle = Math.floor(index / BASE_INFLUENCERS.length);
    const nameSuffix = cycle === 0 ? "" : ` ${["Prime", "Pro", "X"][cycle - 1] ?? "Elite"}`;

    return {
        ...seed,
        id: index + 1,
        name: `${seed.name}${nameSuffix}`,
        username: cycle === 0 ? seed.username : `${seed.username}${cycle + 1}`,
        challenges: seed.challenges + cycle * 34 + (index % 3) * 6,
        winRate: Math.min(79, Math.max(52, seed.winRate + ((index % 5) - 2))),
        wins: seed.wins + cycle * 92 + index * 7,
        rekts: seed.rekts - cycle * 19 - (index % 4) * 4,
        avatarPath: `/profiles/${(index % 31) + 1}.svg`,
    };
});

const PAGE_SIZE_OPTIONS = [8, 12, 16];

function buildPagination(currentPage: number, totalPages: number): Array<number | string> {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

    if (currentPage <= 3) {
        pages.add(2);
        pages.add(3);
    }

    if (currentPage >= totalPages - 2) {
        pages.add(totalPages - 1);
        pages.add(totalPages - 2);
    }

    const sortedPages = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
    const output: Array<number | string> = [];

    sortedPages.forEach((page, idx) => {
        if (idx > 0 && page - sortedPages[idx - 1] > 1) {
            output.push(`ellipsis-${idx}`);
        }
        output.push(page);
    });

    return output;
}

function Badge({ text, tone }: { text: string; tone: BadgeTone }) {
    const toneMap = {
        violet: "border-violet-200 bg-violet-50 text-violet-700",
        green: "border-emerald-200 bg-emerald-50 text-emerald-700",
        yellow: "border-amber-200 bg-amber-50 text-amber-700",
        blue: "border-sky-200 bg-sky-50 text-sky-700",
        red: "border-rose-200 bg-rose-50 text-rose-700",
    };

    return (
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>
            {text}
        </span>
    );
}

export default function MastersPage() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All Categories");
    const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>("All Masters");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);
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

    const filteredInfluencers = useMemo(() => {
        return influencers.filter((influencer) => {
            const matchesSearch =
                influencer.name.toLowerCase().includes(search.toLowerCase()) ||
                influencer.username.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "All Categories" || influencer.category === categoryFilter;

            const matchesVerification =
                verificationFilter === "All Masters" ||
                (verificationFilter === "Verified" && influencer.verified) ||
                (verificationFilter === "Unverified" && !influencer.verified);

            return matchesSearch && matchesCategory && matchesVerification;
        });
    }, [search, categoryFilter, verificationFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredInfluencers.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const pagedInfluencers = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * itemsPerPage;
        return filteredInfluencers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredInfluencers, itemsPerPage, safeCurrentPage]);

    const pageButtons = useMemo(() => buildPagination(safeCurrentPage, totalPages), [safeCurrentPage, totalPages]);
    const currentStart = (safeCurrentPage - 1) * itemsPerPage + 1;
    const currentEnd = Math.min(safeCurrentPage * itemsPerPage, filteredInfluencers.length);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#f3e1d7" }}>
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Explore Masters</h1>
                        <p className="mt-1 text-base text-gray-500">Discover top challenge creators and their track record</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-700">
                        <Info className="h-4 w-4" />
                        How it works?
                    </button>
                </div>

                <div className="max-w-7xl pb-8">
                    <div className="flex flex-col items-stretch gap-3 sm:gap-4 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:max-w-md lg:flex-1">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search masters..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded-2xl bg-white/60 py-3 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:rounded-full sm:py-2.5"
                            />
                        </div>

                        <div className="grid w-full grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:w-auto">
                            <div className="relative w-full min-w-0" ref={categoryRef}>
                                <button
                                    onClick={() => setIsCategoryOpen((prev) => !prev)}
                                    className="w-full cursor-pointer justify-between rounded-2xl border border-gray-300 bg-white/60 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-white/80 sm:rounded-full sm:py-2.5 flex items-center gap-2"
                                >
                                    <span className="min-w-0 truncate flex items-center gap-2">
                                        <Shapes className="h-4 w-4" />
                                        {categoryFilter}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isCategoryOpen ? (
                                    <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-lg sm:min-w-[14rem] sm:w-auto">
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setCategoryFilter(option);
                                                    setCurrentPage(1);
                                                    setIsCategoryOpen(false);
                                                }}
                                                className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${categoryFilter === option ? "font-semibold text-black" : "text-gray-700 hover:bg-gray-50"}`}
                                            >
                                                <Shapes className="h-4 w-4" />
                                                <span>{option}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            <div className="relative w-full min-w-0" ref={verificationRef}>
                                <button
                                    onClick={() => setIsVerificationOpen((prev) => !prev)}
                                    className="w-full cursor-pointer justify-between rounded-2xl border border-gray-300 bg-white/60 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-white/80 sm:rounded-full sm:py-2.5 flex items-center gap-2"
                                >
                                    <span className="min-w-0 truncate flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        {verificationFilter}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isVerificationOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isVerificationOpen ? (
                                    <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-lg sm:min-w-[14rem] sm:w-auto">
                                        {VERIFICATION_OPTIONS.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setVerificationFilter(option);
                                                    setCurrentPage(1);
                                                    setIsVerificationOpen(false);
                                                }}
                                                className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${verificationFilter === option ? "font-semibold text-black" : "text-gray-700 hover:bg-gray-50"}`}
                                            >
                                                {option === "Verified" ? (
                                                    <ShieldCheck className="h-4 w-4" />
                                                ) : option === "Unverified" ? (
                                                    <ShieldOff className="h-4 w-4" />
                                                ) : (
                                                    <Shield className="h-4 w-4" />
                                                )}
                                                <span>{option}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {pagedInfluencers.map((influencer) => (
                        <article
                            key={influencer.id}
                            className="group mx-auto flex h-full w-full max-w-[400px] flex-col overflow-hidden rounded border border-gray-400 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gray-300/80 hover:shadow-xl md:max-w-[350px]"
                        >
                            <div className="relative h-[88px] overflow-hidden rounded-[8px] border border-[#d9d0ef]" style={{ background: influencer.banner }}>
                                <div className="absolute inset-0 opacity-75 [background-image:linear-gradient(rgba(164,140,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(164,140,255,0.25)_1px,transparent_1px)] [background-size:24px_24px]" />
                                <div className="absolute inset-0 opacity-65 [background-image:linear-gradient(0deg,transparent_0_58%,rgba(126,90,235,0.38)_58%_72%,transparent_72%_100%),linear-gradient(90deg,transparent_0_35%,rgba(126,90,235,0.4)_35%_48%,transparent_48%_100%)] [background-size:84px_84px] [background-position:0_0,14px_8px]" />
                            </div>

                            <div className="-mt-9 flex justify-center">
                                <div className="relative h-[80px] w-[80px] rounded-full border-4 border-white bg-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.18)]">
                                    <Image
                                        src={influencer.avatarPath}
                                        alt={`${influencer.name} avatar`}
                                        fill
                                        sizes="80px"
                                        className="rounded-full object-cover"
                                    />
                                    {influencer.verified ? (
                                        <span className="absolute -bottom-1 -right-1 z-10 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[#2f7bff] text-white shadow-[0_3px_8px_rgba(47,123,255,0.45)]">
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <h2 className="text-[21px] leading-tight font-black text-slate-900">{influencer.name}</h2>
                                <p className="mt-1 text-base font-semibold text-slate-500">{influencer.username}</p>
                            </div>


                            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-[14px] leading-none font-black text-slate-900">{influencer.challenges}</p>
                                    <p className="mt-1 text-[12px] font-semibold text-slate-500">Challenges</p>
                                </div>
                                <div>
                                    <p className="text-[14px] leading-none font-black text-slate-900">+{influencer.wins}</p>
                                    <p className="mt-1 text-[12px] font-semibold text-slate-500">Wins</p>
                                </div>
                                <div>
                                    <p className="text-[14px] leading-none font-black text-slate-900">{influencer.rekts}</p>
                                    <p className="mt-1 text-[12px] font-semibold text-slate-500">Rekts</p>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button className="flex-1 rounded-xl border border-[#e6e2f0] bg-white/80 px-3 py-3 text-sm font-bold text-[#5a4fff] transition hover:bg-[#f5f3ff]">
                                    View Profile
                                </button>
                                <button className="grid h-11 w-11 place-items-center rounded-xl border border-[#e6e2f0] bg-white/80 text-slate-500 transition hover:bg-slate-50">
                                    <UserPlus className="h-4 w-4" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                    <p className="hidden text-sm font-medium text-slate-500 md:block">
                        Showing {currentStart}-{currentEnd} of {filteredInfluencers.length}
                    </p>

                    <nav className="flex items-center justify-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                            disabled={safeCurrentPage === 1}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {pageButtons.map((item) =>
                            typeof item === "number" ? (
                                <button
                                    key={item}
                                    onClick={() => setCurrentPage(item)}
                                    className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-semibold transition ${safeCurrentPage === item
                                        ? "bg-indigo-600 text-white shadow-[0_8px_18px_rgba(79,70,229,0.35)]"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                        }`}
                                >
                                    {item}
                                </button>
                            ) : (
                                <span key={item} className="px-1 text-slate-400">
                                    ...
                                </span>
                            ),
                        )}

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                            disabled={safeCurrentPage === totalPages}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>

                    <div className="flex justify-center md:justify-end">
                        <label className="relative inline-flex items-center">
                            <span className="sr-only">Items per page</span>
                            <select
                                value={itemsPerPage}
                                onChange={(event) => {
                                    setItemsPerPage(Number(event.target.value));
                                    setCurrentPage(1);
                                }}
                                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-semibold text-slate-600 outline-none transition hover:border-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                            >
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <option key={size} value={size}>
                                        {size} per page
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
