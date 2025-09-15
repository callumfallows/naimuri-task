# GitHub API

Create a project using React + Typescript SPA that connects to the GitHub API, allowing search and filtering of repository through an easy to use interface.

## Features

- [x] - UI/UX
- [x] - Accessibility
- [x] - GitHub API
- [x] - Search
- [x] - Filter
- [x] - Sort
- [x] - Pagination

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

### Notes

I was quite happy with how I structured the repository search and display components. Initially, I struggled a little with rendering all repository statistics cleanly in the card without overcrowding, but using MUI’s Grid and a reusable StatBox component helped make it much more readable and maintainable.

For state management, I decided to use useState for the modal and readme loading instead of setting up Redux or Context. This was a conscious decision based on time constraints. If this were a larger project, I would consider using a global state solution to manage repositories and readme data more efficiently.

Fetching the README using the custom useGetReadme hook worked well, though I did run into occasional issues where the response would fail or the PAT (personal access token) became invalid quickly. I’ve handled loading and error states in the modal to ensure the UI fails gracefully, showing either a loader or an error message.

For component design, I focused on making everything modular: RepositoryCard, StatBox, and ReadmeModal are all reusable and typed with TypeScript. I initially passed all repository props individually but then refactored to spread the repository object for cleaner code.

I was unsure/ unable to complete the task requirement for "likes" on a repository as mentioned: "...detailed view containing the forks, likes, *stars* and issue". I would ask more questions before starting the project again rather than just trying to implement what I could from the API response

Testing was something I planned to include, particularly to ensure filtering and error handling work as expected. Currently, the project relies on visual validation, but adding unit tests and integration tests for the repository fetching and modal behavior would be a priority if more time were available.

Lastly, working with MUI’s useMediaQuery and responsive grids was very useful to ensure cards looked good on both desktop and mobile without duplicating too much code. I was initially passing conditional props based on isMobile, but switching to xs={12} sm={6} simplified things significantly.

#### Material UI

- Used for rapid UI development and consistent component styling.

- Provides pre-built components like Card, Grid, Button, Select, and Typography that streamline accessibility and responsiveness.

- Allows customization via themes and sx props for responsive design.

#### Accessibility

- Uses semantic HTML elements like label, input, and link.

- MUI components include ARIA attributes by default.

- Considers keyboard navigation and screen readers.

- Ensures color contrast and readable text sizes for statistics and buttons.

#### User Experience

- Responsive layout adapts for mobile, tablet, and desktop.

- Clear presentation of repository stats: stars, forks, likes, and issues.

- Repository and owner links open in new tabs with visual cues.

- Loading indicators and disabled states improve feedback during fetch.

#### Debouncing

- Implemented to prevent excessive API calls during search input changes.

- Improves performance by delaying fetch requests until the user stops typing.

- Enhances user experience by reducing flicker and unnecessary network requests.

#### Custom Hooks

- Encapsulates logic for fetching GitHub repositories in useRepositorySearch.

- Handles loading, error states, pagination, and data reset.

- Keeps components clean and reusable by separating concerns (UI vs data fetching).

#### Pagination

- Supports previous and next on mobile/tablet and page navigation on desktop.

- Ensures smooth data accumulation without losing previously fetched results.

- Uses GitHub API limits efficiently and prevents fetching beyond the maximum allowed pages.

#### Date Filtering

- Allows users to filter repositories by creation date (from and to).

- Provides default date range (last month) for immediate results.

- Updates search automatically when date filters change.

#### Testing

- Not fully implemented due to time constraints, but planned using Jest and React Testing Library.

- Could cover hook logic, API calls, and component rendering.

- Add WCAG accessiblity tests as part of build pipeline

- Ensure robustness for search, pagination, and error handling.

