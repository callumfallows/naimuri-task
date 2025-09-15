import { useCallback, useEffect, useState } from 'react';

/**
 * Custom React hook for fetching the README file content
 * from a GitHub repository.
 *
 * @param repoName - Repository in "owner/repo" format (e.g. "facebook/react")
 */
export const useGetReadme = (repoName: string) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readme, setReadme] = useState('');

  /**
   * Fetches the README from GitHub’s API.
   * Wrapped in useCallback so it can be reused and doesn’t re-create unnecessarily.
   */
  const fetchReadme = useCallback(async () => {
    if (!repoName) {
      setError('Repository name is required');
      return;
    }

    // Reset loading and error state before starting
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch README metadata from GitHub’s API
      const metadataResponse = await fetch(
        `https://api.github.com/repos/${repoName}/readme`
      );

      if (!metadataResponse.ok) {
        throw new Error('Unable to fetch README metadata');
      }

      const metadata = await metadataResponse.json();

      // Ensure the download URL exists
      if (!metadata?.download_url) {
        throw new Error('README download URL not found');
      }

      // 2. Fetch the actual README content using the download_url
      const contentResponse = await fetch(metadata.download_url);

      if (!contentResponse.ok) {
        throw new Error('Unable to download README content');
      }

      // Convert response to plain text and update state
      const content = await contentResponse.text();
      setReadme(content);
    } catch (err: unknown) {
      // Handle errors gracefully
      const message =
        err instanceof Error ? err.message : 'Failed to fetch README';
      setError(message);
    } finally {
      // Stop loading whether success or error
      setIsLoading(false);
    }
  }, [repoName]);

  // Fetch README on mount or when repoName changes
  useEffect(() => {
    fetchReadme();
  }, [fetchReadme]);

  // Expose state + manual refetch function
  return { error, isLoading, readme, refetch: fetchReadme };
};
