import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useState } from 'react';
import './App.scss';
import RepositoryResults from './RepositoryResults';
import { useRepositorySearch } from './useRepositorySearch';

const dateFormatter = (date: Date) => date.toISOString().split('T')[0];

const getDefaultDateRange = () => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);
  return { from: dateFormatter(lastMonth), to: dateFormatter(today) };
};

export const LIMIT = 30;

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const defaultDates = getDefaultDateRange();
  const [searchTerm, setSearchTerm] = useState('');
  const [createdFrom, setCreatedFrom] = useState(defaultDates.from);
  const [createdTo, setCreatedTo] = useState(defaultDates.to);
  const [sortBy, setSortBy] = useState('updated');
  const [orderBy, setOrderBy] = useState('desc');
  const [page, setPage] = useState(1);

  const handleLoadMore = () => setPage(curr => curr + 1);
  const handlePrevious = () => setPage(curr => Math.max(1, curr - 1));
  const handleNext = () => setPage(curr => curr + 1);

  const { repositories, repositoryCount, isLoading, error } =
    useRepositorySearch({
      searchTerm,
      createdFrom,
      createdTo,
      sortBy,
      orderBy,
      page,
    });

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
          {/* Search Field */}
          <TextField
            id='search'
            label='Search'
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search for repository'
            fullWidth
            sx={{ minWidth: isMobile ? '100%' : '300px' }}
          />

          {/* Date Range */}
          <Stack
            className='dateOptions'
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 2}
            sx={{ minWidth: isMobile ? '100%' : 'auto' }}
          >
            <TextField
              id='dateFrom'
              label='From'
              type='date'
              value={createdFrom}
              onChange={e => setCreatedFrom(e.target.value)}
              fullWidth
            />
            <TextField
              id='dateTo'
              label='To'
              type='date'
              value={createdTo}
              onChange={e => setCreatedTo(e.target.value)}
              fullWidth
            />
          </Stack>

          {/* Sort and Order */}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 2}
            sx={{ minWidth: isMobile ? '100%' : 'auto' }}
          >
            {/* Sort By */}
            <Stack className='sortOptions' sx={{ minWidth: '150px' }}>
              <FormControl fullWidth>
                <InputLabel>
                  Sort By
                  <Select
                    id='sortBy'
                    name='sortBy'
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
                </InputLabel>
              </FormControl>
            </Stack>

            {/* Order By */}
            <Stack className='orderOptions' sx={{ minWidth: '150px' }}>
              <FormControl fullWidth>
                <InputLabel>
                  Order By
                  <Select
                    id='orderBy'
                    name='orderBy'
                    fullWidth
                    value={orderBy}
                    onChange={e => setOrderBy(e.target.value)}
                    size={isMobile ? 'small' : 'medium'}
                  >
                    <MenuItem value='desc'>Descending</MenuItem>
                    <MenuItem value='asc'>Ascending</MenuItem>
                  </Select>
                </InputLabel>
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Box className='introduction'>
        <Typography
          variant='h1'
          component='h1'
          fontSize={{ xs: '1.5rem', sm: '2rem', md: '2.5rem' }}
          sx={{ color: '#111', lineHeight: 1.2 }} // ensure good contrast
        >
          GitHub Repository Search
        </Typography>
      </Box>

      {/* Results Section */}
      <Box
        className='resultsContainer'
        role='region'
        aria-live='polite'
        aria-label='Repository search results'
      >
        <RepositoryResults
          repositories={repositories}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
        />

        {/* Load More (Mobile/Tablet) */}
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
              aria-label='Load more results'
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Pagination (Desktop) */}
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
                aria-label='Go to previous page'
              >
                Previous
              </Button>
            </Grid>
            <Grid size={4}>
              <Box
                sx={{ textAlign: 'center', fontWeight: 'medium' }}
                role='status'
                aria-live='polite'
              >
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
                aria-label='Go to next page'
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Pagination Info (Mobile/Tablet) */}
      {isTablet && (
        <Box
          sx={{ textAlign: 'center', py: 1 }}
          role='status'
          aria-live='polite'
        >
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
