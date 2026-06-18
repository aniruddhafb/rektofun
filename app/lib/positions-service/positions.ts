export interface Position {
  id: number;
  challenge_id: number;
  bet: number;
  side: 'TEAM_A' | 'TEAM_B' | string;
  creator: number;
  created_at: string;
}

export interface CreatePositionParams {
  challenge_id: number;
  bet: number;
  side: 'TEAM_A' | 'TEAM_B' | string;
  creator: number;
}

export interface GetAllPositionsResponse {
  positions: Position[];
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

export async function createPosition(params: CreatePositionParams): Promise<Position> {
  const response = await fetch(`${API_BASE_URL}/positions`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new ApiError(`Failed to create position: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function getPositionById(id: number): Promise<Position> {
  const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch position: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function getAllPositions(limit: number = 100, offset: number = 0): Promise<GetAllPositionsResponse> {
  const response = await fetch(`${API_BASE_URL}/positions?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch positions: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function getPositionsByChallenge(challengeId: number): Promise<Position[]> {
  const response = await fetch(`${API_BASE_URL}/positions?challenge_id=${challengeId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch positions by challenge: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function getPositionsByCreator(creatorId: number): Promise<Position[]> {
  const response = await fetch(`${API_BASE_URL}/positions?creator=${creatorId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch positions by creator: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function updatePosition(id: number, params: Partial<CreatePositionParams>): Promise<Position> {
  const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new ApiError(`Failed to update position: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function deletePosition(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new ApiError(`Failed to delete position: ${response.statusText}`, response.status);
  }
}