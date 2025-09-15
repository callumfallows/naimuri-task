import { useCallback, useEffect, useState } from 'react';

export const useGetReadme = (repoName: string) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readme, setReadme] = useState('');

  const fetchReadme = useCallback(async () => {
    if (!repoName) {
      setError('Repository name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoName}/readme`
      );

      if (!response.ok) {
        throw new Error('Unable to fetch README metadata');
      }

      const data = await response.json();

      if (!data?.download_url) {
        throw new Error('README download URL not found');
      }

      const readmeResponse = await fetch(data.download_url);

      if (!readmeResponse.ok) {
        throw new Error('Unable to download README content');
      }

      const readmeContent = await readmeResponse.text();
      setReadme(readmeContent);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch README';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [repoName]);

  useEffect(() => {
    fetchReadme();
  }, [fetchReadme]);

  return { error, isLoading, readme, refetch: fetchReadme };
};
