import { useCallback, useEffect, useState } from 'react';
import { LIMIT } from './App';
import type { RepositoryType, UseReposParams } from './interfaces';

/**
 * Custom hook for fetching and managing GitHub repository data
 *
 * Features:
 * - Debounced search to prevent excessive API calls
 * - Pagination support with data accumulation
 * - Error handling and loading states
 * - Automatic search reset when parameters change
 */

interface UseReposReturn {
  repositories: RepositoryType[];
  repositoryCount: number;
  isLoading: boolean;
  error: string;
}

// Constants
const SEARCH_DEBOUNCE_DELAY = 500;

export const useRepositorySearch = ({
  searchTerm,
  createdFrom,
  createdTo,
  sortBy,
  orderBy,
  page,
}: UseReposParams): UseReposReturn => {
  const [repositories, setRepositories] = useState<RepositoryType[]>([]);
  const [repositoryCount, setRepositoryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetRepositoryData = useCallback(() => {
    setRepositories([]);
    setRepositoryCount(0);
    setError('');
  }, []);

  const buildSearchUrl = useCallback(
    (searchTerm: string): string => {
      const baseUrl = 'https://api.github.com/search/repositories';
      const query = `${searchTerm}+created:${createdFrom}..${createdTo}`;

      return `${baseUrl}?q=${query}&sort=${sortBy}&order=${orderBy}&per_page=${LIMIT}&page=${page}`;
    },
    [createdFrom, createdTo, sortBy, orderBy, page]
  );

  const fetchRepositories = useCallback(async () => {
    const trimmedSearchTerm = searchTerm.trim();

    // Handle empty search term
    if (!trimmedSearchTerm) {
      resetRepositoryData();
      setIsLoading(false);
      return;
    }

    setError('');

    try {
      const url = buildSearchUrl(trimmedSearchTerm);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { items, total_count } = await response.json();

      // Update repositories based on pagination
      if (items) {
        setRepositories(currentRepos => {
          return page === 1 ? items : [...currentRepos, ...items];
        });
        setRepositoryCount(total_count || 0);
      } else {
        resetRepositoryData();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? `Failed to fetch repositories: ${err.message}`
          : 'Failed to fetch repositories';

      setError(errorMessage);
      resetRepositoryData();
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, buildSearchUrl, resetRepositoryData]);

  // Effect: Handle page changes (load more results)
  useEffect(() => {
    // Only fetch on page change if we have a search term and we're not on page 1
    if (searchTerm.trim() && page > 1) {
      setIsLoading(true);
      fetchRepositories();
    }
  }, [page]);

  // Effect for handling search term changes (with debouncing)
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsLoading(true);
      resetRepositoryData();

      // Debounce the search to avoid excessive API calls
      const debounceTimer = setTimeout(
        fetchRepositories,
        SEARCH_DEBOUNCE_DELAY
      );

      return () => clearTimeout(debounceTimer);
    } else {
      // Clear data when search term is empty
      resetRepositoryData();
      setIsLoading(false);
    }
  }, [
    searchTerm,
    createdFrom,
    createdTo,
    sortBy,
    orderBy,
    fetchRepositories,
    resetRepositoryData,
  ]);

  useEffect(() => {
    // Only fetch if we have a search term and we're not on the first page
    // (first page is handled by the search term effect)
    if (searchTerm.trim() && page > 1) {
      setIsLoading(true);
      fetchRepositories();
    }
  }, [page, searchTerm, fetchRepositories]);

  return {
    repositories,
    repositoryCount,
    isLoading,
    error,
  };
};
