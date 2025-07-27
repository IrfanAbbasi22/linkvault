'use client';

import { X } from 'lucide-react';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

export default function TagFilter({ 
  allTags, 
  selectedTags, 
  onTagToggle, 
  onClearTags 
}: TagFilterProps) {
  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter by tags
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearTags}
            className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-primary/10"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-card/50 border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30 hover:shadow-md'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex items-center gap-3 pt-3 border-t border-border/50">
          <span className="text-xs font-medium text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border border-primary/20 rounded-full"
              >
                {tag}
                <button
                  onClick={() => onTagToggle(tag)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 