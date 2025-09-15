import {
  ForkRight as ForkIcon,
  GitHub as GitHubIcon,
  BugReport as IssueIcon,
  ThumbUp as LikeIcon,
  OpenInNew as OpenInNewIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import type { RepositoryType } from './interfaces';
import { useGetReadme } from './useGetReadme';

// Extracted constants for better maintainability
const STAT_CONFIGS = {
  stars: {
    icon: StarIcon,
    color: '#ffc107',
    bgColor: 'rgba(255, 193, 7, 0.1)',
    borderColor: 'rgba(255, 193, 7, 0.2)',
  },
  forks: {
    icon: ForkIcon,
    color: '#1976d2',
    bgColor: 'rgba(25, 118, 210, 0.1)',
    borderColor: 'rgba(25, 118, 210, 0.2)',
  },
  issues: {
    icon: IssueIcon,
    color: '#d32f2f',
    bgColor: 'rgba(211, 47, 47, 0.1)',
    borderColor: 'rgba(211, 47, 47, 0.2)',
  },
  likes: {
    icon: LikeIcon,
    color: '#31d151',
    bgColor: 'rgba(111, 209, 42, 0.1)',
    borderColor: 'rgba(111, 209, 42, 0.2)',
  },
};

const StatBox = ({
  type,
  count,
  label,
}: {
  type: keyof typeof STAT_CONFIGS;
  count: number;
  label: string;
}) => {
  const config = STAT_CONFIGS[type];
  const IconComponent = config.icon;

  return (
    <Box
      display='flex'
      alignItems='center'
      gap={0.5}
      sx={{
        p: 1,
        backgroundColor: config.bgColor,
        borderRadius: 1,
        border: `1px solid ${config.borderColor}`,
        minWidth: 0, // Prevents overflow
      }}
    >
      <IconComponent
        sx={{ fontSize: 16, color: config.color, flexShrink: 0 }}
      />
      <Typography
        variant='body2'
        fontWeight='500'
        sx={{ minWidth: 0 }} // Allows text to shrink if needed
      >
        {count.toLocaleString()} {/* Format large numbers with commas */}
      </Typography>
      <Typography
        variant='caption'
        color='text.secondary'
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

// Readme modal
export function BasicModal({ full_name }: { full_name: string }) {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);
  const { error, isLoading, readme } = useGetReadme(full_name);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box>
          {isLoading ? (
            <p>Loading readme...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div
              style={{
                padding: '20px',
                backgroundColor: 'white',
                maxHeight: '80vh',
                overflowY: 'auto',
                color: 'black',
              }}
            >
              <Markdown>{readme}</Markdown>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}

// Main component with improved structure
const RepoistoryCard = ({
  name,
  owner,
  html_url,
  stargazers_count,
  full_name,
  forks_count,
  open_issues_count,
}: RepositoryType) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const [open, setOpen] = useState(false);
  const handleShowReadme = () => {
    setOpen(curr => !curr);
  };
  return (
    <Grid size={isMobile ? 12 : 6}>
      <Card
        sx={{
          height: '100%', // Ensures consistent card heights
          display: 'flex',
          flexDirection: 'column',
        }}
        elevation={2}
      >
        {/* Header Section */}
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display='flex' alignItems='center' gap={1} mb={3}>
            <GitHubIcon color='action' />
            <Typography
              variant='h6'
              component='h2'
              fontWeight='bold'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </Typography>
          </Box>

          {/* Repository Info Section */}
          <Box mb={3}>
            <Typography
              variant='subtitle2'
              color='text.secondary'
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Owner
            </Typography>

            {owner ? (
              <Box display='flex' alignItems='center' gap={1}>
                <PersonIcon fontSize='small' color='action' />
                <Link
                  href={owner.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  underline='hover'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {owner.login}
                  <OpenInNewIcon
                    sx={{ ml: 0.5, fontSize: 16, flexShrink: 0 }}
                  />
                </Link>
              </Box>
            ) : (
              <Typography variant='body2' color='text.secondary'>
                No owner information
              </Typography>
            )}
          </Box>

          {/* Statistics Section */}
          <Box>
            <Typography
              variant='subtitle2'
              color='text.secondary'
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Statistics
            </Typography>

            <Grid container spacing={1}>
              <Grid size={3}>
                <StatBox type='stars' count={stargazers_count} label='stars' />
              </Grid>

              <Grid size={3}>
                <StatBox type='forks' count={forks_count} label='forks' />
              </Grid>

              <Grid size={3}>
                <StatBox
                  type='issues'
                  count={open_issues_count}
                  label='issues'
                />
              </Grid>
              <Grid size={3}>
                <StatBox type='likes' count={0} label='likes' />
              </Grid>
            </Grid>
          </Box>
        </CardContent>

        {/* Action Section */}
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 2, px: 2 }}>
          <>
            {html_url ? (
              <Button
                href={html_url}
                target='_blank'
                rel='noopener noreferrer'
                variant='contained'
                startIcon={<GitHubIcon />}
                endIcon={<OpenInNewIcon />}
                size='small'
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                View Repository
              </Button>
            ) : (
              <Button disabled size='small'>
                Repository Unavailable
              </Button>
            )}
            <Button
              rel='noopener noreferrer'
              variant='contained'
              size='small'
              sx={{
                textTransform: 'none',
                borderRadius: 2,
              }}
              onClick={handleShowReadme}
            >
              View Read Me
            </Button>
            {open && <BasicModal full_name={full_name} />}
          </>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default RepoistoryCard;
