import type { LeaderboardUser } from "@/app/lib/users-service/users";
import type { Master, MasterCategory } from "./types";

const BANNERS = [
    "linear-gradient(120deg, #211548 0%, #3d2e7a 45%, #20163e 100%)",
    "linear-gradient(120deg, #121f2f 0%, #214062 50%, #132439 100%)",
    "linear-gradient(120deg, #1f1f1f 0%, #3a3a3a 50%, #212121 100%)",
    "linear-gradient(120deg, #0b0f18 0%, #1f2a43 52%, #111827 100%)",
    "linear-gradient(120deg, #052d15 0%, #0f5f2e 52%, #081f16 100%)",
    "linear-gradient(120deg, #2f0207 0%, #6b0914 52%, #1f0c12 100%)",
];

function getCategoryFromWallet(walletAddress: string): MasterCategory {
    const score = walletAddress
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const categories: MasterCategory[] = ["Crypto", "Sports", "Stocks", "Others"];
    return categories[score % categories.length];
}

export function mapUserToMaster(user: LeaderboardUser, index: number): Master {
    const challenges = user.referrals?.length ?? 0;
    const wins = challenges * 100;
    const rekts = Math.max(0, Math.floor(challenges * 0.2));

    return {
        id: user.id,
        name: user.username || `user-${user.wallet_address.slice(0, 6)}`,
        username: `@${(user.username || `user-${user.wallet_address.slice(0, 6)}`).toLowerCase()}`,
        walletAddress: user.wallet_address,
        category: getCategoryFromWallet(user.wallet_address),
        verified: Boolean(user.username),
        challenges,
        wins,
        rekts,
        followers: user.followers ?? [],
        avatarPath: user.profile_image || "/scribbles/pepe.png",
        banner: BANNERS[index % BANNERS.length],
    };
}

export function buildPagination(currentPage: number, totalPages: number): Array<number | string> {
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
