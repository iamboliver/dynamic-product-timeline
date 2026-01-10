import { useState, useEffect, useCallback } from 'react';
import type { VoteType, VotesMap, UserVotesMap } from '../types';
import {
  fetchVotes,
  submitVote,
  getUserVotes,
  saveUserVote,
} from '../services/voteService';

interface UseVotesReturn {
  /** All vote counts by feature ID */
  votes: VotesMap;
  /** User's votes by feature ID */
  userVotes: UserVotesMap;
  /** Submit a vote for a feature */
  vote: (featureId: string, voteType: VoteType) => Promise<void>;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
}

/**
 * Hook to manage feature votes
 *
 * Handles:
 * - Loading votes on mount
 * - Tracking user's votes in localStorage
 * - Optimistic UI updates
 * - Preventing duplicate votes (same direction)
 * - Allowing vote changes (switching from like to dislike)
 */
export function useVotes(): UseVotesReturn {
  const [votes, setVotes] = useState<VotesMap>({});
  const [userVotes, setUserVotes] = useState<UserVotesMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load votes on mount
  useEffect(() => {
    async function loadVotes() {
      try {
        setIsLoading(true);
        const [votesData, userVotesData] = await Promise.all([
          fetchVotes(),
          Promise.resolve(getUserVotes()),
        ]);
        setVotes(votesData);
        setUserVotes(userVotesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load votes');
      } finally {
        setIsLoading(false);
      }
    }

    loadVotes();
  }, []);

  const vote = useCallback(
    async (featureId: string, voteType: VoteType) => {
      const previousVote = userVotes[featureId];

      // Don't allow voting the same way twice
      if (previousVote === voteType) {
        return;
      }

      // Optimistic update
      const previousVotes = { ...votes };
      const previousUserVotes = { ...userVotes };

      setVotes((prev) => {
        const current = prev[featureId] || { likes: 0, dislikes: 0 };
        const updated = { ...current };

        // Remove previous vote if changing
        if (previousVote) {
          const prevKey = previousVote === 'like' ? 'likes' : 'dislikes';
          updated[prevKey] = Math.max(0, updated[prevKey] - 1);
        }

        // Add new vote
        const key = voteType === 'like' ? 'likes' : 'dislikes';
        updated[key]++;

        return { ...prev, [featureId]: updated };
      });

      setUserVotes((prev) => ({ ...prev, [featureId]: voteType }));

      try {
        // Submit to backend
        const updatedVoteData = await submitVote(featureId, voteType, previousVote);

        // Update with server response
        setVotes((prev) => ({ ...prev, [featureId]: updatedVoteData }));

        // Save user vote locally
        saveUserVote(featureId, voteType);
      } catch (err) {
        // Rollback on error
        setVotes(previousVotes);
        setUserVotes(previousUserVotes);
        setError(err instanceof Error ? err.message : 'Failed to submit vote');
      }
    },
    [votes, userVotes]
  );

  return {
    votes,
    userVotes,
    vote,
    isLoading,
    error,
  };
}
