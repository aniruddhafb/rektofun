export type MasterCategory = "Crypto" | "Sports" | "Stocks" | "Others";

export type Master = {
    id: string;
    name: string;
    username: string;
    walletAddress: string;
    category: MasterCategory;
    verified: boolean;
    challenges: number;
    wins: number;
    rekts: number;
    followers: string[];
    avatarPath: string;
    banner: string;
};

export const CATEGORY_OPTIONS = ["All Categories", "Crypto", "Sports", "Stocks", "Others"] as const;
export type CategoryFilter = (typeof CATEGORY_OPTIONS)[number];

export const VERIFICATION_OPTIONS = ["All Masters", "Verified", "Unverified"] as const;
export type VerificationFilter = (typeof VERIFICATION_OPTIONS)[number];

export const PAGE_SIZE_OPTIONS = [8, 12, 16];
