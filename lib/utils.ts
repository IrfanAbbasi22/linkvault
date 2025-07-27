import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Bookmark, SortOption, SortOrder } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '/default-favicon.png';
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function sortBookmarks(
  bookmarks: Bookmark[],
  sortBy: SortOption,
  sortOrder: SortOrder
): Bookmark[] {
  return [...bookmarks].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    if (sortBy === 'title') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

export function filterBookmarksByTags(
  bookmarks: Bookmark[],
  selectedTags: string[]
): Bookmark[] {
  if (selectedTags.length === 0) {
    return bookmarks;
  }

  return bookmarks.filter(bookmark =>
    selectedTags.some((tag: string) => bookmark.tags.includes(tag))
  );
}

export function getAllTags(bookmarks: Bookmark[]): string[] {
  const tagSet = new Set<string>();
  bookmarks.forEach(bookmark => {
    bookmark.tags.forEach((tag: string) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
} 