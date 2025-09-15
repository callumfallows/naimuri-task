import { Button, Card, Input, MenuItem, Select } from '@mui/material';

import { useState } from 'react';
import './App.scss';

/**
 *
 * @returns Create an application
 * Create an app that can retreive reoisutiry data
 */

const dateFormatter = (date: Date) => date.toISOString().split('T')[0];
/* accessing a date range */
const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

function App() {
  const [orderBy, setOrderBy] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [createdFrom, setCreatedFrom] = useState(dateFormatter(lastMonth));
  const [createdTo, setCreatedTo] = useState(dateFormatter(today));
  const [sortBy, setSortBy] = useState('updated');
  const [page, setPage] = useState(1);

  return (
    <>
      <div className='app'>
        <div className='searchBar'>
          <Input
            fullWidth
            type='text'
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search for repository'
            id='search'
            value={searchTerm}
          />
        </div>
        <div className='dateOptions'>
          <Input
            value={createdFrom}
            onChange={e => setCreatedFrom(e.target.value)}
            type='date'
            name='dateFrom'
          />
          <Input
            value={createdTo}
            onChange={e => setCreatedTo(e.target.value)}
            type='date'
            name='dateTo'
          />
        </div>
        <div className='sortOptions'>
          <Select
            name='sortBy'
            fullWidth
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <MenuItem value='updated'>Updated</MenuItem>
            <MenuItem value='stars'>Stars</MenuItem>
            <MenuItem value='help-wanted-issues'>Help Wanted Issues</MenuItem>
            <MenuItem value='forks'>Forks</MenuItem>
          </Select>
        </div>
        <div className='sortOptions'>
          <Select
            name='orderBy'
            fullWidth
            value={orderBy}
            onChange={e => setOrderBy(e.target.value)}
          >
            <MenuItem value='desc'>Descending</MenuItem>
            <MenuItem value='asc'>Ascending</MenuItem>
          </Select>
        </div>

        <>
          <Card>Content will be here soon</Card>
        </>

        <div className='pagination'>
          <div className='paginationButtons'>
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              variant='contained'
              color='primary'
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === 1}
              variant='contained'
              color='primary'
            >
              Next
            </Button>
          </div>

          <div className='pageNumber'>Page {page}</div>
        </div>
      </div>
    </>
  );
}

export default App;
