export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  favicon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description: string;
  tags: string;
}

export type SortOption = 'title' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc'; 