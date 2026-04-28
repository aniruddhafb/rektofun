export interface Challenge {
  id: string;
  status: 'open' | 'accepted' | 'closed';
  asset: string;
  creator_wallet: string;
  challenge_type: string;
  amount: string;
  expires_at: number;
  created_at: number;
  description?: string;
}

export interface ChallengesResponse {
  challenges: Challenge[];
  total: number;
}

export interface GetChallengesParams {
  status?: 'open' | 'accepted' | 'closed';
  asset?: string;
  creator_wallet?: string;
  limit?: number;
  offset?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getChallengeById(id: string): Promise<Challenge> {
  const response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch challenge: ${response.statusText}`);
  }

  return response.json();
}

export async function getChallenges(params: GetChallengesParams = {}): Promise<ChallengesResponse> {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.asset) {
    searchParams.set('asset', params.asset);
  }
  if (params.creator_wallet) {
    searchParams.set('creator_wallet', params.creator_wallet);
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }
  if (params.offset !== undefined) {
    searchParams.set('offset', String(params.offset));
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/challenges${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch challenges: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateChallengeParams {
  tx_signature: string;
  challenge_pda: string;
  challenge_id: number;
  creator_wallet: string;
  market: string;
  asset: string;
  bet_amount_sol: number;
  target_price_usd_cents: number;
  direction_above: boolean;
  expires_at: number;
  resolves_at: number;
}

export async function createChallenge(params: CreateChallengeParams): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/challenges`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to create challenge: ${response.statusText}`);
  }

  return response.json();
}