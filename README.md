# GitHub API

Create a project using React + Typescript SPA that connects to the GitHub API, allowing search and filtering of repository through an easy to use interface.

## Features

[/] - UI/UX
[ ] - Accessibility
[/] - GitHub API
[/] - Search
[/] - Filter
[/] - Sort
[/] - Pagination

## Installation Instructions

### `Install dependencies`

```
npm install
```

### `Start the development server`

```
npm run dev
```

### `Start the production server`

```
npm run build
npm run start
```

## Implementation

### Material UI

- Used for rapid UI development and consistent component styling.

- Provides pre-built components like Card, Grid, Button, Select, and Typography that streamline accessibility and responsiveness.

- Allows customization via themes and sx props for responsive design.

### Accessibility

- Uses semantic HTML elements like label, input, and link.

- MUI components include ARIA attributes by default.

- Considers keyboard navigation and screen readers.

- Ensures color contrast and readable text sizes for statistics and buttons.

### User Experience

- Responsive layout adapts for mobile, tablet, and desktop.

- Clear presentation of repository stats: stars, forks, likes, and issues.

- Repository and owner links open in new tabs with visual cues.

- Loading indicators and disabled states improve feedback during fetch.

### Debouncing

- Implemented to prevent excessive API calls during search input changes.

- Improves performance by delaying fetch requests until the user stops typing.

- Enhances user experience by reducing flicker and unnecessary network requests.

### Custom Hooks

- Encapsulates logic for fetching GitHub repositories in useRepositorySearch.

- Handles loading, error states, pagination, and data reset.

- Keeps components clean and reusable by separating concerns (UI vs data fetching).

### Pagination

- Supports previous and next on mobile/tablet and page navigation on desktop.

- Ensures smooth data accumulation without losing previously fetched results.

- Uses GitHub API limits efficiently and prevents fetching beyond the maximum allowed pages.

### Date Filtering

- Allows users to filter repositories by creation date (from and to).

- Provides default date range (last month) for immediate results.

- Updates search automatically when date filters change.

### Testing
