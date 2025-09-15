import { Grid } from '@mui/material';
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
  if (isLoading) {
    return <p>Loading repositories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (repositories.length === 0) {
    return (
      <p>
        {searchTerm
          ? 'No repositories found for search criteria'
          : 'Search for repositories using the form above'}
      </p>
    );
  }

  return (
    <div className='repositoryItems'>
      <Grid container spacing={2}>
        {repositories.map(repo => (
          <RepositoryCard key={repo.id} {...repo} />
        ))}
      </Grid>
    </div>
  );
}

export default RepositoryResults;
