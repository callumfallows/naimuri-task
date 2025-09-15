import { Grid } from '@mui/material';
import type { RepositoryType } from './interfaces';
import RepoCard from './RepositoryCard';

function RepositoryResults({
  repositories,
  isLoading,
  error,
  searchTerm,
}: {
  repositories: RepositoryType[];
  isLoading: boolean;
  error: string;
  searchTerm: string;
}) {
  return (
    <div className='repositoryItems'>
      {repositories.length > 0 ? (
        <Grid container spacing={2}>
          {repositories.map(
            ({
              forks_count,
              full_name,
              html_url,
              id,
              name,
              open_issues_count,
              owner,
              stargazers_count,
            }) => (
              <RepoCard
                forks_count={forks_count}
                full_name={full_name}
                html_url={html_url}
                key={id}
                name={name}
                open_issues_count={open_issues_count}
                owner={owner}
                stargazers_count={stargazers_count}
              />
            )
          )}
        </Grid>
      ) : isLoading ? (
        <p>Loading reposistories...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>
          {searchTerm
            ? 'No repos found for search criteria'
            : 'Search for repositories using the form above'}
        </p>
      )}
    </div>
  );
}

export default RepositoryResults;
