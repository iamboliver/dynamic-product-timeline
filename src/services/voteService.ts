/**
 * Vote Service
 *
 * Handles fetching and submitting votes for features.
 * Currently uses localStorage as a mock backend.
 *
 * To connect to a real backend:
 * 1. Set VOTES_API_URL to your GET endpoint that returns VotesMap
 * 2. Set VOTE_SUBMIT_URL to your POST endpoint
 * 3. POST body format: { featureId: string, voteType: 'like' | 'dislike' }
 * 4. POST response format: { likes: number, dislikes: number }
 */

import type { VoteType, VoteData, VotesMap } from '../types';

// ============================================================
// CONFIGURATION - Set these URLs when backend is ready
// ============================================================
const VOTES_API_URL = ''; // e.g., 'https://api.example.com/votes'
const VOTE_SUBMIT_URL = ''; // e.g., 'https://api.example.com/vote'

// localStorage keys
const VOTES_STORAGE_KEY = 'feature-timeline-votes';
const USER_VOTES_STORAGE_KEY = 'feature-timeline-user-votes';

/**
 * Check if we're using the real API or localStorage mock
 */
function isUsingRealApi(): boolean {
  return Boolean(VOTES_API_URL && VOTE_SUBMIT_URL);
}

/**
 * Fetch all votes from the backend or localStorage
 */
export async function fetchVotes(): Promise<VotesMap> {
  if (isUsingRealApi()) {
    const response = await fetch(VOTES_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch votes: ${response.statusText}`);
    }
    return response.json();
  }

  // Mock implementation using localStorage
  const stored = localStorage.getItem(VOTES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

/**
 * Submit a vote to the backend or localStorage
 */
export async function submitVote(
  featureId: string,
  voteType: VoteType,
  previousVote?: VoteType
): Promise<VoteData> {
  if (isUsingRealApi()) {
    const response = await fetch(VOTE_SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ featureId, voteType, previousVote }),
    });
    if (!response.ok) {
      throw new Error(`Failed to submit vote: ${response.statusText}`);
    }
    return response.json();
  }

  // Mock implementation using localStorage
  const votes = await fetchVotes();

  if (!votes[featureId]) {
    votes[featureId] = { likes: 0, dislikes: 0 };
  }

  // If user is changing their vote, decrement the old vote
  if (previousVote) {
    const prevKey = previousVote === 'like' ? 'likes' : 'dislikes';
    votes[featureId][prevKey] = Math.max(0, votes[featureId][prevKey] - 1);
  }

  // Increment the new vote
  const key = voteType === 'like' ? 'likes' : 'dislikes';
  votes[featureId][key]++;

  localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));

  return votes[featureId];
}

/**
 * Get user's votes from localStorage
 * (Always stored locally, even with real API)
 */
export function getUserVotes(): Record<string, VoteType> {
  const stored = localStorage.getItem(USER_VOTES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

/**
 * Save user's vote to localStorage
 */
export function saveUserVote(featureId: string, voteType: VoteType): void {
  const userVotes = getUserVotes();
  userVotes[featureId] = voteType;
  localStorage.setItem(USER_VOTES_STORAGE_KEY, JSON.stringify(userVotes));
}
