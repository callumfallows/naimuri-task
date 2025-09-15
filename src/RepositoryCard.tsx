import {
  Close as CloseIcon,
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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import { useState } from 'react';
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
} as const;

type StatKey = keyof typeof STAT_CONFIGS;

const StatBox = ({
  type,
  count,
  label,
}: {
  type: StatKey;
  count: number;
  label: string;
}) => {
  const config = STAT_CONFIGS[type];
  const IconComponent = config.icon;

  return (
    // role="group" with an accessible name so screen readers get "stars 1,234"
    <Box
      role='group'
      aria-label={`${label} ${count.toLocaleString()}`}
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
      {/* Icon is decorative — hide from screen readers */}
      <IconComponent
        sx={{ fontSize: 16, color: config.color, flexShrink: 0 }}
        aria-hidden='true'
      />
      <Typography variant='body2' fontWeight='500' sx={{ minWidth: 0 }}>
        {count.toLocaleString()}
      </Typography>
      <Typography
        variant='caption'
        color='text.secondary'
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        aria-hidden='true' // label text is included in the group aria-label so hide this duplicate text
      >
        {label}
      </Typography>
    </Box>
  );
};

// Accessible Readme dialog that replaces the raw Modal
export function ReadmeDialog({
  full_name,
  open,
  onClose,
}: {
  full_name: string;
  open: boolean;
  onClose: () => void;
}) {
  const { error, isLoading, readme } = useGetReadme(full_name);

  const dialogTitleId = `readme-dialog-title-${full_name.replace(/\W/g, '-')}`;
  const dialogDescriptionId = `readme-dialog-desc-${full_name.replace(/\W/g, '-')}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={dialogTitleId}
      aria-describedby={dialogDescriptionId}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle
        id={dialogTitleId}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Title announces the repository name */}
        <span>README — {full_name}</span>
        {/* Accessible close button */}
        <IconButton
          aria-label='Close readme dialog'
          onClick={onClose}
          size='small'
        >
          <CloseIcon aria-hidden='true' />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Provide polite live region for loading/error — screen readers get updates */}
        {isLoading ? (
          <Box
            role='status'
            aria-live='polite'
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <CircularProgress size={18} aria-hidden='true' />
            <Typography>Loading README…</Typography>
          </Box>
        ) : error ? (
          <Typography role='status' aria-live='polite' color='error'>
            {error}
          </Typography>
        ) : readme ? (
          // The markdown content is the main document content in the dialog
          <article id={dialogDescriptionId}>
            <Markdown>{readme}</Markdown>
          </article>
        ) : (
          <Typography role='status' aria-live='polite'>
            No README available.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} aria-label='Close readme'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Main component with improved structure and accessibility
const RepoistoryCard = ({
  name,
  owner,
  html_url,
  stargazers_count,
  full_name,
  forks_count,
  open_issues_count,
}: RepositoryType) => {
  const [open, setOpen] = useState(false);
  const handleShowReadme = () => setOpen(curr => !curr);

  // Dialog accessibility IDs
  const dialogId = `readme-dialog-${full_name.replace(/\W/g, '-')}`;

  return (
    // Use Grid item props for correct semantics / layout
    <Grid>
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
            {/* Decorative GitHub icon: hide from assistive tech */}
            <GitHubIcon color='action' aria-hidden='true' />
            <Typography
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
              component='h3'
              color='text.secondary'
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Owner
            </Typography>

            {owner ? (
              <Box display='flex' alignItems='center' gap={1}>
                <PersonIcon
                  fontSize='small'
                  color='action'
                  aria-hidden='true'
                />
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
                  // Clear accessible label describing destination and that it opens in a new tab
                  aria-label={`Visit ${owner.login}'s GitHub profile (opens in a new tab)`}
                >
                  {owner.login}
                  <OpenInNewIcon
                    sx={{ ml: 0.5, fontSize: 16, flexShrink: 0 }}
                    aria-hidden='true'
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
              component={'h3'}
              color='text.secondary'
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Statistics
            </Typography>

            <Grid container spacing={1}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatBox type='stars' count={stargazers_count} label='stars' />
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <StatBox type='forks' count={forks_count} label='forks' />
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <StatBox
                  type='issues'
                  count={open_issues_count}
                  label='issues'
                />
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
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
                startIcon={<GitHubIcon aria-hidden='true' />}
                endIcon={<OpenInNewIcon aria-hidden='true' />}
                size='small'
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                }}
                aria-label={`Open ${name} repository on GitHub (opens in a new tab)`}
              >
                View Repository
              </Button>
            ) : (
              <Button disabled size='small' aria-disabled>
                Repository Unavailable
              </Button>
            )}

            <Button
              variant='contained'
              size='small'
              sx={{
                textTransform: 'none',
                borderRadius: 2,
              }}
              onClick={handleShowReadme}
              aria-expanded={open}
              aria-controls={open ? dialogId : undefined}
              aria-label={
                open ? `Close README for ${name}` : `Open README for ${name}`
              }
            >
              View Read Me
            </Button>

            {/* Render the accessible dialog (controlled from parent state) */}
            <ReadmeDialog
              full_name={full_name}
              open={open}
              onClose={() => setOpen(false)}
            />
          </>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default RepoistoryCard;
