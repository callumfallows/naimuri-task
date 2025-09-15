export interface RepositoryType {
  forks_count: number;
  full_name: string;
  html_url?: string;
  id?: string;
  name?: string;
  open_issues_count: number;
  owner?: { html_url: string; login: string };
  stargazers_count: number;
}

export interface UseReposParams {
  createdFrom: string;
  createdTo: string;
  orderBy: string;
  page: number;
  searchTerm: string;
  sortBy: string;
}
