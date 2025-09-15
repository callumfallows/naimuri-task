import { Box, Grid, Typography } from '@mui/material';
import type { RepositoryType } from './interfaces';
import RepositoryCard from './RepositoryCard';

type RepositoryResultsProps = {
  repositories: RepositoryType[];
  isLoading: boolean;
  error: string;
  searchTerm: string;
};

function RepositoryResults({
  repositories,
  isLoading,
  error,
  searchTerm,
}: RepositoryResultsProps) {
  // Live region for screen readers to announce status
  if (isLoading) {
    return (
      <Typography role='status' aria-live='polite'>
        Loading repositories…
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography role='alert' color='error'>
        {error}
      </Typography>
    );
  }

  if (repositories.length === 0) {
    return (
      <Typography role='status' aria-live='polite'>
        {searchTerm
          ? `No repositories found for "${searchTerm}".`
          : 'Search for repositories using the form above.'}
      </Typography>
    );
  }

  return (
    // Use role="list" for a list of repositories
    <Box
      className='repositoryItems'
      role='list'
      aria-label='Repository search results'
    >
      <Grid container spacing={2}>
        {repositories.map(repo => (
          // Each repository card is a list item
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={repo.id} role='listitem'>
            <RepositoryCard {...repo} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RepositoryResults;
