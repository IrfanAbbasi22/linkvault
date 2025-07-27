'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortOption, SortOrder } from '@/lib/types';

interface SortControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortByChange: (sortBy: SortOption) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

export default function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortControlsProps) {
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
  ] as const;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortOption)}
          className="appearance-none px-4 py-3 pr-10 border border-input rounded-xl bg-background/50 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 text-sm font-medium"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <button
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-3 border border-input rounded-xl bg-background/50 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
        title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        {sortOrder === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
    </div>
  );
} 