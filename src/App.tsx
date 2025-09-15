import {
  Box,
  Button,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useState } from 'react';
import './App.scss';
import RepositoryResults from './RepositoryResults';
import { useRepositorySearch } from './useRepositorySearch';

/**
 * Repository Search Application
 *
 * A responsive React component that provides a user interface for searching and filtering
 * GitHub repositories with date range, sorting, and pagination capabilities.
 * Automatically adjusts layout for mobile and tablet devices.
 */

// Utility functions
const dateFormatter = (date: Date) => date.toISOString().split('T')[0];

const getDefaultDateRange = () => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  return {
    from: dateFormatter(lastMonth),
    to: dateFormatter(today),
  };
};

// Constants
export const LIMIT = 30; // GitHub API default per_page limit

function App() {
  // Theme and breakpoint detection
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.down('md')); // < 900px

  // State management
  const defaultDates = getDefaultDateRange();
  const [searchTerm, setSearchTerm] = useState('');
  const [createdFrom, setCreatedFrom] = useState(defaultDates.from);
  const [createdTo, setCreatedTo] = useState(defaultDates.to);
  const [sortBy, setSortBy] = useState('updated');
  const [orderBy, setOrderBy] = useState('desc');
  const [page, setPage] = useState(1);

  // Event handlers
  const handleLoadMore = () => setPage(curr => curr + 1);
  const handlePrevious = () => setPage(curr => Math.max(1, curr - 1));
  const handleNext = () => setPage(curr => curr + 1);

  // Fetch repository data
  const { repositories, repositoryCount, isLoading, error } =
    useRepositorySearch({
      searchTerm,
      createdFrom,
      createdTo,
      sortBy,
      orderBy,
      page,
    });

  // Pagination calculations
  const totalPages = Math.ceil(Math.min(repositoryCount / LIMIT, 1000 / LIMIT));
  const hasMorePages = page < totalPages;
  const canGoBack = page > 1;

  return (
    <Stack className='app' spacing={2}>
      {/* Search Container */}
      <Box className='searchContainer'>
        <Stack
          spacing={2}
          padding={2}
          direction={isTablet ? 'column' : 'row'}
          alignItems={isTablet ? 'stretch' : 'center'}
          className='searchWrapper'
        >
          {/* Search Bar */}
          <Box
            className='searchBar'
            sx={{ minWidth: isMobile ? '100%' : '300px' }}
          >
            {' '}
            <InputLabel htmlFor='search' sx={{ fontSize: '0.875rem', mb: 0.5 }}>
              Search:
            </InputLabel>
            <Input
              fullWidth
              type='text'
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search for repository'
              name='search'
              id='search'
              value={searchTerm}
            />
          </Box>

          {/* Date Options */}
          <Stack
            className='dateOptions'
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 2}
            sx={{ minWidth: isMobile ? '100%' : 'auto' }}
          >
            <Stack sx={{ minWidth: isMobile ? '100%' : '150px' }}>
              <InputLabel
                htmlFor='dateFrom'
                sx={{ fontSize: '0.875rem', mb: 0.5 }}
              >
                From:
              </InputLabel>
              <Input
                value={createdFrom}
                onChange={e => setCreatedFrom(e.target.value)}
                type='date'
                name='dateFrom'
                id='dateFrom'
                fullWidth
              />
            </Stack>
            <Stack sx={{ minWidth: isMobile ? '100%' : '150px' }}>
              <InputLabel
                htmlFor='dateTo'
                sx={{ fontSize: '0.875rem', mb: 0.5 }}
              >
                To:
              </InputLabel>
              <Input
                value={createdTo}
                onChange={e => setCreatedTo(e.target.value)}
                type='date'
                name='dateTo'
                id='dateTo'
                fullWidth
              />
            </Stack>
          </Stack>

          {/* Sort and Order Options */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 2}
            sx={{ minWidth: isMobile ? '100%' : 'auto' }}
          >
            {/* Sort By */}
            <Stack
              className='sortOptions'
              sx={{ minWidth: isMobile ? '100%' : '150px' }}
            >
              <InputLabel id='sortBy' sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                Sort By
              </InputLabel>
              <Select
                name='sortBy'
                id='sortBy'
                fullWidth
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                size={isMobile ? 'small' : 'medium'}
              >
                <MenuItem value='updated'>Updated</MenuItem>
                <MenuItem value='stars'>Stars</MenuItem>
                <MenuItem value='forks'>Forks</MenuItem>
                <MenuItem value='help-wanted-issues'>Issues</MenuItem>
              </Select>
            </Stack>

            {/* Order By */}
            <Stack
              className='orderOptions'
              sx={{ minWidth: isMobile ? '100%' : '150px' }}
            >
              <InputLabel id='orderBy' sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                Order By
              </InputLabel>
              <Select
                name='orderBy'
                id='orderBy'
                fullWidth
                value={orderBy}
                onChange={e => setOrderBy(e.target.value)}
                labelId='orderBy'
                size={isMobile ? 'small' : 'medium'}
              >
                <MenuItem value='desc'>Descending</MenuItem>
                <MenuItem value='asc'>Ascending</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Results Section */}
      <Box className='resultsContainer'>
        <RepositoryResults
          repositories={repositories}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
        />

        {/* Load More Button (Mobile/Tablet preferred pattern) */}
        {hasMorePages && isTablet && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant='contained'
              color='primary'
              disabled={isLoading}
              onClick={handleLoadMore}
              size={isMobile ? 'large' : 'medium'}
              fullWidth={isMobile}
              sx={{ minWidth: isMobile ? '100%' : '200px' }}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Pagination Controls (Desktop preferred pattern) */}
      {!isTablet && (
        <Box className='paginationContainer' sx={{ mt: 3 }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid size={4}>
              <Button
                onClick={handlePrevious}
                disabled={!canGoBack || isLoading}
                variant='contained'
                color='primary'
                fullWidth
              >
                Previous
              </Button>
            </Grid>
            <Grid size={4}>
              <Box sx={{ textAlign: 'center', fontWeight: 'medium' }}>
                Page {page}
              </Box>
            </Grid>
            <Grid size={4}>
              <Button
                onClick={handleNext}
                disabled={!hasMorePages || isLoading}
                variant='contained'
                color='primary'
                fullWidth
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Mobile/Tablet Pagination Info */}
      {isTablet && (
        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            Page {page} of {totalPages || 1}
            {repositoryCount > 0 && (
              <> • {repositoryCount.toLocaleString()} total results</>
            )}
          </Box>
        </Box>
      )}
    </Stack>
  );
}

export default App;
