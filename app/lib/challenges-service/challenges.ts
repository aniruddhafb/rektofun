export interface ChallengeMetadata {
  [key: string]: Record<string, unknown>;
}

export interface Challenge {
  id: number;
  statement: string;
  ticker: string;
  trading_pair: string;
  target: number;
  initial_bet: number;
  pool_size: number;
  resolution_source: string;
  metadata: ChallengeMetadata;
  creator: number;
  resolution_method: 'PRICE_FEED' | string;
  participants: number;
  status: 'OPEN' | 'CLOSED' | 'RESOLVED' | string;
  mode: 'PVP' | string;
  result: 'TEAM_A' | 'TEAM_B' | 'DRAW' | string;
  direction: 'UP' | 'DOWN' | string;
  expiry: string;
  resolution_date: string;
  final_price: number | null;
  created_at: string;
}

export interface CreateChallengeParams {
  statement: string;
  ticker: string;
  trading_pair: string;
  target: number;
  initial_bet: number;
  pool_size: number;
  resolution_source: string;
  metadata?: ChallengeMetadata;
  creator: number;
  resolution_method: 'PRICE_FEED' | string;
  participants?: number;
  status?: 'OPEN' | 'CLOSED' | 'RESOLVED' | string;
  mode: 'PVP' | string;
  result?: 'TEAM_A' | 'TEAM_B' | 'DRAW' | string;
  direction: 'UP' | 'DOWN' | string;
  expiry: string;
  resolution_date: string;
  final_price?: number;
}

export interface GetAllChallengesResponse {
  challenges: Challenge[];
  total: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function createChallenge(params: CreateChallengeParams): Promise<Challenge> {
  const response = await fetch(`${API_BASE_URL}/challenges`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new ApiError(`Failed to create challenge: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function getChallengeById(id: number): Promise<Challenge> {
  const response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch challenge: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function getAllChallenges(limit: number = 100, offset: number = 0): Promise<GetAllChallengesResponse> {
  const response = await fetch(`${API_BASE_URL}/challenges?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch challenges: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function updateChallenge(id: number, params: Partial<CreateChallengeParams>): Promise<Challenge> {
  const response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new ApiError(`Failed to update challenge: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function deleteChallenge(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError(`Failed to delete challenge: ${response.statusText}`, response.status);
  }
}