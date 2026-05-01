/**
 * Clans Service
 * API calls for clan creation and management
 */

import { Clan as FrontendClan } from "@/app/components/clan-components/ClanTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface Clan {
    id: string;
    clan_name: string;
    clan_description: string | null;
    clan_image: string | null;
    max_members: number;
    clan_leader: string;
    clan_members: string[];
    clan_status: "public" | "invite_only";
    clan_region: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface CreateClanParams {
    clan_name: string;
    clan_description?: string;
    clan_image?: string;
    max_members: number;
    clan_status: "public" | "invite_only";
    clan_region?: string;
    clan_leader: string;
}

export async function createClan(params: CreateClanParams): Promise<Clan> {
    const response = await fetch(`${API_BASE_URL}/clans`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to create clan: ${errorData.detail || response.statusText}`);
    }

    return response.json();
}

export async function getClanById(clanId: string): Promise<Clan> {
    const response = await fetch(`${API_BASE_URL}/clans/${encodeURIComponent(clanId)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch clan: ${response.statusText}`);
    }

    return response.json();
}

export interface PaginatedClansResponse {
    clans: FrontendClan[];
    total: number;
    limit: number;
    offset: number;
}

/**
 * Transform backend clan response to frontend Clan type
 */
function transformClanResponse(clan: Clan, index: number): FrontendClan {
    // Map backend fields to frontend Clan type
    return {
        id: clan.id,
        rank: index + 1,
        name: clan.clan_name,
        description: clan.clan_description || "",
        leader: clan.clan_leader,
        leaderAvatar: "/scribbles/btc.png", // Default avatar
        logo: clan.clan_image || "/scribbles/coins.png", // Default logo
        type: clan.clan_status === "public" ? "Public" : "Invite Only",
        members: clan.clan_members?.length || 0,
        maxMembers: clan.max_members,
        totalWins: 0, // These would need to be calculated from challenge data
        totalRekts: 0,
        winRate: 0,
        rektPoints: "0",
        verified: false,
        chain: clan.clan_region || "Solana",
    };
}

export async function getClans(limit: number = 10, offset: number = 0): Promise<PaginatedClansResponse> {
    const response = await fetch(`${API_BASE_URL}/clans?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch clans: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform backend clans to frontend format
    const transformedClans = data.clans.map((clan: Clan, index: number) =>
        transformClanResponse(clan, offset + index)
    );

    return {
        clans: transformedClans,
        total: data.total,
        limit,
        offset,
    };
}

/**
 * Get user ID by wallet address
 */
export async function getUserIdByWallet(walletAddress: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/users/wallet/${encodeURIComponent(walletAddress)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const user = await response.json();
    return user.id;
}
