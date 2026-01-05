// Utility functions for the CMS package

export function formatPath(path: string): string {
  // Ensure path starts with /
  return path.startsWith('/') ? path : `/${path}`;
}

// Add more utility functions as needed

